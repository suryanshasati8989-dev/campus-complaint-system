import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, checkBackendHealth, calculateUrgency, enrichComplaint } from '../api';

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [priorityData, setPriorityData] = useState({ topThree: [], allUnresolved: [] });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('backend'); // 'backend' | 'localStorage'
  
  // Modals & Active state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [deletingComplaint, setDeletingComplaint] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filters & Search
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    search: '',
    sortBy: 'newest'
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type, title };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch full dataset
  const refreshAll = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    try {
      const [listRes, pqRes, anaRes] = await Promise.all([
        api.getComplaints(currentFilters),
        api.getPriorityQueue(),
        api.getAnalytics()
      ]);

      setComplaints(listRes.data);
      setDataSource(listRes.source);
      setPriorityData(pqRes.data);
      setAnalyticsData(anaRes.data);
    } catch (err) {
      console.error('Failed to load complaint data:', err);
      addToast('Failed to load complaint data. Using local cache.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  // Initial load
  useEffect(() => {
    refreshAll();

    // Check backend health periodically and live-recalculate ages every 60s
    const interval = setInterval(() => {
      setComplaints(prev => prev.map(enrichComplaint));
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshAll]);

  // Handle filter changes
  const updateFilters = (newFilters) => {
    setFilters(prev => {
      const next = typeof newFilters === 'function' ? newFilters(prev) : { ...prev, ...newFilters };
      // refresh with new filters
      api.getComplaints(next).then(res => {
        setComplaints(res.data);
      });
      return next;
    });
  };

  // Submit Complaint
  const createComplaint = async (data) => {
    try {
      const res = await api.createComplaint(data);
      addToast(`Complaint ${res.data.id} submitted successfully! Status: Raised.`, 'success', 'Submission Successful');
      await refreshAll();
      return { success: true, complaint: res.data };
    } catch (err) {
      addToast(err.message || 'Submission failed. Please check inputs.', 'error', 'Error');
      return { success: false, error: err.message };
    }
  };

  // Update Complaint Details
  const updateComplaint = async (id, data) => {
    try {
      const res = await api.updateComplaint(id, data);
      addToast(`Complaint ${id} updated successfully.`, 'success', 'Updated');
      setIsEditModalOpen(false);
      setEditingComplaint(null);
      await refreshAll();
      return { success: true, complaint: res.data };
    } catch (err) {
      addToast(err.message || 'Update failed.', 'error', 'Error');
      return { success: false, error: err.message };
    }
  };

  // Update Status ('Raised' -> 'In Progress' -> 'Resolved')
  const updateStatus = async (id, status, notes = '', changed_by = 'Admin') => {
    try {
      const res = await api.updateStatus(id, { status, notes, changed_by });
      addToast(`Status updated to "${status}" for complaint ${id}.`, 'info', 'Status Changed');
      
      // Update selectedComplaint if it's currently open
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint(res.data);
      }

      await refreshAll();
      return { success: true, complaint: res.data };
    } catch (err) {
      addToast(err.message || 'Failed to update status.', 'error', 'Error');
      return { success: false, error: err.message };
    }
  };

  // Delete Complaint
  const deleteComplaint = async (id) => {
    try {
      await api.deleteComplaint(id);
      addToast(`Complaint ${id} deleted permanently.`, 'warning', 'Deleted');
      setIsDeleteModalOpen(false);
      setDeletingComplaint(null);
      if (selectedComplaint && selectedComplaint.id === id) {
        setIsDetailModalOpen(false);
        setSelectedComplaint(null);
      }
      await refreshAll();
      return { success: true };
    } catch (err) {
      addToast(err.message || 'Failed to delete complaint.', 'error', 'Error');
      return { success: false, error: err.message };
    }
  };

  // Reset sample data
  const resetSampleData = async () => {
    try {
      await api.resetSampleData();
      addToast('Reset to original sample complaints (C01 - C04) successfully.', 'info', 'Database Reset');
      await refreshAll();
    } catch {
      addToast('Failed to reset sample data.', 'error');
    }
  };

  // View details modal trigger
  const openDetailModal = async (complaint) => {
    try {
      const res = await api.getComplaint(complaint.id);
      setSelectedComplaint(res.data);
    } catch {
      setSelectedComplaint(complaint);
    }
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedComplaint(null);
  };

  // Edit modal trigger
  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingComplaint(null);
  };

  // Delete modal trigger
  const openDeleteModal = (complaint) => {
    setDeletingComplaint(complaint);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingComplaint(null);
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      priorityData,
      analyticsData,
      loading,
      dataSource,
      filters,
      updateFilters,
      refreshAll,
      createComplaint,
      updateComplaint,
      updateStatus,
      deleteComplaint,
      resetSampleData,
      // Modals
      selectedComplaint,
      isDetailModalOpen,
      openDetailModal,
      closeDetailModal,
      editingComplaint,
      isEditModalOpen,
      openEditModal,
      closeEditModal,
      deletingComplaint,
      isDeleteModalOpen,
      openDeleteModal,
      closeDeleteModal,
      // Toasts
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) throw new Error('useComplaints must be used within ComplaintProvider');
  return context;
}
