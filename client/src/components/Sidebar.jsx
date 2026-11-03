import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  Flame, 
  BarChart3, 
  Settings, 
  LogOut, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Database
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const { priorityData, complaints, dataSource } = useComplaints();
  const { user, logout } = useAuth();

  const unresolvedCount = priorityData?.totalUnresolved || 
    complaints.filter(c => c.status !== 'Resolved').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-complaint', label: 'Add Complaint', icon: PlusCircle },
    { id: 'all-complaints', label: 'All Complaints', icon: ListFilter, count: complaints.length },
    { 
      id: 'priority-queue', 
      label: 'Priority Queue', 
      icon: Flame, 
      count: unresolvedCount, 
      highlight: unresolvedCount > 0 
    },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                  CampusPulse
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
                  CMS v2.6 • College
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Database Status Ribbon */}
        {!isCollapsed && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-indigo-500" />
              Storage:
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {dataSource === 'backend' ? 'SQLite Persistent' : 'LocalStorage Cache'}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-110'}`} />

                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.count !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.highlight
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}

                {/* Collapsed Tooltip Indicator */}
                {isCollapsed && item.highlight && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {user ? (
            <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 ${isCollapsed ? 'justify-center' : ''}`}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user.role}
                  </div>
                </div>
              )}
              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-4 h-4 rotate-180" />
              {!isCollapsed && <span>Admin Login</span>}
            </button>
          )}

          {isCollapsed && user && (
            <button
              onClick={logout}
              className="w-full mt-2 p-2 flex justify-center text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </aside>
    </>
  );
}
