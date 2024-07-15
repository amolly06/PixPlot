# PixPlotWeb/Folders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('intro/', views.intro, name='intro'),
    # Add more paths as needed
]
