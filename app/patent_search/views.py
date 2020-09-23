from django.shortcuts import render

# Create your views here.

def patent_search(request):
    return render(request, 'patent_search/patent_search.html')


def patent_search_result(request):
    search_input = request.GET.get('search_name', "") 
    result = {'search_name' : search_input}
    return render(request, 'patent_search/patent_search_result.html', result)
    

