from django.db import models
from django.utils import timezone


class Task(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    priority = models.IntegerField(default=5, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    expire_date = models.DateTimeField(null=True)
    published_date = models.DateTimeField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    
    def publish(self):
        self.published_date = timezone.now()
        self.save()
    
    def __str__(self):
        return self.title
