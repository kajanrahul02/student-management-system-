import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Building2,
  BookOpen,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Clock,
  Eye,
  Edit,
  TrendingUp
} from 'lucide-react';
import { DashboardStats, Student } from '../types.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';

interface DashboardProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onRefresh: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onNavigateToStudents: (filter?: { department?: string; course?: string; status?: string }) => void;
  onNavigateToAddStudent: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  isLoading,
  onRefresh,
  onViewStudent,
  onEditStudent,
  onNavigateToStudents,
  onNavigateToAddStudent,
}) => {
  if (isLoading && !stats) {
    return <LoadingSpinner message="Calculating dashboard statistics..." size="lg" />;
  }

  const total = stats?.total_students || 0;
  const active = stats?.active_students || 0;
  const inactive = stats?.inactive_students || 0;
  const graduated = stats?.graduated_students || 0;

  const departmentEntries = stats ? Object.entries(stats.by_department).sort((a, b) => Number(b[1]) - Number(a[1])) : [];
  const courseEntries = stats ? Object.entries(stats.by_course).sort((a, b) => Number(b[1]) - Number(a[1])) : [];

  return (
    <div id="dashboard-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-sm mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Live Academic Management
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Student Management System
          </h1>
          <p className="mt-2 text-sm md:text-base text-blue-100/90 leading-relaxed">
            Manage students, courses, and academic information efficiently. Track real-time admissions, departmental distributions, and student statuses.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-banner-add-btn"
              onClick={onNavigateToAddStudent}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 font-semibold text-xs md:text-sm hover:bg-blue-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Enroll New Student
            </button>
            <button
              id="dashboard-banner-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-medium text-xs md:text-sm border border-blue-400/30 backdrop-blur-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Sync Statistics
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          id="stat-card-total"
          onClick={() => onNavigateToStudents()}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500">enrolled total</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
            <span>View all directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Active Students */}
        <div
          id="stat-card-active"
          onClick={() => onNavigateToStudents({ status: 'Active' })}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-400/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{active}</span>
            <span className="text-xs text-emerald-600 font-semibold">
              {total > 0 ? `${Math.round((active / total) * 100)}% of total` : '0%'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-medium">
            <span>Filter active status</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Inactive Students */}
        <div
          id="stat-card-inactive"
          onClick={() => onNavigateToStudents({ status: 'Inactive' })}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Inactive Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{inactive}</span>
            <span className="text-xs text-amber-600 font-semibold">
              {total > 0 ? `${Math.round((inactive / total) * 100)}% on leave` : '0%'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-medium">
            <span>Filter inactive status</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Graduated Students */}
        <div
          id="stat-card-graduated"
          onClick={() => onNavigateToStudents({ status: 'Graduated' })}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-400/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Graduated Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{graduated}</span>
            <span className="text-xs text-indigo-600 font-semibold">Alumni completed</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
            <span>Filter alumni status</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two-Column Analytics: Departments & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Department */}
        <div id="dashboard-departments-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Students by Department</h3>
                <p className="text-xs text-slate-500">Distribution across academic faculties</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 font-mono">
              {departmentEntries.length} departments
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {departmentEntries.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No departmental records found.</p>
            ) : (
              departmentEntries.map(([dept, count]) => {
                const numericCount = Number(count);
                const percentage = total > 0 ? Math.round((numericCount / total) * 100) : 0;
                return (
                  <div
                    key={dept}
                    onClick={() => onNavigateToStudents({ department: dept })}
                    className="group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                        {dept}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{numericCount}</span>
                        <span className="text-slate-400 font-mono">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 group-hover:bg-blue-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Students by Course */}
        <div id="dashboard-courses-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Students by Course</h3>
                <p className="text-xs text-slate-500">Breakdown across registered degrees</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 font-mono">
              {courseEntries.length} courses
            </span>
          </div>

          <div className="mt-4 space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
            {courseEntries.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No course records found.</p>
            ) : (
              courseEntries.map(([course, count]) => {
                const numericCount = Number(count);
                const percentage = total > 0 ? Math.round((numericCount / total) * 100) : 0;
                return (
                  <div
                    key={course}
                    onClick={() => onNavigateToStudents({ course })}
                    className="group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {course}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{numericCount}</span>
                        <span className="text-slate-400 font-mono">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500 group-hover:bg-indigo-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Students Section */}
      <div id="dashboard-recent-students-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Students</h3>
              <p className="text-xs text-slate-500">Latest enrolled academic candidates</p>
            </div>
          </div>
          <button
            id="dashboard-view-all-students-btn"
            onClick={() => onNavigateToStudents()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View All Students</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          {(!stats?.recent_students || stats.recent_students.length === 0) ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No recent student records available.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Course & Dept</th>
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {stats.recent_students.map((student) => (
                  <tr
                    key={student.id}
                    id={`recent-student-row-${student.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-xs text-blue-700">
                      {student.student_id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {student.first_name} {student.last_name}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {student.email}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="font-medium text-slate-800 block text-xs">
                        {student.course}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {student.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-medium text-slate-600">
                      {student.year}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          id={`recent-view-btn-${student.id}`}
                          onClick={() => onViewStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View student profile"
                          aria-label={`View details of ${student.first_name} ${student.last_name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`recent-edit-btn-${student.id}`}
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit student profile"
                          aria-label={`Edit ${student.first_name} ${student.last_name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
