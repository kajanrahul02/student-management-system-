import { Student, StudentFormData, DashboardStats, StudentFilterOptions } from '../types.ts';

const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = (typeof data === 'object' && data?.message) ||
      (typeof data === 'object' && data?.error) ||
      `Request failed with status ${response.status}`;
    const fieldErrors = (typeof data === 'object' && data?.errors) || undefined;
    throw new ApiError(errorMessage, response.status, fieldErrors);
  }

  return data as T;
}

export const studentService = {
  /**
   * Fetch all students with optional filters and search
   */
  async getStudents(filters?: StudentFilterOptions): Promise<Student[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.searchQuery) params.append('q', filters.searchQuery);
      if (filters.department && filters.department !== 'All') params.append('department', filters.department);
      if (filters.course && filters.course !== 'All') params.append('course', filters.course);
      if (filters.year && filters.year !== 'All') params.append('year', filters.year);
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.gender && filters.gender !== 'All') params.append('gender', filters.gender);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/students/${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<Student[]>(response);
  },

  /**
   * Search students by query
   */
  async searchStudents(query: string): Promise<Student[]> {
    const encoded = encodeURIComponent(query);
    const response = await fetch(`${API_BASE_URL}/students/search/?q=${encoded}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<Student[]>(response);
  },

  /**
   * Get single student by primary key ID
   */
  async getStudent(id: number | string): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<Student>(response);
  },

  /**
   * Create a new student (POST /api/students/)
   */
  async createStudent(studentData: StudentFormData): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse<Student>(response);
  },

  /**
   * Update student (PUT /api/students/:id/)
   */
  async updateStudent(id: number | string, studentData: Partial<StudentFormData>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse<Student>(response);
  },

  /**
   * Partially update student (PATCH /api/students/:id/)
   */
  async patchStudent(id: number | string, studentData: Partial<StudentFormData>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse<Student>(response);
  },

  /**
   * Delete student (DELETE /api/students/:id/)
   */
  async deleteStudent(id: number | string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Get dynamic dashboard stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<DashboardStats>(response);
  },

  /**
   * Reset to sample student records for demonstration
   */
  async resetSampleData(): Promise<{ message: string; stats: DashboardStats }> {
    const response = await fetch(`${API_BASE_URL}/students/reset-sample/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<{ message: string; stats: DashboardStats }>(response);
  }
};
