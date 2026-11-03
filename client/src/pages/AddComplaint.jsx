import React, { useState, useEffect } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_WEIGHTS, getCategoryWeight } from '../api';
import { 
  PlusCircle, 
  Send, 
  Sparkles, 
  Tag, 
  FileText, 
  User, 
  Building, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function AddComplaint({ setActiveTab }) {
  const { createComplaint } = useComplaints();
  const { user, isStudent } = useAuth();

  const [category, setCategory] = useState('Wi-Fi');
  const [description, setDescription] = useState('');
  const [studentName, setStudentName] = useState(user ? user.name : '');
  const [department, setDepartment] = useState(user && user.department ? user.department : '');
  const [location, setLocation] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setStudentName(user.name);
      if (user.department) setDepartment(user.department);
    }
  }, [user]);

  // Live Urgency preview (Initial: 0 hours pending)
  const currentWeight = getCategoryWeight(category);
  const initialUrgencyScore = currentWeight; // Category Weight + 0

  const validate = () => {
    const errs = {};
    if (!category || !category.trim()) {
      errs.category = 'Complaint Category is mandatory.';
    }
    if (!description || !description.trim()) {
      errs.description = 'Complaint Description is mandatory.';
    } else if (description.trim().length < 10) {
      errs.description = 'Please provide at least 10 characters describing the issue.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      category,
      description,
      student_name: studentName.trim() || (user ? user.name : 'Anonymous Student'),
      department: department.trim() || 'General Campus',
      location: location.trim() || 'Main Campus'
    };

    const res = await createComplaint(payload);
    setIsSubmitting(false);

    if (res.success) {
      // Clear form
      setDescription('');
      setLocation('');
      // Navigate to all complaints or dashboard
      setActiveTab('all-complaints');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <PlusCircle className="w-7 h-7 text-indigo-600" />
          Submit New Campus Complaint
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Lodge facility issues for prompt campus administration review and automated priority dispatch.
        </p>
      </div>

      {/* User Session Banner */}
      {user && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Filing as: <strong>{user.name}</strong> ({user.department || 'Campus'})</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            Status: Raised on Submit
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Complaint Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                  }}
                  className={`w-full text-sm pl-10 pr-4 py-3 rounded-2xl border ${
                    errors.category 
                      ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                >
                  <option value="Wi-Fi">Wi-Fi (Priority Weight: 2)</option>
                  <option value="Hostel">Hostel (Priority Weight: 2)</option>
                  <option value="Classroom">Classroom (Priority Weight: 1)</option>
                  <option value="Laboratory">Laboratory (Priority Weight: 3)</option>
                  <option value="Campus Facilities">Other Campus Facilities (Priority Weight: 1)</option>
                </select>
              </div>
              {errors.category && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Detailed Complaint Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                }}
                placeholder="Explain the issue clearly (e.g. Wi-Fi router signal lost in Library 2nd floor, fans in room 204 vibrating loudly, etc.)..."
                className={`w-full text-sm p-4 rounded-2xl border ${
                  errors.description 
                    ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20' 
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                </p>
              )}
            </div>

            {/* Optional Fields Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Student Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Department <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Optional Field: Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Campus Location / Room <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block C, Room 302 or Girls Hostel 2nd floor"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Complaint to Campus Desk</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Informative Side Panel */}
        <div className="space-y-5">
          
          {/* Live Urgency Estimator Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" /> Automatic Priority Estimator
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Selected Category:</span>
                <span className="font-bold text-slate-900 dark:text-white">{category}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Category Weight:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">+{currentWeight} pts</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Initial Hours Pending:</span>
                <span className="font-mono text-slate-500">0 hrs (0 days)</span>
              </div>
              <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Starting Urgency:</span>
                <span className="text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  {initialUrgencyScore}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every 24 hours this complaint remains unresolved, the system automatically adds <strong>+1 point</strong> to its urgency score.
            </div>
          </div>

          {/* Submission Guidelines */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-xs space-y-3 text-slate-600 dark:text-slate-400">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Submission Standards
            </h4>
            <ul className="space-y-2 list-disc pl-4 leading-relaxed">
              <li>Category and description are required by campus policy.</li>
              <li>Complaint ID (e.g. <span className="font-mono text-indigo-600 font-bold">CMP-2026-0005</span>) is generated automatically.</li>
              <li>Status is immediately initialized as <strong className="text-amber-600">Raised</strong>.</li>
              <li>All complaints are stored permanently in the SQLite database.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
