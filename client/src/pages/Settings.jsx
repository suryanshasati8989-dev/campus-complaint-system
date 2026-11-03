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
  AlertTriangle
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { dataSource, resetSampleData, complaints } = useComplaints();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleConfirmReset = async () => {
    setIsResetModalOpen(false);
    await resetSampleData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          System Settings & Campus Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize interface appearance, view database connectivity, and manage demonstration datasets
        </p>
      </div>

      <div className="space-y-6">
        
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

        {/* Demo Data Management */}
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

        {/* System Architecture Specifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" />
            Software Architecture & Competition Specs
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Frontend Framework</span>
              <strong className="text-slate-800 dark:text-slate-200">React.js + Vite</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Styling Engine</span>
              <strong className="text-slate-800 dark:text-slate-200">Tailwind CSS v3.4</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Charts & Graphs</span>
              <strong className="text-slate-800 dark:text-slate-200">Recharts</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Backend Server</span>
              <strong className="text-slate-800 dark:text-slate-200">Express.js (Port 5000)</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Primary Database</span>
              <strong className="text-slate-800 dark:text-slate-200">Node:SQLite Persistent</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Offline Fallback</span>
              <strong className="text-slate-800 dark:text-slate-200">LocalStorage Mirror</strong>
            </div>
          </div>
        </div>

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
