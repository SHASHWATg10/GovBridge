import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import './Login.css'; // Reusing shared auth CSS

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const { success, error: authError } = await register(name, email, password);
    
    if (success) {
      navigate('/eligibility');
    } else {
      setError(authError || 'Failed to register');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-background">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={28} />
          </div>
          <h2>Create Account</h2>
          <p>Join GovBridge to discover your benefits</p>
        </div>
        
        {error && (
          <div className="error-message flex items-center justify-center gap-2 mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input 
                type="text" 
                id="name"
                className="auth-input" 
                placeholder="Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input 
                type="email" 
                id="email"
                className="auth-input" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input 
                type="password" 
                id="password"
                className="auth-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input 
                type="password" 
                id="confirmPassword"
                className="auth-input" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            {!isSubmitting && <UserPlus size={18} />}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
