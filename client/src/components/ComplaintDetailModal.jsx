import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, Clock, Tag, Calendar, User, MapPin, Building, 
  CheckCircle, ArrowRight, ShieldAlert, FileText, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

export default function ComplaintDetailModal() {
  const { selectedComplaint, isDetailModalOpen, closeDetailModal, updateStatus, openEditModal, openDeleteModal } = useComplaints();
  const { user } = useAuth();

  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isDetailModalOpen || !selectedComplaint) return null;

  const c = selectedComplaint;

  const handleStatusChange = async (targetStatus) => {
    setIsUpdating(true);
    await updateStatus(c.id, targetStatus, statusNotes, user ? user.name : 'Admin');
    setIsUpdating(false);
    setStatusNotes('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Raised':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical Priority':
        return 'bg-rose-500 text-white shadow-rose-500/20';
      case 'High Priority':
        return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'Medium Priority':
        return 'bg-blue-500 text-white shadow-blue-500/20';
      case 'Low Priority':
      default:
        return 'bg-slate-500 text-white shadow-slate-500/20';
    }
  };

  const steps = ['Raised', 'In Progress', 'Resolved'];
  const currentStepIndex = steps.indexOf(c.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full my-auto text-slate-800 dark:text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300">
              {c.id}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(c.status)}`}>
              {c.status}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${getPriorityBadge(c.priorityLevel)}`}>
              {c.priorityLevel} (Score: {c.urgencyScore})
            </span>
          </div>
          <button
            onClick={closeDetailModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Progress Tracker Stepper */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Workflow Status Progression
            </h4>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${(currentStepIndex / 2) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                      isCurrent 
                        ? 'bg-indigo-600 border-white text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-100 dark:ring-indigo-950'
                        : isPassed
                        ? 'bg-emerald-500 border-white text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }`}>
                      {isPassed && !isCurrent ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-xs mt-1.5 font-medium ${isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complaint Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Complaint Description
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
              {c.description}
            </div>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" /> Category & Weight
              </div>
              <div className="text-sm font-semibold">{c.category} (Weight: {c.categoryWeight})</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Age / Hours Pending
              </div>
              <div className="text-sm font-semibold">{c.hoursPending} Hours ({c.daysPending} full days)</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Submitted At
              </div>
              <div className="text-xs font-semibold">{new Date(c.submitted_at).toLocaleString()}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-purple-500" /> Student Name
              </div>
              <div className="text-sm font-semibold">{c.student_name || 'Anonymous Student'}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-emerald-500" /> Department
              </div>
              <div className="text-sm font-semibold">{c.department || 'Not Specified'}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location
              </div>
              <div className="text-sm font-semibold">{c.location || 'Campus'}</div>
            </div>
          </div>

          {/* Urgency Formula Breakdown Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800/60">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" /> Priority Score Calculation Breakdown
            </div>
            <div className="font-mono text-sm text-slate-800 dark:text-slate-200">
              Urgency Score = Category Weight ({c.categoryWeight}) + FLOOR({c.hoursPending} / 24) = {c.categoryWeight} + {c.daysPending} = <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base">{c.urgencyScore}</strong>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Resulting Priority Level: <strong>{c.priorityLevel}</strong>. Recalculated dynamically as complaint age increases.
            </div>
          </div>

          {/* Administrator Action Bar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Update Status & Resolution
            </h4>

            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Resolution or Status Transition Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Technician inspected site; spare parts ordered..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 mr-2">Transition to:</span>
              {c.status !== 'Raised' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('Raised')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 transition"
                >
                  Mark as Raised
                </button>
              )}
              {c.status !== 'In Progress' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 transition"
                >
                  Mark In Progress
                </button>
              )}
              {c.status !== 'Resolved' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('Resolved')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
                >
                  Mark as Resolved ✓
                </button>
              )}
            </div>
          </div>

          {/* Status Timeline History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Status Audit Trail & History
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
              {c.history && c.history.length > 0 ? (
                c.history.map((hist, index) => (
                  <div key={hist.id || index} className="relative group">
                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {hist.to_status}
                      </span>
                      {hist.from_status && (
                        <span className="text-slate-400 text-[11px]">
                          (from {hist.from_status})
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px] ml-auto">
                        {new Date(hist.changed_at).toLocaleString()}
                      </span>
                    </div>
                    {hist.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        {hist.notes}
                      </p>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      By: {hist.changed_by || 'System'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Initial registration on {new Date(c.submitted_at).toLocaleString()}</div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeDetailModal();
                openEditModal(c);
              }}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Edit Details
            </button>
            <button
              onClick={() => {
                closeDetailModal();
                openDeleteModal(c);
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
            >
              Delete
            </button>
          </div>
          <button
            onClick={closeDetailModal}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
