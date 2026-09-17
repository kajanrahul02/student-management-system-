from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, search_students, dashboard_stats

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('students/search/', search_students, name='student-search'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('', include(router.urls)),
]
