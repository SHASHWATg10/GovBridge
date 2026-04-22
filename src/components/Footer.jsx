import { Link } from 'react-router-dom';
import { Layers, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand">
            <Layers className="brand-icon" size={32} />
            <span>GovBridge</span>
          </Link>
          <p className="footer-description">
            Bridging the gap between citizens and government by making scheme eligibility simple, fast, and accessible to everyone.
          </p>
          <div className="footer-socials">
            {/* Can add social icons here */}
          </div>
        </div>
        
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/eligibility">Scheme Check</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            <li><MapPin size={18} /> KCCITM, UTTAR PRADESH, INDIA</li>
            <li><Phone size={18} /> 957210XXXX</li>
            <li><Mail size={18} /> govbridge@gmail.com</li>
          </ul>
        </div>
        
        <div className="footer-col newsletter-col">
          <h3>Stay Updated</h3>
          <p>Get the latest schemes delivered to your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn btn-primary">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GovBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}
