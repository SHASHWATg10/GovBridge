import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/govbridge';
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Generate Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'supersecret123';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// --- Authentication Routes ---

// @desc    Register a new user
// @route   POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Main Eligibility Match Endpoint
app.post('/api/schemes/match', async (req, res) => {
  const { name, age, income, gender, category, interest, state } = req.body;

  if (!name || age === undefined || income === undefined || !category || !interest) {
    return res.status(400).json({ error: 'Missing required profile fields' });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in backend/.env file' });
  }

  try {
    const prompt = `You are a highly knowledgeable expert on Indian government schemes (Central and State level). 
A user has submitted the following profile to find suitable welfare schemes:
Name: ${name}
Age: ${age}
Gender: ${gender}
Annual Family Income: ₹${income}
State of Residence: ${state}
Category: ${category}
Primary Interest: ${interest}

Search your knowledge base and determine the most relevant active government schemes this individual is eligible for. Focus highly on the strict numerical constraints like income limit, age limit, and category restrictions.

CRITICAL: Return ONLY a raw JSON array. No markdown code blocks, no intro text, no outro text. Use this exact schema:
[
  {
    "id": 1, 
    "name": "Scheme Name",
    "description": "Short explanation of benefits",
    "matchScore": 95
  }
]
Return 10 to 15 highly relevant matching schemes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let resultText = response.text;

    // Clean up markdown code blocks if Gemini ignores responseMimeType
    if (resultText.includes('```json')) {
      resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (resultText.includes('```')) {
      resultText = resultText.replace(/```/g, '').trim();
    }

    const schemesData = JSON.parse(resultText);

    return res.json({
      success: true,
      profileAnalysed: name,
      matchesFound: schemesData.length,
      schemes: schemesData
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'Failed to process schemes with Gemini AI.', details: error.message });
  }
});

// Scheme Specific Details Endpoint
app.post('/api/schemes/details', async (req, res) => {
  const { schemeName, profile } = req.body;

  if (!schemeName || !profile) {
    return res.status(400).json({ error: 'Missing schemeName or profile' });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in backend/.env file' });
  }

  try {
    const prompt = `You are a highly knowledgeable expert on Indian government schemes.
A user with the following profile needs specific details for the scheme named "${schemeName}":
Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Annual Family Income: ₹${profile.income}
State of Residence: ${profile.state}
Category: ${profile.category}
Primary Interest: ${profile.interest}

Generate a list of 10-15 specific, actionable eligibility criteria bullet points explaining exactly why they match or what they need to prove, and provide the official application URL for the scheme.

CRITICAL: Return ONLY a raw JSON object. No markdown code blocks, intro, or outro. Use this exact schema:
{
  "criteria": ["Eligibility matched criteria 1", "Criteria 2"],
  "link": "https://gov.in/link or #"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let resultText = response.text;

    if (resultText.includes('\`\`\`json')) {
      resultText = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    } else if (resultText.includes('\`\`\`')) {
      resultText = resultText.replace(/\`\`\`/g, '').trim();
    }

    const detailsData = JSON.parse(resultText);

    return res.json({
      success: true,
      criteria: detailsData.criteria,
      link: detailsData.link
    });

  } catch (error) {
    console.error("Gemini API Error details:", error);
    return res.status(500).json({ error: 'Failed to process details with Gemini AI.', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`GovBridge Backend API running on http://127.0.0.1:${PORT} and http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use by another program. Please close any unused terminals or restart your computer if necessary.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
