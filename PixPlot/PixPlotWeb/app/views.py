from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm


from .forms import CreateUserForm

def intro(request):
    return render(request, 'intro.html')

def LoginPage(request):
    if request.user.is_authenticated:
        return redirect('main')
    else:
        form = AuthenticationForm()

        if request.method == 'POST':
            form = AuthenticationForm(request, data=request.POST)
            if form.is_valid():
                username = form.cleaned_data.get('username')
                password = form.cleaned_data.get('password')
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    login(request, user)
                    return redirect('main')
                else:
                    messages.error(request, 'Username or password is incorrect')
            else:
                messages.error(request, 'Invalid credentials')

        return render(request, 'login.html', {'form': form})

        
def RegisterPage(request):
    if request.user.is_authenticated:
        return redirect('main')
    else:
        if request.method == 'POST':
            form = CreateUserForm(request.POST)
            if form.is_valid():
                form.save()
                user = form.cleaned_data.get('username')
                messages.success(request, 'Account was created for ' + user)
                return redirect('login')  
        else:
            form = CreateUserForm()

        return render(request, 'signup.html', {'form': form})

def LogoutUser(request):
    logout(request)
    return redirect('intro')

@login_required(login_url='login')
def main(request):
    return render(request, 'main.html')

def about(request):
    return render(request, 'about.html')
