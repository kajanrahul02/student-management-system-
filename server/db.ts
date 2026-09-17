import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'students.db');
export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      course TEXT NOT NULL,
      department TEXT NOT NULL,
      year TEXT NOT NULL,
      address TEXT NOT NULL,
      enrollment_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
    CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
    CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
    CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
  `);

  // Check if database has records
  const countRow = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
  if (countRow.count === 0) {
    seedSampleData();
  }
}

export const SAMPLE_STUDENTS = [
  {
    student_id: 'STU001',
    first_name: 'Alexander',
    last_name: 'Wright',
    email: 'alexander.wright@university.edu',
    phone: '+1 (555) 234-5678',
    date_of_birth: '2003-04-15',
    gender: 'Male',
    course: 'Computer Science',
    department: 'School of Computing',
    year: '3rd Year',
    address: '742 Evergreen Terrace, Springfield',
    enrollment_date: '2023-09-01',
    status: 'Active'
  },
  {
    student_id: 'STU002',
    first_name: 'Sophia',
    last_name: 'Martinez',
    email: 'sophia.martinez@university.edu',
    phone: '+1 (555) 345-6789',
    date_of_birth: '2004-08-22',
    gender: 'Female',
    course: 'Mechanical Engineering',
    department: 'School of Engineering',
    year: '2nd Year',
    address: '1204 Elm Street, Boston',
    enrollment_date: '2024-09-01',
    status: 'Active'
  },
  {
    student_id: 'STU003',
    first_name: 'Marcus',
    last_name: 'Chen',
    email: 'marcus.chen@university.edu',
    phone: '+1 (555) 456-7890',
    date_of_birth: '2002-11-10',
    gender: 'Male',
    course: 'Business Administration',
    department: 'School of Business',
    year: '4th Year',
    address: '55 Maple Avenue, Chicago',
    enrollment_date: '2022-09-01',
    status: 'Graduated'
  },
  {
    student_id: 'STU004',
    first_name: 'Amara',
    last_name: 'Okafor',
    email: 'amara.okafor@university.edu',
    phone: '+1 (555) 567-8901',
    date_of_birth: '2005-02-18',
    gender: 'Female',
    course: 'Data Science',
    department: 'School of Computing',
    year: '1st Year',
    address: '88 Pine Road, Seattle',
    enrollment_date: '2025-09-01',
    status: 'Active'
  },
  {
    student_id: 'STU005',
    first_name: 'Jordan',
    last_name: 'Taylor',
    email: 'jordan.taylor@university.edu',
    phone: '+1 (555) 678-9012',
    date_of_birth: '2003-07-30',
    gender: 'Other',
    course: 'Electrical Engineering',
    department: 'School of Engineering',
    year: '3rd Year',
    address: '310 Oak Boulevard, Austin',
    enrollment_date: '2023-09-01',
    status: 'Inactive'
  },
  {
    student_id: 'STU006',
    first_name: 'Emily',
    last_name: 'Watson',
    email: 'emily.watson@university.edu',
    phone: '+1 (555) 789-0123',
    date_of_birth: '2001-12-05',
    gender: 'Female',
    course: 'International Relations',
    department: 'School of Humanities',
    year: '4th Year',
    address: '42 Beacon Street, San Francisco',
    enrollment_date: '2021-09-01',
    status: 'Graduated'
  },
  {
    student_id: 'STU007',
    first_name: 'David',
    last_name: 'Kim',
    email: 'david.kim@university.edu',
    phone: '+1 (555) 890-1234',
    date_of_birth: '2004-05-14',
    gender: 'Male',
    course: 'Software Engineering',
    department: 'School of Computing',
    year: '2nd Year',
    address: '915 Sunset Way, Denver',
    enrollment_date: '2024-09-01',
    status: 'Active'
  },
  {
    student_id: 'STU008',
    first_name: 'Priya',
    last_name: 'Patel',
    email: 'priya.patel@university.edu',
    phone: '+1 (555) 901-2345',
    date_of_birth: '2005-09-28',
    gender: 'Female',
    course: 'Finance & Economics',
    department: 'School of Business',
    year: '1st Year',
    address: '620 Riverfront Drive, Atlanta',
    enrollment_date: '2025-09-01',
    status: 'Active'
  }
];

export function seedSampleData() {
  const insertStmt = db.prepare(`
    INSERT INTO students (
      student_id, first_name, last_name, email, phone, date_of_birth,
      gender, course, department, year, address, enrollment_date,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  for (const s of SAMPLE_STUDENTS) {
    insertStmt.run(
      s.student_id,
      s.first_name,
      s.last_name,
      s.email,
      s.phone,
      s.date_of_birth,
      s.gender,
      s.course,
      s.department,
      s.year,
      s.address,
      s.enrollment_date,
      s.status,
      now,
      now
    );
  }
}

export function resetDatabase() {
  db.exec('DELETE FROM students;');
  seedSampleData();
}

