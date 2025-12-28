import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    activeCoupons: 0,
    totalSavings: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    // Check for token in URL (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean URL
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Get user from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(userData));
    fetchWalletBalance(token);
    fetchRecentTransactions(token);
    fetchUserStats(token);
  }, []);

  const fetchWalletBalance = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setWalletBalance(data.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet/transactions?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setTransactions(data.data.transactions || []);
        setUserStats(prev => ({ ...prev, totalTransactions: data.data.pagination?.total || 0 }));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchUserStats = async (token) => {
    try {
      // Fetch user profile to get stats
      const userResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = await userResponse.json();
      if (userData.success) {
        const user = userData.data;
        
        // Fetch user's coupons to count active ones
        const couponsResponse = await fetch('http://localhost:5000/api/coupons', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const couponsData = await couponsResponse.json();
        let activeCoupons = 0;
        
        if (couponsData.success) {
          // Count coupons owned by this user that are not used
          activeCoupons = couponsData.data.coupons.filter(
            c => c.ownerId._id === user._id && (c.status === 'active' || c.status === 'sold')
          ).length;
        }
        
        setUserStats({
          totalSpent: user.totalSpent || 0,
          activeCoupons: activeCoupons,
          totalSavings: user.totalSavings || 0,
          totalTransactions: userStats.totalTransactions
        });
        
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const navigateTo = (page) => {
    window.history.pushState({}, '', `/${page}`);
    window.location.href = `/${page}`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">💰</span>
              <span className="logo-text">MOPONS</span>
            </div>
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('marketplace'); }}>Marketplace</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('vault'); }}>My Vault</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('wallet'); }}>Wallet</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('analytics'); }}>Analytics</a>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h1>Welcome back, {user?.name}! 👋</h1>
              <p>Here's what's happening with your coupons today.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigateTo('vault')}>
              + Add Coupon
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card card-gradient">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₹{walletBalance.toLocaleString()}</h3>
                <p>Wallet Balance</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('wallet')}>Add Money</button>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💸</div>
              <div className="stat-info">
                <h3>₹{userStats.totalSpent.toLocaleString()}</h3>
                <p>Total Spent</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎟️</div>
              <div className="stat-info">
                <h3>{userStats.activeCoupons}</h3>
                <p>Active Coupons</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₹{userStats.totalSavings.toLocaleString()}</h3>
                <p>Total Savings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{userStats.totalTransactions}</h3>
                <p>Transactions</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <div className="action-card card">
                <div className="action-icon">🛒</div>
                <h3>Browse Marketplace</h3>
                <p>Find amazing deals on coupons</p>
                <button className="btn btn-primary" onClick={() => navigateTo('marketplace')}>Browse Now</button>
              </div>

              <div className="action-card card">
                <div className="action-icon">💸</div>
                <h3>Sell Coupon</h3>
                <p>List your unused coupons</p>
                <button className="btn btn-primary" onClick={() => navigateTo('vault')}>Sell Now</button>
              </div>

              <div className="action-card card">
                <div className="action-icon">🔄</div>
                <h3>Exchange Coupon</h3>
                <p>Trade with other users</p>
                <button className="btn btn-primary" onClick={() => navigateTo('vault')}>Exchange</button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section">
            <h2>Recent Activity</h2>
            <div className="activity-card card">
              {transactions.length > 0 ? (
                <div className="activity-list">
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="activity-item">
                      <div className="activity-icon">
                        {transaction.type === 'credit' ? '💰' : 
                         transaction.type === 'debit' ? '💸' : '📋'}
                      </div>
                      <div className="activity-details">
                        <h4>{transaction.description}</h4>
                        <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`activity-amount ${transaction.type}`}>
                        {transaction.type === 'credit' && '+'}
                        {transaction.type === 'debit' && '-'}
                        {transaction.amount > 0 ? `₹${transaction.amount}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No activity yet</h3>
                  <p>Start buying, selling, or exchanging coupons to see your activity here.</p>
                  <button className="btn btn-primary" onClick={() => navigateTo('marketplace')}>Get Started</button>
                </div>
              )}
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="section">
            <h2>Expiring Soon</h2>
            <div className="activity-card card">
              <div className="empty-state">
                <div className="empty-icon">⏰</div>
                <h3>No expiring coupons</h3>
                <p>You'll see coupons that are about to expire here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
