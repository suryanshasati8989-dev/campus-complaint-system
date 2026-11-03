import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider, useComplaints } from './context/ComplaintContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import EditComplaintModal from './components/EditComplaintModal';
import ConfirmModal from './components/ConfirmModal';

// Pages
import Dashboard from './pages/Dashboard';
import AddComplaint from './pages/AddComplaint';
import AllComplaints from './pages/AllComplaints';
import PriorityQueue from './pages/PriorityQueue';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

function MainAppShell() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const {
    isDeleteModalOpen,
    deletingComplaint,
    closeDeleteModal,
    deleteComplaint
  } = useComplaints();

  // If not signed in, show the modern Sign In page directly!
  if (!isAuthenticated) {
    return <Login setActiveTab={setActiveTab} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'add-complaint':
        return <AddComplaint setActiveTab={setActiveTab} />;
      case 'all-complaints':
        return <AllComplaints setActiveTab={setActiveTab} />;
      case 'priority-queue':
        return <PriorityQueue setActiveTab={setActiveTab} />;
      case 'analytics':
        return <Analytics setActiveTab={setActiveTab} />;
      case 'settings':
        return <Settings setActiveTab={setActiveTab} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingComplaint) {
      await deleteComplaint(deletingComplaint.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      
      {/* App Shell */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMobileOpen={setIsMobileOpen}
          />

          <main className="flex-1 overflow-y-auto">
            {renderActivePage()}
          </main>
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <ComplaintDetailModal />
      <EditComplaintModal />
      
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Complaint Ticket?"
        message={`Are you sure you want to permanently delete complaint ${deletingComplaint?.id}? All audit history records for this ticket will also be removed.`}
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ComplaintProvider>
          <MainAppShell />
        </ComplaintProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
