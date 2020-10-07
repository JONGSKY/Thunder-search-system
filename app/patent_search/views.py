from django.shortcuts import render
from django.views.generic  import ListView
from elasticsearch_dsl.query import Q
from .documents import PatentDocument, PatentEmbeddingDocument, PatentNgramDocument
from django.core.paginator import Paginator
# Create your views here.

def patent_search(request):
    return render(request, 'patent_search/patent_search.html')


def patent_search_result(request):
    search_input = request.GET.get('search_name', "") 
    
    patent_list = PatentDocument.search().filter('match', abstract=search_input)
    
    paginator = Paginator(list(patent_list), 8)
    page = int(request.GET.get('page', 1))
    patent_list = paginator.get_page(page)

    page_numbers_range = 5
    
    max_index = len(paginator.page_range)
    current_page = page
    start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
    end_index = start_index + page_numbers_range
    
    if end_index >= max_index:
        end_index = max_index
    paginator_range = paginator.page_range[start_index:end_index]

    search_result = {'search_name' : search_input,
                     'patent_list' : patent_list,
                     'page' : page,
                     'paginator_range' : paginator_range
                     }
    
    return render(request, 'patent_search/patent_search_result.html', search_result)

