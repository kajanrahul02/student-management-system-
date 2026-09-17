import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Save,
  ArrowLeft,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Building2,
  BookOpen,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, StudentFormData, ValidationErrors } from '../types.ts';
import { DEPARTMENTS, COURSES, ACADEMIC_YEARS, GENDERS, STATUSES } from '../utils/constants.ts';

interface StudentFormProps {
  mode: 'add' | 'edit';
  initialStudent?: Student | null;
  existingStudents: Student[];
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  serverErrors?: ValidationErrors;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  mode,
  initialStudent,
  existingStudents,
  onSubmit,
  onCancel,
  isSubmitting,
  serverErrors,
}) => {
  // Form State
  const [formData, setFormData] = useState<StudentFormData>({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    course: COURSES[0],
    department: DEPARTMENTS[0],
    year: '1st Year',
    address: '',
    enrollment_date: new Date().toISOString().slice(0, 10),
    status: 'Active',
  });

  // Client Validation Errors State
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate data in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialStudent) {
      setFormData({
        student_id: initialStudent.student_id,
        first_name: initialStudent.first_name,
        last_name: initialStudent.last_name,
        email: initialStudent.email,
        phone: initialStudent.phone,
        date_of_birth: initialStudent.date_of_birth,
        gender: initialStudent.gender,
        course: initialStudent.course,
        department: initialStudent.department,
        year: initialStudent.year,
        address: initialStudent.address,
        enrollment_date: initialStudent.enrollment_date,
        status: initialStudent.status,
      });
    }
  }, [mode, initialStudent]);

  // Merge server errors if any arrive
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  const validateField = (name: keyof StudentFormData, value: any): string | undefined => {
    switch (name) {
      case 'student_id':
        if (!value || !value.trim()) return 'Student ID is required.';
        if (!/^[A-Za-z0-9_-]{3,20}$/.test(value.trim())) {
          return 'Student ID must be 3-20 alphanumeric characters (e.g. STU001).';
        }
        // Duplicate check against existing list
        const dupId = existingStudents.find(
          (s) =>
            s.student_id.toLowerCase() === value.trim().toLowerCase() &&
            (mode === 'add' || s.id !== initialStudent?.id)
        );
        if (dupId) return 'Student ID already exists.';
        return undefined;

      case 'first_name':
        if (!value || !value.trim()) return 'First name is required.';
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return 'First name must contain text characters only.';
        }
        return undefined;

      case 'last_name':
        if (!value || !value.trim()) return 'Last name is required.';
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return 'Last name must contain text characters only.';
        }
        return undefined;

      case 'email':
        if (!value || !value.trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        const dupEmail = existingStudents.find(
          (s) =>
            s.email.toLowerCase() === value.trim().toLowerCase() &&
            (mode === 'add' || s.id !== initialStudent?.id)
        );
        if (dupEmail) return 'Email address already exists.';
        return undefined;

      case 'phone': {
        if (!value || !value.trim()) return 'Phone number is required.';
        const trimmedPhone = value.trim();
        const digits = trimmedPhone.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
          return 'Phone number must contain between 7 and 15 digits.';
        }
        if (!/^[\d\s+\-().]{7,25}$/.test(trimmedPhone)) {
          return 'Please enter a valid phone number.';
        }
        return undefined;
      }

      case 'date_of_birth':
        if (!value) return 'Date of birth is required.';
        const dob = new Date(value);
        if (isNaN(dob.getTime())) return 'Please select a valid date.';
        if (dob >= new Date()) return 'Date of birth must be in the past.';
        return undefined;

      case 'enrollment_date':
        if (!value) return 'Enrollment date is required.';
        const enDate = new Date(value);
        if (isNaN(enDate.getTime())) return 'Please select a valid enrollment date.';
        return undefined;

      case 'address':
        if (!value || !value.trim()) return 'Residential address is required.';
        return undefined;

      case 'course':
        if (!value || !value.trim()) return 'Course is required.';
        return undefined;

      case 'department':
        if (!value || !value.trim()) return 'Department is required.';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Instant validation for touched field
    if (touched[name]) {
      const fieldError = validateField(name as keyof StudentFormData, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name as keyof StudentFormData, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all touched
    const allTouched: Record<string, boolean> = {};
    const newErrors: ValidationErrors = {};

    (Object.keys(formData) as (keyof StudentFormData)[]).forEach((key) => {
      allTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setTouched(allTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first errored field
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`student-input-${firstErrorKey}`);
      if (element) {
        element.focus();
      }
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div id="student-form-container" className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            id="student-form-back-btn"
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to student directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {mode === 'add' ? 'Enroll New Student' : `Edit Student Record (${formData.student_id})`}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {mode === 'add'
                ? 'Fill out all required academic and personal details to register a new student.'
                : 'Modify academic profile and contact information.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-rose-500 font-semibold">* Required fields</span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Section 1: Identification & Personal Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Legal name, identification, and demographics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Student ID */}
            <div>
              <label htmlFor="student-input-student_id" className="block text-xs font-bold text-slate-700 mb-1.5">
                Student ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="student-input-student_id"
                  name="student_id"
                  type="text"
                  value={formData.student_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. STU001"
                  disabled={mode === 'edit'}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl font-mono uppercase bg-slate-50 border transition-all ${
                    errors.student_id && touched.student_id
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                  } ${mode === 'edit' ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
              {errors.student_id && touched.student_id && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.student_id}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="student-input-first_name" className="block text-xs font-bold text-slate-700 mb-1.5">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-input-first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Alexander"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.first_name && touched.first_name
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.first_name && touched.first_name && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.first_name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="student-input-last_name" className="block text-xs font-bold text-slate-700 mb-1.5">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-input-last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Wright"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.last_name && touched.last_name
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.last_name && touched.last_name && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.last_name}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="student-input-date_of_birth" className="block text-xs font-bold text-slate-700 mb-1.5">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-input-date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().slice(0, 10)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.date_of_birth && touched.date_of_birth
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.date_of_birth && touched.date_of_birth && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="student-input-gender" className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id="student-input-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Contact Information</h2>
              <p className="text-xs text-slate-500">Official communication channels and residence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label htmlFor="student-input-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-input-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="student@university.edu"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.email && touched.email
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.email && touched.email && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="student-input-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-input-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.phone && touched.phone
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="student-input-address" className="block text-xs font-bold text-slate-700 mb-1.5">
                Residential Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="student-input-address"
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Street address, city, state, zip code..."
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.address && touched.address
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.address && touched.address && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Academic & Enrollment Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic & Enrollment Status</h2>
              <p className="text-xs text-slate-500">Degree program, faculty, year level, and active status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Department */}
            <div>
              <label htmlFor="student-input-department" className="block text-xs font-bold text-slate-700 mb-1.5">
                Department / Faculty <span className="text-rose-500">*</span>
              </label>
              <select
                id="student-input-department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label htmlFor="student-input-course" className="block text-xs font-bold text-slate-700 mb-1.5">
                Degree Course <span className="text-rose-500">*</span>
              </label>
              <select
                id="student-input-course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Level */}
            <div>
              <label htmlFor="student-input-year" className="block text-xs font-bold text-slate-700 mb-1.5">
                Academic Year <span className="text-rose-500">*</span>
              </label>
              <select
                id="student-input-year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Enrollment Date */}
            <div>
              <label htmlFor="student-input-enrollment_date" className="block text-xs font-bold text-slate-700 mb-1.5">
                Enrollment Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-input-enrollment_date"
                name="enrollment_date"
                type="date"
                value={formData.enrollment_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border transition-all ${
                  errors.enrollment_date && touched.enrollment_date
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
              />
              {errors.enrollment_date && touched.enrollment_date && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.enrollment_date}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="student-input-status" className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Status
              </label>
              <select
                id="student-input-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="student-form-cancel-btn"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="student-form-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs shadow-blue-500/30 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
