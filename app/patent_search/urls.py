from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='patent_search_home'),
    path('result', views.search_action, name='search'),
]