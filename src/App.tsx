import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavView } from './components/Sidebar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { StudentList } from './pages/StudentList.tsx';
import { StudentForm } from './pages/StudentForm.tsx';
import { StudentDetails } from './pages/StudentDetails.tsx';
import { ConfirmDialog } from './components/ConfirmDialog.tsx';
import { NotificationToast, ToastMessage } from './components/NotificationToast.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { studentService, ApiError } from './services/studentService.ts';
import { Student, StudentFormData, DashboardStats, StudentFilterOptions, ValidationErrors } from './types.ts';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<StudentFilterOptions>({});

  // Active Student for Details / Edit
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  // Deletion Modal State
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all students and stats
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [fetchedStudents, fetchedStats] = await Promise.all([
        studentService.getStudents(),
        studentService.getDashboardStats(),
      ]);
      setStudents(fetchedStudents);
      setStats(fetchedStats);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      addToast('error', 'Unable to connect to the server. Please try again.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Add Student
  const handleCreateStudent = async (formData: StudentFormData) => {
    setIsSubmitting(true);
    setFormErrors({});
    try {
      const created = await studentService.createStudent(formData);
      addToast('success', `Student ${created.first_name} ${created.last_name} (${created.student_id}) added successfully.`);
      await loadData(false);
      setCurrentView('students');
    } catch (err: any) {
      console.error('Create student failed:', err);
      if (err instanceof ApiError && err.errors) {
        setFormErrors(err.errors);
        addToast('error', err.message || 'Validation failed. Please check the fields.');
      } else {
        addToast('error', err.message || 'Failed to save student record.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Student
  const handleUpdateStudent = async (formData: StudentFormData) => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    setFormErrors({});
    try {
      const updated = await studentService.updateStudent(selectedStudent.id, formData);
      addToast('success', `Student ${updated.first_name} ${updated.last_name} updated successfully.`);
      await loadData(false);
      setSelectedStudent(updated);
      setCurrentView('students');
    } catch (err: any) {
      console.error('Update student failed:', err);
      if (err instanceof ApiError && err.errors) {
        setFormErrors(err.errors);
        addToast('error', err.message || 'Validation failed. Please check the fields.');
      } else {
        addToast('error', err.message || 'Failed to update student.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Student Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(deleteTarget.id);
      addToast('success', `Student ${deleteTarget.first_name} ${deleteTarget.last_name} deleted successfully.`);
      setDeleteTarget(null);
      await loadData(false);
      if (currentView === 'student-details' || currentView === 'edit-student') {
        setCurrentView('students');
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      addToast('error', err.message || 'Could not delete student record.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Reset Sample Records
  const handleResetSampleRecords = async () => {
    try {
      await studentService.resetSampleData();
      addToast('info', 'Database sample records restored successfully.');
      await loadData(false);
    } catch (err: any) {
      console.error('Reset failed:', err);
      addToast('error', 'Failed to reset sample data.');
    }
  };

  // Navigation handlers
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('student-details');
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormErrors({});
    setCurrentView('edit-student');
  };

  const handleDeleteRequest = (student: Student) => {
    setDeleteTarget(student);
  };

  const handleNavigateToStudentsWithFilter = (filter?: { department?: string; course?: string; status?: string }) => {
    setActiveFilters(filter || {});
    setCurrentView('students');
  };

  const handleQuickSearch = (query: string) => {
    setActiveFilters({ searchQuery: query });
    setCurrentView('students');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'students') setActiveFilters({});
          setCurrentView(view);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetSampleRecords}
        totalStudentsCount={students.length}
      />

      {/* Main Content Area (offset by sidebar width on lg) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-200">
        {/* Top Navbar */}
        <Navbar
          currentView={currentView}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={(view) => {
            if (view === 'add-student') setFormErrors({});
            setCurrentView(view);
          }}
          onQuickSearch={handleQuickSearch}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              stats={stats}
              isLoading={isLoading}
              onRefresh={() => loadData(true)}
              onViewStudent={handleViewStudent}
              onEditStudent={handleEditStudent}
              onNavigateToStudents={handleNavigateToStudentsWithFilter}
              onNavigateToAddStudent={() => {
                setFormErrors({});
                setCurrentView('add-student');
              }}
            />
          )}

          {currentView === 'students' && (
            <StudentList
              students={students}
              isLoading={isLoading}
              onRefresh={() => loadData(true)}
              onViewStudent={handleViewStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteRequest}
              onNavigateToAddStudent={() => {
                setFormErrors({});
                setCurrentView('add-student');
              }}
              initialFilters={activeFilters}
            />
          )}

          {currentView === 'add-student' && (
            <StudentForm
              mode="add"
              existingStudents={students}
              onSubmit={handleCreateStudent}
              onCancel={() => setCurrentView('students')}
              isSubmitting={isSubmitting}
              serverErrors={formErrors}
            />
          )}

          {currentView === 'edit-student' && selectedStudent && (
            <StudentForm
              mode="edit"
              initialStudent={selectedStudent}
              existingStudents={students}
              onSubmit={handleUpdateStudent}
              onCancel={() => setCurrentView('students')}
              isSubmitting={isSubmitting}
              serverErrors={formErrors}
            />
          )}

          {currentView === 'student-details' && selectedStudent && (
            <StudentDetails
              student={selectedStudent}
              onBack={() => setCurrentView('students')}
              onEdit={handleEditStudent}
              onDelete={handleDeleteRequest}
            />
          )}
        </main>
      </div>

      {/* Confirmation Dialog for Deletions */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Student Record"
        message="Are you sure you want to delete this student from the academic directory?"
        studentName={deleteTarget ? `${deleteTarget.first_name} ${deleteTarget.last_name}` : undefined}
        studentId={deleteTarget?.student_id}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* About & Docs Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetSampleRecords}
        students={students}
      />

      {/* Toast Notification Container */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
