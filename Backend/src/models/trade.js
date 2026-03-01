
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  // Every trade belongs to exactly one user (this enables ownership security)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',           // Links to User model
    required: [true, 'User is required']
  },

  // Crypto pair (e.g., BTCUSDT, ETHUSDT)
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    uppercase: true,
    trim: true,
    index: true                // Fast searching by coin
  },

  // BUY or SELL
  tradeType: {
    type: String,
    enum: {
      values: ['BUY', 'SELL'],
      message: 'tradeType must be either BUY or SELL'
    },
    required: [true, 'Trade type is required']
  },

  // How many coins were traded
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.00000001, 'Quantity must be greater than 0']
  },

  // Price per coin at the time of trade
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },

  // Trading fee (optional)
  fee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative']
  },

  // When the trade happened
  tradeDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Optional notes (e.g., "Bought during dip", "FOMO sell")
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },

  // Realized Profit & Loss (calculated when SELL trade is created)
  // For BUY trades we keep it null or 0
  realizedPnl: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true   // Auto adds createdAt & updatedAt
});

// ====================== INDEXES FOR PERFORMANCE ======================
// These make dashboard queries and filtering lightning fast
tradeSchema.index({ user: 1, tradeDate: -1 });     // Show recent trades first
tradeSchema.index({ user: 1, symbol: 1 });

// Total cost of this trade (for quick calculations later)
tradeSchema.virtual('totalCost').get(function () {
  return this.quantity * this.price + this.fee;
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;