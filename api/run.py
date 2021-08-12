from flask import Flask
from flask_restful import Api

app = Flask(__name__)
rest_api = Api(app) #Zainicjowanie pracy serwera


from api.extentions import mongo

config_object='api.settings'
app.config.from_object(config_object)
mongo.init_app(app) #Zainicjowanie komunikacji z bazą danych
app.secret_key = '###########' #Sekretny klucz, którego deklaracja jest wymagana przy obsłudze zapytań HTTP

import api.login_manager, api.views, api.models

from flask_jwt_extended import JWTManager
app.config['JWT_SECRET_KEY'] = '###########'

jwt = JWTManager(app) #zainicjowanie pracy menadżera tokenów logowania

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh'] #Zainicjowanie pracy algorytmu sprawdzającego unieważnione tokeny

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token): #Funkcja sprawdzająca czy token jest unieważniony
    jti = decrypted_token['jti']
    return api.models.RevokedTokenModel.is_jti_blacklisted(jti)

rest_api.add_resource(api.login_manager.UserLogin, '/login')
rest_api.add_resource(api.login_manager.UserLogoutAccess, '/logout/access')
rest_api.add_resource(api.login_manager.UserLogoutRefresh, '/logout/refresh')
rest_api.add_resource(api.login_manager.TokenRefresh, '/token/refresh') #dodanie do api ścieżek związanych z systemem logowania


