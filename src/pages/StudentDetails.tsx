import React from 'react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  GraduationCap,
  User,
  ShieldAlert
} from 'lucide-react';
import { Student } from '../types.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';

interface StudentDetailsProps {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentDetails: React.FC<StudentDetailsProps> = ({
  student,
  onBack,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (isoStr: string) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="student-details-page" className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="student-details-back-btn"
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to student directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {student.first_name} {student.last_name}
              </h1>
              <StatusBadge status={student.status} />
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
              <span>ID: {student.student_id}</span>
              <span>•</span>
              <span>Enrolled: {formatDate(student.enrollment_date)}</span>
            </div>
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            id="student-details-edit-btn"
            onClick={() => onEdit(student)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Edit className="w-4 h-4 text-slate-500" />
            <span>Edit Record</span>
          </button>
          <button
            id="student-details-delete-btn"
            onClick={() => onDelete(student)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-extrabold text-white backdrop-blur-md shadow-inner">
          {student.first_name[0]}
          {student.last_name[0]}
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
            {student.department}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">{student.course}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-blue-100/80 pt-1">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-300" />
              {student.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-300" />
              {student.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-300" />
              {student.phone}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Detail Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Personal Information */}
        <div id="details-section-personal" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>

          <dl className="space-y-3.5 text-xs md:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Full Name</dt>
              <dd className="font-semibold text-slate-900 text-right">
                {student.first_name} {student.last_name}
              </dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Student ID Number</dt>
              <dd className="font-mono font-bold text-blue-700 text-right">{student.student_id}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Gender</dt>
              <dd className="font-semibold text-slate-900 text-right">{student.gender}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Date of Birth</dt>
              <dd className="font-semibold text-slate-900 text-right">
                {formatDate(student.date_of_birth)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Section 2: Contact Information */}
        <div id="details-section-contact" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Contact Information</h3>
          </div>

          <dl className="space-y-3.5 text-xs md:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Email Address</dt>
              <dd className="font-semibold text-slate-900 text-right select-all">{student.email}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Phone Number</dt>
              <dd className="font-mono font-semibold text-slate-900 text-right">{student.phone}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Residential Address</dt>
              <dd className="font-semibold text-slate-800 text-right max-w-[240px] leading-snug">
                {student.address}
              </dd>
            </div>
          </dl>
        </div>

        {/* Section 3: Academic Information */}
        <div id="details-section-academic" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Academic Information</h3>
          </div>

          <dl className="space-y-3.5 text-xs md:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Department / Faculty</dt>
              <dd className="font-semibold text-slate-900 text-right">{student.department}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Degree Course</dt>
              <dd className="font-semibold text-slate-900 text-right">{student.course}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Academic Level</dt>
              <dd className="font-semibold text-slate-900 text-right">{student.year}</dd>
            </div>
          </dl>
        </div>

        {/* Section 4: Enrollment & Audit Logs */}
        <div id="details-section-enrollment" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Enrollment Information</h3>
          </div>

          <dl className="space-y-3.5 text-xs md:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Enrollment Date</dt>
              <dd className="font-semibold text-slate-900 text-right">
                {formatDate(student.enrollment_date)}
              </dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Current Status</dt>
              <dd className="text-right">
                <StatusBadge status={student.status} />
              </dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Record Created</dt>
              <dd className="font-mono text-xs text-slate-600 text-right">
                {formatTimestamp(student.created_at)}
              </dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Last Modified</dt>
              <dd className="font-mono text-xs text-slate-600 text-right">
                {formatTimestamp(student.updated_at)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
