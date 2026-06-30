import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { BookOpen, Calendar, CheckCircle2, AlertCircle, FileText, ArrowUpRight, UploadCloud, X, Award } from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { currentUser, assignments, submitAssignment, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted'>('all');
  const [selectedAsgId, setSelectedAsgId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [simulatedFileName, setSimulatedFileName] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  // Filter based on role
  const roleAssignments = isAdmin
    ? assignments
    : assignments.filter((a) => a.department === currentUser?.department && a.semester === currentUser?.semester);

  // Filter based on tab
  const filteredAsg = roleAssignments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'Pending' || a.status === 'Late';
    if (activeTab === 'submitted') return a.status === 'Submitted';
    return true;
  });

  const handleOpenSubmitModal = (id: string) => {
    setSelectedAsgId(id);
    setSimulatedFileName('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSimulatedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSimulatedFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedAsgId) {
      submitAssignment(selectedAsgId);
      setSelectedAsgId(null);
    }
  };

  // Admin grading simulator
  const [gradingAsgId, setGradingAsgId] = useState<string | null>(null);
  const [gradingScore, setGradingScore] = useState(90);
  const [gradingFeedback, setGradingFeedback] = useState('Outstanding research drafting!');

  const handleAdminGrade = (id: string) => {
    setGradingAsgId(id);
    const asg = assignments.find((a) => a.id === id);
    if (asg) {
      setGradingScore(asg.marksAwarded || 85);
      setGradingFeedback(asg.feedback || 'Outstanding research drafting!');
    }
  };

  const saveAdminGrade = () => {
    if (gradingAsgId) {
      // Simulate grading update directly in our context (or show toast)
      showToast('Marks Graded', 'Assignment evaluated, results published securely.', 'success');
      setGradingAsgId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <BookOpen className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              {isAdmin ? 'Academic Assignments Center' : 'My Course Milestones'}
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              {isAdmin ? 'Formulate, grade, and evaluate student milestones' : 'Manage your course syllabus deliverables'}
            </span>
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/20 dark:border-slate-850">
          {[
            { id: 'all', name: 'All Milestones' },
            { id: 'pending', name: 'Pending / Late' },
            { id: 'submitted', name: 'Submitted' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAsg.map((asg) => (
          <div
            key={asg.id}
            className={`p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-solid shadow-lg flex flex-col justify-between overflow-hidden relative ${
              asg.status === 'Submitted'
                ? 'border-slate-200/55 dark:border-white/10'
                : asg.status === 'Late'
                ? 'border-rose-500/20 shadow-rose-500/5'
                : 'border-amber-500/20 shadow-amber-500/5'
            }`}
          >
            {/* Status Corner Banner */}
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest text-white ${
              asg.status === 'Submitted'
                ? 'bg-emerald-500'
                : asg.status === 'Late'
                ? 'bg-rose-500 animate-pulse'
                : 'bg-amber-500'
            }`}>
              {asg.status}
            </div>

            <div>
              <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">
                {asg.department} &bull; {asg.semester}
              </span>
              <h4 className="text-xs font-black text-slate-850 dark:text-white mt-1.5 leading-snug line-clamp-2 pr-16">
                {asg.title}
              </h4>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-4 font-semibold">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Due Date: {asg.dueDate}</span>
              </div>

              {/* If graded, show marks and remarks */}
              {asg.status === 'Submitted' && asg.marksAwarded !== undefined ? (
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 border-solid">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Performance Graded</span>
                    <span className="font-mono text-emerald-500 font-extrabold">{asg.marksAwarded} / {asg.maxMarks}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1 leading-normal">
                    &ldquo;{asg.feedback}&rdquo;
                  </p>
                </div>
              ) : asg.status === 'Submitted' ? (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-500/10 border-solid text-[10px] text-indigo-500 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span>Awaiting administrative evaluation</span>
                </div>
              ) : null}
            </div>

            {/* Action buttons */}
            <div className="border-t border-slate-100 dark:border-slate-850/50 mt-4 pt-3 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400">Max score: {asg.maxMarks}</span>
              
              {!isAdmin && asg.status !== 'Submitted' && (
                <button
                  onClick={() => handleOpenSubmitModal(asg.id)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/10 hover:scale-[1.02] cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Submit Task</span>
                </button>
              )}

              {isAdmin && asg.status === 'Submitted' && (
                <button
                  onClick={() => handleAdminGrade(asg.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Grade Marks</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* STUDENT SUBMISSION MODAL */}
      <AnimatePresence>
        {selectedAsgId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsgId(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl p-6 bg-white/80 dark:bg-[#0c0f17]/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 border-solid shadow-2xl z-10 flex flex-col pointer-events-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-950 pb-3.5 mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-indigo-500" />
                  <span>Transmit deliverables</span>
                </h3>
                <button
                  onClick={() => setSelectedAsgId(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drag and drop panel */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3 animate-pulse" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Drag and drop document here
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Supports PDF, DOCX, ZIP or TAR up to 128MB
                </span>

                <label className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer border border-slate-250/20 dark:border-slate-700">
                  <span>Browse Storage</span>
                  <input type="file" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>

              {simulatedFileName && (
                <div className="mt-4 p-3 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-500/10 border-solid flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-xs font-mono font-bold truncate text-indigo-900 dark:text-indigo-300">
                    {simulatedFileName}
                  </span>
                </div>
              )}

              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setSelectedAsgId(null)}
                  className="px-4 py-2 text-[10px] font-bold rounded-xl border border-solid border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={!simulatedFileName}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white rounded-xl shadow-md transition-all ${
                    simulatedFileName
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:scale-[1.02]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  Upload & Verify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN GRADING MODAL */}
      <AnimatePresence>
        {gradingAsgId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGradingAsgId(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl p-6 bg-white/80 dark:bg-[#0c0f17]/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 border-solid shadow-2xl z-10"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <span>Evaluate Milestone Task</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score points (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradingScore}
                    onChange={(e) => setGradingScore(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Advisor feedback notes</label>
                  <textarea
                    rows={3}
                    value={gradingFeedback}
                    onChange={(e) => setGradingFeedback(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setGradingAsgId(null)}
                  className="px-4 py-2 text-[10px] font-bold rounded-xl border border-solid border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAdminGrade}
                  className="px-4 py-2 text-[10px] font-bold text-white rounded-xl bg-indigo-500 shadow-md hover:bg-indigo-600 cursor-pointer"
                >
                  Publish evaluation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
