import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Calendar, Clock, AlertTriangle, CheckCircle, HelpCircle, ArrowUpRight } from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { currentUser, students, schoolSettings, showToast } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // State for Admin attendance marker
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchScholar, setSearchScholar] = useState('');

  const uniqueDepts = Array.from(new Set(students.map((s) => s.department)));

  // Admin filter
  const filteredStudents = students.filter((s) => {
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
    const matchesSearch = s.name.toLowerCase().includes(searchScholar.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchScholar.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Simulated today check-in marker for admin
  const handleRecordTodayCheckin = (id: string, status: 'Present' | 'Absent') => {
    showToast('Attendance Logged', `Recorded today as ${status} (simulated).`, 'success');
  };

  // Student specific parameters
  const personalStudent = !isAdmin
    ? students.find((s) => s.id === currentUser?.id)
    : null;

  const personalAttendance = personalStudent ? personalStudent.attendance : 0;
  const compliant = personalAttendance >= schoolSettings.minAttendance;

  // Render a simulated Calendar grid for student (e.g. 30 days)
  const mockDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Distribute Present / Absent based on student's attendance ratio
    const rand = (day * 7) % 100;
    const isPresent = rand < personalAttendance;
    return { day, isPresent };
  });

  return (
    <div className="space-y-6">
      {/* Overview layout */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-500">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              {isAdmin ? 'Administrative Attendance Matrix' : 'My Attendance Logs'}
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              {isAdmin ? 'Record, review, and flag syllabus compliance targets' : 'Track your compliance and classroom check-ins'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Compliance standard:</span>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/15 border-solid font-mono">
            &gt;= {schoolSettings.minAttendance}%
          </span>
        </div>
      </div>

      {/* ADMIN ATTENDANCE VIEW */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Query scholar by name, roll, or ID..."
              value={searchScholar}
              onChange={(e) => setSearchScholar(e.target.value)}
              className="flex-grow text-xs px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {uniqueDepts.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Student Ratios Grid Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200/50 dark:border-white/10 border-solid bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-black/20 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-white/10">
                  <th className="py-4 px-6">Scholar Name</th>
                  <th className="py-4 px-3">Roll number</th>
                  <th className="py-4 px-3">Attendance ratio</th>
                  <th className="py-4 px-3">Compliance Status</th>
                  <th className="py-4 px-6 text-right">Log today check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {filteredStudents.map((s) => {
                  const isCompliant = s.attendance >= schoolSettings.minAttendance;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-950/20 transition-all">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img src={s.profilePicture} alt={s.name} className="w-8 h-8 rounded-xl object-cover" />
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-white block">{s.name}</span>
                            <span className="text-[9px] text-slate-400 block">{s.department}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] font-bold text-slate-500">{s.rollNumber}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-850 dark:text-white">{s.attendance}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-solid ${
                          isCompliant
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/15 animate-pulse'
                        }`}>
                          {isCompliant ? 'Compliant' : 'Warning'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleRecordTodayCheckin(s.id, 'Present')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase cursor-pointer"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleRecordTodayCheckin(s.id, 'Absent')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase cursor-pointer"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* STUDENT PORTAL ATTENDANCE VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Percentage Circular Ring card */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                My Attendance Level
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Aggregated syllabus session presence
              </span>
            </div>

            {/* Circular Ring SVG */}
            <div className="relative w-40 h-40 my-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Underlay */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                {/* Foreground */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={compliant ? 'url(#emeraldGrad)' : 'url(#roseGrad)'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - personalAttendance / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute text-center">
                <span className="text-2xl font-black font-mono text-slate-850 dark:text-white">{personalAttendance}%</span>
                <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">Presence</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border border-solid text-[10px] font-semibold w-full flex items-center gap-2.5 ${
              compliant
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                : 'bg-rose-500/10 text-rose-500 border-rose-500/15 animate-pulse'
            }`}>
              {compliant ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Syllabus presence criteria compliant. Outstanding presence.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Warning: below required min threshold of {schoolSettings.minAttendance}%.</span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Month-grid calendar checklist */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                  Interactive Attendance Calendar
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Last 30 academic calendar days check-in markers
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Absent</span>
                </div>
              </div>
            </div>

            {/* Grid days layout */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3.5 pt-4">
              {mockDays.map((d) => (
                <div
                  key={d.day}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-between border border-solid text-center relative overflow-hidden transition-all hover:scale-105 ${
                    d.isPresent
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-50/30 dark:bg-rose-950/5 border-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">Day {d.day}</span>
                  <span className="text-xs font-black font-mono block mt-2">
                    {d.isPresent ? 'P' : 'A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
