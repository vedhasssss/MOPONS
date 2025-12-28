const express = require('express');
const {
  getBalance,
  addMoney,
  getTransactions,
  getTransaction
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/balance', protect, getBalance);
router.post('/add-money', protect, addMoney);
router.get('/transactions', protect, getTransactions);
router.get('/transactions/:id', protect, getTransaction);

module.exports = router;
