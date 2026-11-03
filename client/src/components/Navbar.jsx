import React from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Plus, 
  Flame, 
  Database,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  setIsMobileOpen
}) {
  const { theme, toggleTheme } = useTheme();
  const { filters, updateFilters, priorityData, dataSource, addToast } = useComplaints();
  const { user, isAdmin, isStudent, logout } = useAuth();

  const unresolvedCount = priorityData?.topThree?.length || 0;

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully. Return anytime!', 'info', 'Logged Out');
  };

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'Campus Complaint Dashboard';
      case 'add-complaint':
        return 'Submit New Campus Complaint';
      case 'all-complaints':
        return 'All Registered Complaints';
      case 'priority-queue':
        return 'Automated Priority Queue & Urgency Algorithm';
      case 'analytics':
        return 'Analytics & Operational Insights';
      case 'settings':
        return 'System & College Settings';
      default:
        return 'Campus Complaint Management';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {getPageTitle(activeTab)}
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Engineering College Campus</span>
            <span>•</span>
            {isAdmin ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Mode: Full Status Management
              </span>
            ) : (
              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                <User className="w-3 h-3" /> Student Mode: Submit & Track Status Only
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Quick search ID, description..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Quick CTA: Add Complaint */}
        <button
          onClick={() => setActiveTab('add-complaint')}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>

        {/* Priority Queue Quick Indicator */}
        <button
          onClick={() => setActiveTab('priority-queue')}
          className="relative p-2 rounded-xl text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`${unresolvedCount} complaints in top priority queue`}
        >
          <Flame className="w-5 h-5 text-amber-500" />
          {unresolvedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        {/* User Role Badge & Logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700">
              {user.name.charAt(0)}
            </div>
            
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold leading-tight">{user.name}</div>
              <div className={`text-[10px] font-bold flex items-center gap-1 ${
                isAdmin ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                {isAdmin ? 'Admin' : 'Student'}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
