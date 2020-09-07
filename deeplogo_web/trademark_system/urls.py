from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.index, name='trademark'),
    path('image_search/', include('image_search.urls')),
    path('vienna_search/', include('vienna_search.urls')),
]
