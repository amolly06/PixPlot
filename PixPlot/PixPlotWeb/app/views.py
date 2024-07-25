from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy

def intro(request):
    return render(request, 'intro.html')

class CustomLoginView(LoginView):
    template_name = 'login.html'

class CustomRegisterView(CreateView):
    form_class = UserCreationForm
    template_name = 'signup.html'
    success_url = reverse_lazy('login')

class CustomLogoutView(LogoutView):
    next_page = 'intro'

@login_required
def main(request):
    return render(request, 'main.html')

def about(request):
    return render(request, 'about.html')
