// src/controllers/tradeController.js
// =============================================
// TRADE CONTROLLER - FULL CRUD OPERATIONS
// =============================================

const Trade = require('../models/trade');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { z } = require('zod');

// ====================== ZOD VALIDATION SCHEMAS ======================
const createTradeSchema = z.object({
  symbol: z.string().min(3).max(20).toUpperCase(),
  tradeType: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive(),
  price: z.number().positive(),
  fee: z.number().nonnegative().default(0),
  tradeDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional()
});

const updateTradeSchema = createTradeSchema.partial(); // all fields optional

// ====================== CREATE TRADE ======================
const createTrade = asyncHandler(async (req, res, next) => {
  const result = createTradeSchema.safeParse(req.body);
  
  // 🔥 BUG FIX: Safely map over 'issues' instead of 'errors' to prevent crashes
  if (!result.success) {
    const errorMessages = result.error.issues?.map(e => e.message).join(', ') || 'Invalid trade data provided';
    throw new AppError(errorMessages, 400);
  }

  const { symbol, tradeType, quantity, price, fee, tradeDate, notes } = result.data;
  let realizedPnl = 0;

  // --- 🔥 IMPROVED P&L LOGIC ---
  if (tradeType === 'SELL') {
    // 1. Find all previous BUY trades for this specific coin by this user
    const buyTrades = await Trade.find({ 
      user: req.user._id, 
      symbol: symbol, 
      tradeType: 'BUY' 
    });

    if (buyTrades.length > 0) {
      // 2. Calculate the average buy price
      let totalCost = 0;
      let totalCoins = 0;
      
      buyTrades.forEach(trade => {
        totalCost += (trade.price * trade.quantity);
        totalCoins += trade.quantity;
      });

      const avgBuyPrice = totalCost / totalCoins;

      // 3. Calculate actual PnL: (Sell Price - Avg Buy Price) * Quantity - Fees
      realizedPnl = ((price - avgBuyPrice) * quantity) - fee;
      
      // Round to 2 decimal places
      realizedPnl = Math.round(realizedPnl * 100) / 100;
    } else {
      // If they sell without logging a buy first, just deduct the fee
      realizedPnl = -fee; 
    }
  }

  const trade = await Trade.create({
    user: req.user._id,
    symbol,
    tradeType,
    quantity,
    price,
    fee,
    tradeDate: tradeDate || Date.now(),
    notes,
    realizedPnl
  });

  res.status(201).json({
    success: true,
    message: 'Trade logged successfully',
    data: trade
  });
});

// ====================== GET ALL TRADES (User sees own, Admin sees all) ======================
const getTrades = asyncHandler(async (req, res, next) => {
  let trades;

  if (req.user.role === 'ADMIN') {
    trades = await Trade.find().populate('user', 'name email');
  } else {
    trades = await Trade.find({ user: req.user._id }).populate('user', 'name email');
  }

  res.status(200).json({
    success: true,
    results: trades.length,
    data: trades
  });
});

// ====================== GET SINGLE TRADE ======================
const getTrade = asyncHandler(async (req, res, next) => {
  const trade = await Trade.findById(req.params.id).populate('user', 'name email');

  if (!trade) {
    throw new AppError('Trade not found', 404);
  }

  // Normal user can only see their own trade
  if (req.user.role !== 'ADMIN' && trade.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('You can only view your own trades', 403);
  }

  res.status(200).json({
    success: true,
    data: trade
  });
});

