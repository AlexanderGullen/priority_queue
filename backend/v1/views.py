from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password, ValidationError
from django.db.models import Q

from django.core.mail import send_mail
from smtplib import SMTPException

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
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def username_to_id(request):
    user = User.objects.filter(Q(username=request.data['username'] if 'username' in request.data else None)).first()

    if user != None:
        return Response({'username':user.username,'id':user.id},status=status.HTTP_200_OK)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def id_to_username(request):
    user = User.objects.filter(Q(id=request.data['id'] if 'id' in request.data else None)).first()

    if user != None:
        return Response({'username':user.username,'id':user.id},status=status.HTTP_200_OK)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response(request.user.username,status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    #TODO: implement email based login
    user = User.objects.filter(username=request.data['username'] if 'username' in request.data else None).first()

    #if username doesn't work check email
    if user == None:
        print(f"Trying email : {user}")
        user = User.objects.filter(email=request.data['email'] if 'email' in request.data else None).first()


    if user == None:
        return Response('incorrect username/password',status=status.HTTP_404_NOT_FOUND)
        # why "incorrect username/password" is still the more correct and useful statement:
        # https://news.ycombinator.com/item?id=8683062

    if not user.check_password(request.data['password'] if 'password' in request.data else None):
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
    username = generate_slug(4)
    while User.objects.filter(username=username).exists():
        username = generate_slug(4)
    #TODO: I've had a few instances of names veering on the inappropriate side, in this library it might be worth replaceing it with something more friendly.

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
        return Response({'token':token.key,'username':serializer.data['username']})
   
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


##### TASKS #####

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def read(request):
    tasks = Task.objects.filter(Q(creator=request.user.id) | Q(assignee=request.user.id))
    serializer = TaskSerializer(tasks,many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create(request):
    serializer = TaskSerializer(data={
        'creator'  : request.user.id,
        'assignee' : None, # reduces function scope by forcing notification functionality to be a side effect of update.
        'deadline' : request.data['deadline'] if 'deadline' in request.data else None,
        'name'     : request.data['name'] if 'name' in request.data else None,
        'text'     : request.data['text'] if 'text' in request.data else None,
        'priority' : request.data['priority'] if 'priority' in request.data else 0,
        })

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update(request,pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    #verify user has permissions to access the object they are accessing
    if task.creator.id != request.user.id:
        if task.assignee == None or task.assignee.id != request.user.id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = TaskSerializer(task,data={
            'id'       : task.id,
            'creator'  : request.user.id,
            'assignee' : request.data['assignee'] if 'assignee' in request.data else task.assignee,
            'deadline' : request.data['deadline'] if 'deadline' in request.data else task.deadline,
            'name'     : request.data['name'] if 'name' in request.data else task.name,
            'text'     : request.data['text'] if 'text' in request.data else task.text,
            'priority' : request.data['priority'] if 'priority' in request.data else task.priority,
        })

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    if request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def notify(request,pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    #verify user has permissions to access the object they are accessing
    if task.creator.id != request.user.id:
        if task.assignee == None or task.assignee.id != request.user.id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    print(task)

    if task.assignee is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        try:
            send_mail(
                f"{task.creator.username} shared {task.name} with you.",
                f"{task.text}",
                f"alexmgullen@gmail.com",
                [task.assignee.email],
                fail_silently=False,
                )

            print(task.assignee.email)
        except SMTPException:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)

