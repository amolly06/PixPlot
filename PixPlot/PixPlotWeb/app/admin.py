from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register the User model with the Django admin site
admin.site.register(User, UserAdmin)