from django.shortcuts import render
from .documents import PatentDocument
from django.core.paginator import Paginator
from django.contrib import messages
from patent_search.models import Patentsview
from django.db.models import Q
import json

with open('patent_word.txt') as word_file:
    word_data = json.load(word_file)
    search_auto_complete = word_data['patent_word']

def patent_search(request):

    result = {'search_auto_complete' : search_auto_complete}
    
    return render(request, 'patent_search/patent_search.html', result)


def patent_search_result(request):
    search_input = request.GET.get('search_name', "")
    
    ##patent = list(PatentDocument.search().filter('match', abstract=search_input))
    patent = Patentsview.objects.filter(Q(abstract__contains=search_input)).order_by('-date')

    if len(patent) != 0:

        paginator = Paginator(patent, 8)
        
        page = request.GET.get('page', 1)
        
        patent_list = paginator.page(page)
        
        page_numbers_range = 9
        
        max_index = len(paginator.page_range)
        current_page = int(page)
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        
        if end_index >= max_index:
                end_index = max_index
        
        paginator_range = paginator.page_range[start_index:end_index]

        search_result = {'search_auto_complete' : search_auto_complete,
                        'search_name' : search_input,
                        'patent_list' : patent_list,
                        'paginator_range' : paginator_range,
                        'page' : page,
                        'current_page' : current_page,
                        'start_index' : start_index,
                        }
        
        return render(request, 'patent_search/patent_search_result.html', search_result)

    else:
        search_result = {'search_auto_complete' : search_auto_complete,
                        'search_name' : search_input,
                        }
        return render(request, 'patent_search/patent_search_none_result.html', search_result)