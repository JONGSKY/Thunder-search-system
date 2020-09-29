from django.urls import path
from . import views

urlpatterns = [
    path('logo_search/', views.logo_search, name='logo_search'),
    path('vienna_search/', views.vienna_search, name='vienna_search'),
    path('logo_search/result', views.logo_search_result, name='logo_search_result'),
    path('vienna_search/result', views.vienna_search_result, name='vienna_search_result')
]