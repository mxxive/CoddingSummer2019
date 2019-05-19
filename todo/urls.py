from django.urls import path, include

from . import api, views

urlpatterns = [
    path('', views.main, name='main'),
    path('tasks', views.tasks),
    path('api/', include([
        path('add_task', api.add_task),
        path('delete_task/<int:task_id>', api.delete_task),
        path('edit_task/<int:task_id>', api.edit_task),
        path('complete_task/<int:task_id>', api.complete_task),
        path('uncomplete_task/<int:task_id>', api.uncomplete_task),
        
        path('test_remove_all_tasks', api.remove_all_tasks),
    ])),
]
