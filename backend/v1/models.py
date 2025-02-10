import json

from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    id = models.BigAutoField(primary_key=True)
    creator = models.ForeignKey(User,on_delete=models.CASCADE,related_name='creator')
    assignee = models.ForeignKey(User,null=True,on_delete=models.SET_NULL,related_name='assignee')

    deadline = models.DateTimeField(null=True,help_text='Date when task should be completed')
    priority = models.IntegerField(help_text='High to Low numeric priority assigned to task')

    name = models.CharField(blank=False,max_length=50, help_text='Name given to the task')
    text = models.TextField(blank=True,help_text='Text description of task to be performed') 
    # charField stores a limited number of chars, TextField can store unlimited text,
    # in postgress there is "No performance difference among these types" 
    # https://www.postgresql.org/docs/9.0/datatype-character.html

    def get_absolute_url(self):
        return reverse('model-detail-view',args=[str(self.id)])

    def __str__(self):
        return f"id: {self.id}, name: {self.name}"

    def toJson(self):
        return json.dumps({
            'id':self.id,
            'creator':self.creator.id,
            'assignee': None if not self.assignee else self.assignee.id,
            'deadline':self.deadline,
            'priority':self.priority,
            'name':self.name,
            'text':self.text,
            })
