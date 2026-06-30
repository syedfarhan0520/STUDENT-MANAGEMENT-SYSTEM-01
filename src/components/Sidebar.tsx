import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  BookOpen,
  FileSpreadsheet,
  Award,
  Settings,
  LogOut,
  X,
  Sparkles,
  Trophy,
  CalendarRange,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { currentUser, logout, resolvedTheme, schoolSettings } = useApp();

  const handleNavClick = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const menuItems = currentUser?.role === 'admin' 
    ? [
        { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'students', name: 'Student Registry', icon: <Users className="w-5 h-5" /> },
        { id: 'progress', name: 'Progress Tracking', icon: <TrendingUp className="w-5 h-5" /> },
        { id: 'analytics', name: 'Performance Analytics', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'assignments', name: 'Course Assignments', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'exams', name: 'Exams & Schedules', icon: <CalendarRange className="w-5 h-5" /> },
        { id: 'attendance', name: 'Attendance Matrix', icon: <FileSpreadsheet className="w-5 h-5" /> },
        { id: 'leaderboard', name: 'Academic Leaderboard', icon: <Award className="w-5 h-5" /> },
        { id: 'settings', name: 'System Settings', icon: <Settings className="w-5 h-5" /> },
      ]
    : [
        { id: 'dashboard', name: 'My Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'progress', name: 'My Progress', icon: <TrendingUp className="w-5 h-5" /> },
        { id: 'assignments', name: 'My Assignments', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'exams', name: 'My Exam Schedule', icon: <CalendarRange className="w-5 h-5" /> },
        { id: 'attendance', name: 'My Attendance Logs', icon: <FileSpreadsheet className="w-5 h-5" /> },
        { id: 'leaderboard', name: 'Leaderboard', icon: <Award className="w-5 h-5" /> },
        { id: 'settings', name: 'My Settings', icon: <Settings className="w-5 h-5" /> },
      ];

  const sidebarContent = (
    <div className="w-64 h-full flex flex-col justify-between bg-white/40 dark:bg-[#0c0f17]/40 backdrop-blur-xl text-slate-800 dark:text-slate-100 border-r border-slate-200/50 dark:border-white/10 shadow-2xl relative">
      {/* Absolute ambient background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-200/40 dark:border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 block max-w-[140px] leading-tight">
                STUDENT MANAGEMENT SYSTEM
              </span>
              <span className="block text-[8px] tracking-widest font-black uppercase text-purple-600 dark:text-purple-400 mt-0.5">
                Portal Management
              </span>
            </div>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg bg-slate-200/50 dark:bg-white/5 hover:bg-slate-300/50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* School Name ticker */}
        <div className="px-6 py-2 bg-slate-200/30 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-indigo-300 truncate border-b border-slate-200/40 dark:border-white/5">
          {schoolSettings.schoolName}
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1 relative z-10">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-extrabold uppercase tracking-wider transition-all border border-solid cursor-pointer ${
                  isActive
                    ? 'bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border-slate-900/10 dark:border-white/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-white/5 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile capsule */}
      {currentUser && (
        <div className="p-4 border-t border-slate-200/40 dark:border-white/5 bg-slate-100/20 dark:bg-black/10 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/20 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200/50 dark:border-white/10 shadow-md"
            />
            <div className="min-w-0 flex-grow">
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5 capitalize">
                {currentUser.role === 'admin' ? '🔥 Admin' : `🎓 ${currentUser.rollNumber}`}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white text-xs font-bold transition-all border border-rose-500/10 hover:border-rose-500/20 border-solid cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Dark mask overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Drawer Sliding body */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative h-full flex z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
