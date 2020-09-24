from django.urls import path

from . import views

urlpatterns = [
    path('', views.patent_search, name='patent_search'),
    path('result', views.patent_search_result, name='patent_search_result'),
]