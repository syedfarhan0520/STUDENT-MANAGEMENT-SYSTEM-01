import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Assignment, Exam, Notification, ActivityLog } from '../types';
import { INITIAL_STUDENTS, INITIAL_ASSIGNMENTS, INITIAL_EXAMS, INITIAL_NOTIFICATIONS, INITIAL_LOGS, calculateGradeAndGPA, generateHistoricalProgress } from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  currentUser: User | null;
  login: (email: string, role: 'admin' | 'student', rollNumber?: string) => boolean;
  logout: () => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'grade' | 'cgpa' | 'result' | 'createdAt'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  duplicateStudent: (id: string) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  assignments: Assignment[];
  submitAssignment: (id: string) => void;
  exams: Exam[];
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  logs: ActivityLog[];
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  schoolSettings: {
    schoolName: string;
    minAttendance: number;
    passingMarks: number;
  };
  updateSchoolSettings: (settings: { schoolName: string; minAttendance: number; passingMarks: number }) => void;
  recentLogins: { email: string; role: string; timestamp: string }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('sms-theme') as 'light' | 'dark' | 'system') || 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Core Data States with Local Storage persistence
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sms-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sms-students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('sms-assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [exams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('sms-exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('sms-notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sms-logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('sms-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [schoolSettings, setSchoolSettings] = useState(() => {
    const saved = localStorage.getItem('sms-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.schoolName === 'Apex Institute of Technology' || parsed.schoolName === 'GNU Institute of Technology' || parsed.schoolName === 'Apex University') {
          parsed.schoolName = 'Guru Nanak University';
          localStorage.setItem('sms-settings', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        // Fallback if parsing fails
      }
    }
    return {
      schoolName: 'Guru Nanak University',
      minAttendance: 75,
      passingMarks: 40,
    };
  });

  const [recentLogins, setRecentLogins] = useState<{ email: string; role: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('sms-recent-logins');
    return saved ? JSON.parse(saved) : [
      { email: 'admin@university.edu', role: 'admin', timestamp: '2026-06-29T14:15:00Z' },
      { email: 'sarah.connor@university.edu', role: 'student', timestamp: '2026-06-29T08:30:00Z' }
    ];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme resolution side-effect
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let active: 'light' | 'dark' = 'light';
      if (theme === 'system') {
        active = mediaQuery.matches ? 'dark' : 'light';
      } else {
        active = theme;
      }
      setResolvedTheme(active);

      if (active === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    updateTheme();
    localStorage.setItem('sms-theme', theme);

    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sms-current-user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sms-students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sms-assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sms-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sms-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('sms-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('sms-settings', JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  useEffect(() => {
    localStorage.setItem('sms-recent-logins', JSON.stringify(recentLogins));
  }, [recentLogins]);

  // Toast functions
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setTheme = (t: 'light' | 'dark' | 'system') => {
    setThemeState(t);
    showToast('Theme Changed', `Theme set to ${t === 'system' ? 'System Theme' : t}`, 'success');
  };

  // Activity Log helper
  const addLog = (user: string, action: string, details: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substring(2, 9),
      user,
      action,
      details,
      timestamp: new Date().toISOString(),
      type,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep last 50 logs
  };

  // Authentication logic
  const login = (email: string, role: 'admin' | 'student', rollNumber?: string): boolean => {
    // Normalization
    const normEmail = email.toLowerCase().trim();

    if (role === 'admin') {
      const adminUser: User = {
        id: 'admin_1',
        email: normEmail,
        name: 'Principal Administrator',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      };
      setCurrentUser(adminUser);
      setRecentLogins((prev) => [{ email: normEmail, role: 'admin', timestamp: new Date().toISOString() }, ...prev.slice(0, 9)]);
      addLog('Admin Portal', 'User Logged In', 'Admin session established securely.', 'auth');
      showToast('Login Successful', 'Welcome back, Administrator!', 'success');
      return true;
    } else {
      // Find matching student
      let foundStudent = students.find((s) => s.email.toLowerCase() === normEmail);
      if (!foundStudent && rollNumber) {
        foundStudent = students.find((s) => s.rollNumber.toUpperCase() === rollNumber.toUpperCase());
      }

      if (foundStudent) {
        const studentUser: User = {
          id: foundStudent.id,
          email: foundStudent.email,
          name: foundStudent.name,
          role: 'student',
          avatar: foundStudent.profilePicture,
          rollNumber: foundStudent.rollNumber,
          department: foundStudent.department,
          semester: foundStudent.semester,
        };
        setCurrentUser(studentUser);
        setRecentLogins((prev) => [{ email: foundStudent!.email, role: 'student', timestamp: new Date().toISOString() }, ...prev.slice(0, 9)]);
        addLog(foundStudent.name, 'Student Logged In', `Student portal loaded for ${foundStudent.rollNumber}.`, 'auth');
        showToast('Portal Accessible', `Welcome back, ${foundStudent.name}!`, 'success');
        return true;
      } else {
        showToast('Login Failed', 'No student found with these credentials.', 'error');
        return false;
      }
    }
  };

  const logout = () => {
    if (currentUser) {
      addLog(currentUser.name, 'User Logged Out', 'Session terminated cleanly.', 'auth');
      showToast('Session Expired', 'You have been logged out successfully.', 'info');
      setCurrentUser(null);
    }
  };

  // CRUD Operations
  const addStudent = (studentData: Omit<Student, 'id' | 'grade' | 'cgpa' | 'result' | 'createdAt'>) => {
    // Prevent duplicate rolls
    const exists = students.some(
      (s) => s.rollNumber.toLowerCase() === studentData.rollNumber.toLowerCase()
    );
    if (exists) {
      showToast('Enrollment Error', `Roll Number ${studentData.rollNumber} is already occupied.`, 'error');
      return;
    }

    const { grade, cgpa, result } = calculateGradeAndGPA(studentData.marks);

    const newStudent: Student = {
      ...studentData,
      id: Math.random().toString(36).substring(2, 9),
      grade,
      cgpa,
      result,
      createdAt: new Date().toISOString(),
      historicalProgress: generateHistoricalProgress(studentData.rollNumber, studentData.semester, studentData.marks, studentData.attendance),
    };

    setStudents((prev) => [newStudent, ...prev]);
    addLog(currentUser?.name || 'System', 'Student Admitted', `Registered ${newStudent.name} (${newStudent.rollNumber}).`, 'create');
    showToast('Record Created', `${newStudent.name} is now registered in the system.`, 'success');
  };

  const updateStudent = (updated: Student) => {
    const { grade, cgpa, result } = calculateGradeAndGPA(updated.marks);
    const finalStudent: Student = {
      ...updated,
      grade,
      cgpa,
      result,
      historicalProgress: updated.historicalProgress || generateHistoricalProgress(updated.rollNumber, updated.semester, updated.marks, updated.attendance),
    };

    setStudents((prev) => prev.map((s) => (s.id === updated.id ? finalStudent : s)));
    addLog(currentUser?.name || 'System', 'Record Updated', `Modified portfolio of ${updated.name}.`, 'update');
    showToast('Portfolio Saved', `Updated academic profile of ${updated.name}.`, 'success');

    // If current user is this student, sync their session as well!
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser((prev) => prev ? {
        ...prev,
        name: finalStudent.name,
        avatar: finalStudent.profilePicture,
        email: finalStudent.email,
      } : null);
    }
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    setStudents((prev) => prev.filter((s) => s.id !== id));
    setBookmarks((prev) => prev.filter((bId) => bId !== id));
    addLog(currentUser?.name || 'System', 'Record Purged', `Deleted archive of ${student.name}.`, 'delete');
    showToast('Student Removed', `Expelled and archived portfolio of ${student.name}.`, 'warning');
  };

  const duplicateStudent = (id: string) => {
    const source = students.find((s) => s.id === id);
    if (!source) return;

    const duplicated: Student = {
      ...source,
      id: Math.random().toString(36).substring(2, 9),
      rollNumber: `${source.rollNumber}-COPY`,
      name: `${source.name} (Duplicate)`,
      email: `copy.${source.email}`,
      createdAt: new Date().toISOString(),
    };

    setStudents((prev) => [duplicated, ...prev]);
    addLog(currentUser?.name || 'System', 'Record Duplicated', `Duplicated entry for ${source.name}.`, 'create');
    showToast('Record Duplicated', `Cloned academic portfolio of ${source.name}.`, 'success');
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.includes(id);
      if (isBookmarked) {
        showToast('Favorite Removed', 'Removed student from bookmarks.', 'info');
        return prev.filter((bId) => bId !== id);
      } else {
        showToast('Favorite Added', 'Pinned student for easy monitoring.', 'success');
        return [...prev, id];
      }
    });
  };

  const submitAssignment = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'Submitted',
            submittedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    addLog(currentUser?.name || 'Student', 'Assignment Uploaded', `Turned in milestone ${assignmentId}.`, 'assignment');
    showToast('Milestone Uploaded', 'Your document has been verified and logged.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Inbox Cleared', 'All incoming alerts archived.', 'info');
  };

  const updateSchoolSettings = (newSettings: { schoolName: string; minAttendance: number; passingMarks: number }) => {
    setSchoolSettings(newSettings);
    addLog(currentUser?.name || 'System', 'Settings Altered', 'Global passing parameters modified.', 'update');
    showToast('Settings Saved', 'Global academic configurations successfully published.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        currentUser,
        login,
        logout,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        duplicateStudent,
        bookmarks,
        toggleBookmark,
        assignments,
        submitAssignment,
        exams,
        notifications,
        markNotificationRead,
        clearNotifications,
        logs,
        toasts,
        showToast,
        removeToast,
        schoolSettings,
        updateSchoolSettings,
        recentLogins,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
