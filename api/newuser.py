import bcrypt
from pymongo import MongoClient

username = 'Student'                    #Miejsce na uzupełnienie danych przez użytkownika
password = (b'qwerty')
email = 's999999@student.edu.pg.pl.com'

hash_password = bcrypt.hashpw(password, bcrypt.gensalt(12))


client = MongoClient()
db = client['Test-database-new']
users = db.users

data= {
    'username': username,
    'password': hash_password,
    'email': email
}


if(db.users.find_one({'username':username})):
    print("Istnieje już użytkownik o podanej nazwie użytkownika.")

elif(db.users.find_one({'email':email})):
    print("Istnieje już użytkownik o podanym mailu.")

elif(len(username) > 12):
    print("Login nie może być dłuższy niż 12 znaków.")

elif(len(password) > 12):
    print("Hasło nie może być dłuższe niż 12 znaków.")

else:
    users.insert_one(data)

