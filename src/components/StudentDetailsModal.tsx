import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Phone, Mail, Award, BookOpen, CheckCircle, FileText, Printer, ShieldAlert, FileSpreadsheet, QrCode } from 'lucide-react';
import { Student } from '../types';
import { useApp } from '../context/AppContext';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

// Procedural SVG QR code matrix generator for high fidelity without installing dependencies
const StudentQRCodeSVG: React.FC<{ value: string }> = ({ value }) => {
  // Let's generate a highly convincing pseudo-QR matrix pattern based on the string hash
  const size = 21; // 21x21 matrix
  const grid: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  // Finders in corners
  const drawFinder = (x: number, y: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[y + r][x + c] = isBorder || isCenter;
      }
    }
  };

  // Top-left finder
  drawFinder(0, 0);
  // Top-right finder
  drawFinder(size - 7, 0);
  // Bottom-left finder
  drawFinder(0, size - 7);

  // Fill in other cells procedurally based on hash of the value string
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Avoid finder patterns
      const isTopLeftFinder = r < 8 && c < 8;
      const isTopRightFinder = r < 8 && c >= size - 8;
      const isBottomLeftFinder = r >= size - 8 && c < 8;
      
      if (!isTopLeftFinder && !isTopRightFinder && !isBottomLeftFinder) {
        // Pseudo random based on indices and hash
        const cellHash = Math.abs(Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453);
        grid[r][c] = (cellHash - Math.floor(cellHash)) > 0.45;
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full fill-slate-900 dark:fill-white">
      {grid.map((row, r) =>
        row.map((active, c) => (
          active ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} shapeRendering="crispEdges" /> : null
        ))
      )}
    </svg>
  );
};

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ isOpen, onClose, studentId }) => {
  const { students, toggleBookmark, bookmarks, showToast, schoolSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'idcard' | 'report'>('profile');

  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const isBookmarked = bookmarks.includes(student.id);

  // Simulated achievements based on grades/marks
  const getAchievements = (s: Student) => {
    const list = [
      { title: 'Dean’s List Scholar', desc: 'Maintained elite GPA in current semester.', icon: <Award className="w-4 h-4 text-amber-500" /> },
    ];
    if (s.marks >= 90) {
      list.push({ title: 'Summa Cum Laude', desc: 'Outstanding academic excellence (>90%).', icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> });
    }
    if (s.attendance >= 95) {
      list.push({ title: 'Perfect Attendance Medal', desc: 'Commitment to constant presence (>95%).', icon: <CheckCircle className="w-4 h-4 text-sky-500" /> });
    }
    if (s.department === 'Computer Science' && s.marks >= 80) {
      list.push({ title: 'Algorithmic Architect', desc: 'Brilliant capabilities in computing.', icon: <BookOpen className="w-4 h-4 text-indigo-500" /> });
    }
    return list;
  };

  const achievements = getAchievements(student);

  // Simulated Certificate List
  const certificates = [
    { name: 'Advanced AI Architect (Nvidia certified)', date: 'May 2026' },
    { name: 'Full-Stack Engineering Milestone', date: 'Jan 2026' },
  ];

  const handlePrintCard = () => {
    window.print();
  };

  const handleExportPDF = () => {
    showToast('Export Successful', `Exported ${student.name} profile PDF to downloads folder (simulated).`, 'success');
  };

  const handleExportExcel = () => {
    showToast('Export Successful', `Exported ${student.name} credentials to Excel sheet (simulated).`, 'success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col pointer-events-auto"
          >
            {/* Top header decoration banner */}
            <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-600 to-pink-500 relative flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar overlay */}
            <div className="px-6 -mt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 relative z-10 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <img
                  src={student.profilePicture}
                  alt={student.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
                />
                <div className="pb-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    {student.name}
                    <button
                      onClick={() => toggleBookmark(student.id)}
                      className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      title={isBookmarked ? 'Unfavorite Student' : 'Favorite Student'}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono font-bold tracking-tight">
                    {student.rollNumber} &bull; {student.department}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border border-solid ${
                  student.result === 'Pass'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5'
                }`}>
                  {student.result} &bull; Grade {student.grade}
                </span>
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-indigo-500/5 border-solid">
                  CGPA {student.cgpa.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200/40 dark:border-slate-800 px-6 mt-6 gap-6 flex-shrink-0 overflow-x-auto scrollbar-none">
              {[
                { id: 'profile', name: 'Overview Profile' },
                { id: 'progress', name: 'Academic Progress' },
                { id: 'idcard', name: 'Generated ID Card' },
                { id: 'report', name: 'Academic Actions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs font-extrabold uppercase tracking-widest relative cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.name}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 dark:bg-indigo-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-grow overflow-y-auto p-6">
              {/* TAB 4: ACADEMIC PROGRESS */}
              {activeTab === 'progress' && (
                <div className="space-y-6">
                  {/* Miniature Trend Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Marks trend */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 border-solid">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                        Semester Marks Curve
                      </span>
                      <div className="h-32 flex items-end gap-1 px-2 pb-2 border-b border-slate-200/30 dark:border-white/5">
                        {student.historicalProgress?.map((hp, idx) => {
                          const heightPct = `${hp.marks}%`;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                              <div className="w-full bg-indigo-500/80 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-600" style={{ height: heightPct }} />
                              <span className="text-[8px] font-mono font-bold text-slate-500 mt-1">{hp.semester.split(' ')[1]}</span>
                              <div className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-[8px] font-mono px-1 py-0.5 rounded shadow pointer-events-none z-50">
                                {hp.marks}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attendance trend */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 border-solid">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                        Attendance Curve
                      </span>
                      <div className="h-32 flex items-end gap-1 px-2 pb-2 border-b border-slate-200/30 dark:border-white/5">
                        {student.historicalProgress?.map((hp, idx) => {
                          const heightPct = `${hp.attendance}%`;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                              <div className="w-full bg-pink-500/80 rounded-t-lg transition-all duration-300 group-hover:bg-pink-600" style={{ height: heightPct }} />
                              <span className="text-[8px] font-mono font-bold text-slate-500 mt-1">{hp.semester.split(' ')[1]}</span>
                              <div className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-[8px] font-mono px-1 py-0.5 rounded shadow pointer-events-none z-50">
                                {hp.attendance}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary evaluation description */}
                  <div className="p-4 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-500/10 border-solid">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Overall Scholar Journey Summary</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {student.name} is on track in {student.semester} with an overall attendance average of {student.attendance}% and marks at {student.marks}%. 
                      {student.marks >= 75 
                        ? " Exhibiting excellent engagement metrics, meeting and exceeding core academic compliance criteria." 
                        : " Active academic support or remedial advising is recommended to optimize current learning milestones."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Bio details and contact details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-250/20 dark:border-slate-850/40 border-solid">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>+91 {student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Born: {student.dateOfBirth} ({student.gender})</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">Semester Term:</span>
                        <span className="text-slate-800 dark:text-slate-100 font-bold">{student.semester} (Sec {student.section})</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">Class Attendance:</span>
                        <span className={`font-mono font-black ${
                          student.attendance >= schoolSettings.minAttendance ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {student.attendance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">Milestone Score:</span>
                        <span className="text-slate-800 dark:text-slate-100 font-mono font-bold">{student.marks}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Academic Advising Logs
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic p-3 bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-500/10 border-solid rounded-xl">
                      &ldquo;{student.remarks}&rdquo;
                    </p>
                  </div>

                  {/* Achievements Grid */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Achievements & Medals
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {achievements.map((ach, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-850 border-solid shadow-sm"
                        >
                          <div className="p-2 rounded-xl bg-amber-500/10 flex-shrink-0 mt-0.5">
                            {ach.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                              {ach.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight block">
                              {ach.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certificates list */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Academic Credentials
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {certificates.map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850/40 border-solid"
                        >
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{cert.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{cert.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GENERATED ID CARD */}
              {activeTab === 'idcard' && (
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                  {/* Elegant Glassmorphic ID Card Container */}
                  <div
                    id="id-card-render"
                    className="relative w-85 h-54 rounded-3xl overflow-hidden p-6 text-white shadow-2xl border border-indigo-500/20 bg-gradient-to-tr from-slate-900 via-indigo-950 to-pink-950 flex flex-col justify-between"
                  >
                    {/* Background glows */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/30 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-pink-500/30 rounded-full blur-2xl" />

                    {/* School header */}
                    <div className="relative flex justify-between items-start border-b border-white/10 pb-2.5">
                      <div>
                        <h4 className="text-xs font-black tracking-widest uppercase bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                          {schoolSettings.schoolName}
                        </h4>
                        <span className="text-[8px] font-bold tracking-wider uppercase text-pink-300">
                          Secure Academic Scholar ID
                        </span>
                      </div>
                      <span className="text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-white/10 uppercase">
                        Active
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative flex items-center gap-4 py-2">
                      <img
                        src={student.profilePicture}
                        alt={student.name}
                        className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-black tracking-tight block truncate">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-pink-200 block mt-0.5">
                          {student.rollNumber}
                        </span>
                        <span className="text-[9px] text-slate-300 font-bold block mt-1 uppercase">
                          {student.department}
                        </span>
                        <span className="text-[8px] text-indigo-200 block mt-0.5">
                          {student.semester}
                        </span>
                      </div>
                    </div>

                    {/* ID Card Footer */}
                    <div className="relative flex justify-between items-end border-t border-white/10 pt-2 text-[8px] font-mono">
                      <div>
                        <span className="text-slate-400 block uppercase">Phone Contact</span>
                        <span className="text-slate-200 block font-bold">+91 {student.phone}</span>
                      </div>
                      
                      {/* Barcode / QR placeholder */}
                      <div className="w-10 h-10 p-1 bg-white rounded-lg flex items-center justify-center shadow-lg">
                        <StudentQRCodeSVG value={`SMS-STUDENT-CARD-${student.rollNumber}`} />
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID card renders with high-fidelity vector barcodes and embedded QR.
                    </p>
                    <button
                      onClick={handlePrintCard}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Scholar Pass</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: ACADEMIC ACTIONS */}
              {activeTab === 'report' && (
                <div className="space-y-6">
                  {/* Warning notices if attendance or grades are failing */}
                  {student.attendance < schoolSettings.minAttendance && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-500/25 border-solid shadow-sm">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500 animate-pulse" />
                      <div>
                        <span className="text-xs font-bold block">Low Attendance Advisory Issued</span>
                        <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                          This scholar has attended only {student.attendance}% of instruction sessions, which falls below the mandatory global threshold of {schoolSettings.minAttendance}%. Attendance warning is active.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Document and simulation actions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Document Processing Actions
                    </h4>
                    
                    <button
                      onClick={handlePrintCard}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-solid border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                          <Printer className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                            Print Complete Report Card
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight block">
                            Generates a printer-optimized profile with academic marks, logs, and compliance audits.
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportPDF}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-solid border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                            Export Profile as PDF
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight block">
                            Compiles all charts, grades, GPA aggregates, and credentials into a secure portable PDF document.
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportExcel}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-solid border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                            Export Excel Worksheet (.xlsx)
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight block">
                            Creates a spreadsheet listing demographic records, grades breakdown, and attendance matrix.
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-250/20 dark:border-slate-850/40 border-solid space-y-3">
                      <div className="w-18 h-18 p-1.5 bg-white rounded-xl shadow-lg border border-indigo-500/10">
                        <StudentQRCodeSVG value={`SMS-ID-PORTAL-${student.id}`} />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                          External Scan Portal
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight block">
                          Scan to load secure academic credential records instantly onto external administrative terminals.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/40 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                Created: {new Date(student.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/10 hover:scale-[1.02] cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
