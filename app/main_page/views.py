from django.shortcuts import render

# Create your views here.

def main_page(request):
    return render(request, 'main_page/main_page.html')