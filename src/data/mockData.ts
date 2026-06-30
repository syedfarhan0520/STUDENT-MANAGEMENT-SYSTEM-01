import { Student, Assignment, Exam, Notification, ActivityLog, SemesterProgress } from '../types';

export const generateHistoricalProgress = (
  rollNumber: string,
  currentSemesterStr: string,
  currentMarks: number,
  currentAttendance: number
): SemesterProgress[] => {
  const match = currentSemesterStr.match(/\d+/);
  const currentSemesterNum = match ? parseInt(match[0], 10) : 1;
  const progress: SemesterProgress[] = [];
  
  let seed = 0;
  for (let i = 0; i < rollNumber.length; i++) {
    seed += rollNumber.charCodeAt(i);
  }
  
  for (let sem = 1; sem <= currentSemesterNum; sem++) {
    const isCurrent = sem === currentSemesterNum;
    const semName = `Semester ${sem}`;
    
    if (isCurrent) {
      const totalAsg = Math.max(3, (seed % 3) + 3);
      const subAsg = Math.round((currentMarks / 100) * totalAsg);
      progress.push({
        semester: semName,
        marks: currentMarks,
        attendance: currentAttendance,
        assignmentsSubmitted: Math.min(totalAsg, subAsg),
        assignmentsTotal: totalAsg,
      });
    } else {
      const marksFactor = 0.88 + ((seed + sem) % 15) / 100;
      const pastMarks = Math.max(35, Math.min(100, Math.round(currentMarks * marksFactor)));
      
      const attendanceFactor = 0.94 + ((seed * sem) % 10) / 100;
      const pastAttendance = Math.max(40, Math.min(100, Math.round(currentAttendance * attendanceFactor)));
      
      const totalAsg = Math.max(3, ((seed + sem) % 3) + 3);
      const subAsg = Math.round((pastMarks / 100) * totalAsg);
      
      progress.push({
        semester: semName,
        marks: pastMarks,
        attendance: pastAttendance,
        assignmentsSubmitted: Math.min(totalAsg, subAsg),
        assignmentsTotal: totalAsg,
      });
    }
  }
  return progress;
};

