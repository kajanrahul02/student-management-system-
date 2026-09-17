from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Count
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Students:
    - GET /api/students/ (supports search and filters)
    - POST /api/students/ (create with validation)
    - GET /api/students/<id>/ (retrieve)
    - PUT /api/students/<id>/ (update)
    - DELETE /api/students/<id>/ (destroy)
    """
    queryset = Student.objects.all().order_by('-id')
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Search param
        search = self.request.query_params.get('search') or self.request.query_params.get('q')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(student_id__icontains=search) |
                Q(email__icontains=search) |
                Q(course__icontains=search) |
                Q(department__icontains=search)
            )

        # Filters
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department=department)

        course = self.request.query_params.get('course')
        if course:
            queryset = queryset.filter(course=course)

        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(year=year)

        status_val = self.request.query_params.get('status')
        if status_val:
            queryset = queryset.filter(status=status_val)

        gender = self.request.query_params.get('gender')
        if gender:
            queryset = queryset.filter(gender=gender)

        return queryset


@api_view(['GET'])
def search_students(request):
    """
    GET /api/students/search/?q=<query>
    Direct search endpoint matching SOP Section 20.
    """
    query = request.query_params.get('q', '').strip()
    if not query:
        students = Student.objects.all().order_by('-id')
    else:
        students = Student.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(student_id__icontains=query) |
            Q(email__icontains=query) |
            Q(course__icontains=query) |
            Q(department__icontains=query)
        ).order_by('-id')

    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def dashboard_stats(request):
    """
    GET /api/dashboard/stats/
    Aggregates student metrics for the administrative dashboard.
    """
    total = Student.objects.count()
    active = Student.objects.filter(status='Active').count()
    inactive = Student.objects.filter(status='Inactive').count()
    graduated = Student.objects.filter(status='Graduated').count()

    # Breakdown queries
    dept_qs = Student.objects.values('department').annotate(count=Count('id'))
    by_department = {item['department']: item['count'] for item in dept_qs}

    course_qs = Student.objects.values('course').annotate(count=Count('id'))
    by_course = {item['course']: item['count'] for item in course_qs}

    year_qs = Student.objects.values('year').annotate(count=Count('id'))
    by_year = {item['year']: item['count'] for item in year_qs}

    status_qs = Student.objects.values('status').annotate(count=Count('id'))
    by_status = {'Active': 0, 'Inactive': 0, 'Graduated': 0}
    for item in status_qs:
        by_status[item['status']] = item['count']

    gender_qs = Student.objects.values('gender').annotate(count=Count('id'))
    by_gender = {'Male': 0, 'Female': 0, 'Other': 0}
    for item in gender_qs:
        by_gender[item['gender']] = item['count']

    recent_students = Student.objects.all().order_by('-id')[:5]
    recent_data = StudentSerializer(recent_students, many=True).data

    return Response({
        'total_students': total,
        'active_students': active,
        'inactive_students': inactive,
        'graduated_students': graduated,
        'recent_students': recent_data,
        'by_department': by_department,
        'by_course': by_course,
        'by_year': by_year,
        'by_status': by_status,
        'by_gender': by_gender,
    })
