import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { LogOut, Activity, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  // Extract user data from localStorage
  const storedData = JSON.parse(localStorage.getItem('user') || '{}');
  const actualUser = storedData.user || storedData; 
  
  // ✅ Clean Admin Check: Relying purely on the database role now
  const userRole = String(actualUser.role || '').toUpperCase();
  const isAdmin = userRole === 'ADMIN';

  return (
    <nav className="bg-rzp-card border-b border-rzp-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3 text-rzp-primary">
            <Activity size={24} strokeWidth={2} />
            <span className="font-bold text-xl tracking-tight">Crypto Journal</span>
            
            {/* ADMIN BADGE */}
            {isAdmin && (
              <span className="hidden sm:flex items-center gap-1 bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-xs font-bold ml-4">
                <ShieldCheck size={14} />
                ADMIN MODE
              </span>
            )}
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-rzp-text hover:text-rzp-primary transition-colors text-sm font-medium"
          >
            <LogOut size={18} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;