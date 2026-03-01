import React, { useState, useEffect, useMemo } from 'react';
import api from '../Api/Axios';
import Navbar from '../components/Navbar';
import TradeModal from '../components/TradeModal';
import {
  ArrowUpRight, ArrowDownLeft, Download, Plus,
  Trash2, Edit3, Shield, User, Layout, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('all');
  const [stats, setStats] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tradeId: null });

  // ==================== CLEAN ROLE DETECTION ====================
  const currentUser = useMemo(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      return parsed.user || parsed.data?.user || parsed.data || parsed || {};
    } catch (e) {
      console.error("Auth Parse Error", e);
      return {};
    }
  }, []);

  const isAdmin = useMemo(() => 
    String(currentUser.role || '').toUpperCase() === 'ADMIN', 
    [currentUser]
  );
  const currentUserId = useMemo(() => 
    String(currentUser._id || currentUser.id || '').trim(), 
    [currentUser]
  );

  // DEBUG - Remove after testing
  // console.log('Current User Debug →', { isAdmin, currentUserId, currentUser });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, tradesRes] = await Promise.all([
        api.get('/trades/dashboard/summary'),
        api.get('/trades')
      ]);
      setStats(statsRes.data.data || {});
      setTrades(tradesRes.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trade) => {
    setTradeToEdit(trade);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (id) => {
    setDeleteModal({ isOpen: true, tradeId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/trades/${deleteModal.tradeId}`);
      setDeleteModal({ isOpen: false, tradeId: null });
      fetchData();
    } catch (e) {
      setError("Delete failed. Please try again.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/trades/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', isAdmin ? 'all_trades.csv' : 'my_trades.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setError("CSV export failed. Make sure backend route exists.");
    }
  };

  // ==================== FILTERS ====================
  const myTrades = useMemo(() => 
    trades.filter(t => {
      const tradeOwnerId = String(t.user?._id || t.user || '').trim();
      return tradeOwnerId === currentUserId;
    }), 
    [trades, currentUserId]
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTrades = useMemo(() => 
    trades.filter(t => t.tradeDate?.startsWith(todayStr)), 
    [trades]
  );

  // FIXED FILTER LOGIC - This was the main bug
  let displayedTrades = trades;
  if (isAdmin) {
    if (viewMode === 'mytrades') displayedTrades = myTrades;
    else if (viewMode === 'today') displayedTrades = todayTrades;
  } else {
    displayedTrades = trades; // Backend already returns ONLY your trades for normal users
  }

  const showTraderColumn = isAdmin && viewMode === 'all';
  const totalColumns = showTraderColumn ? 7 : 6;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0F172A] border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Loading your trading journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ROLE BADGE + HEADER - Razorpay-style premium header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-xs font-bold tracking-[0.08em] uppercase border shadow-sm ${
                isAdmin 
                  ? 'bg-violet-50 text-violet-700 border-violet-100' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {isAdmin ? <Shield size={16} /> : <User size={16} />}
                {isAdmin ? 'ADMIN' : 'TRADER'}
              </div>
            </div>

            <h1 className="text-4xl font-semibold tracking-tighter text-[#0F172A]">
              {isAdmin ? 'Platform Control Center' : 'Trading Journal'}
            </h1>
            <p className="text-gray-500 mt-1 text-[15px]">
              Welcome back, <span className="font-semibold text-[#0F172A]">{currentUser.name || currentUser.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-gray-300 px-7 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 transition-all active:scale-[0.985]"
            >
              <Download size={18} /> Export CSV
            </button>

            <button 
              onClick={() => { setTradeToEdit(null); setIsModalOpen(true); }}
              className="flex items-center gap-2.5 bg-[#0F172A] hover:bg-black text-white px-7 py-3.5 rounded-2xl text-sm font-semibold shadow-xl shadow-black/10 transition-all active:scale-[0.985]"
            >
              <Plus size={18} strokeWidth={3} /> New Trade
            </button>
          </div>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-5 py-3.5 rounded-2xl text-sm">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto underline text-xs">Dismiss</button>
          </div>
        )}

        {/* STATS - Premium Razorpay-style cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total P&L" 
            value={`₹${(stats?.totalRealizedPnl || 0).toLocaleString('en-IN')}`} 
            trend={stats?.totalRealizedPnl >= 0} 
          />
          <StatCard 
            title="Win Rate" 
            value={`${stats?.winRate || 0}%`} 
            sub="Closed positions" 
          />
          <StatCard 
            title="Total Trades" 
            value={stats?.totalTrades?.toLocaleString() || '0'} 
          />
          <StatCard 
            title="Fees Paid" 
            value={`₹${(stats?.totalFees || 0).toFixed(2)}`} 
          />
        </div>

        {/* ADMIN FILTERS - Razorpay clean segmented control */}
        {isAdmin && (
          <div className="flex gap-2 mb-8 border-b border-gray-100 pb-6 overflow-x-auto no-scrollbar">
            <FilterBtn 
              active={viewMode === 'all'} 
              onClick={() => setViewMode('all')} 
              icon={<Layout size={16}/>} 
              label="All Platform Trades" 
              count={trades.length} 
            />
            <FilterBtn 
              active={viewMode === 'today'} 
              onClick={() => setViewMode('today')} 
              icon={<Calendar size={16}/>} 
              label="Today's Activity" 
              count={todayTrades.length} 
            />
            <FilterBtn 
              active={viewMode === 'mytrades'} 
              onClick={() => setViewMode('mytrades')} 
              icon={<CheckCircle size={16}/>} 
              label="My Trades Only" 
              count={myTrades.length} 
            />
          </div>
        )}

        {/* TRADE TABLE - Razorpay-grade table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/70 flex justify-between items-center">
            <h3 className="font-semibold text-xl tracking-tight text-[#0F172A]">
              {isAdmin && viewMode === 'all' ? 'All Platform Activity' : 'Your Journal'}
            </h3>
            <div className="text-xs text-gray-400 font-mono">
              {displayedTrades.length} entries
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.5px] border-b border-gray-100 bg-white">
                  <th className="px-8 py-5 text-left">Date</th>
                  {showTraderColumn && <th className="px-8 py-5 text-left">Trader</th>}
                  <th className="px-8 py-5 text-left">Symbol</th>
                  <th className="px-8 py-5 text-left">Side</th>
                  <th className="px-8 py-5 text-right">Entry Price</th>
                  <th className="px-8 py-5 text-right">Realized P&amp;L</th>
                  <th className="px-8 py-5 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedTrades.length === 0 ? (
                  <tr>
                    <td colSpan={totalColumns} className="py-28 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <Calendar size={28} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-medium">No trades found in this view.</p>
                    </td>
                  </tr>
                ) : (
                  displayedTrades.map((trade) => {
                    const tradeOwnerId = String(trade.user?._id || trade.user || '').trim();
                    // FIXED: Normal users always see Edit/Delete (backend already filters their trades)
                    const isOwn = !isAdmin || tradeOwnerId === currentUserId;

                    return (
                      <tr key={trade._id} className="group hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                          {new Date(trade.tradeDate).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        
                        {showTraderColumn && (
                          <td className="px-8 py-6">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl">
                              {isOwn ? 'You' : (trade.user?.name || trade.user?.email || 'Unknown')}
                            </span>
                          </td>
                        )}

                        <td className="px-8 py-6 font-bold text-[#0F172A] text-[15px] tracking-tight uppercase">
                          {trade.symbol}
                        </td>

                        <td className="px-8 py-6">
                          <span className={`inline-block px-4 py-1 text-xs font-black tracking-widest rounded-2xl ${
                            trade.tradeType === 'BUY' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {trade.tradeType}
                          </span>
                        </td>

                        <td className="px-8 py-6 text-right font-mono text-sm font-semibold text-gray-700">
                          ₹{parseFloat(trade.price).toLocaleString('en-IN')}
                        </td>

                        <td className={`px-8 py-6 text-right font-semibold text-sm font-mono tabular-nums ${
                          trade.realizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {trade.realizedPnl >= 0 ? '+' : ''}₹{parseFloat(trade.realizedPnl || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="px-8 py-6 text-right">
                          {isOwn ? (
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button 
                                onClick={() => handleEdit(trade)} 
                                className="p-3 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-2xl transition-all"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteTrigger(trade._id)} 
                                className="p-3 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-2xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 bg-gray-50 px-4 py-2 rounded-2xl">VIEW ONLY</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <TradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        tradeToEdit={tradeToEdit} 
      />

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-md w-full p-10 shadow-2xl">
            <div className="mx-auto w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-8">
              <Trash2 className="text-rose-500" size={42} strokeWidth={2} />
            </div>
            
            <h3 className="text-2xl font-semibold text-center mb-3">Delete this trade?</h3>
            <p className="text-center text-gray-500 text-[15px] leading-relaxed">
              This action cannot be undone and will permanently remove the entry from your journal and statistics.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, tradeId: null })} 
                className="py-4 text-sm font-semibold border border-gray-200 rounded-2xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="py-4 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-100"
              >
                Yes, Delete Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== REFINED SUB-COMPONENTS ====================
const StatCard = ({ title, value, trend = null, sub = null }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow transition-shadow group">
    <div className="flex justify-between items-start">
      <p className="text-xs font-semibold tracking-[0.5px] text-gray-400 uppercase">{title}</p>
      {trend !== null && (
        <div className={`rounded-2xl p-2 transition-all ${trend ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend ? <ArrowUpRight size={20} strokeWidth={3} /> : <ArrowDownLeft size={20} strokeWidth={3} />}
        </div>
      )}
    </div>
    
    <div className="mt-6">
      <div className="text-4xl font-semibold tracking-tighter text-[#0F172A] tabular-nums">{value}</div>
      {sub && <p className="text-xs text-gray-400 mt-1 font-medium tracking-wider">{sub}</p>}
    </div>
  </div>
);

const FilterBtn = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-7 py-4 rounded-3xl text-sm font-semibold border transition-all whitespace-nowrap
      ${active 
        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xl shadow-black/10 scale-[1.02]' 
        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
      }`}
  >
    {icon}
    {label}
    <span className={`ml-auto px-3 py-0.5 text-xs font-mono rounded-2xl ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
      {count}
    </span>
  </button>
);

export default Dashboard;