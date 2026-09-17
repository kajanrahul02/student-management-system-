import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Student, StudentFilterOptions } from '../types.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { DEPARTMENTS, COURSES, ACADEMIC_YEARS, GENDERS, STATUSES } from '../utils/constants.ts';

interface StudentListProps {
  students: Student[];
  isLoading: boolean;
  onRefresh: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onNavigateToAddStudent: () => void;
  initialFilters?: StudentFilterOptions;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  isLoading,
  onRefresh,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onNavigateToAddStudent,
  initialFilters,
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || '');
  const [selectedDepartment, setSelectedDepartment] = useState(initialFilters?.department || 'All');
  const [selectedCourse, setSelectedCourse] = useState(initialFilters?.course || 'All');
  const [selectedYear, setSelectedYear] = useState(initialFilters?.year || 'All');
  const [selectedStatus, setSelectedStatus] = useState(initialFilters?.status || 'All');
  const [selectedGender, setSelectedGender] = useState(initialFilters?.gender || 'All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter students in memory (client-side dynamic responsive filtering of synced backend data)
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search matching across multiple fields
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const matchesQuery =
          student.student_id.toLowerCase().includes(query) ||
          fullName.includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.course.toLowerCase().includes(query) ||
          student.department.toLowerCase().includes(query) ||
          student.phone.toLowerCase().includes(query);

        if (!matchesQuery) return false;
      }

      // Department filter
      if (selectedDepartment !== 'All' && student.department !== selectedDepartment) {
        return false;
      }

      // Course filter
      if (selectedCourse !== 'All' && student.course !== selectedCourse) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'All' && student.year !== selectedYear) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && student.status !== selectedStatus) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'All' && student.gender !== selectedGender) {
        return false;
      }

      return true;
    });
  }, [students, searchQuery, selectedDepartment, selectedCourse, selectedYear, selectedStatus, selectedGender]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, selectedCourse, selectedYear, selectedStatus, selectedGender]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const isFiltered =
    Boolean(searchQuery) ||
    selectedDepartment !== 'All' ||
    selectedCourse !== 'All' ||
    selectedYear !== 'All' ||
    selectedStatus !== 'All' ||
    selectedGender !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedCourse('All');
    setSelectedYear('All');
    setSelectedStatus('All');
    setSelectedGender('All');
  };

  // Export filtered students to CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      'Student ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Gender',
      'Course',
      'Department',
      'Year',
      'Status',
      'Enrollment Date',
      'Address',
    ];

    const rows = filteredStudents.map((s) => [
      s.student_id,
      `"${s.first_name}"`,
      `"${s.last_name}"`,
      s.email,
      `"${s.phone}"`,
      s.date_of_birth,
      s.gender,
      `"${s.course}"`,
      `"${s.department}"`,
      s.year,
      s.status,
      s.enrollment_date,
      `"${s.address.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="student-list-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Student Directory</h1>
            <span
              id="student-count-badge"
              className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
            >
              {filteredStudents.length} {filteredStudents.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Search, filter, view details, update, or remove student profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="student-list-refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
            title="Refresh from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            id="student-list-export-csv-btn"
            onClick={handleExportCSV}
            disabled={filteredStudents.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            id="student-list-add-student-btn"
            onClick={onNavigateToAddStudent}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div id="student-filter-panel" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="student-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, email, department, or course..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Department Filter */}
          <div>
            <label htmlFor="filter-department" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              id="filter-department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label htmlFor="filter-course" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Course
            </label>
            <select
              id="filter-course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="All">All Courses</option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label htmlFor="filter-year" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Year Level
            </label>
            <select
              id="filter-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="All">All Years</option>
              {ACADEMIC_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="filter-status" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label htmlFor="filter-gender" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              id="filter-gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="All">All Genders</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Clear Button */}
        {isFiltered && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters active:</span>
              {selectedDepartment !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                  Dept: {selectedDepartment}
                </span>
              )}
              {selectedCourse !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                  Course: {selectedCourse}
                </span>
              )}
              {selectedYear !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                  {selectedYear}
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                  {selectedStatus}
                </span>
              )}
            </div>
            <button
              id="student-clear-filters-btn"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Student Records Table */}
      <div
        id="student-records-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        {isLoading && students.length === 0 ? (
          <LoadingSpinner message="Fetching students from REST API..." size="lg" />
        ) : filteredStudents.length === 0 ? (
          /* Empty State */
          <div id="students-empty-state" className="py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No students found</h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              {isFiltered
                ? 'No student records match your active search and filter criteria. Try adjusting or clearing your filters.'
                : 'There are currently no students registered in the database. Add your first student to get started.'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {isFiltered ? (
                <button
                  id="empty-state-clear-filters-btn"
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Reset All Filters
                </button>
              ) : (
                <button
                  id="empty-state-add-student-btn"
                  onClick={onNavigateToAddStudent}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Enroll First Student
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table id="student-table" className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student ID</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Course & Department</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedStudents.map((student) => (
                    <tr
                      key={student.id}
                      id={`student-row-${student.id}`}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Student ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-blue-700">
                        {student.student_id}
                      </td>

                      {/* Name & Gender */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {student.first_name} {student.last_name}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Gender: {student.gender}
                        </span>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-slate-800 font-medium truncate max-w-[180px]">
                          {student.email}
                        </div>
                        <div className="text-slate-400 font-mono mt-0.5">
                          {student.phone}
                        </div>
                      </td>

                      {/* Course & Department */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {student.course}
                        </div>
                        <div className="text-slate-400 truncate max-w-[200px] mt-0.5">
                          {student.department}
                        </div>
                      </td>

                      {/* Year */}
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                        {student.year}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={student.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            id={`student-action-view-${student.id}`}
                            onClick={() => onViewStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View student profile"
                            aria-label={`View details of ${student.first_name} ${student.last_name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`student-action-edit-${student.id}`}
                            onClick={() => onEditStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit student profile"
                            aria-label={`Edit ${student.first_name} ${student.last_name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`student-action-delete-${student.id}`}
                            onClick={() => onDeleteStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete student record"
                            aria-label={`Delete ${student.first_name} ${student.last_name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div
              id="student-table-pagination"
              className="px-4 py-3 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500"
            >
              <div>
                Showing{' '}
                <span className="font-bold text-slate-800">
                  {Math.min((currentPage - 1) * pageSize + 1, filteredStudents.length)}
                </span>{' '}
                to{' '}
                <span className="font-bold text-slate-800">
                  {Math.min(currentPage * pageSize, filteredStudents.length)}
                </span>{' '}
                of <span className="font-bold text-slate-800">{filteredStudents.length}</span> students
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    id="pagination-prev-btn"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      id={`pagination-page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    id="pagination-next-btn"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
