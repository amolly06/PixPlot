# folders/views.py
from django.shortcuts import render, redirect
from .models import Folder

def home(request):
    if request.method == "POST":
        folder_name = request.POST.get('name').upper()
        Folder.objects.create(name=folder_name, user=request.user)
        return redirect('home')

    folders = Folder.objects.filter(user=request.user)
    return render(request, 'Folders/home.html', {'folders': folders})

def intro(request):
    return render(request, 'intro.html')

def about(request):
    return render(request, 'about.html')
