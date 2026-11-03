import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { 
  Inbox, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  Flame, 
  Plus, 
  ArrowUpRight, 
  Tag, 
  TrendingUp, 
  Layers,
  ChevronRight,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export default function Dashboard({ setActiveTab }) {
  const { complaints, priorityData, analyticsData, openDetailModal } = useComplaints();

  // Metrics
  const total = complaints.length;
  const raised = complaints.filter(c => c.status === 'Raised').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const pending = raised; // pending unassigned
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category Pie Chart Data
  const categoryCounts = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryColors = {
    'Wi-Fi': '#6366f1',
    'Hostel': '#ec4899',
    'Classroom': '#3b82f6',
    'Laboratory': '#8b5cf6',
    'Campus Facilities': '#10b981',
    'Other': '#f59e0b'
  };

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || '#64748b'
  }));

  // Status Distribution Bar Data
  const statusData = [
    { name: 'Raised', count: raised, color: '#f59e0b' },
    { name: 'In Progress', count: inProgress, color: '#3b82f6' },
    { name: 'Resolved', count: resolved, color: '#10b981' }
  ];

  // Activity Trends (from analyticsData or derived)
  const timelineData = analyticsData?.timeline && analyticsData.timeline.length > 0
    ? analyticsData.timeline
    : [
        { date: 'Nov 1', total: 2, resolved: 1, raised: 1 },
        { date: 'Nov 2', total: 3, resolved: 2, raised: 1 },
        { date: 'Nov 3', total: total, resolved: resolved, raised: raised }
      ];

  // Top Priority Queue
  const topPriority = priorityData?.topThree || [];

  // Recent 5 complaints
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 5);

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
        return 'bg-rose-500 text-white';
      case 'High Priority':
        return 'bg-amber-500 text-white';
      case 'Medium Priority':
        return 'bg-blue-500 text-white';
      case 'Low Priority':
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-700/15 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Priority Engine Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Complaint Command Center
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm max-w-xl">
            Real-time tracking of student grievances with automatic age & category urgency weighting algorithm.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('add-complaint')}
            className="px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-lg transition active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Complaint</span>
          </button>
          <button
            onClick={() => setActiveTab('priority-queue')}
            className="px-4 py-3 rounded-2xl bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-semibold text-sm backdrop-blur-md transition flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Priority Queue ({topPriority.length})</span>
          </button>
        </div>

        {/* Decorative Circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute left-1/2 bottom-0 w-48 h-48 rounded-full bg-indigo-400/10 pointer-events-none blur-xl" />
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Complaints */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Total Logged
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{total}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>All college categories</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">100%</span>
          </div>
        </div>

        {/* Raised / Pending */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              Raised (Awaiting)
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{raised}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Pending investigation</span>
            <span className="font-semibold text-amber-600">
              {total > 0 ? Math.round((raised / total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <RotateCw className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              In Progress
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{inProgress}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Active maintenance</span>
            <span className="font-semibold text-blue-600">
              {total > 0 ? Math.round((inProgress / total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Resolved
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{resolved}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Resolution rate</span>
            <span className="font-semibold text-emerald-600">{resolutionRate}%</span>
          </div>
        </div>

      </div>

      {/* Top Priority Highlights Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Top Priority Complaints Queue
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  Top 3 Urgent
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formula: Urgency Score = Category Weight + FLOOR(Hours Pending / 24) • Excludes Resolved
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('priority-queue')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Algorithm & Full Queue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {topPriority.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-200">No unresolved complaints pending!</p>
            <p className="text-xs mt-1">All campus complaints have been resolved or attended to.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPriority.map((c, index) => {
              const rankTitles = ['1st Urgent', '2nd Urgent', '3rd Urgent'];
              const rankColors = [
                'bg-rose-600 text-white',
                'bg-amber-600 text-white',
                'bg-indigo-600 text-white'
              ];
              return (
                <div
                  key={c.id}
                  onClick={() => openDetailModal(c)}
                  className="cursor-pointer group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600/50 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${rankColors[index] || 'bg-slate-600'}`}>
                        Rank #{index + 1} • {rankTitles[index]}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {c.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (Wt: {c.categoryWeight})
                      </span>
                      <span className={`text-[10px] ml-auto font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400">Age: {c.hoursPending} hrs ({c.daysPending}d)</span>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        Score: {c.urgencyScore}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition flex items-center gap-1">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown (Donut Pie) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" />
              Category Breakdown
            </h3>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>

          <div className="h-64">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No complaints yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Distribution (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              Status Pipeline
            </h3>
            <span className="text-xs text-slate-400">Count per status</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Activity Chart (Area Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Complaint Activity
            </h3>
            <span className="text-xs text-slate-400">Volume Trend</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#totalGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Recent Complaints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest submissions across all departments
            </p>
          </div>
          <button
            onClick={() => setActiveTab('all-complaints')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({complaints.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Submitted</th>
                <th className="pb-3 font-semibold">Urgency</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {c.id}
                  </td>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">
                    {c.category}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {c.description}
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(c.submitted_at).toLocaleDateString()} ({c.hoursPending}h ago)
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${getPriorityBadge(c.priorityLevel)}`}>
                      {c.urgencyScore} • {c.priorityLevel.replace(' Priority', '')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => openDetailModal(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
