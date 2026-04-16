import './About.css';
import { Users, Shield, Lightbulb, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="about-page animate-fade-in">
      <div className="page-header">
        <div className="container">
          <h1>About GovBridge</h1>
          <p>We believe every citizen deserves easy access to their rightful benefits.</p>
        </div>
      </div>
      
      <div className="container about-content">
        <section className="mission-section">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              GovBridge was created to solve a singular, massive problem: while thousands of 
              government schemes and benefits exist, citizens struggle to find which ones they 
              qualify for due to complex eligibility criteria and fragmented information.
            </p>
            <p>
              We're building an intelligent bridge between the government and the people. By 
              entering basic document details, our AI-driven engine instantly analyzes thousands 
              of data points to provide you with a 100% matched list of schemes.
            </p>
          </div>
          <div className="mission-image">
            {/* A premium placeholder image */}
            <div className="image-placeholder">
              <Lightbulb size={64} className="placeholder-icon" />
              <span>Illuminating Access</span>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <Users size={32} className="value-icon" />
              <h3>Citizen First</h3>
              <p>Everything we build is designed with the user's best interest, privacy, and ease of use in mind.</p>
            </div>
            <div className="value-card">
              <Shield size={32} className="value-icon" />
              <h3>Privacy & Security</h3>
              <p>We do not store your documents permanently. Your data is analyzed instantly and then discarded to ensure maximum security.</p>
            </div>
            <div className="value-card">
              <Heart size={32} className="value-icon" />
              <h3>Empowerment</h3>
              <p>We want to empower every individual to improve their livelihood through rightful access to resources.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
