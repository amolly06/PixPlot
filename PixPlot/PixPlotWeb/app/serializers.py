from rest_framework import serializers
from .models import Node, Canvas

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = '__all__'

class CanvasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canvas
        fields = ['canvas_data']
