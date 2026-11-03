import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { api } from '../api';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  Plus, 
  RotateCcw,
  Clock, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AllComplaints({ setActiveTab }) {
  const { 
    complaints, 
    filters, 
    updateFilters, 
    openDetailModal, 
    openEditModal, 
    openDeleteModal,
    updateStatus,
    loading 
  } = useComplaints();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Search local triggers
  const handleSearchChange = (e) => {
    setCurrentPage(1);
    updateFilters({ search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setCurrentPage(1);
    updateFilters({ category: e.target.value });
  };

  const handleStatusChange = (e) => {
    setCurrentPage(1);
    updateFilters({ status: e.target.value });
  };

  const handleSortChange = (e) => {
    setCurrentPage(1);
    updateFilters({ sortBy: e.target.value });
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    updateFilters({ category: 'All', status: 'All', search: '', sortBy: 'newest' });
  };

  const handleExportCsv = () => {
    api.downloadClientCsv(complaints);
  };

  // Status badge styling: Raised = Orange, In Progress = Blue, Resolved = Green
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

  // Pagination calculation
  const totalPages = Math.ceil(complaints.length / itemsPerPage) || 1;
  const paginatedComplaints = complaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header with Title and CSV export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Campus Complaints
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, prioritize, and update grievance tickets across campus
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('add-complaint')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, text, student..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="All">All Categories</option>
              <option value="Wi-Fi">Wi-Fi (Weight: 2)</option>
              <option value="Hostel">Hostel (Weight: 2)</option>
              <option value="Classroom">Classroom (Weight: 1)</option>
              <option value="Laboratory">Laboratory (Weight: 3)</option>
              <option value="Campus Facilities">Campus Facilities</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="All">All Statuses</option>
              <option value="Raised">Raised (Orange)</option>
              <option value="In Progress">In Progress (Blue)</option>
              <option value="Resolved">Resolved (Green)</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="urgency_desc">Sort: Highest Urgency Score</option>
              <option value="urgency_asc">Sort: Lowest Urgency Score</option>
              <option value="category">Sort: Category A-Z</option>
            </select>
          </div>

        </div>

        {/* Filter stats & clear */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong>{complaints.length}</strong> matching complaint{complaints.length === 1 ? '' : 's'}
          </span>
          {(filters.search || filters.category !== 'All' || filters.status !== 'All' || filters.sortBy !== 'newest') && (
            <button
              onClick={handleResetFilters}
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {complaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No Complaints Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no complaint records matching your current filter criteria. Try clearing filters or submit a new complaint.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Complaint ID</th>
                  <th className="py-4 px-3">Category</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-3">Submitted Date</th>
                  <th className="py-4 px-3">Age (Hours)</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Urgency Score</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {paginatedComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    
                    {/* ID */}
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                      {c.id}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {c.category}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Weight: {c.categoryWeight}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="line-clamp-2 leading-relaxed">
                        {c.description}
                      </div>
                      {c.location && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          📍 {c.location}
                        </div>
                      )}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-3 text-slate-500 dark:text-slate-400">
                      <div>{new Date(c.submitted_at).toLocaleDateString()}</div>
                      <div className="text-[10px]">{new Date(c.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    {/* Age (Hours) */}
                    <td className="py-4 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {c.hoursPending} hrs
                      </span>
                      <div className="text-[10px] text-slate-400">
                        ({c.daysPending} full days)
                      </div>
                    </td>

                    {/* Status with Colored Labels: Raised = Orange, In Progress = Blue, Resolved = Green */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border shadow-xs ${getStatusBadge(c.status)}`}>
                          {c.status}
                        </span>

                        {/* Quick Status Dropdown for Admin */}
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className="text-[10px] py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none"
                          title="Quick update status"
                        >
                          <option value="Raised">Raised</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>

                    {/* Urgency Score */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-xs shadow-xs ${getPriorityBadge(c.priorityLevel)}`}>
                          {c.urgencyScore}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden xl:inline">
                          {c.priorityLevel.replace(' Priority', '')}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetailModal(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                          title="Edit Complaint"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Complaint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {complaints.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({complaints.length} total entries)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1 font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
