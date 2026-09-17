export type Gender = 'Male' | 'Female' | 'Other';
export type YearLevel = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type StudentStatus = 'Active' | 'Inactive' | 'Graduated';

export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: Gender;
  course: string;
  department: string;
  year: YearLevel;
  address: string;
  enrollment_date: string;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export type StudentFormData = Omit<Student, 'id' | 'created_at' | 'updated_at'>;

export interface ValidationErrors {
  student_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  course?: string;
  department?: string;
  year?: string;
  address?: string;
  enrollment_date?: string;
  status?: string;
  [key: string]: string | undefined;
}

export interface DashboardStats {
  total_students: number;
  active_students: number;
  inactive_students: number;
  graduated_students: number;
  recent_students: Student[];
  by_department: Record<string, number>;
  by_course: Record<string, number>;
  by_year: Record<string, number>;
  by_status: Record<string, number>;
  by_gender: Record<string, number>;
}

export interface StudentFilterOptions {
  searchQuery?: string;
  department?: string;
  course?: string;
  year?: string;
  status?: string;
  gender?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationErrors;
}
