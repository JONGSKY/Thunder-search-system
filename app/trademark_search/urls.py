from django.urls import path
from . import views

urlpatterns = [
    path('logo_search', views.logo_search, name='logo_search'),
    path('vienna_search', views.vienna_search, name='vienna_search'),
    path('image_upload', views.image_upload, name='image_upload'),
    path('predict_code', views.predict_code, name='predict_code'),
]