// ====================== UPDATE TRADE ======================
const updateTrade = asyncHandler(async (req, res, next) => {
  const result = updateTradeSchema.safeParse(req.body);
  
  // 🔥 BUG FIX: Safely map over 'issues' instead of 'errors'
  if (!result.success) {
    const errorMessages = result.error.issues?.map(e => e.message).join(', ') || 'Invalid trade data provided';
    throw new AppError(errorMessages, 400);
  }

  const trade = await Trade.findById(req.params.id);

  if (!trade) throw new AppError('Trade not found', 404);

  // Ownership check
  if (req.user.role !== 'ADMIN' && trade.user.toString() !== req.user._id.toString()) {
    throw new AppError('You can only update your own trades', 403);
  }

  // OPTIMIZED: Update fields directly on the fetched document and save it.
  // This avoids a second database lookup via findByIdAndUpdate.
  Object.assign(trade, result.data);
  const updatedTrade = await trade.save();

  res.status(200).json({
    success: true,
    message: 'Trade updated successfully',
    data: updatedTrade
  });
});

// ====================== DELETE TRADE ======================
const deleteTrade = asyncHandler(async (req, res, next) => {
  const trade = await Trade.findById(req.params.id);

  if (!trade) throw new AppError('Trade not found', 404);

  if (req.user.role !== 'ADMIN' && trade.user.toString() !== req.user._id.toString()) {
    throw new AppError('You can only delete your own trades', 403);
  }

  // OPTIMIZED: Delete the document directly using the fetched instance.
  // This avoids a second database lookup via findByIdAndDelete.
  await trade.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Trade deleted successfully'
  });
});


// ====================== EXPORT TRADES TO CSV ======================
const exportTradesCSV = asyncHandler(async (req, res, next) => {
  // 1. Fetch all trades for the logged-in user
  const trades = await Trade.find({ user: req.user._id }).sort({ tradeDate: -1 });

  if (!trades.length) {
    throw new AppError('No trades found to export', 404);
  }

  // 2. Define CSV Headers
  const headers = ['Trade ID', 'Symbol', 'Type', 'Quantity', 'Price', 'Fee', 'Realized PnL', 'Date', 'Notes'];
  
  // 3. Map trade data to CSV rows
  const csvRows = trades.map(trade => {
    return [
      trade._id,
      trade.symbol,
      trade.tradeType,
      trade.quantity,
      trade.price,
      trade.fee,
      trade.realizedPnl,
      new Date(trade.tradeDate).toISOString().split('T')[0], // YYYY-MM-DD
      `"${trade.notes ? trade.notes.replace(/"/g, '""') : ''}"` // Escape quotes in notes
    ].join(',');
  });

  // 4. Combine headers and rows
  const csvData = [headers.join(','), ...csvRows].join('\n');

  // 5. Send file to client
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="my_trades.csv"');
  res.status(200).send(csvData);
});

// ====================== GET DASHBOARD STATS ======================
const getDashboardStats = asyncHandler(async (req, res, next) => {
  // Use MongoDB Aggregation pipeline for high-performance math
  const stats = await Trade.aggregate([
    // Step 1: Only get trades for the currently logged-in user
    { $match: { user: req.user._id } },
    
    // Step 2: Group them together and calculate the totals
    {
      $group: {
        _id: null,
        totalTrades: { $sum: 1 },
        totalRealizedPnl: { $sum: '$realizedPnl' },
        totalFees: { $sum: '$fee' },
        winningTrades: {
          $sum: { $cond: [{ $gt: ['$realizedPnl', 0] }, 1, 0] }
        },
        losingTrades: {
          $sum: { $cond: [{ $lt: ['$realizedPnl', 0] }, 1, 0] }
        }
      }
    }
  ]);

  // Default values if the user has no trades yet
  let summary = {
    totalTrades: 0,
    totalRealizedPnl: 0,
    totalFees: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0
  };

  if (stats.length > 0) {
    summary = stats[0];
    delete summary._id; // Remove the internal MongoDB grouping ID
    
    // Calculate Win Rate percentage based on closed trades (wins + losses)
    const closedTrades = summary.winningTrades + summary.losingTrades;
    summary.winRate = closedTrades > 0 
      ? Number(((summary.winningTrades / closedTrades) * 100).toFixed(2)) 
      : 0;
  }

  res.status(200).json({
    success: true,
    data: summary
  });
});

module.exports = {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
  getDashboardStats,
  exportTradesCSV
};