import React, { useState, useEffect } from 'react';
import './Wallet.css';

function Wallet() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [addingMoney, setAddingMoney] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(userData));
    fetchWalletData(token);
  }, []);

  const fetchWalletData = async (token) => {
    try {
      // Fetch balance
      const balanceRes = await fetch('http://localhost:5000/api/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const balanceData = await balanceRes.json();
      if (balanceData.success) {
        setBalance(balanceData.data.balance);
      }

      // Fetch transactions
      const transRes = await fetch('http://localhost:5000/api/wallet/transactions?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const transData = await transRes.json();
      if (transData.success) {
        setTransactions(transData.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setAddingMoney(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');
    const amountNum = parseFloat(amount);

    if (amountNum < 100) {
      setMessage({ type: 'error', text: 'Minimum amount is ₹100' });
      setAddingMoney(false);
      return;
    }

    if (amountNum > 50000) {
      setMessage({ type: 'error', text: 'Maximum amount is ₹50,000' });
      setAddingMoney(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/wallet/add-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amountNum, paymentMethod: 'upi' })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `₹${amountNum} added successfully!` });
        setBalance(data.data.newBalance);
        setAmount('');
        setShowAddMoney(false);
        
        // Refresh transactions
        fetchWalletData(token);
        
        // Update user in localStorage
        const updatedUser = { ...user, walletBalance: data.data.newBalance };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setAddingMoney(false);
    }
  };

  const navigateTo = (page) => {
    window.history.pushState({}, '', `/${page}`);
    window.location.href = `/${page}`;
  };

  if (loading) {
    return (
      <div className="wallet-loading">
        <div className="spinner"></div>
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo" onClick={() => navigateTo('dashboard')} style={{cursor: 'pointer'}}>
              <span className="logo-icon">💰</span>
              <span className="logo-text">MOPONS</span>
            </div>
            <div className="nav-links">
              <a href="#" onClick={() => navigateTo('dashboard')}>Dashboard</a>
              <a href="#" onClick={() => navigateTo('marketplace')}>Marketplace</a>
              <a href="#" onClick={() => navigateTo('vault')}>My Vault</a>
              <a href="#" className="active">Wallet</a>
              <button onClick={() => { localStorage.clear(); navigateTo(''); }} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="wallet-content">
        <div className="container">
          {/* Header */}
          <div className="wallet-header">
            <div>
              <h1>My Wallet</h1>
              <p>Manage your money and transactions</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddMoney(true)}>
              + Add Money
            </button>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <span>{message.type === 'success' ? '✅' : '⚠️'}</span> {message.text}
            </div>
          )}

          {/* Balance Card */}
          <div className="balance-card card-gradient">
            <div className="balance-info">
              <p className="balance-label">Available Balance</p>
              <h2 className="balance-amount">₹{balance.toLocaleString()}</h2>
            </div>
            <div className="balance-icon">💳</div>
          </div>

          {/* Quick Stats */}
          <div className="wallet-stats">
            <div className="stat-box card">
              <div className="stat-icon">📥</div>
              <div>
                <h3>₹{balance.toLocaleString()}</h3>
                <p>Total Added</p>
              </div>
            </div>
            <div className="stat-box card">
              <div className="stat-icon">📤</div>
              <div>
                <h3>₹0</h3>
                <p>Total Spent</p>
              </div>
            </div>
            <div className="stat-box card">
              <div className="stat-icon">🔄</div>
              <div>
                <h3>{transactions.length}</h3>
                <p>Transactions</p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="transactions-section">
            <h2>Recent Transactions</h2>
            {transactions.length > 0 ? (
              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-item card">
                    <div className="transaction-icon">
                      {transaction.type === 'credit' ? '📥' : '📤'}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.description}</h4>
                      <p>{new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                    <div className={`badge badge-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                      {transaction.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="empty-icon">📭</div>
                <h3>No transactions yet</h3>
                <p>Add money to your wallet to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="modal-overlay" onClick={() => setShowAddMoney(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Money to Wallet</h2>
              <button className="close-btn" onClick={() => setShowAddMoney(false)}>×</button>
            </div>
            <form onSubmit={handleAddMoney}>
              <div className="form-group">
                <label className="form-label">Enter Amount</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Enter amount (₹100 - ₹50,000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  max="50000"
                  required
                />
                <p className="form-hint">Minimum: ₹100 | Maximum: ₹50,000</p>
              </div>

              <div className="quick-amounts">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setAmount('500')}>₹500</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setAmount('1000')}>₹1,000</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setAmount('2000')}>₹2,000</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setAmount('5000')}>₹5,000</button>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="input">
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={addingMoney}>
                {addingMoney ? <span className="spinner"></span> : 'Add Money'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
