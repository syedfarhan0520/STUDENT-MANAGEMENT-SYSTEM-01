export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  rollNumber?: string;
  department?: string;
  semester?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  marks: number; // overall percentage marks (0-100)
  attendance: number; // overall attendance percentage (0-100)
  profilePicture: string;
  assignmentStatus: 'Pending' | 'Submitted';
  examStatus: 'Eligible' | 'Not Eligible';
  remarks: string;
  grade: string;      // Calculated automatically
  cgpa: number;       // Calculated automatically
  result: 'Pass' | 'Fail'; // Calculated automatically
  createdAt: string;
  historicalProgress?: SemesterProgress[];
}

export interface SemesterProgress {
  semester: string;
  marks: number;
  attendance: number;
  assignmentsSubmitted: number;
  assignmentsTotal: number;
}

export interface Assignment {
  id: string;
  title: string;
  department: string;
  semester: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Late';
  marksAwarded?: number;
  maxMarks: number;
  feedback?: string;
  submittedAt?: string;
}

export interface Exam {
  id: string;
  subject: string;
  department: string;
  semester: string;
  examDate: string;
  hallNumber: string;
  maxMarks: number;
  obtainedMarks?: number;
  grade?: string;
  status: 'Upcoming' | 'Completed';
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'auth' | 'assignment';
}
