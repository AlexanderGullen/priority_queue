from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password, ValidationError
from django.shortcuts import get_object_or_404

from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Task
from .serializer import TaskSerializer, UserSerializer

from coolname import generate_slug


##### USERS #####

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("successful",status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):

    user = User.objects.filter(username=request.data['username'])

    if not user.exists():
        return Response('incorrect username/password',status=status.HTTP_404_NOT_FOUND)
        # why "incorrect username/password" is still the more correct and useful statement:
        # https://news.ycombinator.com/item?id=8683062
    
    user = user[0]

    if not user.check_password(request.data['password']):
        return Response('incorrect username/password',status=status.HTTP_404_NOT_FOUND)

    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'token':token.key,'user':serializer.data['username']})

@api_view(['POST'])
def sign_up(request):

    #validate password
    try:
        validate_password(request.data['password'])
    except ValidationError as e:
        return Response(e,status=status.HTTP_401_UNAUTHORIZED)

    
    #ensure no two usernames are identical
    #TODO: I've had a few instances of names veering on the inappropriate side, in this library it might be worth replaceing it with something more friendly.
    username = generate_slug(4)
    while User.objects.filter(username=username).exists():
        username = generate_slug(4)

    serializer = UserSerializer(data={
            'id': None,
            'username': username,
            'password': request.data['password'] if 'password' in request.data else None,
            'email': request.data['email'] if 'email' in request.data else None,
    })

    if serializer.is_valid():
        user = User(
                id=None,
                username=serializer.data['username'],
                password=serializer.data['password'],
                email=serializer.data['email']
            )

        user.set_password(user.password)
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token':token.key,'user':serializer.data['username']})
   
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


##### TASKS #####


@api_view(['POST'])
def create(request):

    if not request.user.is_authenticated:
        return Response("Please sign in to access this service",status=status.HTTP_401_UNAUTHORIZED)

    serializer = TaskSerializer(data={
        'creator'  : request.user.id,
        'assignee' : None, # reduces function scope by forcing notification functionality to be a side effect of update.
        'deadline' : request.data['deadline'] if 'deadline' in request.data else None,
        'name'     : request.data['name'] if 'name' in request.data else None,
        'text'     : request.data['text'] if 'text' in request.data else None,
        'priority' : request.data['priority'] if 'priority' in request.data else 0, #TODO: get the program to weigh priority autmatically
        })

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    return Response(status=status.HTTP_400_BAD_REQUEST)

def read(request):
    pass

def read(request,id):
    pass

def update(request):
    pass

def delete(request):
    pass
