import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../Api/Axios';

const TradeModal = ({ isOpen, onClose, onSuccess, tradeToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Default form state
  const defaultFormState = {
    symbol: '',
    tradeType: 'BUY',
    price: '',
    quantity: '',
    tradeDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(defaultFormState);

  // If we receive a tradeToEdit, populate the form
  useEffect(() => {
    if (tradeToEdit && isOpen) {
      setFormData({
        symbol: tradeToEdit.symbol,
        tradeType: tradeToEdit.tradeType,
        price: tradeToEdit.price,
        quantity: tradeToEdit.quantity,
        // Format the ISO date back to YYYY-MM-DD for the HTML input field
        tradeDate: new Date(tradeToEdit.tradeDate).toISOString().split('T')[0]
      });
    } else if (isOpen) {
      // Reset to default when opening for a new trade
      setFormData(defaultFormState);
    }
    setError(''); // Clear errors on open
  }, [tradeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure price, quantity are numbers, and date is a full ISO string for the backend
      const payload = {
        ...formData,
        symbol: formData.symbol.toUpperCase(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        tradeDate: new Date(formData.tradeDate).toISOString() 
      };

      if (tradeToEdit) {
        // 🔥 FIX: Changed api.put to api.patch to match your backend!
        await api.patch(`/trades/${tradeToEdit._id}`, payload);
      } else {
        // CREATE new trade
        await api.post('/trades', payload);
      }
      
      onSuccess(); 
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-rzp-card w-full max-w-md rounded-xl shadow-lg border border-rzp-border overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-rzp-border bg-rzp-bg/50">
          <h2 className="text-lg font-bold text-rzp-primary">
            {tradeToEdit ? 'Edit Trade' : 'Log New Trade'}
          </h2>
          <button onClick={onClose} className="text-rzp-text hover:text-rzp-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-rzp-text mb-1">Coin Symbol</label>
              <input 
                type="text" 
                name="symbol" 
                required 
                placeholder="BTC"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full p-2.5 bg-rzp-bg border border-rzp-border rounded-md text-rzp-primary focus:outline-none focus:border-rzp-accent uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rzp-text mb-1">Trade Type</label>
              <select 
                name="tradeType" 
                value={formData.tradeType}
                onChange={handleChange}
                className="w-full p-2.5 bg-rzp-bg border border-rzp-border rounded-md text-rzp-primary focus:outline-none focus:border-rzp-accent"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-rzp-text mb-1">Entry Price ($)</label>
              <input 
                type="number" 
                name="price" 
                step="any"
                required 
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2.5 bg-rzp-bg border border-rzp-border rounded-md text-rzp-primary focus:outline-none focus:border-rzp-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rzp-text mb-1">Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                step="any"
                required 
                placeholder="0.00"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2.5 bg-rzp-bg border border-rzp-border rounded-md text-rzp-primary focus:outline-none focus:border-rzp-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-rzp-text mb-1">Trade Date</label>
            <input 
              type="date" 
              name="tradeDate" 
              required 
              value={formData.tradeDate}
              onChange={handleChange}
              className="w-full p-2.5 bg-rzp-bg border border-rzp-border rounded-md text-rzp-primary focus:outline-none focus:border-rzp-accent"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-rzp-border text-rzp-text rounded-md font-medium hover:bg-rzp-bg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-rzp-accent text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (tradeToEdit ? 'Save Changes' : 'Save Trade')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TradeModal;