export const calculateGradeAndGPA = (marks: number): { grade: string; cgpa: number; result: 'Pass' | 'Fail' } => {
  if (marks >= 90) return { grade: 'A+', cgpa: 4.0, result: 'Pass' };
  if (marks >= 80) return { grade: 'A', cgpa: 3.7, result: 'Pass' };
  if (marks >= 70) return { grade: 'B+', cgpa: 3.3, result: 'Pass' };
  if (marks >= 60) return { grade: 'B', cgpa: 3.0, result: 'Pass' };
  if (marks >= 50) return { grade: 'C', cgpa: 2.5, result: 'Pass' };
  if (marks >= 40) return { grade: 'D', cgpa: 2.0, result: 'Pass' };
  return { grade: 'Fail', cgpa: 0.0, result: 'Fail' };
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    rollNumber: 'CS-2023-01',
    name: 'Sarah Connor',
    email: 'sarah.connor@university.edu',
    phone: '9876543210',
    department: 'Computer Science',
    semester: 'Semester 5',
    section: 'A',
    gender: 'Female',
    dateOfBirth: '2004-03-12',
    marks: 94,
    attendance: 96,
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Submitted',
    examStatus: 'Eligible',
    remarks: 'Exceptional visual thinker and full-stack architecture prodigy.',
    createdAt: '2023-09-01T08:00:00Z',
    ...calculateGradeAndGPA(94),
  },
  {
    id: '2',
    rollNumber: 'CS-2023-02',
    name: 'Alex Mercer',
    email: 'alex.mercer@university.edu',
    phone: '8765432109',
    department: 'Computer Science',
    semester: 'Semester 5',
    section: 'A',
    gender: 'Male',
    dateOfBirth: '2003-08-22',
    marks: 88,
    attendance: 92,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Submitted',
    examStatus: 'Eligible',
    remarks: 'Strong analytical skills, excels in complex algorithms.',
    createdAt: '2023-09-02T10:00:00Z',
    ...calculateGradeAndGPA(88),
  },
  {
    id: '3',
    rollNumber: 'DS-2023-05',
    name: 'Aria Chen',
    email: 'aria.chen@university.edu',
    phone: '7654321098',
    department: 'Data Science',
    semester: 'Semester 3',
    section: 'B',
    gender: 'Female',
    dateOfBirth: '2005-01-15',
    marks: 78,
    attendance: 84,
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Pending',
    examStatus: 'Eligible',
    remarks: 'Great interest in deep learning models and data visualization.',
    createdAt: '2023-09-03T11:30:00Z',
    ...calculateGradeAndGPA(78),
  },
  {
    id: '4',
    rollNumber: 'EE-2023-11',
    name: 'Marcus Vance',
    email: 'marcus.vance@university.edu',
    phone: '6543210987',
    department: 'Electrical Engineering',
    semester: 'Semester 5',
    section: 'C',
    gender: 'Male',
    dateOfBirth: '2003-11-05',
    marks: 62,
    attendance: 74,
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Pending',
    examStatus: 'Eligible',
    remarks: 'Needs to focus on lab reports. Good practical skills.',
    createdAt: '2023-09-04T09:15:00Z',
    ...calculateGradeAndGPA(62),
  },
  {
    id: '5',
    rollNumber: 'BA-2023-18',
    name: 'Elena Rostova',
    email: 'elena.rostova@university.edu',
    phone: '5432109876',
    department: 'Business Administration',
    semester: 'Semester 1',
    section: 'A',
    gender: 'Female',
    dateOfBirth: '2006-05-19',
    marks: 92,
    attendance: 98,
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Submitted',
    examStatus: 'Eligible',
    remarks: 'Highly active in classroom presentations, brilliant leader.',
    createdAt: '2023-09-05T14:45:00Z',
    ...calculateGradeAndGPA(92),
  },
  {
    id: '6',
    rollNumber: 'ME-2023-24',
    name: 'Devin Patel',
    email: 'devin.patel@university.edu',
    phone: '4321098765',
    department: 'Mechanical Engineering',
    semester: 'Semester 7',
    section: 'B',
    gender: 'Male',
    dateOfBirth: '2002-12-30',
    marks: 45,
    attendance: 65,
    profilePicture: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Pending',
    examStatus: 'Not Eligible',
    remarks: 'Attendance falls below minimum requirement. Warning issued.',
    createdAt: '2023-09-06T12:00:00Z',
    ...calculateGradeAndGPA(45),
  },
  {
    id: '7',
    rollNumber: 'CS-2023-08',
    name: 'Lucas Graham',
    email: 'lucas.graham@university.edu',
    phone: '3210987654',
    department: 'Computer Science',
    semester: 'Semester 3',
    section: 'A',
    gender: 'Male',
    dateOfBirth: '2004-09-14',
    marks: 38,
    attendance: 55,
    profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Pending',
    examStatus: 'Not Eligible',
    remarks: 'Failing both attendance and course milestones. Needs major support.',
    createdAt: '2023-09-07T16:20:00Z',
    ...calculateGradeAndGPA(38),
  },
  {
    id: '8',
    rollNumber: 'DS-2023-09',
    name: 'Zoe Winters',
    email: 'zoe.winers@university.edu',
    phone: '2109876543',
    department: 'Data Science',
    semester: 'Semester 3',
    section: 'B',
    gender: 'Female',
    dateOfBirth: '2004-07-02',
    marks: 84,
    attendance: 88,
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Submitted',
    examStatus: 'Eligible',
    remarks: 'Very dedicated, always delivers analytical tasks on schedule.',
    createdAt: '2023-09-08T10:05:00Z',
    ...calculateGradeAndGPA(84),
  },
  {
    id: '9',
    rollNumber: 'ME-2023-14',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@university.edu',
    phone: '1098765432',
    department: 'Mechanical Engineering',
    semester: 'Semester 5',
    section: 'C',
    gender: 'Male',
    dateOfBirth: '2003-10-25',
    marks: 75,
    attendance: 81,
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Submitted',
    examStatus: 'Eligible',
    remarks: 'Great aptitude for material mechanics. Well disciplined.',
    createdAt: '2023-09-09T14:10:00Z',
    ...calculateGradeAndGPA(75),
  },
  {
    id: '10',
    rollNumber: 'EE-2023-04',
    name: 'Yuki Sato',
    email: 'yuki.sato@university.edu',
    phone: '1987654321',
    department: 'Electrical Engineering',
    semester: 'Semester 7',
    section: 'A',
    gender: 'Female',
    dateOfBirth: '2002-04-18',
    marks: 89,
    attendance: 94,
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    assignmentStatus: 'Submitted',
    examStatus: 'Eligible',
    remarks: 'Brilliant thesis draft. Exemplary research capabilities.',
    createdAt: '2023-09-10T09:00:00Z',
    ...calculateGradeAndGPA(89),
  }
].map((s) => ({
  ...s,
  historicalProgress: generateHistoricalProgress(s.rollNumber, s.semester, s.marks, s.attendance),
})) as Student[];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'Advanced Neural Networks & Backprop',
    department: 'Computer Science',
    semester: 'Semester 5',
    dueDate: '2026-07-05',
    status: 'Pending',
    maxMarks: 100,
  },
  {
    id: 'a2',
    title: 'Exploratory Data Analysis with Python',
    department: 'Data Science',
    semester: 'Semester 3',
    dueDate: '2026-07-02',
    status: 'Pending',
    maxMarks: 100,
  },
  {
    id: 'a3',
    title: 'High Voltage Circuit Architecture',
    department: 'Electrical Engineering',
    semester: 'Semester 5',
    dueDate: '2026-06-25',
    status: 'Submitted',
    marksAwarded: 85,
    maxMarks: 100,
    feedback: 'Excellent circuit logic and safety considerations.',
  },
  {
    id: 'a4',
    title: 'Thermodynamics Performance Simulation',
    department: 'Mechanical Engineering',
    semester: 'Semester 7',
    dueDate: '2026-06-28',
    status: 'Late',
    marksAwarded: 50,
    maxMarks: 100,
    feedback: 'Submitted 3 days late. Simulation bounds were incomplete.',
  },
  {
    id: 'a5',
    title: 'Global Supply Chain Strategy Pitch',
    department: 'Business Administration',
    semester: 'Semester 1',
    dueDate: '2026-07-10',
    status: 'Pending',
    maxMarks: 100,
  },
  {
    id: 'a6',
    title: 'Distributed Databases & Sharding',
    department: 'Computer Science',
    semester: 'Semester 5',
    dueDate: '2026-06-20',
    status: 'Submitted',
    marksAwarded: 95,
    maxMarks: 100,
    feedback: 'Phenomenal architecture document, clean diagram mapping.',
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'e1',
    subject: 'Artificial Intelligence & Deep Learning',
    department: 'Computer Science',
    semester: 'Semester 5',
    examDate: '2026-07-15T09:00:00',
    hallNumber: 'A-301 Glass Wing',
    maxMarks: 100,
    status: 'Upcoming'
  },
  {
    id: 'e2',
    subject: 'Advanced Database Systems',
    department: 'Computer Science',
    semester: 'Semester 5',
    examDate: '2026-06-18T14:00:00',
    hallNumber: 'B-105 Tech Tower',
    maxMarks: 100,
    obtainedMarks: 94,
    grade: 'A+',
    status: 'Completed'
  },
  {
    id: 'e3',
    subject: 'Predictive Modeling & Big Data',
    department: 'Data Science',
    semester: 'Semester 3',
    examDate: '2026-07-16T11:00:00',
    hallNumber: 'DS Lab 2',
    maxMarks: 100,
    status: 'Upcoming'
  },
  {
    id: 'e4',
    subject: 'Electromagnetics & Waves',
    department: 'Electrical Engineering',
    semester: 'Semester 5',
    examDate: '2026-07-18T09:00:00',
    hallNumber: 'Engineering Arena C',
    maxMarks: 100,
    status: 'Upcoming'
  },
  {
    id: 'e5',
    subject: 'Fluid Dynamics & Aerodynamics',
    department: 'Mechanical Engineering',
    semester: 'Semester 7',
    examDate: '2026-06-15T09:00:00',
    hallNumber: 'Lab-4 West Wing',
    maxMarks: 100,
    obtainedMarks: 45,
    grade: 'D',
    status: 'Completed'
  },
  {
    id: 'e6',
    subject: 'Corporate Microeconomics',
    department: 'Business Administration',
    semester: 'Semester 1',
    examDate: '2026-07-12T13:30:00',
    hallNumber: 'Auditorium Lounge',
    maxMarks: 100,
    status: 'Upcoming'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Assignment Released',
    message: 'Advanced Neural Networks (CS) is now live. Check the assignments panel.',
    type: 'info',
    timestamp: '2026-06-29T10:00:00Z',
    read: false,
  },
  {
    id: 'n2',
    title: 'Midterm Results Published',
    message: 'Advanced Database Systems results are now viewable.',
    type: 'success',
    timestamp: '2026-06-28T16:00:00Z',
    read: false,
  },
  {
    id: 'n3',
    title: 'Attendance Advisory Alert',
    message: 'Attendance warning triggered for student Devin Patel (< 75%).',
    type: 'warning',
    timestamp: '2026-06-27T09:30:00Z',
    read: true,
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'l1',
    user: 'Principal Admin',
    action: 'Student Added',
    details: 'Sarah Connor successfully admitted to CS dept.',
    timestamp: '2026-06-29T14:20:00Z',
    type: 'create',
  },
  {
    id: 'l2',
    user: 'Sarah Connor',
    action: 'Assignment Upload',
    details: 'Submitted Distributed Databases project.',
    timestamp: '2026-06-29T15:45:00Z',
    type: 'assignment',
  },
  {
    id: 'l3',
    user: 'Principal Admin',
    action: 'Grade Updated',
    details: 'Updated Devin Patel grades for thermodynamics report.',
    timestamp: '2026-06-28T11:00:00Z',
    type: 'update',
  }
];
