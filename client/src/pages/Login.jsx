import React, { useState } from 'react';
import { useAuth, DEMO_ADMIN_CREDENTIALS, DEMO_STUDENTS } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building, 
  IdCard, 
  Sun, 
  Moon, 
  ShieldAlert,
  Info
} from 'lucide-react';

export default function Login({ setActiveTab }) {
  const { loginAsAdmin, loginAsStudent, user, logout } = useAuth();
  const { addToast } = useComplaints();
  const { theme, toggleTheme } = useTheme();

  // Active Tab: 'student' or 'admin'
  const [authRole, setAuthRole] = useState('student');

  // Student Form state
  const [studentName, setStudentName] = useState('Aarav Patel');
  const [studentId, setStudentId] = useState('CS-2024-042');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');

  // Admin Form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      loginAsStudent({
        name: studentName,
        studentId: studentId,
        department: studentDept
      });
      setIsLoading(false);
      addToast(`Signed in as Student: ${studentName}. You can now submit complaints & track live statuses!`, 'info', 'Welcome Student');
      if (setActiveTab) setActiveTab('dashboard');
    }, 300);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      setError('Please enter your administrator email.');
      return;
    }
    if (!adminPassword) {
      setError('Please enter your administrator password.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAsAdmin(adminEmail, adminPassword);
      setIsLoading(false);
      if (res.success) {
        addToast('Signed in as Campus Administrator. Full workflow & status management enabled.', 'success', 'Admin Access Granted');
        if (setActiveTab) setActiveTab('dashboard');
      } else {
        setError(res.error || 'Invalid administrator credentials');
      }
    }, 400);
  };

  const handleAutofillAdmin = () => {
    setAdminEmail(DEMO_ADMIN_CREDENTIALS.email);
    setAdminPassword(DEMO_ADMIN_CREDENTIALS.password);
    setError('');
  };

  const handleQuickStudentSelect = (std) => {
    setStudentName(std.name);
    setStudentId(std.studentId);
    setStudentDept(std.department);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200 relative">
      
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:scale-105 transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>

      <div className="max-w-xl w-full">
        
        {/* Main Header / College Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-600/30 mb-3.5">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CampusPulse Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            College Grievance & Facility Management System
          </p>
        </div>

        {/* Portal Selection Tabs */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 mb-6">
          <button
            type="button"
            onClick={() => { setAuthRole('student'); setError(''); }}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              authRole === 'student'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-300/40 dark:shadow-none'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthRole('admin'); setError(''); }}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              authRole === 'admin'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-300/40 dark:shadow-none'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Portal</span>
          </button>
        </div>

        {/* Auth Card Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: STUDENT SIGN-IN */}
          {authRole === 'student' && (
            <div className="space-y-5">
              
              {/* Permission Banner for Students */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-xs space-y-2">
                <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Student Permissions Notice
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  As a student, you can <strong>lodge new complaints</strong> and <strong>track the live status</strong> (Raised, In Progress, Resolved) of all complaints. Status modification and ticket editing are reserved for Campus Administration.
                </p>
              </div>

              {/* Quick Demo Student Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Quick Select Demo Student
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_STUDENTS.map((std) => (
                    <button
                      key={std.studentId}
                      type="button"
                      onClick={() => handleQuickStudentSelect(std)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        studentId === std.studentId
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 font-semibold text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{std.name}</div>
                      <div className="text-[10px] text-slate-400">{std.studentId}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Form */}
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aarav Patel"
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Student ID / Roll No.
                    </label>
                    <div className="relative">
                      <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. CS-2024-042"
                        className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={studentDept}
                        onChange={(e) => setStudentDept(e.target.value)}
                        className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      >
                        <option value="Computer Science & Engineering">Computer Science</option>
                        <option value="Electronics & Communication">Electronics (ECE)</option>
                        <option value="Mechanical Engineering">Mechanical Eng.</option>
                        <option value="Information Technology">Information Tech.</option>
                        <option value="Civil Engineering">Civil Eng.</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Student Complaint Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: ADMINISTRATOR SIGN-IN */}
          {authRole === 'admin' && (
            <div className="space-y-5">
              
              {/* Demo Credentials Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleAutofillAdmin}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-700 shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" /> Click to Autofill
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Email: <strong className="text-slate-900 dark:text-white">{DEMO_ADMIN_CREDENTIALS.email}</strong></div>
                  <div>Password: <strong className="text-slate-900 dark:text-white">{DEMO_ADMIN_CREDENTIALS.password}</strong></div>
                </div>
              </div>

              {/* Permissions info for Admin */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full Administrative Authority
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Admins can change statuses (<span className="text-amber-600 font-bold">Raised</span> $\to$ <span className="text-blue-600 font-bold">In Progress</span> $\to$ <span className="text-emerald-600 font-bold">Resolved</span>), dispatch technicians, edit tickets, delete complaints, and reset demo data.
                </p>
              </div>

              {/* Admin Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Administrator Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@college.edu"
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
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
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as Campus Administrator</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
          <span>CampusPulse CMS v2.6</span>
          <span>•</span>
          <span>Role-Based Access Control</span>
        </div>

      </div>
    </div>
  );
}
