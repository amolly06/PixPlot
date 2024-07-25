from django.urls import path
from . import views

urlpatterns = [
    path('', views.intro, name='intro'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('signup/', views.CustomRegisterView.as_view(), name='signup'),
    path('main/', views.main, name='main'),
    path('about/', views.about, name='about'),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
]
