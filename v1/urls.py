from django.urls import path
from . import views

urlpatterns = [
    path('user_id',views.username_to_id),
    path('login',views.login),
    path('sign_up',views.sign_up),
    path('test_token',views.test_token),
    path('task', views.read, name='Create new task'),
    path('task/create', views.create, name='Get all tasks'),
    path('task/<int:pk>', views.update, name='Update a task'),
]

