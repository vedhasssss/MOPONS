import React, { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics() {
  const [stats, setStats] = useState({
    totalSavings: 0,
    couponsBought: 0,
    couponsSold: 0,
    totalEarnings: 0,
    monthlyActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    setTimeout(() => {
      setStats({
        totalSavings: 1250,
        couponsBought: 5,
        couponsSold: 2,
        totalEarnings: 450,
        monthlyActivity: [
          { month: 'Jan', savings: 200, earnings: 0 },
          { month: 'Feb', savings: 450, earnings: 150 },
          { month: 'Mar', savings: 600, earnings: 300 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const navigateTo = (page) => {
    window.history.pushState({}, '', `/${page}`);
    window.location.href = `/${page}`;
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Crunching the numbers...</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
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
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('vault'); }}>My Vault</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('wallet'); }}>Wallet</a>
              <a href="#" className="active">Analytics</a>
              <button onClick={() => { localStorage.clear(); navigateTo(''); }} className="btn btn-outline btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="analytics-content">
        <div className="container">
          <div className="analytics-header">
            <h1>Analytics Dashboard 📊</h1>
            <p>Track your savings and earnings</p>
          </div>

          <div className="stats-overview">
            <div className="stat-card card-gradient-blue">
              <h3>Total Savings</h3>
              <div className="value">₹{stats.totalSavings}</div>
              <p>Money saved on purchases</p>
            </div>
            <div className="stat-card card-gradient-pink">
              <h3>Total Earnings</h3>
              <div className="value">₹{stats.totalEarnings}</div>
              <p>Money earned from sales</p>
            </div>
            <div className="stat-card">
              <h3>Coupons Bought</h3>
              <div className="value">{stats.couponsBought}</div>
            </div>
            <div className="stat-card">
              <h3>Coupons Sold</h3>
              <div className="value">{stats.couponsSold}</div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-card card">
              <h3>Monthly Activity</h3>
              <div className="chart-placeholder">
                {/* Simple CSS Bar Chart visualization */}
                <div className="bar-chart">
                  {stats.monthlyActivity.map((item, index) => (
                    <div key={index} className="bar-group">
                      <div className="bars">
                        <div className="bar savings-bar" style={{height: `${(item.savings / 1000) * 100}%`}} title={`Savings: ₹${item.savings}`}></div>
                        <div className="bar earnings-bar" style={{height: `${(item.earnings / 1000) * 100}%`}} title={`Earnings: ₹${item.earnings}`}></div>
                      </div>
                      <span className="label">{item.month}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item"><span className="dot savings-dot"></span> Savings</div>
                  <div className="legend-item"><span className="dot earnings-dot"></span> Earnings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
