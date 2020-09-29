from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

def logo_search(request):
    return render(request, 'trademark_search/logo_search.html')


def vienna_search(request):
    return render(request, 'trademark_search/vienna_search.html')

@csrf_exempt
def logo_search_result(request):
    logo_search_image = request.FILES["logo_search_image"]
    return render(request, 'trademark_search/logo_search_result.html')

@csrf_exempt
def vienna_search_result(request):
    vienna_search_image = request.FILES["vienna_search_image"]
    return render(request, 'trademark_search/vienna_search_result.html')