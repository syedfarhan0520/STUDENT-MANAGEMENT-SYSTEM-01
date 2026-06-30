import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Award, Medal, TrendingUp, Users, Sparkles, Filter, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardViewProps {
  onOpenViewStudent: (id: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onOpenViewStudent }) => {
  const { students } = useApp();
  const [filterDept, setFilterDept] = useState('ALL');
  const [sortMetric, setSortMetric] = useState<'marks' | 'cgpa' | 'attendance'>('cgpa');

  const depts = Array.from(new Set(students.map((s) => s.department)));

  // Filter and sort roster
  const rankedRoster = students
    .filter((s) => filterDept === 'ALL' || s.department === filterDept)
    .sort((a, b) => {
      if (sortMetric === 'cgpa') return b.cgpa - a.cgpa;
      if (sortMetric === 'attendance') return b.attendance - a.attendance;
      return b.marks - a.marks;
    });

  // Top 3 Podium
  const gold = rankedRoster[0];
  const silver = rankedRoster[1];
  const bronze = rankedRoster[2];

  // Rest of runners
  const runners = rankedRoster.slice(3);

  const getMetricSuffix = (val: number) => {
    if (sortMetric === 'cgpa') return `GPA: ${val.toFixed(2)}`;
    return `${val}%`;
  };

  const getMetricValue = (s: typeof students[0]) => {
    if (sortMetric === 'cgpa') return s.cgpa;
    if (sortMetric === 'attendance') return s.attendance;
    return s.marks;
  };

  return (
    <div className="space-y-6">
      {/* Filters and selectors */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Academic Honor Roll & Leaderboards
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
            Real-time ranked scholars based on cumulative performance criteria
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Dept filter */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {depts.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>

          {/* Metric selector */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200/20 dark:border-white/10">
            {[
              { id: 'cgpa', name: 'CGPA' },
              { id: 'marks', name: 'Marks %' },
              { id: 'attendance', name: 'Presence' },
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSortMetric(metric.id as any)}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  sortMetric === metric.id
                    ? 'bg-white dark:bg-white/10 text-indigo-500 dark:text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {metric.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM HEROES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6 relative">
        
        {/* SILVER podium #2 */}
        {silver && (
          <div className="order-2 md:order-1 p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col items-center justify-between text-center relative h-64 border-b-4 border-b-slate-300/50">
            <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-500 border border-slate-300 dark:border-white/20 flex items-center justify-center shadow-md font-black font-mono">
              2
            </div>

            <div className="mt-4 flex flex-col items-center">
              <img src={silver.profilePicture} alt={silver.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 dark:border-white/10" />
              <h4 onClick={() => onOpenViewStudent(silver.id)} className="text-xs font-black text-slate-850 dark:text-white mt-3 block hover:text-indigo-500 cursor-pointer truncate max-w-[140px]">
                {silver.name}
              </h4>
              <span className="text-[9px] text-slate-400 font-mono block uppercase mt-0.5">{silver.department}</span>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
              {getMetricSuffix(getMetricValue(silver))}
            </span>
          </div>
        )}

        {/* GOLD podium #1 */}
        {gold && (
          <div className="order-1 md:order-2 p-6 rounded-3xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-slate-200/50 dark:border-white/15 border-solid shadow-xl flex flex-col items-center justify-between text-center relative h-72 border-b-4 border-b-amber-400 ring-2 ring-amber-500/10 scale-105">
            {/* Absolute floating crown sparkles */}
            <div className="absolute -top-8 p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white border border-amber-300 flex items-center justify-center shadow-lg font-black font-mono animate-bounce">
              <Trophy className="w-5 h-5" />
            </div>

            <div className="mt-4 flex flex-col items-center">
              <img src={gold.profilePicture} alt={gold.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400" />
              <h4 onClick={() => onOpenViewStudent(gold.id)} className="text-sm font-black text-slate-850 dark:text-white mt-3 block hover:text-indigo-500 cursor-pointer truncate max-w-[160px]">
                {gold.name}
              </h4>
              <span className="text-[9px] text-slate-400 font-mono block uppercase mt-0.5">{gold.department}</span>
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-amber-500 font-mono">
              {getMetricSuffix(getMetricValue(gold))}
            </span>
          </div>
        )}

        {/* BRONZE podium #3 */}
        {bronze && (
          <div className="order-3 p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col items-center justify-between text-center relative h-56 border-b-4 border-b-orange-400/50">
            <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-orange-100 dark:bg-white/10 text-orange-600 border border-orange-300 dark:border-white/20 flex items-center justify-center shadow-md font-black font-mono">
              3
            </div>

            <div className="mt-4 flex flex-col items-center">
              <img src={bronze.profilePicture} alt={bronze.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-350 dark:border-white/10" />
              <h4 onClick={() => onOpenViewStudent(bronze.id)} className="text-xs font-black text-slate-850 dark:text-white mt-3 block hover:text-indigo-500 cursor-pointer truncate max-w-[145px]">
                {bronze.name}
              </h4>
              <span className="text-[9px] text-slate-400 font-mono block uppercase mt-0.5">{bronze.department}</span>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 font-mono">
              {getMetricSuffix(getMetricValue(bronze))}
            </span>
          </div>
        )}
      </div>

      {/* LEADERS LIST DECK */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
          Ranking Runners List
        </span>

        <div className="divide-y divide-slate-100 dark:divide-slate-850/40">
          {runners.map((s, idx) => (
            <div
              key={s.id}
              className="flex justify-between items-center py-3.5 hover:bg-slate-50/20 dark:hover:bg-slate-950/20 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-black font-mono text-slate-400 w-6 text-center">#{idx + 4}</span>
                <img src={s.profilePicture} alt={s.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="min-w-0">
                  <span onClick={() => onOpenViewStudent(s.id)} className="text-xs font-extrabold text-slate-850 dark:text-white hover:text-indigo-500 cursor-pointer block truncate">
                    {s.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{s.rollNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 font-mono">
                    {getMetricSuffix(getMetricValue(s))}
                  </span>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Grade {s.grade}</span>
                </div>

                <button
                  onClick={() => onOpenViewStudent(s.id)}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {rankedRoster.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records matching the Departmental filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
