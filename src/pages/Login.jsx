import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import './Login.css'; // Shared CSS for auth pages

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const { success, error: authError } = await login(email, password);
    
    if (success) {
      navigate('/eligibility'); // Redirect to intended destination
    } else {
      setError(authError || 'Failed to login');
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
            <LogIn size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your GovBridge account</p>
        </div>
        
        {error && (
          <div className="error-message flex items-center justify-center gap-2 mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
          
          <button 
            type="submit" 
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            {!isSubmitting && <LogIn size={18} />}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
