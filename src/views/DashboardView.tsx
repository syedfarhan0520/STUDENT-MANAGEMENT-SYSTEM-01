import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Trophy,
  Activity,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Clock,
  ShieldCheck,
  Percent
} from 'lucide-react';
import {
  DigitalClock,
  WeatherWidget,
  MiniCalendar,
  QuickActions,
} from '../components/Widgets';
import { AreaChart, DonutChart } from '../components/AnalyticsCharts';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenAddStudent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenAddStudent }) => {
  const { currentUser, students, assignments, exams, logs, schoolSettings } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // Calculations for ADMIN
  const totalStudentsCount = students.length;
  
  const averageMarks = Math.round(
    students.reduce((sum, s) => sum + s.marks, 0) / (totalStudentsCount || 1)
  );

  const highestMarks = students.length > 0 
    ? Math.max(...students.map((s) => s.marks)) 
    : 0;

  const lowestMarks = students.length > 0 
    ? Math.min(...students.map((s) => s.marks)) 
    : 0;

  const averageAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendance, 0) / (totalStudentsCount || 1)
  );

  const topPerformer = students.length > 0
    ? [...students].sort((a, b) => b.marks - a.marks)[0]
    : null;

  const submittedAssignments = assignments.filter((a) => a.status === 'Submitted').length;
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending' || a.status === 'Late').length;

  // Student portal data (for the logged-in student)
  const personalStudent = !isAdmin
    ? students.find((s) => s.id === currentUser?.id)
    : null;

  const studentExams = !isAdmin && personalStudent
    ? exams.filter((e) => e.department === personalStudent.department && e.semester === personalStudent.semester)
    : [];

  const studentAssignments = !isAdmin && personalStudent
    ? assignments.filter((a) => a.department === personalStudent.department && a.semester === personalStudent.semester)
    : [];

  const personalSubmitted = studentAssignments.filter((a) => a.status === 'Submitted').length;
  const personalPending = studentAssignments.filter((a) => a.status === 'Pending' || a.status === 'Late').length;

  // Chart data definitions
  const chartDataPoints = [...students]
    .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
    .slice(0, 10)
    .map((s) => ({
      label: s.name,
      value: s.marks,
    }));

  const passCount = students.filter((s) => s.result === 'Pass').length;
  const failCount = students.filter((s) => s.result === 'Fail').length;
  const genderData = [
    { label: 'Passed Scholars', value: passCount, color: '#10b981' },
    { label: 'Needs Support', value: failCount, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Welcome bar */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-slate-900/80 dark:bg-slate-950/40 backdrop-blur-md text-white shadow-xl border border-slate-200/30 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Glow vector backdrops */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-white backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h2>
            <p className="text-xs text-indigo-200/80 mt-0.5 font-medium">
              Academic Node: <span className="font-bold text-white uppercase">{schoolSettings.schoolName}</span> &bull; Status Verified
            </p>
          </div>
        </div>

        <span className="relative text-[10px] font-mono font-bold tracking-widest px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md uppercase border border-white/5">
          {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* ADMIN DASHBOARD VIEW */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* Main Stat Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Total Enrolled',
                val: totalStudentsCount,
                sub: 'Active scholars in directory',
                icon: <Users className="w-5 h-5" />,
                color: 'from-blue-500 to-indigo-500 shadow-blue-500/10 text-blue-500',
              },
              {
                title: 'Marks Average',
                val: `${averageMarks}%`,
                sub: `Class average marks performance`,
                icon: <TrendingUp className="w-5 h-5" />,
                color: 'from-pink-500 to-purple-500 shadow-pink-500/10 text-pink-500',
              },
              {
                title: 'Topper Candidate',
                val: topPerformer ? topPerformer.name : 'N/A',
                sub: `Highest mark is ${highestMarks}%`,
                icon: <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />,
                color: 'from-amber-500 to-orange-500 shadow-amber-500/10 text-amber-500',
              },
              {
                title: 'Attendance Average',
                val: `${averageAttendance}%`,
                sub: `Pass threshold is ${schoolSettings.minAttendance}%`,
                icon: <Percent className="w-5 h-5" />,
                color: 'from-emerald-500 to-teal-500 shadow-emerald-500/10 text-emerald-500',
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      {card.title}
                    </span>
                    <span className="text-xl font-black text-slate-800 dark:text-white block mt-1.5 font-sans">
                      {card.val}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-2xl bg-slate-100/50 dark:bg-black/20 border border-slate-200/30 dark:border-white/5 border-solid ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
                <div className="border-t border-slate-200/30 dark:border-white/5 mt-4 pt-3 text-[10px] text-slate-400 font-semibold">
                  {card.sub}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Graphics & Primary analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    Portfolio Grade Distribution
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                    Showing marks curve for active scholars list
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>Full Analytics</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <AreaChart data={chartDataPoints} gradientColor="rgb(99, 102, 241)" />
            </div>

            {/* Performance status pass/fail pie chart */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Academic Compliance Rate
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  Proportion of pass vs fails criteria
                </span>
              </div>
              <DonutChart data={genderData} title="Passing Index" />
            </div>
          </div>

          {/* Activity Logs & Widget layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widgets layout stack */}
            <div className="space-y-6">
              <QuickActions onOpenAddStudent={onOpenAddStudent} onNavigate={onNavigate} />
              <DigitalClock />
              <WeatherWidget />
            </div>

            {/* Calendar widget */}
            <div>
              <MiniCalendar />
            </div>

            {/* Audit Logs stack */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-500" />
                  <span>Real-time Administrative Logs</span>
                </h3>
                <div className="space-y-4 max-h-85 overflow-y-auto pr-1">
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="relative pl-4 border-l-2 border-indigo-500/30 text-left">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase">
                        <span>{log.action}</span>
                        <span className="text-[8px] text-slate-400 font-mono font-bold">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {log.details}
                      </p>
                      <span className="text-[8px] text-indigo-500 dark:text-indigo-400 font-bold block mt-1">
                        By &bull; {log.user}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200/30 dark:border-white/5 mt-4 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Archiving logs count: {logs.length}</span>
                <span className="text-emerald-500 font-bold">Live node operational</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STUDENT PORTAL VIEW */
        <div className="space-y-6">
          {personalStudent ? (
            <div className="space-y-6">
              {/* Performance row cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'My Grade Level',
                    val: `${personalStudent.grade}`,
                    sub: `CGPA stands at ${personalStudent.cgpa.toFixed(2)}`,
                    icon: <Award className="w-5 h-5 text-indigo-500" />,
                    color: 'from-indigo-500 to-indigo-600 shadow-indigo-500/10',
                  },
                  {
                    title: 'My attendance',
                    val: `${personalStudent.attendance}%`,
                    sub: `Required threshold is ${schoolSettings.minAttendance}%`,
                    icon: <Clock className="w-5 h-5 text-pink-500 animate-pulse" />,
                    color: 'from-pink-500 to-pink-600 shadow-pink-500/10',
                  },
                  {
                    title: 'Course Marks',
                    val: `${personalStudent.marks}/100`,
                    sub: `Equivalent result: ${personalStudent.result}`,
                    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
                    color: 'from-emerald-500 to-teal-500 shadow-emerald-500/10',
                  },
                  {
                    title: 'Assignments Task',
                    val: `${personalSubmitted} / ${studentAssignments.length}`,
                    sub: `${personalPending} deliverables outstanding`,
                    icon: <FileCheck2 className="w-5 h-5 text-amber-500" />,
                    color: 'from-amber-500 to-orange-500 shadow-amber-500/10',
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {card.title}
                        </span>
                        <span className="text-xl font-black text-slate-800 dark:text-white block mt-1.5 font-sans">
                          {card.val}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-100/50 dark:bg-black/20 border border-slate-200/30 dark:border-white/5 border-solid text-slate-800 dark:text-white">
                        {card.icon}
                      </div>
                    </div>
                    <div className="border-t border-slate-200/30 dark:border-white/5 mt-4 pt-3 text-[10px] text-slate-400 font-semibold">
                      {card.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Assignments / Exams schedule list and widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Due assignments module */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span>My Course Milestones ({studentAssignments.length})</span>
                      </h3>
                      <button
                        onClick={() => onNavigate('assignments')}
                        className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                      >
                        <span>Manage My Portal</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {studentAssignments.slice(0, 4).map((asg) => (
                        <div
                          key={asg.id}
                          className="flex justify-between items-center p-3 rounded-2xl border border-solid border-slate-200/30 dark:border-white/5 bg-slate-100/40 dark:bg-black/20"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate max-w-xs sm:max-w-md">
                              {asg.title}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 block mt-0.5">
                              Due date: {asg.dueDate}
                            </span>
                          </div>
                          
                          <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full border border-solid ${
                            asg.status === 'Submitted'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : asg.status === 'Late'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {asg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200/30 dark:border-white/5 mt-4 pt-3 text-[10px] text-slate-400 font-semibold flex justify-between">
                    <span>Active Semester: {personalStudent.semester}</span>
                    <span>Department of {personalStudent.department}</span>
                  </div>
                </div>

                {/* Exam scheduler roster widget */}
                <div className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 border-solid shadow-lg">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <span>My Upcoming Exam Roster</span>
                  </h3>
                  <div className="space-y-3">
                    {studentExams.slice(0, 3).map((ex) => (
                      <div
                        key={ex.id}
                        className="p-3 rounded-2xl bg-slate-100/40 dark:bg-black/20 border border-slate-200/30 dark:border-white/5 border-solid"
                      >
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-100 block">
                          {ex.subject}
                        </span>
                        <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-slate-400">
                          <span>Hall: {ex.hallNumber}</span>
                          <span className="text-pink-500 font-bold">
                            {new Date(ex.examDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {studentExams.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No immediate examinations scheduled.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clock, Weather and Calendar for Student Portal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DigitalClock />
                <WeatherWidget />
                <MiniCalendar />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-850 border-solid shadow-lg">
              Authorized session corrupted. Please terminate session and re-authenticate.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
