import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { CATEGORY_WEIGHTS, getCategoryWeight } from '../api';
import { 
  Flame, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Award, 
  ArrowRight, 
  AlertTriangle, 
  Eye, 
  RotateCw,
  Sparkles,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function PriorityQueue({ setActiveTab }) {
  const { priorityData, openDetailModal, updateStatus } = useComplaints();

  // Interactive Simulator Sandbox State
  const [simCategory, setSimCategory] = useState('Laboratory');
  const [simHours, setSimHours] = useState(48);

  const simWeight = getCategoryWeight(simCategory);
  const simDays = Math.floor(simHours / 24);
  const simScore = simWeight + simDays;
  let simLevel = 'Low Priority';
  if (simScore >= 5) simLevel = 'Critical Priority';
  else if (simScore >= 4) simLevel = 'High Priority';
  else if (simScore >= 2) simLevel = 'Medium Priority';

  const topThree = priorityData?.topThree || [];
  const allUnresolved = priorityData?.allUnresolved || [];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical Priority':
        return 'bg-rose-600 text-white shadow-rose-600/25';
      case 'High Priority':
        return 'bg-amber-500 text-white shadow-amber-500/25';
      case 'Medium Priority':
        return 'bg-blue-500 text-white shadow-blue-500/25';
      case 'Low Priority':
      default:
        return 'bg-slate-500 text-white shadow-slate-500/25';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Raised':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-600/15 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-300" />
            Core Mathematical Urgency Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Priority Queue & Dispatch Center
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Unresolved complaints dynamically sorted by urgency score. Older complaints receive automatic escalation every 24 hours. Resolved tickets are automatically filtered out.
          </p>
        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* Mathematical Algorithm Explanation Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Urgency Score Calculation Algorithm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic priority assignment formula defined for campus operations
            </p>
          </div>
        </div>

        {/* Formula Display Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white font-mono text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-inner">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-sans font-bold">Standard Formula</div>
            <div className="text-base sm:text-lg font-bold text-indigo-400">
              Urgency Score = Category Weight + FLOOR(Hours Pending / 24)
            </div>
          </div>
          <div className="text-xs bg-slate-800 px-4 py-2 rounded-xl text-slate-300 border border-slate-700">
            Escalates <strong className="text-emerald-400">+1 point</strong> every 24 full hours pending
          </div>
        </div>

        {/* Category Weights Grid & Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Category Weights Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-500" />
              Category Weights
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Category</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Base Weight</th>
                    <th className="py-2.5 px-4 font-semibold">Campus Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">Laboratory</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">3</td>
                    <td className="py-2.5 px-4 text-slate-500">Affects research & practical exams</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">Wi-Fi</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">2</td>
                    <td className="py-2.5 px-4 text-slate-500">Academic connectivity & assignments</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">Hostel</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">2</td>
                    <td className="py-2.5 px-4 text-slate-500">Living conditions, water & power</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">Classroom</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">1</td>
                    <td className="py-2.5 px-4 text-slate-500">Lecture hall facilities & fans</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">Other Facilities</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">1</td>
                    <td className="py-2.5 px-4 text-slate-500">General campus amenities</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Algorithmic Sorting & Queue Rules
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5 text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span><strong>Unresolved Only:</strong> Only complaints in <code className="text-amber-600 font-bold">Raised</code> or <code className="text-blue-600 font-bold">In Progress</code> status qualify.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span><strong>Exclusion Rule:</strong> Resolved complaints are strictly excluded from the unresolved priority queue.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span><strong>Highest Urgency First:</strong> Tickets sorted in descending order of calculated Urgency Score.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                <span><strong>Tie-Breaker Rule:</strong> If two complaints have identical scores, the older complaint (<code className="font-mono">submitted_at ASC</code>) is prioritized first.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TOP 3 HIGHEST PRIORITY SPOTLIGHT (Mandatory Requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Top 3 Highest-Priority Unresolved Complaints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate action requested: Ranked by highest score, with older tickets prioritized on ties
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
            Dispatch Priority
          </span>
        </div>

        {topThree.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Zero Unresolved Grievances</h4>
            <p className="text-xs mt-1">All complaints have reached Resolved status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topThree.map((c, index) => {
              const ranks = ['1st Highest Priority', '2nd Priority', '3rd Priority'];
              const borders = [
                'border-rose-400 dark:border-rose-600 ring-2 ring-rose-500/20',
                'border-amber-400 dark:border-amber-600',
                'border-indigo-400 dark:border-indigo-600'
              ];
              const badgeColors = [
                'bg-rose-600 text-white',
                'bg-amber-600 text-white',
                'bg-indigo-600 text-white'
              ];

              return (
                <div
                  key={c.id}
                  className={`bg-white dark:bg-slate-900 border ${borders[index]} rounded-3xl p-6 shadow-md relative flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Rank Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${badgeColors[index]}`}>
                        Rank #{index + 1} • {ranks[index]}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-600 dark:text-slate-300">
                        {c.id}
                      </span>
                    </div>

                    {/* Category & Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-slate-900 dark:text-white">
                        {c.category}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {c.description}
                    </p>

                    {/* Detailed Math Breakdown Card */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs space-y-1 mb-4">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Formula Evaluation:</div>
                      <div className="text-slate-800 dark:text-slate-200">
                        Weight ({c.categoryWeight}) + FLOOR({c.hoursPending} / 24)
                      </div>
                      <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                        = {c.categoryWeight} + {c.daysPending} = <strong>Urgency Score {c.urgencyScore}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => openDetailModal(c)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>

                    {c.status === 'Raised' ? (
                      <button
                        onClick={() => updateStatus(c.id, 'In Progress', 'Admin dispatched priority task')}
                        className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                      >
                        Start Work
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(c.id, 'Resolved', 'Resolved from priority queue')}
                        className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                      >
                        Resolve ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL UNRESOLVED QUEUE TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Full Unresolved Priority Dispatch List ({allUnresolved.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted strictly by Urgency Score DESC, then submitted date (older first). Resolved excluded.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Priority Rank</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3">Age (Hours)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Urgency Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allUnresolved.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {c.id}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {c.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {c.description}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-900 dark:text-white">{c.hoursPending}h</span>
                    <span className="text-[10px] text-slate-400 block">({c.daysPending}d)</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold border text-[11px] ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${getPriorityBadge(c.priorityLevel)}`}>
                      Score: {c.urgencyScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openDetailModal(c)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Priority Sandbox Simulator */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-slate-50 dark:from-slate-900 dark:to-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Interactive Urgency Formula Sandbox
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test hypothetical categories and age durations to see how the algorithm scores them
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Input 1: Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Category
            </label>
            <select
              value={simCategory}
              onChange={(e) => setSimCategory(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Laboratory">Laboratory (Weight: 3)</option>
              <option value="Wi-Fi">Wi-Fi (Weight: 2)</option>
              <option value="Hostel">Hostel (Weight: 2)</option>
              <option value="Classroom">Classroom (Weight: 1)</option>
              <option value="Campus Facilities">Campus Facilities (Weight: 1)</option>
            </select>
          </div>

          {/* Input 2: Hours Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pending Duration:
              </label>
              <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                {simHours} Hours ({simDays} days)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="168"
              step="4"
              value={simHours}
              onChange={(e) => setSimHours(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0h</span>
              <span>48h (2d)</span>
              <span>96h (4d)</span>
              <span>168h (7d)</span>
            </div>
          </div>

          {/* Live Output */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] text-slate-400 font-mono">
              Score = {simWeight} + FLOOR({simHours} / 24) = {simWeight} + {simDays}
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {simScore}
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityBadge(simLevel)}`}>
                {simLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
