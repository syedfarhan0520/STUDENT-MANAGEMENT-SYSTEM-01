import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, ShieldAlert, CheckCircle, RefreshCw, Sparkles, Building, Sliders, Laptop } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { schoolSettings, updateSchoolSettings, resetToDefaultData, showToast } = useApp();

  const [schoolName, setSchoolName] = useState(schoolSettings.schoolName);
  const [minAttendance, setMinAttendance] = useState(schoolSettings.minAttendance);
  const [activeSemester, setActiveSemester] = useState(schoolSettings.activeSemester);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      showToast('Validation Error', 'School branding name cannot stand empty.', 'error');
      return;
    }

    updateSchoolSettings({
      schoolName: schoolName.trim(),
      minAttendance,
      activeSemester,
    });
  };

  const handleResetDB = () => {
    if (confirm('Are you absolute sure you want to wipe all local storage and restore default seed mock portfolios? This will reload the active registry.')) {
      resetToDefaultData();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Action panel header */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
          <Settings className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Portal Control & Configurations
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
            Modify corporate branding parameters, attendance levels, and administrative nodes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
          <form onSubmit={handleSave} className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-500" />
              <span>Portal Identity Branding</span>
            </h4>

            {/* School Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Academy Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Guru Nanak University"
                className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Attendance & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min Attendance Level (%)</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={minAttendance}
                  onChange={(e) => setMinAttendance(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Semester Term</label>
                <select
                  value={activeSemester}
                  onChange={(e) => setActiveSemester(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Commit Changes
              </button>
            </div>
          </form>
        </div>

        {/* Developer / Danger deck */}
        <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Administrative Operations</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              If your browser's persistent cache has stored corrupted schemas or you wish to refresh and clean up custom added testing student cards:
            </p>
          </div>

          <button
            onClick={handleResetDB}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-wider transition-all border border-rose-500/15 border-solid cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>Wipe Local Indexes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
