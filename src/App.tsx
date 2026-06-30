import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { StudentsListView } from './views/StudentsListView';
import { AnalyticsView } from './views/AnalyticsView';
import { AssignmentsView } from './views/AssignmentsView';
import { ExamsView } from './views/ExamsView';
import { AttendanceView } from './views/AttendanceView';
import { LeaderboardView } from './views/LeaderboardView';
import { SettingsView } from './views/SettingsView';
import { ProgressView } from './views/ProgressView';

import { StudentFormModal } from './components/StudentFormModal';
import { StudentDetailsModal } from './components/StudentDetailsModal';

function PortalAppContent() {
  const { currentUser, resolvedTheme } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals management
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  // If user is not authenticated, render Login terminal
  if (!currentUser) {
    return <LoginView />;
  }

  // Render view nodes dynamically
  const renderView = () => {
    switch (currentView) {
      case 'students':
        return (
          <StudentsListView
            onOpenAddStudent={() => setShowAddModal(true)}
            onOpenEditStudent={(id) => setEditingStudentId(id)}
            onOpenViewStudent={(id) => setViewingStudentId(id)}
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'exams':
        return <ExamsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leaderboard':
        return <LeaderboardView onOpenViewStudent={(id) => setViewingStudentId(id)} />;
      case 'settings':
        return <SettingsView />;
      case 'progress':
        return <ProgressView />;
      case 'dashboard':
      default:
        return (
          <DashboardView
            onNavigate={(v) => setCurrentView(v)}
            onOpenAddStudent={() => setShowAddModal(true)}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-100/60 dark:bg-[#0A0C10] text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans relative overflow-hidden`}>
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-blue-600/15 dark:bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-purple-600/15 dark:bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500/8 dark:bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none" />
      </div>

      {/* Sidebar Component */}
      <div className="relative z-20">
        <Sidebar
          currentView={currentView}
          onNavigate={(v) => setCurrentView(v)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Core Section */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen relative z-10">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={(v) => setCurrentView(v)}
        />

        {/* Content body with soft transitions */}
        <main className="p-6 md:p-8 flex-grow overflow-y-auto relative z-10">
          {renderView()}
        </main>
      </div>

      {/* MODALS INJECT DECK */}

      {/* Add Student Form Modal */}
      {showAddModal && (
        <StudentFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Student Form Modal */}
      {editingStudentId && (
        <StudentFormModal
          isOpen={!!editingStudentId}
          onClose={() => setEditingStudentId(null)}
          studentId={editingStudentId}
        />
      )}

      {/* View Student Details Modal */}
      {viewingStudentId && (
        <StudentDetailsModal
          isOpen={!!viewingStudentId}
          onClose={() => setViewingStudentId(null)}
          studentId={viewingStudentId}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PortalAppContent />
      <ToastContainer />
    </AppProvider>
  );
}
