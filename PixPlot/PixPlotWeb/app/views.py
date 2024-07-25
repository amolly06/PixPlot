from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from .forms import CreateUserForm

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Node, Canvas
from .serializers import NodeSerializer, CanvasSerializer

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Node.objects.filter(user=user)

class CanvasViewSet(viewsets.ModelViewSet):
    queryset = Canvas.objects.all()
    serializer_class = CanvasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Canvas.objects.filter(user=user)

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

@login_required
def load_canvas(request):
    # Load the Canvas and Node data for the current user
    canvas = Canvas.objects.filter(user=request.user).first()
    nodes = Node.objects.filter(user=request.user)
    
    context = {
        'canvas_data': canvas.canvas_data if canvas else '{}',  # Provide default empty data
        'nodes': list(nodes.values('x', 'y', 'width', 'height', 'color', 'font_size', 'font_style', 'text', 'border_color'))
    }
    return render(request, 'canvas.html', context)  # Render with context for the canvas and nodes


def save_canvas(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        canvas_data = data.get('canvas_data', '{}')
        nodes_data = data.get('nodes', [])

        # Update or create Canvas record for the current user
        canvas, created = Canvas.objects.update_or_create(
            user=request.user,
            defaults={'canvas_data': canvas_data}
        )

        # Update or create Node records
        for node_data in nodes_data:
            Node.objects.update_or_create(
                user=request.user,
                x=node_data['x'],
                y=node_data['y'],
                defaults={
                    'width': node_data['width'],
                    'height': node_data['height'],
                    'color': node_data['color'],
                    'font_size': node_data['font_size'],
                    'font_style': node_data['font_style'],
                    'text': node_data['text'],
                    'border_color': node_data['border_color']
                }
            )

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)