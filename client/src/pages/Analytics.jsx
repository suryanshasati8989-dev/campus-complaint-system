import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { api } from '../api';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  PieChart as PieIcon,
  Percent,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';

export default function Analytics() {
  const { complaints, analyticsData } = useComplaints();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const raised = complaints.filter(c => c.status === 'Raised').length;
  const pending = raised;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category statistics
  const categoryStats = analyticsData?.categoryStats || [];

  // Priority Level distribution
  const priorityDistribution = [
    { name: 'Critical Priority (Score ≥ 5)', count: complaints.filter(c => c.priorityLevel === 'Critical Priority').length, color: '#e11d48' },
    { name: 'High Priority (Score 4)', count: complaints.filter(c => c.priorityLevel === 'High Priority').length, color: '#f59e0b' },
    { name: 'Medium Priority (Score 2-3)', count: complaints.filter(c => c.priorityLevel === 'Medium Priority').length, color: '#3b82f6' },
    { name: 'Low Priority (Score ≤ 1)', count: complaints.filter(c => c.priorityLevel === 'Low Priority').length, color: '#64748b' },
  ];

  // Category Status Stacked Bar Data
  const categoryStackData = categoryStats.map(cat => ({
    name: cat.category,
    Raised: cat.raised,
    'In Progress': cat.inProgress,
    Resolved: cat.resolved
  }));

  const timelineData = analyticsData?.timeline && analyticsData.timeline.length > 0
    ? analyticsData.timeline
    : [
        { date: 'Nov 1', total: 2, resolved: 1, raised: 1 },
        { date: 'Nov 2', total: 3, resolved: 2, raised: 1 },
        { date: 'Nov 3', total: total, resolved: resolved, raised: raised }
      ];

  const handleDownloadCsv = () => {
    api.downloadClientCsv(complaints);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            Campus Analytics & Operations Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data visualizations and performance metrics across departments and facilities
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete CSV Report</span>
        </button>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Grievances</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cumulative college campus tickets</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Resolved Successfully</div>
          <div className="text-3xl font-extrabold text-emerald-600">{resolved}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Completed maintenance tickets</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Resolution Rate</div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{resolutionRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Target benchmark: &gt; 80%</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">In Progress Pipeline</div>
          <div className="text-3xl font-extrabold text-blue-600">{inProgress}</div>
          <div className="text-[11px] text-blue-600/80 mt-1">Staff currently investigating</div>
        </div>
      </div>

      {/* Two Column Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Stacked Status Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Category-wise Status Distribution
              </h3>
              <p className="text-xs text-slate-400">Raised vs In Progress vs Resolved breakdown</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStackData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Raised" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="In Progress" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Resolved" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Level Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Urgency Level Distribution
              </h3>
              <p className="text-xs text-slate-400">Classification by calculated urgency scores</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityDistribution} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`prio-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Category Performance & Average Urgency Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
          Detailed Category Performance & Average Urgency
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-3">Base Weight</th>
                <th className="py-3 px-3">Total Registered</th>
                <th className="py-3 px-3">Raised</th>
                <th className="py-3 px-3">In Progress</th>
                <th className="py-3 px-3">Resolved</th>
                <th className="py-3 px-3">Resolution Rate</th>
                <th className="py-3 px-4 text-right">Avg Urgency Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categoryStats.map((c) => {
                const catRate = c.total > 0 ? Math.round((c.resolved / c.total) * 100) : 0;
                return (
                  <tr key={c.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {c.category}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.weight}
                    </td>
                    <td className="py-3.5 px-3 font-semibold">{c.total}</td>
                    <td className="py-3.5 px-3 text-amber-600 font-semibold">{c.raised}</td>
                    <td className="py-3.5 px-3 text-blue-600 font-semibold">{c.inProgress}</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-semibold">{c.resolved}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${catRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{catRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.avgUrgency}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
