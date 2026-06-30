import React, { useState } from 'react';
import { Menu, Bell, Sun, Moon, Laptop, Eye, Check, Calendar, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const {
    theme,
    setTheme,
    notifications,
    markNotificationRead,
    clearNotifications,
    currentUser,
    schoolSettings
  } = useApp();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-4 h-4 text-pink-400" />;
      case 'light':
        return <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />;
      default:
        return <Laptop className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
    // If it's an assignment notice, go to assignments
    if (id === 'n1') onNavigate('assignments');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/30 dark:bg-[#0c0f17]/30 backdrop-blur-md border-b border-slate-200/40 dark:border-white/10">
      {/* Left side actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-200/50 hover:bg-slate-300/50 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
            {schoolSettings.schoolName}
          </span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/15 border-solid">
            {currentUser?.role === 'admin' ? 'Admin Node' : 'Scholar Node'}
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 relative">
        
        {/* Dynamic theme selector menu */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            onBlur={() => setTimeout(() => setShowThemeMenu(false), 200)}
            className="p-2.5 rounded-xl bg-slate-200/40 hover:bg-slate-300/40 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/30 dark:border-white/10 border-solid transition-colors cursor-pointer flex items-center justify-center"
            title="Switch portal theme preference"
          >
            {getThemeIcon()}
          </button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute right-0 mt-2 w-36 rounded-2xl bg-white/85 dark:bg-[#0c0f17]/85 backdrop-blur-xl shadow-xl border border-slate-200/50 dark:border-white/15 p-2 flex flex-col gap-1 z-50 border-solid"
              >
                {[
                  { id: 'light', name: 'Light Mode', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
                  { id: 'dark', name: 'Dark Mode', icon: <Moon className="w-3.5 h-3.5 text-pink-400" /> },
                  { id: 'system', name: 'System Auto', icon: <Laptop className="w-3.5 h-3.5 text-indigo-400" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id as any)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-left text-[11px] font-bold transition-all cursor-pointer ${
                      theme === mode.id
                        ? 'bg-slate-200/50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {mode.icon}
                      <span>{mode.name}</span>
                    </div>
                    {theme === mode.id && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live System Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative p-2.5 rounded-xl bg-slate-200/40 hover:bg-slate-300/40 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/30 dark:border-white/10 border-solid transition-colors cursor-pointer flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ring-2 ring-white dark:ring-[#0a0c10] animate-pulse" />
            )}
          </button>

          {/* Alerts Dropdown Drawer */}
          <AnimatePresence>
            {showAlertsDropdown && (
              <>
                {/* Overlay to catch clicks */}
                <div onClick={() => setShowAlertsDropdown(false)} className="fixed inset-0 z-40" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2.5 w-80 rounded-3xl bg-white/85 dark:bg-[#0c0f17]/85 backdrop-blur-xl border border-slate-200/50 dark:border-white/15 border-solid shadow-2xl p-4 z-50 flex flex-col pointer-events-auto"
                >
                  <div className="flex justify-between items-center border-b border-slate-200/40 dark:border-white/10 pb-3 mb-2.5">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                        System Notifications
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        You have {unreadCount} unread advisory notices
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          clearNotifications();
                          setShowAlertsDropdown(false);
                        }}
                        className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 text-[10px] font-bold tracking-tight transition-colors cursor-pointer"
                      >
                        Wipe Inbox
                      </button>
                    )}
                  </div>

                  {/* Notification items */}
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-0.5">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-600 block">
                          Alert Inbox is Empty
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto leading-relaxed">
                          No advisory markers or administrative flags are active.
                        </p>
                      </div>
                    ) : (
                      notifications.map((not) => (
                        <div
                          key={not.id}
                          onClick={() => handleNotificationClick(not.id)}
                          className={`p-2.5 rounded-2xl border border-solid border-transparent transition-all cursor-pointer text-left ${
                            not.read
                              ? 'bg-slate-200/25 dark:bg-white/5'
                              : 'bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-500/10'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className={`text-[11px] font-black tracking-tight ${
                              not.read ? 'text-slate-600 dark:text-slate-300' : 'text-indigo-600 dark:text-indigo-400'
                            }`}>
                              {not.title}
                            </span>
                            {!not.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {not.message}
                          </p>
                          <span className="text-[8px] text-slate-400 font-mono block mt-1.5">
                            {new Date(not.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Simple desktop user indicator badge */}
        <div className="hidden md:flex items-center gap-2.5 border-l border-slate-250 dark:border-white/10 pl-3">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-xl object-cover border border-slate-200/50 dark:border-white/10"
          />
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-800 dark:text-white block tracking-tight">
              {currentUser?.name}
            </span>
            <span className="text-[8px] font-mono tracking-wider text-slate-400 block uppercase">
              {currentUser?.role}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
