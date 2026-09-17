# Student Management System

A professional, full-stack web application designed for academic administration. It provides complete CRUD operations, real-time client & server validation, dynamic multi-criteria search and filtering, interactive dashboard statistics, and persistent SQLite storage.

---

## 1. System Architecture

```
                      ┌─────────────────────────┐
                      │   Client Web Browser    │
                      └────────────┬────────────┘
                                   │ HTTP / JSON
                                   ▼
                      ┌─────────────────────────┐
                      │  React 18 SPA Frontend  │
                      │ (Tailwind CSS, Lucide)  │
                      └────────────┬────────────┘
                                   │ REST API Calls
                                   ▼
                      ┌─────────────────────────┐
                      │  REST API Service Layer │
                      │ (/api/students, /stats) │
                      └────────────┬────────────┘
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │                  Backend Server                     │
         │  Integrated: Express.js (Node.js runtime)          │
         │  Exportable: Django 5 + Django REST Framework (DRF) │
         └─────────────────────────┬───────────────────────────┘
                                   │ SQL Transactions
                                   ▼
                      ┌─────────────────────────┐
                      │  SQLite Database Engine │
                      │      (students.db)      │
                      └─────────────────────────┘
```

---

## 2. Features

- **Dashboard Analytics**:
  - Live counts of total students, active students, inactive students, and graduated alumni.
  - Interactive distribution bars by academic department and degree program.
  - Recent enrollment activity feed with direct profile access.
- **Student Directory**:
  - Live multi-field keyword search across name, student ID, email, and course.
  - Department, Academic Year, and Status filter dropdowns.
  - Responsive tabular list with status badges and quick action controls.
  - Pagination with configurable rows per page (5, 10, 25, 50).
  - Export filtered student directory to CSV spreadsheet.
- **Student Enrollment & Management**:
  - Add new student with structured 3-stage form layout (Personal, Contact, Academic).
  - Pre-filled Edit form with duplicate ID and email prevention.
  - Read-only card profile view with audit timestamps (`created_at`, `updated_at`).
  - Safe deletion dialog with confirmation modal.
- **Dual-Layer Validation**:
  - **Frontend**: Real-time feedback beside each form control on blur and submit.
  - **Backend**: Strict validation rules for required fields, email syntax, phone length (7–15 digits), past date-of-birth, and database uniqueness.
- **Academic Demo Tools**:
  - One-click sample dataset restoration (8 pre-configured academic records).
  - Full JSON backup export for data portability.
  - Interactive "Project Overview" modal documenting REST endpoints and demonstration sequence.

---

## 3. Database Schema

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique auto-generated record ID |
| `student_id` | TEXT / VARCHAR(20) | UNIQUE, NOT NULL | Alphanumeric student ID (e.g. `STU001`) |
| `first_name` | TEXT / VARCHAR(50) | NOT NULL | Student's legal first name |
| `last_name` | TEXT / VARCHAR(50) | NOT NULL | Student's legal last name |
| `email` | TEXT / VARCHAR(100) | UNIQUE, NOT NULL | Valid university email address |
| `phone` | TEXT / VARCHAR(25) | NOT NULL | Contact telephone (7–15 digits) |
| `date_of_birth` | TEXT / DATE | NOT NULL | Date of birth (must be in past) |
| `gender` | TEXT / VARCHAR(10) | NOT NULL | `Male`, `Female`, or `Other` |
| `course` | TEXT / VARCHAR(100) | NOT NULL | Degree course of study |
| `department` | TEXT / VARCHAR(100) | NOT NULL | Faculty / Academic Department |
| `year` | TEXT / VARCHAR(15) | NOT NULL | `1st Year`, `2nd Year`, `3rd Year`, `4th Year` |
| `address` | TEXT | NOT NULL | Physical residential address |
| `enrollment_date` | TEXT / DATE | NOT NULL | Date student registered at the institution |
| `status` | TEXT / VARCHAR(15) | NOT NULL | `Active`, `Inactive`, or `Graduated` |
| `created_at` | TEXT / DATETIME | NOT NULL | ISO-8601 creation timestamp |
| `updated_at` | TEXT / DATETIME | NOT NULL | ISO-8601 last update timestamp |

---

## 4. REST API Documentation

### Base URL: `/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students/` | List all students; supports `?search=`, `?department=`, `?course=`, `?year=`, `?status=`, `?gender=` |
| `GET` | `/api/students/:id/` | Retrieve a single student's complete record |
| `POST` | `/api/students/` | Create a new student record (requires JSON body) |
| `PUT` | `/api/students/:id/` | Update an existing student record |
| `DELETE` | `/api/students/:id/` | Permanently remove a student record |
| `GET` | `/api/students/search/?q=` | Search students matching a keyword query |
| `GET` | `/api/dashboard/stats/` | Aggregated dashboard counts and distributions |
| `POST` | `/api/database/reset/` | Restore 8 default demo students |

### Sample POST / PUT Request Payload:
```json
{
  "student_id": "STU009",
  "first_name": "Lucas",
  "last_name": "Moreno",
  "email": "lucas.moreno@university.edu",
  "phone": "+1 (555) 345-6789",
  "date_of_birth": "2004-03-21",
  "gender": "Male",
  "course": "Computer Science",
  "department": "School of Computing",
  "year": "2nd Year",
  "address": "404 Campus Crest, Cambridge",
  "enrollment_date": "2024-09-01",
  "status": "Active"
}
```

### Sample Validation Error Response (HTTP 400):
```json
{
  "message": "Validation failed",
  "errors": {
    "student_id": "Student ID already exists.",
    "email": "Please enter a valid email address."
  }
}
```

---

## 5. Demonstration Walkthrough (SOP Section 37)

1. **Dashboard Overview**: Start on the Dashboard to view total student count, active enrollments, and departmental breakdowns.
2. **Browse Student Directory**: Click **Students** in the sidebar to review the paginated table populated via `GET /api/students/`.
3. **Register New Student**: Click **Add Student**. Try submitting empty to observe inline validation. Fill in required details and click **Save Student** (`POST /api/students/`).
4. **Search & Filter**: Type the new student's name in the search bar or filter by department to confirm instant filtering.
5. **Inspect Student Profile**: Click **View** to inspect the 4-quadrant profile card displaying personal, contact, academic, and audit data.
6. **Edit Record**: Click **Edit Record** to modify their year or status and save (`PUT /api/students/:id/`).
7. **Delete Record**: Click **Delete** and confirm the safety modal (`DELETE /api/students/:id/`). Notice the dashboard statistics decrement in real time.

---

## 6. Standalone Django REST Framework Setup

If running the Python backend independently:

```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```

Run test suite:
```bash
python manage.py test
```
