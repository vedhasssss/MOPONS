import React, { useState } from 'react';
import './Auth.css';
import API_BASE from './config';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        
        // Store token in localStorage
        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }

        // Redirect after 1 second
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please make sure the backend server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">MOPONS</span>
          </div>
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p>{isLogin ? 'Login to continue trading coupons' : 'Join thousands of users saving money'}</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✅</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="input"
                placeholder="+919876543210"
                value={formData.phone}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {!isLogin && (
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label className="checkbox-label" style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required={!isLogin}
                  style={{marginTop: '0.25rem'}}
                />
                <span style={{flex: 1, fontSize: '14px', lineHeight: '1.5'}}>
                  I agree to the{' '}
                  <button 
                    type="button"
                    onClick={() => setShowTerms(true)} 
                    className="link-button"
                    style={{color: '#667eea', textDecoration: 'underline', fontWeight: '500'}}
                  >
                    Terms and Conditions
                  </button>
                  {' '}and commit to honest trading practices
                </span>
              </label>
            </div>
          )}

          {isLogin && (
            <div className="form-footer">
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="link-button">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="link-button">
                Login
              </button>
            </p>
          )}
        </div>


      </div>

      <div className="auth-footer">
        <a href="/">← Back to Home</a>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px', maxHeight: '80vh', overflow: 'auto'}}>
            <div className="modal-header">
              <h2>Terms and Conditions</h2>
              <button className="close-btn" onClick={() => setShowTerms(false)}>×</button>
            </div>
            <div style={{padding: '1.5rem', lineHeight: '1.6'}}>
              <h3 style={{color: '#667eea', marginBottom: '1rem'}}>Anti-Fraud Policy</h3>
              
              <p style={{marginBottom: '1rem'}}>
                By creating an account on MOPONS, you agree to maintain honest and ethical trading practices. 
                This platform is built on trust, and we take fraud very seriously.
              </p>

              <h4 style={{color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem'}}>❌ Prohibited Activities:</h4>
              <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                <li style={{marginBottom: '0.5rem'}}><strong>Listing Used Coupons:</strong> You must NOT list coupons that have already been redeemed or used.</li>
                <li style={{marginBottom: '0.5rem'}}><strong>Listing Fake Coupons:</strong> All coupons must be genuine and valid. Fabricated or counterfeit coupons are strictly prohibited.</li>
                <li style={{marginBottom: '0.5rem'}}><strong>Listing Expired Coupons:</strong> You must verify expiry dates before listing. Selling expired coupons is not allowed.</li>
                <li style={{marginBottom: '0.5rem'}}><strong>Misrepresenting Coupon Details:</strong> All information (discount amount, terms, brand) must be accurate.</li>
                <li style={{marginBottom: '0.5rem'}}><strong>Selling the Same Coupon Multiple Times:</strong> Each coupon should only be listed once.</li>
              </ul>

              <h4 style={{color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem'}}>⚠️ Consequences:</h4>
              <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Immediate account suspension or permanent ban</li>
                <li style={{marginBottom: '0.5rem'}}>Forfeiture of wallet balance</li>
                <li style={{marginBottom: '0.5rem'}}>Refund to affected buyers at your expense</li>
                <li style={{marginBottom: '0.5rem'}}>Legal action for severe violations</li>
              </ul>

              <h4 style={{color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem'}}>✅ Your Responsibilities:</h4>
              <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Verify coupon validity before listing</li>
                <li style={{marginBottom: '0.5rem'}}>Provide accurate and complete information</li>
                <li style={{marginBottom: '0.5rem'}}>Respond promptly to buyer inquiries</li>
                <li style={{marginBottom: '0.5rem'}}>Report suspicious activity</li>
                <li style={{marginBottom: '0.5rem'}}>Maintain honest communication</li>
              </ul>

              <div style={{background: '#f0f4ff', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', border: '1px solid #667eea'}}>
                <p style={{margin: 0, fontSize: '14px'}}>
                  <strong>🛡️ Our Commitment:</strong> We actively monitor transactions and will take swift action 
                  against fraudulent behavior to protect our community. Honest sellers build trust and earn repeat customers!
                </p>
              </div>

              <button 
                className="btn btn-primary btn-block" 
                onClick={() => setShowTerms(false)}
                style={{marginTop: '1.5rem'}}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;
