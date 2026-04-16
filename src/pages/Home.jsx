import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileText, CheckCircle, Target } from 'lucide-react';
import './Home.css';

export default function Home() {
  const steps = [
    {
      icon: <FileText size={32} />,
      title: 'Enter Documents',
      desc: 'Provide details from your basic documents (Aadhar, PAN, Income Certificate) securely.'
    },
    {
      icon: <Search size={32} />,
      title: 'AI Analysis',
      desc: 'Our intelligent system cross-references your profile against thousands of state and central schemes.'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Get Matched',
      desc: 'Instantly view a curated list of schemes you are 100% eligible for, along with application guides.'
    }
  ];

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">AI-Powered Scheme Discovery</div>
            <h1 className="hero-title">
              Find Government Schemes You Actually <span className="text-gradient">Qualify For.</span>
            </h1>
            <p className="hero-subtitle">
              GovBridge analyzes your basic documents and intelligently matches you with the exact government schemes and benefits you are eligible to receive. Simple, quick, and designed for you.
            </p>
            <div className="hero-actions">
              <Link to="/eligibility" className="btn btn-primary btn-lg">
                Check Eligibility Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">500+</span>
                <span className="stat-label">Active Schemes</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-value">Instant</span>
                <span className="stat-label">AI Matching</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">Free Service</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
            <div className="glass-card main-glass-card">
              <div className="card-header">
                <Target className="card-icon" size={24} />
                <span>Eligibility Match found</span>
              </div>
              <div className="card-body">
                <div className="mock-scheme">
                  <h4>PM Kisan Samman Nidhi</h4>
                  <div className="match-score">98% Match</div>
                </div>
                <div className="mock-scheme">
                  <h4>Ayushman Bharat Yojana</h4>
                  <div className="match-score">100% Match</div>
                </div>
                <div className="mock-scheme skeleton"></div>
                <div className="card-action-btn">View All Matching Schemes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How GovBridge Works</h2>
            <p>Three straightforward steps to unlock your government benefits.</p>
          </div>
          
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-icon-wrapper">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>Ready to discover your benefits?</h2>
            <p>Join thousands of citizens who have found their rightful government schemes through GovBridge.</p>
            <Link to="/eligibility" className="btn btn-primary btn-lg cta-btn">
              Start Your Journey <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
