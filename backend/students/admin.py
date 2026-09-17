from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'student_id',
        'first_name',
        'last_name',
        'email',
        'department',
        'course',
        'year',
        'status',
        'enrollment_date',
    )
    list_filter = ('department', 'course', 'year', 'status', 'gender')
    search_fields = ('student_id', 'first_name', 'last_name', 'email', 'course')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-id',)
