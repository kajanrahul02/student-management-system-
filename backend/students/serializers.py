from rest_framework import serializers
from .models import Student
from datetime import date
import re


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id',
            'student_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'date_of_birth',
            'gender',
            'course',
            'department',
            'year',
            'address',
            'enrollment_date',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_student_id(self, value):
        trimmed = value.strip().upper()
        if not re.match(r'^[A-Za-z0-9_-]{3,20}$', trimmed):
            raise serializers.ValidationError('Student ID must be 3-20 alphanumeric characters (e.g., STU001).')
        
        # Check duplicate if new or changing
        instance = self.instance
        qs = Student.objects.filter(student_id__iexact=trimmed)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Student ID already exists.')
        return trimmed

    def validate_email(self, value):
        trimmed = value.strip().lower()
        instance = self.instance
        qs = Student.objects.filter(email__iexact=trimmed)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Email address already exists in student records.')
        return trimmed

    def validate_date_of_birth(self, value):
        if value >= date.today():
            raise serializers.ValidationError('Date of birth must be in the past.')
        return value

    def validate_phone(self, value):
        digits = re.sub(r'\D', '', value)
        if len(digits) < 7 or len(digits) > 15:
            raise serializers.ValidationError('Phone number must contain between 7 and 15 digits.')
        return value.strip()
