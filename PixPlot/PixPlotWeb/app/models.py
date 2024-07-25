from django.db import models
from django.contrib.auth.models import User

class Node(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    color = models.CharField(max_length=7)
    font_size = models.IntegerField(default=16)
    font_style = models.CharField(max_length=50, default='Arial')
    text = models.TextField(blank=True, null=True)
    border_color = models.CharField(max_length=7, default='#000000')
    
    def __str__(self):
        return f"Node {self.id} for user {self.user.username}"

class Canvas(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    canvas_data = models.TextField()  # To store JSON or text representation of the canvas

    def __str__(self):
        return f"Canvas for user {self.user.username}"