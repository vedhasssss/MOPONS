import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Wallet from './Wallet';
import Marketplace from './Marketplace';
import Vault from './Vault';
import Analytics from './Analytics';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple routing based on URL path
    const path = window.location.pathname;
    if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard');
    } else if (path === '/wallet') {
      setCurrentPage('wallet');
    } else if (path === '/marketplace') {
      setCurrentPage('marketplace');
    } else if (path === '/vault') {
      setCurrentPage('vault');
    } else if (path === '/analytics') {
      setCurrentPage('analytics');
    } else {
      setCurrentPage('home');
    }

    // Handle navigation
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      if (path === '/login') {
        setCurrentPage('login');
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else if (path === '/wallet') {
        setCurrentPage('wallet');
      } else if (path === '/marketplace') {
        setCurrentPage('marketplace');
      } else if (path === '/vault') {
        setCurrentPage('vault');
      } else if (path === '/analytics') {
        setCurrentPage('analytics');
      } else {
        setCurrentPage('home');
      }
    });
  }, []);

  const navigateTo = (page) => {
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
    setCurrentPage(page);
  };

  // Show Auth page
  if (currentPage === 'login') {
    return <Auth />;
  }

  // Show Dashboard
  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  // Show Wallet
  if (currentPage === 'wallet') {
    return <Wallet />;
  }

  // Show Marketplace
  if (currentPage === 'marketplace') {
    return <Marketplace />;
  }

  // Show Vault
  if (currentPage === 'vault') {
    return <Vault />;
  }

  // Show Analytics
  if (currentPage === 'analytics') {
    return <Analytics />;
  }

  // Show Landing Page

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">💰</span>
              <span className="logo-text">MOPONS</span>
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#about">About</a>
              <button className="btn btn-primary" onClick={() => navigateTo('login')}>Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title fade-in">
              Trade Coupons,<br />
              <span className="text-gradient">Save Money</span>
            </h1>
            <p className="hero-subtitle fade-in">
              The ultimate platform to buy, sell, and exchange coupons.<br />
              Never let a coupon go to waste again!
            </p>
            <div className="hero-buttons fade-in">
              <button className="btn btn-primary btn-lg" onClick={() => navigateTo('login')}>
                Start Trading
              </button>
              <button className="btn btn-secondary btn-lg">
                Learn More
              </button>
            </div>
            <div className="hero-stats fade-in">
              <div className="stat">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Coupons Traded</div>
              </div>
              <div className="stat">
                <div className="stat-number">₹5M+</div>
                <div className="stat-label">Money Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title text-center">
            Why Choose <span className="text-gradient">MOPONS</span>?
          </h2>
          <p className="section-subtitle text-center">
            Everything you need to manage and trade coupons efficiently
          </p>
          
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">🛒</div>
              <h3>Buy Coupons</h3>
              <p>Browse thousands of coupons at discounted prices. Find deals on food, shopping, travel, and more.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">💸</div>
              <h3>Sell Unused Coupons</h3>
              <p>Turn your unused coupons into cash. List them on our marketplace and earn money instantly.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">🔄</div>
              <h3>Exchange Coupons</h3>
              <p>Trade coupons with other users. Get what you need by exchanging what you don't.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">💰</div>
              <h3>Secure Wallet</h3>
              <p>Manage your money safely with our integrated wallet system. Track all transactions.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Track your savings, monitor usage, and get insights on your coupon trading activity.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Reminders</h3>
              <p>Never miss a deal! Get notified before your coupons expire with smart reminders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title text-center">
            How <span className="text-gradient">MOPONS</span> Works
          </h2>
          <p className="section-subtitle text-center">
            Get started in just 3 simple steps
          </p>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up & Add Money</h3>
                <p>Create your free account and add money to your wallet to start trading.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Browse or List Coupons</h3>
                <p>Explore our marketplace or list your own coupons for sale or exchange.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Trade & Save Money</h3>
                <p>Buy, sell, or exchange coupons and start saving money on every purchase!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title text-center">
            Popular <span className="text-gradient">Categories</span>
          </h2>
          
          <div className="grid grid-4">
            <div className="category-card card">
              <div className="category-icon">🍔</div>
              <h4>Food & Dining</h4>
              <p>1,234 coupons</p>
            </div>
            
            <div className="category-card card">
              <div className="category-icon">🛍️</div>
              <h4>Shopping</h4>
              <p>2,456 coupons</p>
            </div>
            
            <div className="category-card card">
              <div className="category-icon">✈️</div>
              <h4>Travel</h4>
              <p>987 coupons</p>
            </div>
            
            <div className="category-card card">
              <div className="category-icon">🎬</div>
              <h4>Entertainment</h4>
              <p>1,567 coupons</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Saving?</h2>
            <p>Join thousands of users who are already trading coupons and saving money!</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigateTo('login')}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">💰</span>
                <span className="logo-text">MOPONS</span>
              </div>
              <p>Trade coupons, save money, and never let a deal go to waste.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#refund">Refund Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Connect</h4>
              <ul>
                <li><a href="#facebook">Facebook</a></li>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#instagram">Instagram</a></li>
                <li><a href="#linkedin">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 MOPONS. All rights reserved. | B.Sc. IT Final Year Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
