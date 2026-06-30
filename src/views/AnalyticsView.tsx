import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, BookOpen, BarChart3, TrendingUp, Users, Sparkles, Percent, ShieldAlert } from 'lucide-react';
import { AreaChart, BarChart, DonutChart } from '../components/AnalyticsCharts';
import { StudentComparison } from '../components/StudentComparison';

export const AnalyticsView: React.FC = () => {
  const { students } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'benchmark'>('overview');

  const totalCount = students.length;

  // Compute stats
  const avgMarks = Math.round(students.reduce((s, x) => s + x.marks, 0) / (totalCount || 1));
  const avgAttendance = Math.round(students.reduce((s, x) => s + x.attendance, 0) / (totalCount || 1));
  const avgCGPA = students.reduce((s, x) => s + x.cgpa, 0) / (totalCount || 1);

  // Compute Grade distribution counts
  const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'Fail': 0 };
  students.forEach((s) => {
    const g = s.grade as keyof typeof gradeCounts;
    if (gradeCounts[g] !== undefined) {
      gradeCounts[g]++;
    }
  });

  const gradeChartData = Object.entries(gradeCounts).map(([grade, count]) => ({
    label: `Grade ${grade}`,
    value: count,
  }));

  // Compute Department performance averages
  const depts = Array.from(new Set(students.map((s) => s.department)));
  const deptPerformanceData = depts.map((d) => {
    const deptStudents = students.filter((s) => s.department === d);
    const avg = Math.round(deptStudents.reduce((sum, s) => sum + s.marks, 0) / (deptStudents.length || 1));
    return {
      label: d,
      value: avg,
    };
  });

  // Top 5 and Bottom 5 lists
  const sortedByMarks = [...students].sort((a, b) => b.marks - a.marks);
  const topScholars = sortedByMarks.slice(0, 5);
  const supportScholars = [...students].sort((a, b) => a.marks - b.marks).slice(0, 5);

  // Compliance counts
  const passCount = students.filter((s) => s.result === 'Pass').length;
  const failCount = students.filter((s) => s.result === 'Fail').length;
  const passRatioData = [
    { label: 'Passed Scholars', value: passCount, color: '#10b981' },
    { label: 'Needs Support', value: failCount, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab selection menu */}
      <div className="flex border-b border-slate-200/40 dark:border-slate-800 gap-6">
        {[
          { id: 'overview', name: 'Performance Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'departments', name: 'Departmental Breakdown', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'benchmark', name: 'Scholar Benchmarking', icon: <Award className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-extrabold uppercase tracking-widest relative cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-400 font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW PORTFOLIO */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick numbers row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Aggregate Marks', val: `${avgMarks}%`, desc: 'Average syllabus execution score', icon: <Percent className="w-5 h-5 text-indigo-500" /> },
              { label: 'Overall CGPA Index', val: avgCGPA.toFixed(2), desc: 'Average grade point index of directory', icon: <TrendingUp className="w-5 h-5 text-pink-500" /> },
              { label: 'Average Presence Rate', val: `${avgAttendance}%`, desc: 'Average active classroom presence', icon: <Users className="w-5 h-5 text-emerald-500" /> },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-md flex justify-between items-center"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{stat.label}</span>
                  <span className="text-xl font-black mt-1 block text-slate-850 dark:text-white">{stat.val}</span>
                  <span className="text-[9px] text-slate-400 block mt-1">{stat.desc}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 border-solid rounded-2xl">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Double column grids (distribution & compliance) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <div>
                <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                  Global Grade Distribution Roster
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Count of active scholars across grades index (A+ through Fail)
                </span>
              </div>
              <div className="mt-6">
                <BarChart data={gradeChartData} colorTheme="pink" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                  Grade Compliance Ratio
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Proportion of passing index against academic warnings
                </span>
              </div>
              <DonutChart data={passRatioData} title="Passing Index" />
            </div>
          </div>

          {/* Leaders vs support lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top performing Scholars */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Summa Cum Laude Scholars (Top 5)</span>
              </h3>
              <div className="space-y-3">
                {topScholars.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850/60 border-solid"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black font-mono text-amber-500 w-4">#{idx + 1}</span>
                      <img src={s.profilePicture} alt={s.name} className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">{s.rollNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-indigo-500 block">{s.marks}%</span>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block">Grade {s.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Support Scholars */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Milestone Warnings & Support Logs (Bottom 5)</span>
              </h3>
              <div className="space-y-3">
                {supportScholars.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850/60 border-solid"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black font-mono text-rose-500 w-4">#{idx + 1}</span>
                      <img src={s.profilePicture} alt={s.name} className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">{s.rollNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-rose-500 block">{s.marks}%</span>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block">Grade {s.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEPARTMENTS BREAKDOWN */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
            <div>
              <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                Departmental Performance Comparison
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Average milestones score percentage achieved per department syllabus
              </span>
            </div>
            <div className="mt-6">
              <BarChart data={deptPerformanceData} colorTheme="indigo" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptPerformanceData.map((dept, idx) => {
              const studentsInDept = students.filter((s) => s.department === dept.label);
              const passes = studentsInDept.filter((s) => s.result === 'Pass').length;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/60 dark:border-white/10 border-solid shadow-md flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{dept.label}</span>
                    <span className="text-lg font-black text-indigo-500 dark:text-indigo-400 block mt-2">
                      {dept.value}% Marks Average
                    </span>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-3 flex justify-between text-[10px] text-slate-400">
                    <span>Active scholars: {studentsInDept.length}</span>
                    <span className="text-emerald-500 font-bold">Pass Rate: {Math.round((passes / (studentsInDept.length || 1)) * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BENCHMARKING (ELEGANT COMPARISON INLINE) */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6">
          <StudentComparison />
        </div>
      )}
    </div>
  );
};
