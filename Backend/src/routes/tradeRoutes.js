// src/routes/tradeRoutes.js
const express = require('express');
const router = express.Router();

const tradeController = require('../controllers/tradeController');
const { protect } = require('../middlewares/auth');   // your existing auth middleware

// All trade routes require login (protect)
router.use(protect);

// CRUD Routes
router.route('/')
  .post(tradeController.createTrade)   // Create new trade
  .get(tradeController.getTrades);     // Get all (user sees own, admin sees all)

router.route('/dashboard/summary')
  .get(tradeController.getDashboardStats);

router.route('/export/csv')
  .get(tradeController.exportTradesCSV);
    
router.route('/:id')
  .get(tradeController.getTrade)       // Get single trade
  .patch(tradeController.updateTrade)  // Update trade
  .delete(tradeController.deleteTrade); // Delete trade

module.exports = router;