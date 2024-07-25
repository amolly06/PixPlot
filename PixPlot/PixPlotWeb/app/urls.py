from django.urls import path
from . import views

from rest_framework.routers import DefaultRouter
from .views import NodeViewSet, CanvasViewSet

router = DefaultRouter()
router.register(r'nodes', NodeViewSet)
router.register(r'canvas', CanvasViewSet)

urlpatterns = [
    path('', views.intro, name='intro'),
    path('login/', views.LoginPage, name='login'),
    path('signup/', views.RegisterPage, name='signup'),
    path('main/', views.main, name='main'),
    path('about/', views.about, name='about'),
    path('logout/', views.LogoutUser, name='logout'),
]
