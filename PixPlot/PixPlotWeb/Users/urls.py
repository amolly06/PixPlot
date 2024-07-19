from django.urls import path, include
# from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path("login/", views.login_request, name="login"),
    path("register/", views.register_request, name="register"),
]



