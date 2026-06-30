import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { User, Award, Percent, Calendar, FileCheck, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import { Student } from '../types';

export const StudentComparison: React.FC = () => {
  const { students } = useApp();
  const [selectedId1, setSelectedId1] = useState<string>('');
  const [selectedId2, setSelectedId2] = useState<string>('');
  const [selectedId3, setSelectedId3] = useState<string>('');

  const s1 = students.find((s) => s.id === selectedId1);
  const s2 = students.find((s) => s.id === selectedId2);
  const s3 = students.find((s) => s.id === selectedId3);

  const activeSet = [s1, s2, s3].filter((s): s is Student => !!s);

  // Helper to determine topper
  const getTopperId = () => {
    if (activeSet.length < 2) return null;
    let top = activeSet[0];
    for (let i = 1; i < activeSet.length; i++) {
      if (activeSet[i].marks > top.marks) {
        top = activeSet[i];
      } else if (activeSet[i].marks === top.marks && activeSet[i].attendance > top.attendance) {
        top = activeSet[i];
      }
    }
    return top.id;
  };

  const topperId = getTopperId();

  // Helper to draw comparison bars
  const renderComparisonBar = (label: string, value1?: number, value2?: number, value3?: number, max = 100) => {
    const vals = [value1, value2, value3].filter((v): v is number => v !== undefined);
    const maxVal = Math.max(...vals, 1);

    return (
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
          {label} Comparison
        </span>
        <div className="space-y-2">
          {s1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-24 truncate">{s1.name}</span>
              <div className="flex-grow h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(value1! / max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono w-10 text-right">{value1}%</span>
            </div>
          )}
          {s2 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-24 truncate">{s2.name}</span>
              <div className="flex-grow h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(value2! / max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono w-10 text-right">{value2}%</span>
            </div>
          )}
          {s3 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-24 truncate">{s3.name}</span>
              <div className="flex-grow h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(value3! / max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono w-10 text-right">{value3}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Comparison selectors header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-55 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border border-slate-200/50 dark:border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Scholar Benchmarking Console</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Co-align up to three active student profiles side-by-side to review comparative metrics.
          </p>
        </div>

        {/* Dropdowns selectors row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate A</label>
            <select
              value={selectedId1}
              onChange={(e) => setSelectedId1(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-pointer"
            >
              <option value="">-- Choose Student --</option>
              {students
                .filter((s) => s.id !== selectedId2 && s.id !== selectedId3)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate B</label>
            <select
              value={selectedId2}
              onChange={(e) => setSelectedId2(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-pointer"
            >
              <option value="">-- Choose Student --</option>
              {students
                .filter((s) => s.id !== selectedId1 && s.id !== selectedId3)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate C (Optional)</label>
            <select
              value={selectedId3}
              onChange={(e) => setSelectedId3(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-pointer"
            >
              <option value="">-- Choose Student --</option>
              {students
                .filter((s) => s.id !== selectedId1 && s.id !== selectedId2)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {activeSet.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-12 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-center">
          <User className="w-10 h-10 text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            Awaiting comparative selection...
          </span>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Please select at least two student profiles in the console above to initialize benchmarking metrics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main profile card comparison row */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSet.map((student, idx) => {
                const isTopper = topperId === student.id;
                return (
                  <motion.div
                    key={student.id}
                    layout
                    className={`relative p-5 rounded-3xl bg-white dark:bg-slate-900 border border-solid shadow-lg flex flex-col justify-between overflow-hidden ${
                      isTopper
                        ? 'border-indigo-500/30 ring-1 ring-indigo-500/10 shadow-indigo-500/5'
                        : 'border-slate-200/60 dark:border-slate-850'
                    }`}
                  >
                    {isTopper && (
                      <div className="absolute top-0 right-0 p-1 bg-amber-500 text-white rounded-bl-xl flex items-center gap-1.5 shadow-md">
                        <Trophy className="w-4 h-4" />
                        <span className="text-[9px] font-black tracking-widest uppercase pr-1">TOPPER</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src={student.profilePicture}
                          alt={student.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">
                            {student.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{student.rollNumber}</span>
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 border-solid">
                          <span className="text-[9px] font-bold text-slate-400 block">MARKS</span>
                          <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400 block mt-1">
                            {student.marks}%
                          </span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 border-solid">
                          <span className="text-[9px] font-bold text-slate-400 block">ATTENDANCE</span>
                          <span className="text-sm font-black font-mono text-pink-600 dark:text-pink-400 block mt-1">
                            {student.attendance}%
                          </span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 border-solid">
                          <span className="text-[9px] font-bold text-slate-400 block">CGPA</span>
                          <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
                            {student.cgpa.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-850/50 mt-4 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Term: {student.semester}</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">Grade: {student.grade}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Custom SVG Side-by-side comparative bars */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 border-solid shadow-lg space-y-6">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Comparative Analytics Radar metrics
              </h4>

              {renderComparisonBar('Overall Score Marks', s1?.marks, s2?.marks, s3?.marks, 100)}
              {renderComparisonBar('Class Attendance Rate', s1?.attendance, s2?.attendance, s3?.attendance, 100)}
              {renderComparisonBar('Grade GPA Level', s1 ? Math.round(s1.cgpa * 25) : undefined, s2 ? Math.round(s2.cgpa * 25) : undefined, s3 ? Math.round(s3.cgpa * 25) : undefined, 100)}
            </div>
          </div>

          {/* Quick Winner Assessment side-panel */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-500/10 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">
                Benchmarking Evaluation
              </span>
              <h4 className="text-sm font-black mt-1">Strategic Comparison Conclusion</h4>
            </div>

            {topperId && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
                    <Trophy className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 block">CO-ALIGNED LEADER</span>
                    <span className="text-xs font-black text-white">
                      {students.find((s) => s.id === topperId)?.name}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-indigo-200/70 leading-relaxed">
                  Based on direct weighted academic metrics (Marks: 70%, Attendance: 30%),{' '}
                  <span className="text-indigo-200 font-bold">
                    {students.find((s) => s.id === topperId)?.name}
                  </span>{' '}
                  holds the absolute topper rank of the benchmarked set, showing a margin CGPA of{' '}
                  {students.find((s) => s.id === topperId)?.cgpa.toFixed(2)}.
                </p>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 space-y-1 text-[10px]">
                  <span className="font-bold text-white block">Benchmark metrics summary:</span>
                  <div className="flex justify-between mt-1">
                    <span>Performance disparity:</span>
                    <span className="font-mono text-pink-300 font-bold">
                      {Math.max(...activeSet.map((s) => s.marks)) - Math.min(...activeSet.map((s) => s.marks))}% marks
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attendance range:</span>
                    <span className="font-mono text-indigo-300 font-bold">
                      {Math.max(...activeSet.map((s) => s.attendance)) - Math.min(...activeSet.map((s) => s.attendance))}% attendance
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