export interface StudentRecord {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  course: string;
  department: string;
  year: string;
  address: string;
  enrollment_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function getAllStudents(filters?: {
  q?: string;
  department?: string;
  course?: string;
  year?: string;
  status?: string;
  gender?: string;
}): StudentRecord[] {
  let query = 'SELECT * FROM students WHERE 1=1';
  const params: string[] = [];

  if (filters?.q && filters.q.trim() !== '') {
    const term = `%${filters.q.trim().toLowerCase()}%`;
    query += ` AND (
      LOWER(student_id) LIKE ? OR
      LOWER(first_name) LIKE ? OR
      LOWER(last_name) LIKE ? OR
      LOWER(email) LIKE ? OR
      LOWER(course) LIKE ? OR
      LOWER(department) LIKE ?
    )`;
    params.push(term, term, term, term, term, term);
  }

  if (filters?.department && filters.department !== 'All') {
    query += ' AND department = ?';
    params.push(filters.department);
  }

  if (filters?.course && filters.course !== 'All') {
    query += ' AND course = ?';
    params.push(filters.course);
  }

  if (filters?.year && filters.year !== 'All') {
    query += ' AND year = ?';
    params.push(filters.year);
  }

  if (filters?.status && filters.status !== 'All') {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters?.gender && filters.gender !== 'All') {
    query += ' AND gender = ?';
    params.push(filters.gender);
  }

  query += ' ORDER BY id DESC';

  const stmt = db.prepare(query);
  return (stmt.all(...params) as unknown) as StudentRecord[];
}

export function getStudentById(id: number): StudentRecord | null {
  const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
  const student = (stmt.get(id) as unknown) as StudentRecord | undefined;
  return student || null;
}

export function getStudentByStudentId(studentId: string, excludeId?: number): StudentRecord | null {
  let query = 'SELECT * FROM students WHERE LOWER(student_id) = LOWER(?)';
  const params: (string | number)[] = [studentId.trim()];
  if (excludeId !== undefined) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  const stmt = db.prepare(query);
  const student = (stmt.get(...params) as unknown) as StudentRecord | undefined;
  return student || null;
}

export function getStudentByEmail(email: string, excludeId?: number): StudentRecord | null {
  let query = 'SELECT * FROM students WHERE LOWER(email) = LOWER(?)';
  const params: (string | number)[] = [email.trim()];
  if (excludeId !== undefined) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  const stmt = db.prepare(query);
  const student = (stmt.get(...params) as unknown) as StudentRecord | undefined;
  return student || null;
}

export function createStudent(data: Omit<StudentRecord, 'id' | 'created_at' | 'updated_at'>): StudentRecord {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO students (
      student_id, first_name, last_name, email, phone, date_of_birth,
      gender, course, department, year, address, enrollment_date,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.student_id.trim().toUpperCase(),
    data.first_name.trim(),
    data.last_name.trim(),
    data.email.trim().toLowerCase(),
    data.phone.trim(),
    data.date_of_birth.trim(),
    data.gender,
    data.course.trim(),
    data.department.trim(),
    data.year,
    data.address.trim(),
    data.enrollment_date.trim(),
    data.status || 'Active',
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return getStudentById(newId)!;
}

export function updateStudent(id: number, data: Partial<Omit<StudentRecord, 'id' | 'created_at'>>): StudentRecord | null {
  const existing = getStudentById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated = {
    student_id: data.student_id !== undefined ? data.student_id.trim().toUpperCase() : existing.student_id,
    first_name: data.first_name !== undefined ? data.first_name.trim() : existing.first_name,
    last_name: data.last_name !== undefined ? data.last_name.trim() : existing.last_name,
    email: data.email !== undefined ? data.email.trim().toLowerCase() : existing.email,
    phone: data.phone !== undefined ? data.phone.trim() : existing.phone,
    date_of_birth: data.date_of_birth !== undefined ? data.date_of_birth.trim() : existing.date_of_birth,
    gender: data.gender !== undefined ? data.gender : existing.gender,
    course: data.course !== undefined ? data.course.trim() : existing.course,
    department: data.department !== undefined ? data.department.trim() : existing.department,
    year: data.year !== undefined ? data.year : existing.year,
    address: data.address !== undefined ? data.address.trim() : existing.address,
    enrollment_date: data.enrollment_date !== undefined ? data.enrollment_date.trim() : existing.enrollment_date,
    status: data.status !== undefined ? data.status : existing.status,
    updated_at: now
  };

  const stmt = db.prepare(`
    UPDATE students SET
      student_id = ?,
      first_name = ?,
      last_name = ?,
      email = ?,
      phone = ?,
      date_of_birth = ?,
      gender = ?,
      course = ?,
      department = ?,
      year = ?,
      address = ?,
      enrollment_date = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.student_id,
    updated.first_name,
    updated.last_name,
    updated.email,
    updated.phone,
    updated.date_of_birth,
    updated.gender,
    updated.course,
    updated.department,
    updated.year,
    updated.address,
    updated.enrollment_date,
    updated.status,
    updated.updated_at,
    id
  );

  return getStudentById(id);
}

export function deleteStudent(id: number): boolean {
  const stmt = db.prepare('DELETE FROM students WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getStats() {
  const all = getAllStudents();
  const total = all.length;
  let active = 0;
  let inactive = 0;
  let graduated = 0;

  const byDepartment: Record<string, number> = {};
  const byCourse: Record<string, number> = {};
  const byYear: Record<string, number> = {};
  const byStatus: Record<string, number> = { Active: 0, Inactive: 0, Graduated: 0 };
  const byGender: Record<string, number> = { Male: 0, Female: 0, Other: 0 };

  for (const s of all) {
    if (s.status === 'Active') active++;
    else if (s.status === 'Inactive') inactive++;
    else if (s.status === 'Graduated') graduated++;

    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    byDepartment[s.department] = (byDepartment[s.department] || 0) + 1;
    byCourse[s.course] = (byCourse[s.course] || 0) + 1;
    byYear[s.year] = (byYear[s.year] || 0) + 1;
    byGender[s.gender] = (byGender[s.gender] || 0) + 1;
  }

  const recent = all.slice(0, 5);

  return {
    total_students: total,
    active_students: active,
    inactive_students: inactive,
    graduated_students: graduated,
    recent_students: recent,
    by_department: byDepartment,
    by_course: byCourse,
    by_year: byYear,
    by_status: byStatus,
    by_gender: byGender
  };
}
