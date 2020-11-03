from django.shortcuts import render
from .documents import PatentDocument
from django.core.paginator import Paginator
from django.contrib import messages


# Create your views here.

def patent_search(request):
    return render(request, 'patent_search/patent_search.html')


def patent_search_result(request):
    search_input = request.GET.get('search_name', "")
    
    patent = list(PatentDocument.search().filter('match', abstract=search_input))
    
    if len(patent) != 0:

        paginator = Paginator(patent, 8)
        
        page = request.GET.get('page', 1)
        
        patent_list = paginator.page(page)
        
        page_numbers_range = 5
        
        max_index = len(paginator.page_range)
        current_page = int(page)
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        
        if end_index >= max_index:
                end_index = max_index
        
        paginator_range = paginator.page_range[start_index:end_index]

        search_result = {'search_name' : search_input,
                        'patent_list' : patent_list,
                        'paginator_range' : paginator_range,
                        'page' : page,
                        'current_page' : current_page,
                        'start_index' : start_index,
                        }
        
        return render(request, 'patent_search/patent_search_result.html', search_result)

    else:
        search_result = {'search_name' : search_input,
                        }
        return render(request, 'patent_search/patent_search_none_result.html', search_result)
 



