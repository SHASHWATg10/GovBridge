import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Phone, FileCheck, Layers, LogIn, LogOut, User } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/eligibility', name: 'Scheme Check', icon: FileCheck },
    { path: '/about', name: 'About', icon: Info },
    { path: '/contact', name: 'ContactUs', icon: Phone },
  ];

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <Layers className="brand-icon" size={28} />
          <span className="brand-name">GovBridge</span>
        </Link>
        
        <nav className="nav-menu">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <User size={16} style={{ display: 'inline', marginRight: '4px' }}/> 
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={18} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
