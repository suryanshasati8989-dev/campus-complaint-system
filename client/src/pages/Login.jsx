import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  KeyRound,
  UserCheck
} from 'lucide-react';

export default function Login({ setActiveTab }) {
  const { login, loginAsStudent, user, logout } = useAuth();
  const { addToast } = useComplaints();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        addToast('Welcome back, Administrator!', 'success', 'Authenticated');
        setActiveTab('dashboard');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 400);
  };

  const handleAutofill = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  const handleStudentDemo = () => {
    loginAsStudent('Kavya Verma', 'Computer Science & Engineering');
    addToast('Logged in as Student Representative.', 'info');
    setActiveTab('add-complaint');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 mb-4">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campus Administrator Portal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign in to manage, prioritize, and resolve campus complaints
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {user ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email} • {user.role}</p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Go to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    addToast('Logged out successfully', 'info');
                  }}
                  className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-xl transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Demo Credentials Pill */}
              <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <KeyRound className="w-3.5 h-3.5" /> Demo Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Autofill
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Email: <strong className="text-slate-900 dark:text-white">{DEMO_CREDENTIALS.email}</strong></div>
                  <div>Password: <strong className="text-slate-900 dark:text-white">{DEMO_CREDENTIALS.password}</strong></div>
                </div>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    College Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@college.edu"
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as Administrator</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">or explore as</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStudentDemo}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Student Representative Mode (Submit Complaint)</span>
              </button>
            </>
          )}

        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          CampusPulse System • CODE CRACK 3.0 Production Ready • SQLite Engine
        </p>

      </div>
    </div>
  );
}
