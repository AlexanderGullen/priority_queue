from django.urls import path
from . import views

urlpatterns = [
    path('user_id',views.username_to_id),
    path('username',views.id_to_username),
    path('login',views.login),
    path('sign_up',views.sign_up),
    path('test_token',views.test_token),
    path('task', views.read, name='Create new task'),
    path('task/create', views.create, name='Get all tasks'),
    path('task/<int:pk>', views.update, name='Update a task'),
    path('task/<int:pk>/notify', views.notify, name='Notify assignee of a task'),
]

