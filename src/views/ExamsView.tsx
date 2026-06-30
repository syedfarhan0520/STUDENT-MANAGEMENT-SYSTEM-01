import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Award, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

export const ExamsView: React.FC = () => {
  const { currentUser, exams, students } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // Filter based on role
  const roleExams = isAdmin
    ? exams
    : exams.filter((e) => e.department === currentUser?.department && e.semester === currentUser?.semester);

  const upcomingExams = roleExams.filter((e) => e.status === 'Upcoming');
  const pastExams = roleExams.filter((e) => e.status === 'Completed');

  // Compute stats
  const totalUpcoming = upcomingExams.length;
  const totalPast = pastExams.length;

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Upcoming Assessments</span>
          <span className="text-xl font-black mt-1.5 block text-slate-850 dark:text-white font-mono">{totalUpcoming} Paper(s)</span>
          <span className="text-[9px] text-slate-400 block mt-1">Scheduled for current semester term</span>
        </div>
        <div className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Concluded Papers</span>
          <span className="text-xl font-black mt-1.5 block text-slate-850 dark:text-white font-mono">{totalPast} Term(s)</span>
          <span className="text-[9px] text-slate-400 block mt-1">Evaluated and grades archived</span>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/60 via-indigo-950/40 to-purple-950/40 backdrop-blur-md text-white border border-indigo-500/15 shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">Admit Card Status</span>
          <span className="text-sm font-extrabold mt-1.5 block">Approved & Dispatched</span>
          <span className="text-[9px] text-indigo-200 block mt-1">Compliance verified & hall ticket active</span>
        </div>
      </div>

      {/* Roster lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming scheduled exams */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
          <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>Active Scheduled Examinations ({totalUpcoming})</span>
          </h3>

          <div className="space-y-4">
            {upcomingExams.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-3xl bg-slate-50/50 dark:bg-black/25 border border-slate-150/40 dark:border-white/5 border-solid flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase block">
                    {ex.department} &bull; {ex.semester}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white mt-1">
                    {ex.subject}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[10px] text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ex.hallNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(ex.examDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                        {new Date(ex.examDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/15 border-solid self-start sm:self-center">
                  Upcoming
                </span>
              </div>
            ))}

            {upcomingExams.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No upcoming term examinations are scheduled at this time.
              </div>
            )}
          </div>
        </div>

        {/* Past/Concluded exams */}
        <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
          <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Archived Results ({totalPast})</span>
          </h3>

          <div className="space-y-4">
            {pastExams.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-black/20 border border-slate-150/40 dark:border-white/5 border-solid flex justify-between items-center"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {ex.subject}
                  </h4>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Max Marks possible: {ex.maxMarks}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 pl-3">
                  <span className="text-xs font-black font-mono text-emerald-500 block">
                    {ex.obtainedMarks} / {ex.maxMarks}
                  </span>
                  <span className="text-[8px] font-bold text-indigo-500 block uppercase mt-0.5">
                    Grade {ex.grade}
                  </span>
                </div>
              </div>
            ))}

            {pastExams.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No past examination logs available for this portal node.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
