const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');

    res.status(200).json({
      success: true,
      data: {
        balance: user.walletBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add money to wallet
// @route   POST /api/wallet/add-money
// @access  Private
exports.addMoney = async (req, res, next) => {
  try {
    const { amount, paymentMethod = 'upi' } = req.body;

    // Validate amount
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum amount is ₹100'
      });
    }

    if (amount > 50000) {
      return res.status(400).json({
        success: false,
        message: 'Maximum amount is ₹50,000'
      });
    }

    const user = await User.findById(req.user.id);
    const balanceBefore = user.walletBalance;

    // In production, integrate with Razorpay here
    // For now, simulate successful payment
    user.walletBalance += Number(amount);
    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: Number(amount),
      balanceBefore,
      balanceAfter: user.walletBalance,
      paymentMethod,
      status: 'completed',
      description: `Wallet top-up via ${paymentMethod}`
    });

    // Create notification
    await Notification.create({
      userId: user._id,
      type: 'transaction',
      title: 'Money Added',
      message: `₹${amount} has been added to your wallet`,
      relatedId: transaction._id,
      relatedModel: 'Transaction'
    });

    res.status(200).json({
      success: true,
      message: 'Money added successfully',
      data: {
        transaction,
        newBalance: user.walletBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      page = 1,
      limit = 20
    } = req.query;

    const query = { userId: req.user.id };

    if (type) query.type = type;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('couponId', 'title image')
      .populate('relatedUserId', 'name avatar')
      .sort('-createdAt')
      .limit(Number(limit))
      .skip(skip);

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction details
// @route   GET /api/wallet/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('couponId')
      .populate('relatedUserId', 'name avatar email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};
