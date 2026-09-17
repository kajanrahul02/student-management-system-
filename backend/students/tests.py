from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta
from .models import Student


class StudentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_student_data = {
            'student_id': 'STU001',
            'first_name': 'Alexander',
            'last_name': 'Wright',
            'email': 'alexander.wright@university.edu',
            'phone': '+1 (555) 234-5678',
            'date_of_birth': '2004-04-12',
            'gender': 'Male',
            'course': 'Computer Science',
            'department': 'School of Computing',
            'year': '2nd Year',
            'address': '124 Academic Way, Boston, MA',
            'enrollment_date': '2024-09-01',
            'status': 'Active',
        }
        self.student = Student.objects.create(**self.valid_student_data)

    def test_01_get_all_students(self):
        """Test retrieving all students."""
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_02_create_valid_student(self):
        """Test creating a new student with valid data."""
        data = {
            'student_id': 'STU002',
            'first_name': 'Beatrice',
            'last_name': 'Chen',
            'email': 'beatrice.chen@university.edu',
            'phone': '+1 (555) 345-6789',
            'date_of_birth': '2003-11-20',
            'gender': 'Female',
            'course': 'Software Engineering',
            'department': 'School of Computing',
            'year': '3rd Year',
            'address': '45 Tech Plaza, Cambridge, MA',
            'enrollment_date': '2023-09-01',
            'status': 'Active',
        }
        response = self.client.post('/api/students/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)

    def test_03_reject_duplicate_student_id(self):
        """Test rejecting a student with duplicate student_id."""
        data = self.valid_student_data.copy()
        data['email'] = 'unique.email@university.edu'
        response = self.client.post('/api/students/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('student_id', response.data)

    def test_04_reject_duplicate_email(self):
        """Test rejecting a student with duplicate email."""
        data = self.valid_student_data.copy()
        data['student_id'] = 'STU999'
        response = self.client.post('/api/students/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_05_reject_invalid_email(self):
        """Test rejecting an invalid email address."""
        data = self.valid_student_data.copy()
        data['student_id'] = 'STU999'
        data['email'] = 'invalid-email-format'
        response = self.client.post('/api/students/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_06_reject_future_date_of_birth(self):
        """Test rejecting a date of birth in the future."""
        data = self.valid_student_data.copy()
        data['student_id'] = 'STU999'
        data['email'] = 'future.dob@university.edu'
        data['date_of_birth'] = (date.today() + timedelta(days=1)).isoformat()
        response = self.client.post('/api/students/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('date_of_birth', response.data)

    def test_07_get_student_details(self):
        """Test retrieving a single student record."""
        response = self.client.get(f'/api/students/{self.student.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['student_id'], 'STU001')

    def test_08_update_student(self):
        """Test updating a student's year and status."""
        data = self.valid_student_data.copy()
        data['year'] = '3rd Year'
        data['status'] = 'Graduated'
        response = self.client.put(f'/api/students/{self.student.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.year, '3rd Year')
        self.assertEqual(self.student.status, 'Graduated')

    def test_09_delete_student(self):
        """Test deleting a student record."""
        response = self.client.delete(f'/api/students/{self.student.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Student.objects.filter(id=self.student.id).exists())

    def test_10_search_students(self):
        """Test searching students by keyword."""
        response = self.client.get('/api/students/search/?q=Alexander')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_11_filter_by_department(self):
        """Test filtering students by department."""
        response = self.client.get('/api/students/?department=School%20of%20Computing')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_12_dashboard_stats(self):
        """Test dashboard statistics aggregation."""
        response = self.client.get('/api/dashboard/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_students'], 1)
        self.assertEqual(response.data['active_students'], 1)
