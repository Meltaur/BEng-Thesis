import datetime
import json
import bcrypt
from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from api.extentions import mongo
from api.models import RevokedTokenModel

class UserLogin(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('login', help = 'This field cannot be blank', required = True)
        parser.add_argument('password', help = 'This field cannot be blank', required = True)#Zdefiniowanie wymaganych danych w zapytaniu HTTP
        data = parser.parse_args()#Odczytanie zapytania HTTP
        login = data["login"]
        password = data["password"]#Przypisanie do zmiennych wartości z zapytania HTTP

        try:
            user_collection = mongo.db.users#Otworzenie klastra użytkowników
            try:
                db_user = user_collection.find_one({'username': login}) #Spróbowanie znalezienia loginu
                db_password = db_user['password'] #Jeśli istnieje taki login, to do zmiennej przypisywane jest zahaszowane hasło 
                if bcrypt.checkpw(password.encode(), db_password): #Jeżeli zahaszowane haslo z bazy danych jest takie samo jak zahaszowane hasło które przyszło od użytkownika to
                    access_token = create_access_token(identity = data['login'])
                    refresh_token = create_refresh_token(identity = data['login'])
                    return {
                        'message': 'Logged in as {}'.format(db_user),
                        'access_token': access_token,
                        'refresh_token': refresh_token
                    }
                else:
                    error = {
                        'msg':'Invalid password'
                    }
                    return error
            except Exception as ex:
                error = {
                    'msg':'Invalid username'
                }
                return error
        except Exception as ex:
                error = {
                    'msg':'Something went wrong {}'.format(ex) 
                }
                return error    
      
      
class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti) #Dezaktywowanie tokenów
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except Exception as ex:
            return {'message': 'Something went wrong{}'.format(ex)}, 500
      
      
class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500
      
      
class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity() #Dodanie nowego access tokenu
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}
      