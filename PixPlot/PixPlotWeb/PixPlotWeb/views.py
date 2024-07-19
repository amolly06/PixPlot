from django.http import HttpResponse
from django.shortcuts import render

def intro(request):
    # return HttpResponse("Home Page")
    return render(request, 'intro.html')

def about(request):
    return render(request, 'about.html')

