import React, { useState, useEffect } from 'react';
import './Marketplace.css';

function Marketplace() {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user
      const userData = localStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;

      // Fetch coupons
      const couponsRes = await fetch('http://localhost:5000/api/coupons');
      const couponsData = await couponsRes.json();
      if (couponsData.success) {
        // Filter out user's own coupons
        const otherUsersCoupons = couponsData.data.coupons.filter(
          coupon => coupon.ownerId._id !== currentUser?._id
        );
        setCoupons(otherUsersCoupons || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page) => {
    window.history.pushState({}, '', `/${page}`);
    window.location.href = `/${page}`;
  };

  const handleBuyCoupon = async (couponId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to buy coupons');
      return;
    }

    if (!window.confirm('Are you sure you want to buy this coupon?')) {
      return;
    }

    try {
      console.log('Attempting to buy coupon:', couponId);
      const response = await fetch(`http://localhost:5000/api/coupons/${couponId}/buy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Buy response:', data);

      if (data.success) {
        alert('Coupon purchased successfully! Redirecting to your vault...');
        // Navigate to vault to see the purchased coupon
        navigateTo('vault');
      } else {
        alert(data.message || 'Failed to purchase coupon');
        console.error('Purchase failed:', data);
      }
    } catch (error) {
      console.error('Error buying coupon:', error);
      alert('Error purchasing coupon. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigateTo('');
  };

  if (loading) {
    return (
      <div className="marketplace-loading">
        <div className="spinner"></div>
        <p>Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo" onClick={() => navigateTo('dashboard')} style={{cursor: 'pointer'}}>
              <span className="logo-icon">💰</span>
              <span className="logo-text">MOPONS</span>
            </div>
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }}>Dashboard</a>
              <a href="#" className="active">Marketplace</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('vault'); }}>My Vault</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('wallet'); }}>Wallet</a>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="marketplace-content">
        <div className="container">
          {/* Header */}
          <div className="marketplace-header">
            <div>
              <h1>Coupon Marketplace 🛒</h1>
              <p>Browse and buy amazing deals from other users</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigateTo('vault')}>
              + Sell Coupon
            </button>
          </div>

          {/* Search and Filters */}
          <div className="search-section card">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for coupons, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button className={`filter-btn ${!selectedCategory ? 'active' : ''}`} onClick={() => setSelectedCategory('')}>
                All
              </button>
              <button className="filter-btn" onClick={() => setSelectedCategory('food')}>🍔 Food</button>
              <button className="filter-btn" onClick={() => setSelectedCategory('shopping')}>🛍️ Shopping</button>
              <button className="filter-btn" onClick={() => setSelectedCategory('travel')}>✈️ Travel</button>
              <button className="filter-btn" onClick={() => setSelectedCategory('entertainment')}>🎬 Entertainment</button>
            </div>
          </div>

          {/* Coupons Grid */}
          {coupons.length > 0 ? (
            <div className="coupons-grid">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="coupon-card card">
                  <div className="coupon-image">
                    <img src={coupon.image || 'https://via.placeholder.com/300x200?text=Coupon'} alt={coupon.title} />
                    <div className="coupon-badge badge-gradient">
                      {coupon.discountPercentage}% OFF
                    </div>
                  </div>
                  <div className="coupon-content">
                    <h3>{coupon.title}</h3>
                    <p className="coupon-brand">{coupon.brand}</p>
                    <p className="coupon-description">{coupon.description}</p>
                    <div className="coupon-pricing">
                      <div>
                        <span className="original-price">₹{coupon.originalPrice}</span>
                        <span className="selling-price">₹{coupon.sellingPrice}</span>
                      </div>
                      <span className="savings">Save ₹{coupon.originalPrice - coupon.sellingPrice}</span>
                    </div>
                    <div className="coupon-footer">
                      <span className="expiry">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBuyCoupon(coupon._id)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-marketplace card">
              <div className="empty-icon">🎟️</div>
              <h2>No Coupons Available Yet</h2>
              <p>Be the first to list a coupon on the marketplace!</p>
              <button className="btn btn-primary" onClick={() => navigateTo('vault')}>
                + List Your First Coupon
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
