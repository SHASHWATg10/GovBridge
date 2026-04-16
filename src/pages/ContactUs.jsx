import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import './ContactUs.css';

export default function ContactUs() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page animate-fade-in">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have questions about GovBridge? We're here to help.</p>
        </div>
      </div>
      
      <div className="container contact-content">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-subtitle">
              Whether you have a question about our scheme matching algorithm, need help with your documents, or just want to say hello, we're ready to answer all your questions.
            </p>
            
            <div className="info-cards">
              <div className="info-card">
                <MapPin className="info-icon" size={24} />
                <div>
                  <h3>Our Office</h3>
                  <p>KCCITM, UTTAR PRADESH, INDIA</p>
                </div>
              </div>
              <div className="info-card">
                <Phone className="info-icon" size={24} />
                <div>
                  <h3>Phone</h3>
                  <p>957210XXXX</p>
                </div>
              </div>
              <div className="info-card">
                <Mail className="info-icon" size={24} />
                <div>
                  <h3>Email</h3>
                  <p>sk49946144@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <h3>Send us a message</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  required 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                  required 
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows="5"
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  required 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitted}>
                {isSubmitted ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
