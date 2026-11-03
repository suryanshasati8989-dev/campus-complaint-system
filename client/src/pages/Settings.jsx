import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  RotateCcw, 
  Database, 
  Server, 
  ShieldCheck, 
  Building2, 
  Info,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Lock,
  User,
  LogOut
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, isStudent, logout } = useAuth();
  const { dataSource, resetSampleData, complaints, addToast } = useComplaints();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleConfirmReset = async () => {
    setIsResetModalOpen(false);
    await resetSampleData();
  };

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully.', 'info', 'Session Ended');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-indigo-600" />
            System Settings & User Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Account role details, appearance customization, and persistent database status
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Switch User</span>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* User Account Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                  {user?.name}
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isAdmin 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}>
                  {isAdmin ? 'Administrator' : 'Student (Complainant)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email} • {user?.department || 'Main Campus'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {isAdmin
                  ? 'Full administrative authority: Workflow status changes, dispatching technicians, editing tickets, and deletion.'
                  : 'Student role: Submitting complaints & real-time monitoring of grievance resolution pipeline.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            Interface Appearance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Toggle between clean light mode and high-contrast dark theme
          </p>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Active Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </div>
              <div className="text-xs text-slate-500">
                Optimized for low-light campus monitoring stations
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        {/* Database & Storage Engine */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-500" />
            Storage Engine & Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Continuous persistent storage state for complaint records
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs text-slate-400">Current Storage Backend</div>
              <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {dataSource === 'backend' ? 'Node.js SQLite (node:sqlite)' : 'Browser LocalStorage'}
              </div>
              <div className="text-[11px] text-slate-500">
                Path: server/complaints.db
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs text-slate-400">Active Records Stored</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {complaints.length} Complaints
              </div>
              <div className="text-[11px] text-slate-500">
                Persistent across browser sessions & server restarts
              </div>
            </div>
          </div>
        </div>

        {/* Demo Data Management - Only for Admins */}
        {isAdmin ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-500" />
              Demonstration Dataset Reset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Restore the benchmark sample complaints (C01 Wi-Fi, C02 Hostel, C03 Classroom, C04 Laboratory)
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Reset Sample Complaints
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Clears custom complaints and re-seeds C01, C02, C03, and C04 with original submission timestamps.
                </div>
              </div>

              <button
                onClick={() => setIsResetModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <Lock className="w-5 h-5 text-slate-400 shrink-0" />
            <span>Database re-seeding and administration controls require signing in with Administrator privileges.</span>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset to Sample Complaints?"
        message="This will re-initialize the complaints database to the 4 sample complaints (C01, C02, C03, C04) and restore their exact ages and statuses. Any extra complaints created will be replaced."
        confirmText="Yes, Reset Database"
        cancelText="Cancel"
        isDanger={false}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />

    </div>
  );
}
