import express, { Request, Response } from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getAllStudents,
  getStudentById,
  getStudentByStudentId,
  getStudentByEmail,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
  resetDatabase
} from './server/db.ts';

// Initialize DB schema & seed data
initDatabase();

function validateStudentData(data: any, isUpdate = false, currentId?: number) {
  const errors: Record<string, string> = {};

  // Student ID
  if (!data.student_id || typeof data.student_id !== 'string' || data.student_id.trim() === '') {
    if (!isUpdate || data.student_id !== undefined) {
      errors.student_id = 'Student ID is required.';
    }
  } else {
    const trimmedId = data.student_id.trim();
    if (!/^[A-Za-z0-9_-]{3,20}$/.test(trimmedId)) {
      errors.student_id = 'Student ID must be 3-20 alphanumeric characters (e.g., STU001).';
    } else {
      const existing = getStudentByStudentId(trimmedId, currentId);
      if (existing) {
        errors.student_id = 'Student ID already exists.';
      }
    }
  }

  // First Name
  if (!data.first_name || typeof data.first_name !== 'string' || data.first_name.trim() === '') {
    if (!isUpdate || data.first_name !== undefined) {
      errors.first_name = 'First name is required.';
    }
  } else if (!/^[A-Za-z\s'-]{2,50}$/.test(data.first_name.trim())) {
    errors.first_name = 'First name must contain text characters only.';
  }

  // Last Name
  if (!data.last_name || typeof data.last_name !== 'string' || data.last_name.trim() === '') {
    if (!isUpdate || data.last_name !== undefined) {
      errors.last_name = 'Last name is required.';
    }
  } else if (!/^[A-Za-z\s'-]{2,50}$/.test(data.last_name.trim())) {
    errors.last_name = 'Last name must contain text characters only.';
  }

  // Email
  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    if (!isUpdate || data.email !== undefined) {
      errors.email = 'Email address is required.';
    }
  } else {
    const trimmedEmail = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    } else {
      const existingEmail = getStudentByEmail(trimmedEmail, currentId);
      if (existingEmail) {
        errors.email = 'Email address already exists in records.';
      }
    }
  }

  // Phone
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim() === '') {
    if (!isUpdate || data.phone !== undefined) {
      errors.phone = 'Phone number is required.';
    }
  } else {
    const trimmedPhone = data.phone.trim();
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      errors.phone = 'Phone number must contain between 7 and 15 digits.';
    } else if (!/^[\d\s+\-().]{7,25}$/.test(trimmedPhone)) {
      errors.phone = 'Please enter a valid phone number format.';
    }
  }

  // Date of Birth
  if (!data.date_of_birth || typeof data.date_of_birth !== 'string' || data.date_of_birth.trim() === '') {
    if (!isUpdate || data.date_of_birth !== undefined) {
      errors.date_of_birth = 'Date of birth is required.';
    }
  } else {
    const dob = new Date(data.date_of_birth);
    if (isNaN(dob.getTime())) {
      errors.date_of_birth = 'Please enter a valid date of birth.';
    } else {
      const today = new Date();
      if (dob >= today) {
        errors.date_of_birth = 'Date of birth must be in the past.';
      }
    }
  }

  // Gender
  const validGenders = ['Male', 'Female', 'Other'];
  if (!data.gender || !validGenders.includes(data.gender)) {
    if (!isUpdate || data.gender !== undefined) {
      errors.gender = 'Please select a valid gender (Male, Female, or Other).';
    }
  }

  // Course
  if (!data.course || typeof data.course !== 'string' || data.course.trim() === '') {
    if (!isUpdate || data.course !== undefined) {
      errors.course = 'Course is required.';
    }
  }

  // Department
  if (!data.department || typeof data.department !== 'string' || data.department.trim() === '') {
    if (!isUpdate || data.department !== undefined) {
      errors.department = 'Department is required.';
    }
  }

  // Year
  const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  if (!data.year || !validYears.includes(data.year)) {
    if (!isUpdate || data.year !== undefined) {
      errors.year = 'Please select a valid academic year (1st, 2nd, 3rd, or 4th Year).';
    }
  }

  // Address
  if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
    if (!isUpdate || data.address !== undefined) {
      errors.address = 'Residential address is required.';
    }
  }

  // Enrollment Date
  if (!data.enrollment_date || typeof data.enrollment_date !== 'string' || data.enrollment_date.trim() === '') {
    if (!isUpdate || data.enrollment_date !== undefined) {
      errors.enrollment_date = 'Enrollment date is required.';
    }
  } else {
    const enDate = new Date(data.enrollment_date);
    if (isNaN(enDate.getTime())) {
      errors.enrollment_date = 'Please enter a valid enrollment date.';
    }
  }

  // Status (optional, defaults to Active)
  if (data.status) {
    const validStatuses = ['Active', 'Inactive', 'Graduated'];
    if (!validStatuses.includes(data.status)) {
      errors.status = 'Status must be Active, Inactive, or Graduated.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser & URL-encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS middleware for API access
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // REST API: Search endpoint (before /:id)
  app.get(['/api/students/search', '/api/students/search/'], (req: Request, res: Response) => {
    try {
      const q = req.query.q as string || '';
      const students = getAllStudents({ q });
      return res.status(200).json(students);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to search students', details: err.message });
    }
  });

  // REST API: Dashboard Stats endpoint
  app.get(['/api/dashboard/stats', '/api/dashboard/stats/', '/api/stats', '/api/stats/'], (req: Request, res: Response) => {
    try {
      const stats = getStats();
      return res.status(200).json(stats);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve statistics', details: err.message });
    }
  });

  // REST API: Reset Sample Data
  app.post(['/api/students/reset-sample', '/api/students/reset-sample/'], (req: Request, res: Response) => {
    try {
      resetDatabase();
      const stats = getStats();
      return res.status(200).json({ message: 'Sample data reset successfully', stats });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to reset data', details: err.message });
    }
  });

  // REST API: Get All Students with filters
  app.get(['/api/students', '/api/students/'], (req: Request, res: Response) => {
    try {
      const { q, search, department, course, year, status, gender } = req.query;
      const students = getAllStudents({
        q: (q || search) as string,
        department: department as string,
        course: course as string,
        year: year as string,
        status: status as string,
        gender: gender as string
      });
      return res.status(200).json(students);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch students', details: err.message });
    }
  });

  // REST API: Create New Student (POST /api/students/)
  app.post(['/api/students', '/api/students/'], (req: Request, res: Response) => {
    try {
      const validation = validateStudentData(req.body, false);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const newStudent = createStudent({
        student_id: req.body.student_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth,
        gender: req.body.gender,
        course: req.body.course,
        department: req.body.department,
        year: req.body.year,
        address: req.body.address,
        enrollment_date: req.body.enrollment_date,
        status: req.body.status || 'Active'
      });

      return res.status(201).json(newStudent);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create student', details: err.message });
    }
  });

  // REST API: Get Single Student (GET /api/students/:id/)
  app.get(['/api/students/:id', '/api/students/:id/'], (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid student ID' });
      }

      const student = getStudentById(id);
      if (!student) {
        return res.status(404).json({ error: `Student with ID ${id} not found.` });
      }

      return res.status(200).json(student);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch student', details: err.message });
    }
  });

  // REST API: Update Student (PUT /api/students/:id/)
  app.put(['/api/students/:id', '/api/students/:id/'], (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid student ID' });
      }

      const existing = getStudentById(id);
      if (!existing) {
        return res.status(404).json({ error: `Student with ID ${id} does not exist.` });
      }

      const validation = validateStudentData(req.body, true, id);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const updated = updateStudent(id, req.body);
      return res.status(200).json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update student', details: err.message });
    }
  });

  // REST API: Partially Update Student (PATCH /api/students/:id/)
  app.patch(['/api/students/:id', '/api/students/:id/'], (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid student ID' });
      }

      const existing = getStudentById(id);
      if (!existing) {
        return res.status(404).json({ error: `Student with ID ${id} does not exist.` });
      }

      const mergedData = { ...existing, ...req.body };
      const validation = validateStudentData(mergedData, true, id);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const updated = updateStudent(id, req.body);
      return res.status(200).json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to patch student', details: err.message });
    }
  });

  // REST API: Delete Student (DELETE /api/students/:id/)
  app.delete(['/api/students/:id', '/api/students/:id/'], (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid student ID' });
      }

      const existing = getStudentById(id);
      if (!existing) {
        return res.status(404).json({ error: `Student with ID ${id} not found.` });
      }

      const deleted = deleteStudent(id);
      if (deleted) {
        return res.status(200).json({ message: 'Student deleted successfully.' });
      } else {
        return res.status(500).json({ error: 'Could not delete student record.' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete student', details: err.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Student Management System API' });
  });

  // Vite Middleware for development vs production static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Management System running on http://localhost:${PORT}`);
  });
}

startServer();
