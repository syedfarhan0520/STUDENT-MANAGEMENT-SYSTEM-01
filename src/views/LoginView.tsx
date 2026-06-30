import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Lock, ShieldCheck, KeyRound, ArrowRight, Eye, EyeOff, UserSquare2, RefreshCw } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, students } = useApp();

  const [role, setRole] = useState<'admin' | 'student'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Local errors
  const [errors, setErrors] = useState<{ email?: string; password?: string; rollNumber?: string }>({});

  const validate = () => {
    const tempErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please provide a valid email format';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 5) {
      tempErrors.password = 'Password must stand above 5 characters';
    }

    if (role === 'student' && !rollNumber.trim()) {
      tempErrors.rollNumber = 'Roll number is required for verification';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate login via our AppState Context
    login(email, role, rollNumber);
  };

  const handleQuickFill = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setRole('admin');
      setEmail('admin@university.edu');
      setPassword('adminpassword');
      setRollNumber('');
    } else {
      setRole('student');
      // Fill with first mock student (Sarah Connor)
      const sarah = students[0] || { email: 'sarah.connor@university.edu', rollNumber: 'CS-2023-01' };
      setEmail(sarah.email);
      setPassword('studentpassword');
      setRollNumber(sarah.rollNumber);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    alert(`Reset token successfully dispatched to: ${forgotEmail}. Please check your administrative mail server.`);
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0A0C10] text-slate-800 dark:text-white overflow-hidden select-none">
      {/* Background glow meshes */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/15 dark:bg-blue-600/20 blur-[130px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 dark:bg-purple-600/20 blur-[130px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500/8 dark:bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none" />

      {/* Floating UI Elements */}
      <div className="absolute top-1/4 right-1/4 w-3.5 h-3.5 rounded-full bg-indigo-500/30 blur-sm animate-bounce" />
      <div className="absolute bottom-1/4 left-1/4 w-4 h-4 rounded-full bg-pink-500/20 blur-sm animate-bounce-slow" />

      <div className="relative w-full max-w-md z-10 flex flex-col items-center">
        {/* Core Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full rounded-3xl p-8 bg-white/40 dark:bg-[#0c0f17]/40 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl shadow-2xl relative"
        >
          {/* Header Branding */}
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-300 text-center">
              STUDENT MANAGEMENT SYSTEM
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mt-1">
              Student Information System
            </span>
          </div>

          {/* Role switcher */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-200/30 dark:bg-black/30 border border-slate-200/40 dark:border-white/5 mb-6">
            <button
              onClick={() => {
                setRole('admin');
                setErrors({});
              }}
              className={`flex-grow flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-900/10 dark:border-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Terminal</span>
            </button>
            <button
              onClick={() => {
                setRole('student');
                setErrors({});
              }}
              className={`flex-grow flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-900/10 dark:border-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              <UserSquare2 className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Account Email</span>
                {errors.email && <span className="text-rose-500 font-medium tracking-tight font-sans lowercase">{errors.email}</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  placeholder="administrator@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs font-medium pl-10.5 pr-4 py-3 rounded-xl border border-solid bg-slate-100/50 dark:bg-black/25 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.email ? 'border-rose-500/40 focus:border-rose-500/40' : 'border-slate-200/50 dark:border-white/5 focus:border-indigo-500/30'
                  }`}
                />
              </div>
            </div>

            {/* Roll Number Field (Only for student) */}
            {role === 'student' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Student Roll Number</span>
                  {errors.rollNumber && <span className="text-rose-500 font-medium tracking-tight font-sans lowercase">{errors.rollNumber}</span>}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. CS-2023-01"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className={`w-full text-xs font-mono font-bold pl-10.5 pr-4 py-3 rounded-xl border border-solid bg-slate-100/50 dark:bg-black/25 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all uppercase ${
                      errors.rollNumber ? 'border-rose-500/40 focus:border-rose-500/40' : 'border-slate-200/50 dark:border-white/5 focus:border-pink-500/30'
                    }`}
                  />
                </div>
              </motion.div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>Access Pass</span>
                {errors.password && <span className="text-rose-500 font-medium tracking-tight font-sans lowercase">{errors.password}</span>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full text-xs font-medium pl-10.5 pr-10.5 py-3 rounded-xl border border-solid bg-slate-100/50 dark:bg-black/25 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.password ? 'border-rose-500/40 focus:border-rose-500/40' : 'border-slate-200/50 dark:border-white/5 focus:border-indigo-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Pass link */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-slate-200 dark:border-white/10 text-indigo-500 focus:ring-indigo-500 bg-slate-100/50 dark:bg-black/25 w-4 h-4 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Submit Trigger */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.01] shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <span>Connect Portal node</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Fill presets deck */}
          <div className="mt-6 border-t border-slate-200/40 dark:border-white/5 pt-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2.5">
              Admin & Scholar Quick Fill Deck (Testing)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickFill('admin')}
                className="flex-grow flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-solid border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[10px] font-bold text-indigo-600 dark:text-indigo-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Admin Quick-Fill</span>
              </button>
              <button
                onClick={() => handleQuickFill('student')}
                className="flex-grow flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-solid border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[10px] font-bold text-pink-600 dark:text-pink-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Student Quick-Fill</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgotten Access modal popup */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl p-6 bg-white/80 dark:bg-[#0c0f17]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl z-10 text-slate-800 dark:text-slate-100"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-500" />
                <span>Reset Access Key</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Please register your account mail below. We will transmit an encrypted decryption recovery vector link to authorize password recycling.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="mail-identity@university.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 text-[10px] font-bold rounded-xl border border-solid border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-[10px] font-bold rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md shadow-purple-500/10 transition-all cursor-pointer animate-pulse-slow"
                  >
                    Dispatch recovery
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
