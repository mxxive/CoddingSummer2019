from django.shortcuts import render
from django.utils import timezone
from .models import Task
from datetime import datetime
from django.db.models import Q

def main(request):
    tasks = Task.objects.all().order_by('completed', '-priority', 'expire_date')
    for task in tasks:
        if task.expire_date:
            task.expire_date = task.expire_date.strftime('%Y-%m-%d')
    
    return render(request, 'todo/main.html', {
        'tasks'         : tasks,
    })

def tasks(request):
    tasks = Task.objects.all()
    return render(request, 'todo/task.html', {'tasks': tasks})
