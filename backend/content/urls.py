from django.urls import path
from .views import GenerateContentView, ContentHistoryView, ContentDetailView, DashboardStatsView

urlpatterns = [
    path('generate/', GenerateContentView.as_view(), name='content-generate'),
    path('history/', ContentHistoryView.as_view(), name='content-history'),
    path('dashboard/', DashboardStatsView.as_view(), name='content-dashboard'),
    path('<int:pk>/', ContentDetailView.as_view(), name='content-detail'),
]
