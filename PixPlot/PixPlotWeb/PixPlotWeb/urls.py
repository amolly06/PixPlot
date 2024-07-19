"""
URL configuration for PixPlotWeb project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# PixPlotWeb/urls.py
# PixPlotWeb/urls.py
from django.contrib import admin
from django.urls import path, include
# from django.contrib.auth import views as auth_views
from Users import views as user_views
from Folders import views as folder_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.intro, name='intro'),
    path('about/', views.about, name='about'),
    path('users/login/', user_views.login_request, name='account_login'),
    path('users/register/', user_views.register_request, name='account_register'),
    path('folders/home/', folder_views.home, name='home'),
    # path('accounts/login/', auth_views.LoginView.as_view(template_name='login.html'), name='account_login'),


    path("__reload__/", include("django_browser_reload.urls")),
]



