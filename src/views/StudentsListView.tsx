import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Printer,
  FileSpreadsheet,
  FileText,
  Bookmark,
  BookmarkCheck,
  UserCheck2,
  Users
} from 'lucide-react';

interface StudentsListViewProps {
  onOpenAddStudent: () => void;
  onOpenEditStudent: (id: string) => void;
  onOpenViewStudent: (id: string) => void;
}

export const StudentsListView: React.FC<StudentsListViewProps> = ({
  onOpenAddStudent,
  onOpenEditStudent,
  onOpenViewStudent,
}) => {
  const { students, deleteStudent, duplicateStudent, toggleBookmark, bookmarks, showToast } = useApp();

  // Search, Filter & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterResult, setFilterResult] = useState('ALL');
  const [filterAttendance, setFilterAttendance] = useState('ALL'); // 'ALL', 'LOW' (<75%), 'HIGH' (>=90%)
  const [filterAssignments, setFilterAssignments] = useState('ALL');
  const [sortBy, setSortBy] = useState('LATEST'); // 'LATEST', 'OLDEST', 'MARKS_HIGH', 'MARKS_LOW', 'ATTENDANCE_HIGH', 'ALPHA'
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Custom Deletion Confirmation states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Retrieve unique departments for filter dropdown
  const uniqueDepts = Array.from(new Set(students.map((s) => s.department)));

  // Core Search, Filtering and Sorting pipeline
  const filteredStudents = students
    .filter((s) => {
      // 1. Search Query
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.section.toLowerCase().includes(query) ||
        s.semester.toLowerCase().includes(query);

      // 2. Department filter
      const matchesDept = filterDept === 'ALL' || s.department === filterDept;

      // 3. Gender filter
      const matchesGender = filterGender === 'ALL' || s.gender === filterGender;

      // 4. Result filter (Pass/Fail)
      const matchesResult = filterResult === 'ALL' || s.result === filterResult;

      // 5. Attendance filter
      let matchesAttendance = true;
      if (filterAttendance === 'LOW') matchesAttendance = s.attendance < 75;
      else if (filterAttendance === 'HIGH') matchesAttendance = s.attendance >= 90;

      // 6. Assignment filter
      const matchesAssignments = filterAssignments === 'ALL' || s.assignmentStatus === filterAssignments;

      return matchesSearch && matchesDept && matchesGender && matchesResult && matchesAttendance && matchesAssignments;
    })
    .sort((a, b) => {
      // Sorting Logic
      switch (sortBy) {
        case 'OLDEST':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'MARKS_HIGH':
          return b.marks - a.marks;
        case 'MARKS_LOW':
          return a.marks - b.marks;
        case 'ATTENDANCE_HIGH':
          return b.attendance - a.attendance;
        case 'ALPHA':
          return a.name.localeCompare(b.name);
        case 'LATEST':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Pagination bounds
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Delete handler
  const triggerDeleteConfirm = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = () => {
    if (deleteConfirmId) {
      deleteStudent(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Simulated global reports exports
  const handleExportExcel = () => {
    showToast('Registry Exported', 'Wrote active student list to students_registry.xlsx (simulated).', 'success');
  };

  const handleExportPDF = () => {
    showToast('Registry Exported', 'Rendered print-ready PDF of current student logs (simulated).', 'success');
  };

  const handlePrintRegistry = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* List Action Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 flex-shrink-0">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Enrolled Scholars Registry ({totalItems})
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              Refined directory with multi-filter indexes and action triggers
            </span>
          </div>
        </div>

        {/* Command Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handlePrintRegistry}
            className="p-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
            title="Print registry list"
          >
            <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={handleExportPDF}
            className="p-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
            title="Export registry as PDF report"
          >
            <FileText className="w-4 h-4 text-rose-500" />
          </button>
          <button
            onClick={handleExportExcel}
            className="p-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
            title="Export registry as Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Admit Scholar</span>
          </button>
        </div>
      </div>

      {/* Searching, Filtering and Sorting Panels */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg space-y-4">
        {/* Search & View Modes toggles */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, Roll, Dept, Semester or Section..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-10.5 pr-4 py-2.5 rounded-xl border border-solid border-slate-200/55 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all"
            />
          </div>

          {/* View Modes toggle */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/20 dark:border-slate-850 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Filter Selection Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Dept */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Department</label>
            <select
              value={filterDept}
              onChange={(e) => {
                setFilterDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[11px] font-bold px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {uniqueDepts.map((d, idx) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Gender</label>
            <select
              value={filterGender}
              onChange={(e) => {
                setFilterGender(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[11px] font-bold px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Compliance (Pass/Fail) */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Compliance</label>
            <select
              value={filterResult}
              onChange={(e) => {
                setFilterResult(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[11px] font-bold px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Scores</option>
              <option value="Pass">Passing Only</option>
              <option value="Fail">Failing / Below Min</option>
            </select>
          </div>

          {/* Attendance filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Attendance</label>
            <select
              value={filterAttendance}
              onChange={(e) => {
                setFilterAttendance(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[11px] font-bold px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Presence</option>
              <option value="LOW">Low Att. (&lt;75%)</option>
              <option value="HIGH">High Att. (&gt;=90%)</option>
            </select>
          </div>

          {/* Assignments */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Assignments</label>
            <select
              value={filterAssignments}
              onChange={(e) => {
                setFilterAssignments(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[11px] font-bold px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Submission Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Sort criteria</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-[11px] font-bold px-3 py-2 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="LATEST">Latest Added</option>
              <option value="OLDEST">Oldest Added</option>
              <option value="MARKS_HIGH">Score: High to Low</option>
              <option value="MARKS_LOW">Score: Low to High</option>
              <option value="ATTENDANCE_HIGH">Attendance Rate</option>
              <option value="ALPHA">A-Z Name Sort</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {paginatedStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-white/5 backdrop-blur-md border border-solid border-slate-200 dark:border-white/10 rounded-3xl shadow-lg text-center">
          <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">
            No active records matching filters
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
            Adjust your current search term, department selector or filters to review directories.
          </p>
        </div>
      )}

      {/* VIEW MODES RENDERING */}
      {paginatedStudents.length > 0 && (
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            /* TABLE VIEW */
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-xl border-solid"
            >
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-black/20 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-white/10">
                    <th className="py-4.5 px-6">Scholar Profile</th>
                    <th className="py-4.5 px-3">Roll / ID</th>
                    <th className="py-4.5 px-3">Department</th>
                    <th className="py-4.5 px-3 text-center">Milestones</th>
                    <th className="py-4.5 px-3 text-center">Attendance</th>
                    <th className="py-4.5 px-3 text-center">GPA</th>
                    <th className="py-4.5 px-3 text-center">Assignments</th>
                    <th className="py-4.5 px-6 text-right">Actions Deck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {paginatedStudents.map((student) => {
                    const isFav = bookmarks.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors group"
                      >
                        {/* Avatar & Name */}
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleBookmark(student.id)}
                              className={`text-xs hover:scale-110 transition-all cursor-pointer ${
                                isFav ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700 hover:text-slate-400'
                              }`}
                            >
                              ★
                            </button>
                            <img
                              src={student.profilePicture}
                              alt={student.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-inner"
                            />
                            <div className="min-w-0">
                              <span
                                onClick={() => onOpenViewStudent(student.id)}
                                className="font-extrabold text-slate-800 dark:text-white block hover:text-indigo-500 cursor-pointer truncate max-w-xs"
                              >
                                {student.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate max-w-xs">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Roll number */}
                        <td className="py-3 px-3 font-mono font-bold text-[10px] tracking-wider text-slate-500">
                          {student.rollNumber}
                        </td>

                        {/* Department */}
                        <td className="py-3 px-3">
                          <span className="block">{student.department}</span>
                          <span className="text-[9px] text-slate-400">{student.semester}</span>
                        </td>

                        {/* Marks */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono font-bold">{student.marks}%</span>
                          <span className={`block text-[9px] font-extrabold uppercase mt-0.5 ${
                            student.result === 'Pass' ? 'text-emerald-500' : 'text-rose-500'
                          }`}>
                            {student.result}
                          </span>
                        </td>

                        {/* Attendance */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 font-mono">
                            <span className="font-bold">{student.attendance}%</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              student.attendance >= 75 ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'
                            }`} />
                          </div>
                        </td>

                        {/* Grade */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-extrabold font-sans text-indigo-500 block">{student.grade}</span>
                          <span className="text-[9px] font-mono text-slate-400">gpa {student.cgpa.toFixed(2)}</span>
                        </td>

                        {/* Assignments */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-solid ${
                            student.assignmentStatus === 'Submitted'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/15'
                          }`}>
                            {student.assignmentStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-6 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onOpenViewStudent(student.id)}
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                              title="Explore detail logs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenEditStudent(student.id)}
                              className="p-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors cursor-pointer"
                              title="Modify portfolio details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => duplicateStudent(student.id)}
                              className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors cursor-pointer"
                              title="Clone record archives"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => triggerDeleteConfirm(student.id)}
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                              title="Purge profile archive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          ) : (
            /* CARD VIEW */
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {paginatedStudents.map((student) => {
                const isFav = bookmarks.includes(student.id);
                return (
                  <div
                    key={student.id}
                    className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Avatar, Fav and Names */}
                      <div className="flex justify-between items-start">
                        <img
                          src={student.profilePicture}
                          alt={student.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-250/20 dark:border-slate-850/50 shadow-sm"
                        />
                        <button
                          onClick={() => toggleBookmark(student.id)}
                          className={`text-sm hover:scale-110 transition-all cursor-pointer ${
                            isFav ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                      </div>

                      <div className="mt-3.5">
                        <span
                          onClick={() => onOpenViewStudent(student.id)}
                          className="text-xs font-black text-slate-850 dark:text-white hover:text-indigo-500 cursor-pointer block truncate"
                        >
                          {student.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">
                          {student.rollNumber}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 font-bold mt-2 truncate bg-slate-100/50 dark:bg-black/20 px-2 py-1.5 rounded-xl">
                        {student.department} &bull; {student.semester}
                      </p>

                      {/* Performance tags */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                        <div className="p-2 rounded-xl bg-indigo-50/20 dark:bg-indigo-950/5 text-slate-700 dark:text-slate-200 border border-indigo-500/10">
                          <span className="text-[8px] font-bold text-slate-400 block">MARKS</span>
                          <span className="text-xs font-black font-mono block mt-0.5 text-indigo-500">
                            {student.marks}%
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-pink-50/20 dark:bg-pink-950/5 text-slate-700 dark:text-slate-200 border border-pink-500/10">
                          <span className="text-[8px] font-bold text-slate-400 block">ATTENDANCE</span>
                          <span className="text-xs font-black font-mono block mt-0.5 text-pink-500">
                            {student.attendance}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="border-t border-slate-200/30 dark:border-white/5 mt-4 pt-3 flex justify-between items-center">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-solid ${
                        student.result === 'Pass'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/15'
                      }`}>
                        {student.result} &bull; {student.grade}
                      </span>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onOpenViewStudent(student.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
                          title="Open logs portal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditStudent(student.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 transition-colors cursor-pointer"
                          title="Edit portfolio"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(student.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 transition-colors cursor-pointer"
                          title="Purge record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Pagination Row */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4.5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-md text-xs">
          <span className="text-slate-400 font-bold">
            Showing records {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
          </span>
          <div className="flex items-center gap-1.5 font-extrabold">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-7.5 h-7.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-indigo-500 text-white font-black'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM GLASSMORPHIC DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Alert Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 border-solid shadow-2xl flex flex-col items-center text-center z-10"
            >
              <div className="p-3 bg-rose-500/15 text-rose-500 rounded-2xl mb-4 animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">
                Authorize Record Deletion
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                You are requesting to permanently erase{' '}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {students.find((s) => s.id === deleteConfirmId)?.name}
                </span>{' '}
                from the system nodes. This action cannot be undone. Do you authorize this transaction?
              </p>

              <div className="flex gap-2 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-grow py-2.5 text-xs font-bold rounded-xl border border-solid border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer"
                >
                  No, Abort
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="flex-grow py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 cursor-pointer"
                >
                  Yes, Erase Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
