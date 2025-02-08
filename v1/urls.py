from django.urls import path
from . import views

urlpatterns = [
    path('task/create/', views.create, name='Create new task'),
    path('login',views.login),
    path('sign_up',views.sign_up),
    path('test_token',views.test_token),
]

