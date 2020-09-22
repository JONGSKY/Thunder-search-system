from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'patent_search/patent_search.html')


def search_action(request):
    search_input = request.GET.get('search_name', "") 
    return render(request, 'patent_search/patent_search_result.html', { 'search_name' : search_input})
    

