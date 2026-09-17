from django.db import models
from django.core.validators import RegexValidator


class Student(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    YEAR_CHOICES = [
        ('1st Year', '1st Year'),
        ('2nd Year', '2nd Year'),
        ('3rd Year', '3rd Year'),
        ('4th Year', '4th Year'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Graduated', 'Graduated'),
    ]

    student_id = models.CharField(
        max_length=20,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Za-z0-9_-]{3,20}$',
                message='Student ID must be 3-20 alphanumeric characters (e.g., STU001).'
            )
        ],
        help_text='Unique university identification number.'
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(
        max_length=25,
        validators=[
            RegexValidator(
                regex=r'^[\d\s+\-().]{7,25}$',
                message='Enter a valid phone number with 7 to 15 digits.'
            )
        ]
    )
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    course = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    year = models.CharField(max_length=15, choices=YEAR_CHOICES)
    address = models.TextField()
    enrollment_date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

    def __str__(self):
        return f"{self.student_id} - {self.first_name} {self.last_name}"
