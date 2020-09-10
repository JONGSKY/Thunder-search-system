from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'patent_search/home.html')