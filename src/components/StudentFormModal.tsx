import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Save, AlertCircle, ShieldAlert } from 'lucide-react';
import { Student } from '../types';
import { useApp } from '../context/AppContext';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStudentId?: string | null;
}

const DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Business Administration',
];

const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const SECTIONS = ['A', 'B', 'C', 'D'];

const GENDERS = ['Male', 'Female', 'Other'];

const PROFILE_PICTURE_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, editStudentId }) => {
  const { students, addStudent, updateStudent, showToast } = useApp();

  const isEditMode = !!editStudentId;

  // Form states
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [section, setSection] = useState(SECTIONS[0]);
  const [gender, setGender] = useState<Student['gender']>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [marks, setMarks] = useState<number | ''>('');
  const [attendance, setAttendance] = useState<number | ''>('');
  const [profilePicture, setProfilePicture] = useState(PROFILE_PICTURE_PRESETS[0]);
  const [customPicUrl, setCustomPicUrl] = useState('');
  const [useCustomPic, setUseCustomPic] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState<Student['assignmentStatus']>('Pending');
  const [examStatus, setExamStatus] = useState<Student['examStatus']>('Eligible');
  const [remarks, setRemarks] = useState('');

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load existing student if editing
  useEffect(() => {
    if (isEditMode && editStudentId && isOpen) {
      const student = students.find((s) => s.id === editStudentId);
      if (student) {
        setRollNumber(student.rollNumber);
        setName(student.name);
        setEmail(student.email);
        setPhone(student.phone);
        setDepartment(student.department);
        setSemester(student.semester);
        setSection(student.section);
        setGender(student.gender);
        setDateOfBirth(student.dateOfBirth);
        setMarks(student.marks);
        setAttendance(student.attendance);
        setAssignmentStatus(student.assignmentStatus);
        setExamStatus(student.examStatus);
        setRemarks(student.remarks);

        if (PROFILE_PICTURE_PRESETS.includes(student.profilePicture)) {
          setProfilePicture(student.profilePicture);
          setUseCustomPic(false);
        } else {
          setCustomPicUrl(student.profilePicture);
          setUseCustomPic(true);
        }
      }
    } else if (isOpen) {
      // Reset form for fresh creation
      setRollNumber('');
      setName('');
      setEmail('');
      setPhone('');
      setDepartment(DEPARTMENTS[0]);
      setSemester(SEMESTERS[0]);
      setSection(SECTIONS[0]);
      setGender('Male');
      setDateOfBirth('2005-01-01');
      setMarks('');
      setAttendance('');
      setProfilePicture(PROFILE_PICTURE_PRESETS[Math.floor(Math.random() * PROFILE_PICTURE_PRESETS.length)]);
      setCustomPicUrl('');
      setUseCustomPic(false);
      setAssignmentStatus('Pending');
      setExamStatus('Eligible');
      setRemarks('');
      setErrors({});
    }
  }, [isEditMode, editStudentId, isOpen, students]);

  // Real-time validations
  const validateField = (field: string, value: string) => {
    const tempErrors = { ...errors };

    switch (field) {
      case 'rollNumber':
        if (!value.trim()) {
          tempErrors.rollNumber = 'Roll number is required';
        } else {
          // Check uniqueness (except current editing student)
          const isDup = students.some(
            (s) => s.rollNumber.toLowerCase() === value.trim().toLowerCase() && s.id !== editStudentId
          );
          if (isDup) {
            tempErrors.rollNumber = 'This Roll Number is already registered';
          } else {
            delete tempErrors.rollNumber;
          }
        }
        break;

      case 'name':
        const nameVal = value.trim();
        if (!nameVal) {
          tempErrors.name = 'Full name is required';
        } else if (/[0-9]/.test(nameVal)) {
          tempErrors.name = 'Name cannot contain numbers';
        } else if (/[!@#$%^&*(),.?":{}|<>]/.test(nameVal)) {
          tempErrors.name = 'Name cannot contain special symbols';
        } else if (nameVal.length < 3) {
          tempErrors.name = 'Minimum 3 characters required';
        } else if (nameVal.length > 40) {
          tempErrors.name = 'Maximum 40 characters permitted';
        } else {
          delete tempErrors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          tempErrors.email = 'Email address is required';
        } else if (!emailRegex.test(value)) {
          tempErrors.email = 'Please provide a valid email structure';
        } else {
          delete tempErrors.email;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          tempErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value)) {
          tempErrors.phone = 'Must be exactly 10 numeric digits';
        } else {
          delete tempErrors.phone;
        }
        break;

      case 'marks':
        const m = Number(value);
        if (value === '') {
          tempErrors.marks = 'Marks are required';
        } else if (isNaN(m) || m < 0 || m > 100) {
          tempErrors.marks = 'Marks must stand between 0 and 100';
        } else {
          delete tempErrors.marks;
        }
        break;

      case 'attendance':
        const att = Number(value);
        if (value === '') {
          tempErrors.attendance = 'Attendance is required';
        } else if (isNaN(att) || att < 0 || att > 100) {
          tempErrors.attendance = 'Attendance percentage must stand between 0 and 100';
        } else {
          delete tempErrors.attendance;
        }
        break;

      default:
        break;
    }

    setErrors(tempErrors);
  };

  const isFormValid = () => {
    // Check if any error values exist
    if (Object.keys(errors).length > 0) return false;

    // Check required values are not empty
    if (!rollNumber.trim() || !name.trim() || !email.trim() || !phone.trim() || !dateOfBirth) return false;
    if (marks === '' || attendance === '') return false;

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      showToast('Form Invalid', 'Please rectify current errors before submission.', 'error');
      return;
    }

    const finalPic = useCustomPic ? (customPicUrl.trim() || PROFILE_PICTURE_PRESETS[0]) : profilePicture;

    const body = {
      rollNumber: rollNumber.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department,
      semester,
      section,
      gender,
      dateOfBirth,
      marks: Number(marks),
      attendance: Number(attendance),
      profilePicture: finalPic,
      assignmentStatus,
      examStatus,
      remarks: remarks.trim() || 'Awaiting advisor review.',
    };

    if (isEditMode && editStudentId) {
      const existing = students.find((s) => s.id === editStudentId);
      if (existing) {
        updateStudent({
          ...existing,
          ...body,
        });
      }
    } else {
      addStudent(body);
    }

    onClose();
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

          {/* Form Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-slate-800 border-solid flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/20 border-b border-slate-200/40 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                    {isEditMode ? 'Modify Student Portfolio' : 'Enlist New Student'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {isEditMode ? 'Alter credentials and grades' : 'Complete academic profile fields'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Profile Image Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                  Primary Profile Representation
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src={useCustomPic ? (customPicUrl || PROFILE_PICTURE_PRESETS[0]) : profilePicture}
                    alt="Active Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PROFILE_PICTURE_PRESETS[0];
                    }}
                  />
                  <div className="flex-grow flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setUseCustomPic(false)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border border-solid cursor-pointer ${
                          !useCustomPic
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-800'
                        }`}
                      >
                        Avatar Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseCustomPic(true)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border border-solid cursor-pointer ${
                          useCustomPic
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-800'
                        }`}
                      >
                        External URL
                      </button>
                    </div>

                    {!useCustomPic ? (
                      <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-md">
                        {PROFILE_PICTURE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProfilePicture(preset)}
                            className={`relative flex-shrink-0 w-8.5 h-8.5 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                              profilePicture === preset ? 'border-pink-500 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/student-picture.jpg"
                        value={customPicUrl}
                        onChange={(e) => setCustomPicUrl(e.target.value)}
                        className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Grid 2x2 for basic details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Roll Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>Roll Number *</span>
                    {errors.rollNumber && <span className="text-rose-500 text-[10px] lowercase font-semibold">{errors.rollNumber}</span>}
                  </label>
                  <input
                    type="text"
                    disabled={isEditMode}
                    placeholder="E.G. CS-2023-01"
                    value={rollNumber}
                    onChange={(e) => {
                      setRollNumber(e.target.value);
                      validateField('rollNumber', e.target.value);
                    }}
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border border-solid font-mono uppercase bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.rollNumber
                        ? 'border-rose-500/40 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30'
                    } ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>Full Student Name *</span>
                    {errors.name && <span className="text-rose-500 text-[10px] lowercase font-semibold">{errors.name}</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="Sarah Connor"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateField('name', e.target.value);
                    }}
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border border-solid bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-rose-500/40 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30'
                    }`}
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>Email Address *</span>
                    {errors.email && <span className="text-rose-500 text-[10px] lowercase font-semibold">{errors.email}</span>}
                  </label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField('email', e.target.value);
                    }}
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border border-solid bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-rose-500/40 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30'
                    }`}
                  />
                </div>

                {/* Phone number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>10-Digit Mobile *</span>
                    {errors.phone && <span className="text-rose-500 text-[10px] lowercase font-semibold">{errors.phone}</span>}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, '');
                      setPhone(num);
                      validateField('phone', num);
                    }}
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border border-solid bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-rose-500/40 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30'
                    }`}
                  />
                </div>
              </div>

              {/* Grid 3-column academic setup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept, idx) => (
                      <option key={idx} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                  >
                    {SE_SEMESTER_OPTIONS_RENDER()}
                  </select>
                </div>

                {/* Section */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                  >
                    {SECTIONS.map((sec, idx) => (
                      <option key={idx} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Gender Identity</label>
                  <div className="flex gap-2">
                    {GENDERS.map((g, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGender(g as Student['gender'])}
                        className={`flex-grow text-xs font-bold py-2.5 px-3 rounded-xl border border-solid cursor-pointer transition-all ${
                          gender === g
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/15'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-900/60'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              {/* Performance / Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-500/10 border-solid">
                {/* Marks percentage */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex justify-between">
                    <span>Performance Marks (0-100)% *</span>
                    {errors.marks && <span className="text-rose-500 text-[10px] lowercase font-semibold">{errors.marks}</span>}
                  </label>
                  <input
                    type="number"
                    placeholder="85"
                    value={marks}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : Number(e.target.value);
                      setMarks(v);
                      validateField('marks', String(v));
                    }}
                    className={`w-full text-sm font-mono font-bold px-4 py-2.5 rounded-xl border border-solid bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.marks
                        ? 'border-rose-500/40 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30'
                    }`}
                  />
                </div>

                {/* Attendance */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex justify-between">
                    <span>Attendance Rate (0-100)% *</span>
                    {errors.attendance && <span className="text-rose-500 text-[10px] lowercase font-semibold">{errors.attendance}</span>}
                  </label>
                  <input
                    type="number"
                    placeholder="90"
                    value={attendance}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : Number(e.target.value);
                      setAttendance(v);
                      validateField('attendance', String(v));
                    }}
                    className={`w-full text-sm font-mono font-bold px-4 py-2.5 rounded-xl border border-solid bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.attendance
                        ? 'border-rose-500/40 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30'
                    }`}
                  />
                </div>

                {/* Sub Assignment State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Pending Assignment</label>
                  <div className="flex gap-2">
                    {['Pending', 'Submitted'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setAssignmentStatus(status as Student['assignmentStatus'])}
                        className={`flex-grow text-xs font-bold py-2 px-3 rounded-xl border border-solid cursor-pointer transition-all ${
                          assignmentStatus === status
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500'
                            : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exam eligibility */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Exam Eligibility</label>
                  <div className="flex gap-2">
                    {['Eligible', 'Not Eligible'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setExamStatus(status as Student['examStatus'])}
                        className={`flex-grow text-xs font-bold py-2 px-3 rounded-xl border border-solid cursor-pointer transition-all ${
                          examStatus === status
                            ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-violet-500'
                            : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Academic Remarks / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Advisor's behavioral notes and strategic milestones..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-solid border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </form>

            {/* Footer with actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/40 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {!isFormValid() ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Provide all required fields cleanly</span>
                  </>
                ) : (
                  <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Verified structure ready
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-solid border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-md cursor-pointer ${
                    isFormValid()
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.02] shadow-indigo-500/10'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Apply Updates' : 'Publish Scholar'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  function SE_SEMESTER_OPTIONS_RENDER() {
    return SEMESTERS.map((sem, idx) => (
      <option key={idx} value={sem}>
        {sem}
      </option>
    ));
  }
};
