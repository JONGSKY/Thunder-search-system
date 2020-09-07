from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='vienna_search'),
    path('predict_code', views.predict_code, name='predict_code'),
    # path('wordcloud', views.wordcloud_search, name='wordcloud'),
    # path('text_result', views.text_result, name='text_result'),
    # path('clustering_map', views.clustering_map, name='clustering_map'),
    # path('change_data_table', views.change_data_table, name='change_data_table'),
]
