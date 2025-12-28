import React, { useState, useEffect } from 'react';
import './Vault.css';

function Vault() {
  const [myCoupons, setMyCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    originalPrice: '',
    sellingPrice: '',
    discountPercentage: '',
    expiryDate: '',
    couponCode: '',
    termsAndConditions: '',
    isExchangeOnly: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyCoupons();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMyCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(userData);
      console.log('Current user ID:', currentUser._id);
      
      // Fetch only PURCHASED coupons (sold or used status)
      // Active coupons are still listed in marketplace, not in vault
      const statuses = ['sold', 'used'];
      let allUserCoupons = [];
      
      for (const status of statuses) {
        const response = await fetch(`http://localhost:5000/api/coupons?status=${status}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success && data.data.coupons) {
          // Filter coupons owned by the current user
          // These are coupons they BOUGHT (not the ones they listed)
          const userCoupons = data.data.coupons.filter(
            coupon => coupon.ownerId._id === currentUser._id
          );
          console.log(`Found ${userCoupons.length} ${status} coupons`);
          allUserCoupons = [...allUserCoupons, ...userCoupons];
        }
      }
      
      console.log('Total purchased coupons:', allUserCoupons.length);
      setMyCoupons(allUserCoupons);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    
    // Show loading message
    setMessage({ type: 'info', text: '🤖 AI is analyzing your coupon image...' });

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for the image
      const formData = new FormData();
      formData.append('image', file);

      // Call AI extraction API
      const response = await fetch('http://localhost:5000/api/ai/extract-coupon', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success && result.data) {
        const extracted = result.data;
        
        // Auto-fill the form with extracted data
        setFormData(prev => ({
          ...prev,
          title: extracted.title || prev.title,
          brand: extracted.brand || prev.brand,
          description: extracted.description || prev.description,
          discountPercentage: extracted.discountPercentage || prev.discountPercentage,
          originalPrice: extracted.originalPrice || prev.originalPrice,
          couponCode: extracted.couponCode || prev.couponCode,
          expiryDate: extracted.expiryDate || prev.expiryDate,
          termsAndConditions: extracted.termsAndConditions || prev.termsAndConditions,
          // Map AI category to category ID (you'll need to match with your categories)
          category: prev.category // Keep existing or implement category mapping
        }));

        setMessage({ 
          type: 'success', 
          text: '✨ Coupon details extracted! Please review and adjust if needed.' 
        });
      } else {
        setMessage({ 
          type: 'warning', 
          text: '⚠️ Could not extract details automatically. Please fill in manually.' 
        });
      }
    } catch (error) {
      console.error('Error extracting coupon details:', error);
      setMessage({ 
        type: 'warning', 
        text: '⚠️ AI extraction failed. Please fill in the details manually.' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch('http://localhost:5000/api/coupons', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Coupon listed successfully!' });
        setShowAddModal(false);
        fetchMyCoupons(); // Refresh list
        setFormData({
            title: '', description: '', category: '', brand: '',
            originalPrice: '', sellingPrice: '', discountPercentage: '',
            expiryDate: '', couponCode: '', termsAndConditions: '', isExchangeOnly: false
        });
        setImageFile(null);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to list coupon' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const navigateTo = (page) => {
    window.history.pushState({}, '', `/${page}`);
    window.location.href = `/${page}`;
  };

  return (
    <div className="vault-page">
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo" onClick={() => navigateTo('dashboard')} style={{cursor: 'pointer'}}>
              <span className="logo-icon">💰</span>
              <span className="logo-text">MOPONS</span>
            </div>
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }}>Dashboard</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('marketplace'); }}>Marketplace</a>
              <a href="#" className="active">My Vault</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('wallet'); }}>Wallet</a>
              <button onClick={() => { localStorage.clear(); navigateTo(''); }} className="btn btn-outline btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="vault-content">
        <div className="container">
          <div className="vault-header">
            <div>
              <h1>My Vault 🔐</h1>
              <p>View your purchased coupons and their codes</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              + Sell / Exchange Coupon
            </button>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`} style={{marginBottom: '1rem'}}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="empty-state card" style={{gridColumn: '1 / -1'}}>
              <div className="spinner"></div>
              <p>Loading your coupons...</p>
            </div>
          ) : (
            <div className="vault-grid">
              {myCoupons.length > 0 ? (
                myCoupons.map(coupon => (
                  <div key={coupon._id} className="coupon-card card">
                    <div className="coupon-image">
                      <img src={coupon.image || 'https://via.placeholder.com/300x200?text=Coupon'} alt={coupon.title} />
                      <div className="coupon-badge badge-gradient">
                        {coupon.discountPercentage}% OFF
                      </div>
                      <div className={`coupon-status status-${coupon.status}`}>
                        {coupon.status}
                      </div>
                    </div>
                    <div className="coupon-content">
                      <h3>{coupon.title}</h3>
                      <p className="coupon-brand">{coupon.brand}</p>
                      <p className="coupon-description">{coupon.description}</p>
                      {coupon.status === 'sold' && (
                        <div className="coupon-code-section">
                          <label>Coupon Code:</label>
                          <div className="coupon-code">{coupon.couponCode}</div>
                        </div>
                      )}
                      <div className="coupon-pricing">
                        <div>
                          <span className="original-price">₹{coupon.originalPrice}</span>
                          <span className="selling-price">₹{coupon.sellingPrice}</span>
                        </div>
                        <span className="savings">Save ₹{coupon.originalPrice - coupon.sellingPrice}</span>
                      </div>
                      <div className="coupon-footer">
                        <span className="expiry">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state card" style={{gridColumn: '1 / -1'}}>
                  <div className="empty-icon">📭</div>
                  <h3>No purchased coupons yet</h3>
                  <p>Buy coupons from the marketplace to see them here with their codes.</p>
                  <div className="flex gap-2 justify-center">
                      <button className="btn btn-primary" onClick={() => navigateTo('marketplace')}>Browse Marketplace</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>List New Coupon</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="add-coupon-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" className="input" required value={formData.title} onChange={handleInputChange} placeholder="e.g. 50% off Pizza" />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input type="text" name="brand" className="input" required value={formData.brand} onChange={handleInputChange} placeholder="e.g. Dominos" />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="input" required value={formData.description} onChange={handleInputChange} rows="3"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" className="input" value={formData.category} onChange={handleInputChange} required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="date" name="expiryDate" className="input" required value={formData.expiryDate} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Percentage (%)</label>
                  <input type="number" name="discountPercentage" className="input" min="0" max="100" value={formData.discountPercentage} onChange={handleInputChange} placeholder="e.g. 50" />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input type="number" name="originalPrice" className="input" required value={formData.originalPrice} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input type="number" name="sellingPrice" className="input" required={!formData.isExchangeOnly} disabled={formData.isExchangeOnly} value={formData.sellingPrice} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                    <input type="checkbox" name="isExchangeOnly" checked={formData.isExchangeOnly} onChange={handleInputChange} />
                    Available for Exchange Only
                </label>
              </div>

              <div className="form-group">
                <label>Coupon Code (Hidden until purchased)</label>
                <input type="text" name="couponCode" className="input" required value={formData.couponCode} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>
                  Coupon Image 
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    🤖 AI Auto-Fill
                  </span>
                </label>
                <input type="file" className="input" onChange={handleFileChange} accept="image/*" required />
                <small style={{color: '#666', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                  Upload a coupon image and AI will automatically extract the details!
                </small>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? <span className="spinner"></span> : 'List Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vault;
