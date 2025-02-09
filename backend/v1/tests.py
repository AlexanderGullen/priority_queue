from django.test import TestCase

from rest_framework.test import APIRequestFactory

# Create your tests here.
"""
Create User Succeeds
{"email":"developer@alexmgullen.ca","password":"Unguessable123"}
"""

"""
Login Succeeds
{"username":"daring-whispering-cricket-from-pluto","password":"Unguessable123"}
"""
factory = APIRequestFactory()

class TestClassPOC(TestCase):
    def setup(self):
        pass
    
    def tearDown(self):
        pass
    
    def test_valid_login_works(self):
        #This code should send a post request to the specified endpoint
        request = factory.post('/v1/login',{"email":"developer@alexmgullen.ca","password":"Unguessable123"},content_type='application/json')

    def test_create_user(self):
        request = factory.post('/v1/sign_up',{"email":"developer@alexmgullen.ca","password":"Unguessable123"},content_type='application/json')
        


