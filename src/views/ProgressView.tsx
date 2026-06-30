import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Search,
  ArrowRight,
  ShieldAlert,
  BarChart2
} from 'lucide-react';

interface ProgressChartProps {
  data: { label: string; value: number }[];
  color: string;
  gradientId: string;
  ySuffix?: string;
  maxVal?: number;
}

const CustomProgressChart: React.FC<ProgressChartProps> = ({
  data,
  color,
  gradientId,
  ySuffix = '%',
  maxVal = 100
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400">
        No performance records.
      </div>
    );
  }

  const paddingX = 40;
  const paddingY = 30;
  const height = 180;
  const chartHeight = height - paddingY * 2;
  const chartWidth = 460;
  const width = chartWidth + paddingX * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 ? `
    ${linePath}
    L ${points[points.length - 1].x} ${paddingY + chartHeight}
    L ${points[0].x} ${paddingY + chartHeight}
    Z
  ` : '';

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingY + chartHeight * ratio;
          const val = Math.round(maxVal - ratio * maxVal);
          return (
            <g key={idx} className="opacity-15 dark:opacity-10 text-slate-400 dark:text-slate-500">
              <line
                x1={paddingX}
                y1={y}
                x2={paddingX + chartWidth}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                className="text-[9px] font-mono fill-current font-bold"
                textAnchor="end"
              >
                {val}{ySuffix}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && (
          <motion.path
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Line path */}
        {linePath && (
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}

        {/* Data points */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer"
          >
            <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 5.5 : 3.5}
              fill={hoveredIdx === i ? '#f43f5e' : color}
              stroke="white"
              strokeWidth={1.5}
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* X Axis label row */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 8}
            className="text-[9px] font-semibold font-sans fill-current text-slate-400 dark:text-slate-500"
            textAnchor="middle"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* Floating details tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute p-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 text-white text-[10px] shadow-lg border border-white/10 backdrop-blur-md pointer-events-none transition-all duration-150"
          style={{
            left: `${((points[hoveredIdx].x) / width) * 100}%`,
            top: `${((points[hoveredIdx].y) / height) * 100 - 25}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-bold">{points[hoveredIdx].label}</div>
          <div className="text-rose-400 font-mono font-bold mt-0.5">
            Value: {points[hoveredIdx].value}{ySuffix}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProgressView: React.FC = () => {
  const { currentUser, students } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // State for selected student when admin is logged in
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (isAdmin) {
      return students[0]?.id || '';
    } else {
      return currentUser?.id || '';
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // If student: override selection to always target themselves
  const targetStudentId = isAdmin ? selectedStudentId : (currentUser?.id || '');
  
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === targetStudentId);
  }, [students, targetStudentId]);

  // Filter students for admin select dropdown
  const filteredStudentsForSelect = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // Compute metrics trends
  const academicTrends = useMemo(() => {
    if (!currentStudent || !currentStudent.historicalProgress) return null;
    const history = currentStudent.historicalProgress;
    if (history.length === 0) return null;

    const firstSem = history[0];
    const lastSem = history[history.length - 1];

    const marksDiff = lastSem.marks - firstSem.marks;
    const attendanceDiff = lastSem.attendance - firstSem.attendance;

    const totalSubmitted = history.reduce((sum, h) => sum + h.assignmentsSubmitted, 0);
    const totalAssignments = history.reduce((sum, h) => sum + h.assignmentsTotal, 0);
    const assignmentRate = totalAssignments > 0 ? Math.round((totalSubmitted / totalAssignments) * 100) : 0;

    // Generate diagnostic journey summary text
    let journeyVerdict = '';
    let statusTheme: 'good' | 'warning' | 'alert' = 'good';

    if (lastSem.marks >= 80) {
      if (marksDiff >= 0) {
        journeyVerdict = `${currentStudent.name} is demonstrating exemplary academic growth. Starting with a commendable ${firstSem.marks}% in ${firstSem.semester}, they have consistently escalated performance to ${lastSem.marks}% in ${lastSem.semester}. Backed by a high average attendance level of ${lastSem.attendance}%, they represent a prime scholar of the department with highly consistent milestone delivery.`;
        statusTheme = 'good';
      } else {
        journeyVerdict = `${currentStudent.name} maintains a strong academic portfolio with ${lastSem.marks}% in the current semester. Although there is a minor variance compared to their debut semester (${firstSem.marks}%), their overall CGPA is excellent. Continued tracking is advised to maintain peak consistency.`;
        statusTheme = 'good';
      }
    } else if (lastSem.marks >= 55) {
      if (marksDiff >= 2) {
        journeyVerdict = `${currentStudent.name} exhibits positive development, climbing from ${firstSem.marks}% in ${firstSem.semester} to ${lastSem.marks}% in ${lastSem.semester}. Milestone adherence is stable with an assignment submission index of ${assignmentRate}%. Continued guidance will help them reach honors tier.`;
        statusTheme = 'good';
      } else {
        journeyVerdict = `${currentStudent.name} maintains moderate performance standing. Academic scores have fluctuated slightly around ${lastSem.marks}% since enrollment. Strengthening attendance (currently at ${lastSem.attendance}%) and regular assignment submissions will aid in bolstering overall scores.`;
        statusTheme = 'warning';
      }
    } else {
      journeyVerdict = `${currentStudent.name} is currently identified as a candidate requiring academic support. Marks have dipped to ${lastSem.marks}%, with critical attendance concerns sitting at ${lastSem.attendance}% (Minimum required threshold is 75%). An active mentoring plan has been initiated to address outstanding assignment deliverables.`;
      statusTheme = 'alert';
    }

    return {
      marksDiff,
      attendanceDiff,
      assignmentRate,
      journeyVerdict,
      statusTheme,
      firstSem,
      lastSem
    };
  }, [currentStudent]);

  // Prepared chart data
  const marksChartData = useMemo(() => {
    if (!currentStudent || !currentStudent.historicalProgress) return [];
    return currentStudent.historicalProgress.map((hp) => ({
      label: hp.semester,
      value: hp.marks,
    }));
  }, [currentStudent]);

  const attendanceChartData = useMemo(() => {
    if (!currentStudent || !currentStudent.historicalProgress) return [];
    return currentStudent.historicalProgress.map((hp) => ({
      label: hp.semester,
      value: hp.attendance,
    }));
  }, [currentStudent]);

  const assignmentChartData = useMemo(() => {
    if (!currentStudent || !currentStudent.historicalProgress) return [];
    return currentStudent.historicalProgress.map((hp) => ({
      label: hp.semester,
      value: hp.assignmentsTotal > 0 ? Math.round((hp.assignmentsSubmitted / hp.assignmentsTotal) * 100) : 0,
    }));
  }, [currentStudent]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              {isAdmin ? 'Student Progress Tracking' : 'My Academic Progress'}
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              {isAdmin 
                ? 'Visualize academic indices, attendance progress, and submission histories over semesters'
                : 'Monitor your academic milestones, grading trends, and submission compliance'}
            </span>
          </div>
        </div>

        {/* 2. Admin Search / Selector dropdown */}
        {isAdmin && (
          <div className="relative w-full md:w-72">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">Selected Scholar:</span>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100/60 dark:bg-black/30 border border-solid border-slate-200/50 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none transition-colors hover:bg-slate-200/40 dark:hover:bg-white/5"
              >
                <span className="truncate">{currentStudent ? currentStudent.name : 'Select Student'}</span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-full min-w-[280px] rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-solid border-slate-200/60 dark:border-white/10 shadow-xl z-50 p-3 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, roll, dept..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-black/20 text-xs text-slate-800 dark:text-white border border-solid border-slate-200 dark:border-white/5 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {filteredStudentsForSelect.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setShowDropdown(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between ${
                        s.id === targetStudentId
                          ? 'bg-indigo-500/15 text-indigo-500 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{s.name}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{s.rollNumber} &bull; {s.department}</div>
                      </div>
                      <span className="text-[9px] font-mono bg-slate-100 dark:bg-black/30 px-1.5 py-0.5 rounded-md text-slate-500 dark:text-slate-400 font-bold">
                        {s.semester}
                      </span>
                    </button>
                  ))}
                  {filteredStudentsForSelect.length === 0 && (
                    <div className="text-center text-[10px] text-slate-400 py-4">
                      No matching scholars found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {currentStudent ? (
        <div className="space-y-6">
          {/* 3. Student Quick Profile Badge */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={currentStudent.profilePicture}
                alt={currentStudent.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/20"
              />
              <div>
                <h4 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <span>{currentStudent.name}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-solid ${
                    currentStudent.result === 'Pass'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {currentStudent.result}
                  </span>
                </h4>
                <div className="text-[10px] text-slate-400 font-medium mt-1">
                  ID: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{currentStudent.rollNumber}</span> &bull; {currentStudent.department} &bull; {currentStudent.semester} (Sec {currentStudent.section})
                </div>
              </div>
            </div>

            <div className="flex gap-2 font-mono">
              <div className="px-4 py-2 rounded-2xl bg-slate-100/60 dark:bg-black/25 border border-solid border-slate-200/30 dark:border-white/5 text-center">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Grade</span>
                <span className="text-sm font-black text-indigo-500">{currentStudent.grade}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-100/60 dark:bg-black/25 border border-solid border-slate-200/30 dark:border-white/5 text-center">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">CGPA</span>
                <span className="text-sm font-black text-emerald-500">{currentStudent.cgpa.toFixed(2)}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-100/60 dark:bg-black/25 border border-solid border-slate-200/30 dark:border-white/5 text-center">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Attendance</span>
                <span className="text-sm font-black text-pink-500">{currentStudent.attendance}%</span>
              </div>
            </div>
          </div>

          {/* 4. Historical Visual Charts Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Marks Curve */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span>Historical Grade Marks Trend</span>
                  </h4>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Overall performance percentage across semesters</span>
                </div>
                {academicTrends && (
                  <span className={`text-[9px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-lg ${
                    academicTrends.marksDiff >= 0 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {academicTrends.marksDiff >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{academicTrends.marksDiff >= 0 ? `+${academicTrends.marksDiff}` : academicTrends.marksDiff}% Delta</span>
                  </span>
                )}
              </div>
              <div className="mt-4">
                <CustomProgressChart
                  data={marksChartData}
                  color="#6366f1"
                  gradientId="marksGrad"
                  ySuffix="%"
                  maxVal={100}
                />
              </div>
            </div>

            {/* Attendance Curve */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>Historical Attendance Trend</span>
                  </h4>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Attendance consistency index over active periods</span>
                </div>
                {academicTrends && (
                  <span className={`text-[9px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-lg ${
                    academicTrends.attendanceDiff >= 0 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {academicTrends.attendanceDiff >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{academicTrends.attendanceDiff >= 0 ? `+${academicTrends.attendanceDiff}` : academicTrends.attendanceDiff}% Delta</span>
                  </span>
                )}
              </div>
              <div className="mt-4">
                <CustomProgressChart
                  data={attendanceChartData}
                  color="#ec4899"
                  gradientId="attGrad"
                  ySuffix="%"
                  maxVal={100}
                />
              </div>
            </div>

            {/* Assignment Deliverables Curve */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>Milestone Submission Trend</span>
                  </h4>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Ratio of assignment milestones completed successfully</span>
                </div>
                {academicTrends && (
                  <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{academicTrends.assignmentRate}% Life Rate</span>
                  </span>
                )}
              </div>
              <div className="mt-4">
                <CustomProgressChart
                  data={assignmentChartData}
                  color="#10b981"
                  gradientId="asgGrad"
                  ySuffix="%"
                  maxVal={100}
                />
              </div>
            </div>

            {/* Detailed Academic Journey Summary */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Academic Journey Evaluation</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-350 font-medium">
                  {academicTrends?.journeyVerdict}
                </p>
              </div>

              {/* Stat breakdown in card */}
              <div className="border-t border-slate-200/30 dark:border-white/5 mt-4 pt-4 grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-50/50 dark:bg-black/10 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">Initial Score</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5 block font-mono">{academicTrends?.firstSem.marks}%</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50/50 dark:bg-black/10 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">Current Peak</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5 block font-mono">{academicTrends?.lastSem.marks}%</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50/50 dark:bg-black/10 text-center">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">Evaluation Nodes</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5 block font-mono">{currentStudent.historicalProgress?.length || 0} Terms</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Historical Table Log */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
              Academic Term Ledger
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-solid border-slate-200/40 dark:border-white/5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-2.5">Academic Term</th>
                    <th className="py-2.5">Academic Marks</th>
                    <th className="py-2.5">Attendance</th>
                    <th className="py-2.5">Deliverable Ratio</th>
                    <th className="py-2.5 text-right">Term Result Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-solid divide-slate-200/30 dark:divide-white/5">
                  {currentStudent.historicalProgress?.map((hp, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/30 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{hp.semester}</td>
                      <td className="py-3 font-mono font-bold">{hp.marks}%</td>
                      <td className="py-3 font-mono">
                        <span className={`font-bold ${hp.attendance < 75 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {hp.attendance}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-mono">
                          {hp.assignmentsSubmitted} / {hp.assignmentsTotal}
                        </span>
                        <span className="text-[9px] text-slate-400 ml-1 font-mono">
                          ({hp.assignmentsTotal > 0 ? Math.round((hp.assignmentsSubmitted / hp.assignmentsTotal) * 100) : 0}%)
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-solid ${
                          hp.marks >= 40 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/15'
                        }`}>
                          {hp.marks >= 40 ? 'CREDIT' : 'RETAKE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-slate-400 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-white/10 border-solid shadow-lg">
          Please select a valid scholar to analyze progress.
        </div>
      )}
    </div>
  );
};
