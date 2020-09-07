from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.index, name='image_search'),
    path('image_upload', views.image_upload, name='image_upload'),
]
