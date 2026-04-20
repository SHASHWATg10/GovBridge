import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle, ArrowRight, UserCheck, Download, ChevronDown, ChevronUp } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import jsPDF from 'jspdf';
import './EligibilityCheck.css';

export default function EligibilityCheck() {
  const { user, loading } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    income: '',
    gender: 'male',
    category: 'general',
    interest: 'all',
    state: 'All States'
  });

  const INDIAN_STATES = [
    "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
  ];
  
  const [schemes, setSchemes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expandedSchemeIndex, setExpandedSchemeIndex] = useState(null);
  const [loadingDetailsFor, setLoadingDetailsFor] = useState(null);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const simulateApiCall = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/schemes/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSchemes(data.schemes);
      } else {
        console.error('API Error:', data.error);
        setErrorMessage(data.error + (data.details ? ' ' + data.details : ''));
        setSchemes([]); // empty array on error
      }
    } catch (error) {
      console.error('Network Error:', error);
      setErrorMessage("Failed to connect to the backend server. Make sure 'node server.js' is running on port 5000.");
      setSchemes([]);
    } finally {
      setIsProcessing(false);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    setExpandedSchemeIndex(null); // Reset expansions on new search
    setLoadingDetailsFor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    simulateApiCall();
  };

  const handleToggleScheme = async (index, scheme) => {
    if (expandedSchemeIndex === index) {
      setExpandedSchemeIndex(null);
      return;
    }
    
    setExpandedSchemeIndex(index);
    
    if (!scheme.criteria) {
      setLoadingDetailsFor(index);
      try {
        const response = await fetch('http://localhost:5000/api/schemes/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ schemeName: scheme.name, profile })
        });
        
        const data = await response.json();
        if (data.success) {
          const newSchemes = [...schemes];
          newSchemes[index] = { ...newSchemes[index], criteria: data.criteria, link: data.link };
          setSchemes(newSchemes);
        } else {
          console.error("Failed to load details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoadingDetailsFor(null);
      }
    }
  };

  const downloadAllSchemas = () => {
    if (schemes.length === 0) return;
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Your Eligible Government Schemes', 14, 20);
    
    doc.setFontSize(11);
    let yPos = 30;
    
    const checkPageBreak = (addedHeight) => {
      if (yPos + addedHeight > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    schemes.forEach((scheme, index) => {
      checkPageBreak(15);
      
      doc.setFont('helvetica', 'bold');
      const nameLines = doc.splitTextToSize(`${index + 1}. ${scheme.name} (${scheme.matchScore}% Match)`, 180);
      doc.text(nameLines, 14, yPos);
      yPos += (nameLines.length * 6) + 2;
      
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(scheme.description || '', 180);
      checkPageBreak(descLines.length * 6);
      doc.text(descLines, 14, yPos);
      yPos += (descLines.length * 6) + 4;
      
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Matched Eligibility Criteria:', 14, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      if (Array.isArray(scheme.criteria)) {
        scheme.criteria.forEach((crt) => {
          const crtLines = doc.splitTextToSize(`• ${crt}`, 170);
          checkPageBreak(crtLines.length * 6);
          doc.text(crtLines, 20, yPos);
          yPos += (crtLines.length * 6) + 2;
        });
      }
      
      yPos += 10; // Extra padding between schemes
    });
    
    doc.save('GovBridge_Schemes.pdf');
  };

  const downloadSingleSchema = (scheme, e) => {
    e.stopPropagation(); // prevent accordion toggle overlap handling just in case
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Government Scheme Details', 14, 20);
    
    doc.setFontSize(11);
    let yPos = 30;
    
    const checkPageBreak = (addedHeight) => {
      if (yPos + addedHeight > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    doc.setFont('helvetica', 'bold');
    const nameLines = doc.splitTextToSize(`${scheme.name} (${scheme.matchScore}% Match)`, 180);
    doc.text(nameLines, 14, yPos);
    yPos += (nameLines.length * 6) + 2;
    
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(scheme.description || '', 180);
    checkPageBreak(descLines.length * 6);
    doc.text(descLines, 14, yPos);
    yPos += (descLines.length * 6) + 4;
    
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Eligibility Criteria:', 14, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    if (Array.isArray(scheme.criteria)) {
      scheme.criteria.forEach((crt) => {
        const crtLines = doc.splitTextToSize(`• ${crt}`, 170);
        checkPageBreak(crtLines.length * 6);
        doc.text(crtLines, 20, yPos);
        yPos += (crtLines.length * 6) + 2;
      });
    }

    const safeName = scheme.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    doc.save(`${safeName}_Details.pdf`);
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="eligibility-page animate-fade-in">
      <div className="container test-container">
        
        <div className="stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Your Profile</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>AI Analysis</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Your Schemes</span>
          </div>
        </div>

        <div className="eligibility-content">
          {step === 1 && (
            <div className="document-form-card glass-card">
              <div className="card-header-secure">
                <UserCheck size={36} color="var(--color-primary)" />
                <h2>Tell Us About Yourself</h2>
                <p>We don't need document uploads. Just fill in your basic details to find schemes meant for you.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="eligibility-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="e.g. Rahul Kumar" 
                      value={profile.name}
                      onChange={handleInputChange}
                      className="custom-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input 
                      type="number" 
                      name="age" 
                      placeholder="e.g. 35" 
                      value={profile.age}
                      onChange={handleInputChange}
                      className="custom-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select 
                      name="gender" 
                      value={profile.gender}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Annual Family Income (INR)</label>
                    <input 
                      type="number" 
                      name="income" 
                      placeholder="e.g. 250000" 
                      value={profile.income}
                      onChange={handleInputChange}
                      className="custom-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Social Category</label>
                    <select 
                      name="category" 
                      value={profile.category}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="general">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Which Schemes Do You Need?</label>
                    <select 
                      name="interest" 
                      value={profile.interest}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="all">Show Me All Schemes</option>
                      <option value="health">Health & Medical Coverage</option>
                      <option value="housing">Housing & Shelter</option>
                      <option value="education">Education & Scholarships</option>
                      <option value="agriculture">Agriculture & Farming</option>
                      <option value="business">Business & Startup Loans</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State of Residence</label>
                    <select 
                      name="state" 
                      value={profile.state}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    {/* Empty placeholder to keep the grid aligned, or could span full width */}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg submit-eligibility" style={{ marginTop: '1rem' }}>
                  Discover My Benefits <ArrowRight size={20} />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="processing-card">
              <div className="loader-container">
                <div className="scanning-line"></div>
                <Search size={64} color="var(--color-primary)" className="pulse-icon" />
              </div>
              <h2>AI Connecting to Scheme APIs...</h2>
              <p>Cross-referencing `{profile.name}`'s profile against recent state and central schemas.</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="results-container">
              {errorMessage ? (
                <div className="results-header" style={{color: '#ef4444'}}>
                  <h2><AlertCircle color="#ef4444" /> Oops! Something went wrong.</h2>
                  <p>{errorMessage}</p>
                </div>
              ) : (
                <div className="results-header">
                  <h2><CheckCircle color="#10b981" /> Great news! We found {schemes.length} matching scheme(s).</h2>
                  <p>Based on your profile, you meet the eligibility criteria for the following programs:</p>
                </div>
              )}

              {!errorMessage && (
                <div className="schemes-list">
                  {schemes.map((scheme, index) => {
                    const isExpanded = expandedSchemeIndex === index;
                    return (
                      <div className="scheme-result-card" key={scheme.id || index}>
                        <div 
                          className="scheme-result-header" 
                          style={{ cursor: 'pointer', marginBottom: isExpanded ? '1rem' : '0' }}
                          onClick={() => handleToggleScheme(index, scheme)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {isExpanded ? <ChevronUp size={24} color="var(--color-primary)" /> : <ChevronDown size={24} color="var(--color-text-secondary)" />}
                            <h3 style={{ margin: 0 }}>{scheme.name}</h3>
                          </div>
                          <div className="match-badge">{scheme.matchScore}% Match</div>
                        </div>
                        
                        {isExpanded && (
                          <div className="scheme-details">
                            <p className="scheme-desc">{scheme.description}</p>
                            
                            {loadingDetailsFor === index ? (
                               <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-secondary)' }}>
                                 <div className="pulse-icon" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                                   <Search size={24} color="var(--color-primary)" />
                                 </div>
                                 <p style={{ fontSize: '0.9rem', margin: 0 }}>AI is generating specific eligibility criteria...</p>
                               </div>
                            ) : scheme.criteria ? (
                              <>
                                <div className="criteria-list">
                                  <strong>Matched Eligibility Criteria:</strong>
                                  <ul>
                                    {scheme.criteria.map((crt, i) => (
                                      <li key={i}><CheckCircle size={14} color="#10b981"/> {crt}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                  <a href={scheme.link} target="_blank" rel="noreferrer" className="btn btn-primary">
                                    Apply Officially <ArrowRight size={16} />
                                  </a>
                                  <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={(e) => downloadSingleSchema(scheme, e)}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                  >
                                    <Download size={16} style={{ marginRight: '6px' }} />
                                    Download PDF
                                  </button>
                                </div>
                              </>
                            ) : (
                               <div style={{ padding: '1rem', color: '#ef4444' }}>Failed to generate criteria. Please try again or check logs.</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              

              <div className="restart-action">
                <button type="button" className="btn btn-primary" onClick={downloadAllSchemas} disabled={schemes.length === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={20} style={{ marginRight: '8px' }} />
                  Download All as PDF
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setStep(1); 
                  setProfile({...profile, name:'', age:'', income:''});
                }}>
                  Start New Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
