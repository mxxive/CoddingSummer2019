import json

from django.conf.urls import include, url
from django.http import JsonResponse
from django.shortcuts import Http404, render
from django.template.loader import render_to_string
from django.utils import timezone

from datetime import datetime
from .models import Task

def parse_post(post):
    if not post['title']:
        return JsonResponse({'result': 1})
    
    title = post['title']
    text = post['text']
    priority = post['priority']
    print('priority is', priority)
    if priority == 'NaN' or not priority:
        priority = None
    else:
        priority = int(priority)
    expire_date = post['expire_date']
    if expire_date:
        expire_date = datetime.strptime(expire_date, '%Y-%m-%d')
    else:
        expire_date = None
    return (title, text, priority, expire_date)
    
def render_task(request, task):
    if task.expire_date:
        task.expire_date = task.expire_date.strftime('%Y-%m-%d')
    html = render_to_string('todo/task.html', {
        'task'      : task,
        'id'        : id,
    }, request)
    return html
    
    
def add_task(request):
    if request.method != 'POST':
        return Http404()
    (title, text, priority, expire_date) = parse_post(request.POST)
    task = Task.objects.create(
        title = title,
        text = text,
        priority = priority,
        expire_date = expire_date
    )
    task.publish()
    html = render_task(request, task)
    return JsonResponse({
        'result'    : 0,
        'id'        : task.id,
        'html'      : html,
    })
    
def delete_task(request, task_id):
    if request.method != 'POST':
        return Http404()
    tasks = Task.objects.filter(id=task_id)
    task = tasks[0]
    print('Delete object', task_id, task.title)
    tasks.delete()
    return JsonResponse({
        'result': 0
    })
    
def edit_task(request, task_id):
    if request.method != 'POST':
        return Http404()
    (title, text, priority, expire_date) = parse_post(request.POST)
    Task.objects.filter(id=task_id).update(
        title        = title,
        text         = text,
        expire_date  = expire_date,
        priority     = priority
    )
    return JsonResponse({
        'result': 0
    })
    
def complete_task(request, task_id):
    if request.method != 'POST':
        return Http404()
    tasks = Task.objects.filter(id=task_id)
    task = tasks[0]
    tasks.update(completed=True)
    print(task)
    html = render_task(request, task)
    return JsonResponse({
        'result': 0,
        'html': html,
    })
    
def uncomplete_task(request, task_id):
    if request.method != 'POST':
        return Http404()
    tasks = Task.objects.filter(id=task_id)
    task = tasks[0]
    tasks.update(completed=False)
    html = render_task(request, task)
    return JsonResponse({
        'result': 0,
        'html': html,
    })



# only for test
def remove_all_tasks(request):
    Task.objects.all().delete()
    return JsonResponse({
        'result': 0
    })
