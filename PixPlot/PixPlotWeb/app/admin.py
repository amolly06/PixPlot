from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Node, Canvas

# Register the Node and Canvas models with the Django admin site
@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'x', 'y', 'color', 'font_size', 'text')
    search_fields = ('text', 'user__username')

@admin.register(Canvas)
class CanvasAdmin(admin.ModelAdmin):
    list_display = ('user', 'canvas_data')
