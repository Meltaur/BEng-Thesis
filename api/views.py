from api.run import app
from io import StringIO
import datetime
from flask import send_from_directory, make_response
import json
import bcrypt
import os
import csv
from flask import (
Blueprint,
request,
session,
redirect,
url_for,
g
)
from bson.json_util import dumps, default
from .extentions import mongo, JSONEncoder
from flask_restful import Resource, reqparse
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

def formatDate(date): #Format używany do konwersji z datetime.date.today na format z bazy danych
    formatDate = date[:2] + '.' + date[3:5] + '.' + date[6:10]
    return formatDate

def formatDate2(date):
    formatDate = date[8:10] + '.' + date[5:7] + '.' + date[:4]
    return formatDate 

def isoFormatDate(date):
    isoFormatDate = date[6:10] + '-' + date[3:5] + '-' + date[:2]
    return isoFormatDate

@app.route('/lastday')
def lastday():
    courses_collection = mongo.db.courses #Otworzenie klastra z pomiarami
    date = str(datetime.date.today())
    today = formatDate(date) #Przypisanie do zmiennej wczorajszej daty
    courses = courses_collection.find({'TimeStamp': {'$regex':'08.09.2020'}}) #Wyszukanie odpowiednich danych. Funkcja find nie zwraca dokumentu json
    list_cur = list(courses) 
    courses_list = dumps(list_cur) #Zamiana danych na format json, gotowy do przesłania
    return courses_list

@app.route('/graphdata', methods={"POST"}) #Działanie analogiczne do funkcji powyżej
@jwt_required #Dekorator sprawdzający access token
def graphdata():
    print('123')
    parser = reqparse.RequestParser()
    parser.add_argument('day', help = 'This field cannot be blank', required = True) #Zdefiniowanie wymaganych danych w zapytaniu HTTP
    data = parser.parse_args()
    courses_collection = mongo.db.courses
    date = data['day']
    courses = courses_collection.find({'TimeStamp': {'$regex':date}})
    list_cur = list(courses)
    courses_list = dumps(list_cur)
    
    return courses_list

@app.route('/downloadcenter', methods={"POST"})
@jwt_required
def downloadcenter():
    parser = reqparse.RequestParser()
    parser.add_argument('quantities', help = 'This field cannot be blank', required = True, type=list, location='json')
    parser.add_argument('units', help = 'This field cannot be blank', required = True, type=list, location='json')#Te dane przyjdą w postaci list
    parser.add_argument('startDate', help = 'This field cannot be blank', required = True)
    parser.add_argument('endDate', help = 'This field cannot be blank', required = True) #Zdefiniowanie wymaganych danych w zapytaniu HTTP
    data = parser.parse_args()
    courses_collection = mongo.db.courses
    startDate = data['startDate']
    endDate = data['endDate']
    E_Total_temp, E_Total_temp_1, E_Total_temp_2 = ([] for i in range(3)) #Zadeklarowanie pustych tablic, przechowujących informację o całkowitej zgromadzonej energii
    quantities = data['quantities']
    units = data['units']
    si = StringIO()
    fieldnames=['TimeStamp'] #Tablica zawierająca nazwy kolumn. TimeStamp będzie się w niej znajdować zawsze
    errors = [] #Tablica przechowująca informację o błędach
    for name, unitname in zip(quantities, units):
         fieldnames.append(name + ' ' + unitname) #Wypełnienie tablicy z nagłówkami nazwami wielkości i doklejenie jednostek
    cw = csv.DictWriter(si, fieldnames=fieldnames) 
    cw.writeheader() #Zapisanie do obrazu pliku csv nagłówków
    while startDate != formatDate2((str(datetime.date.fromisoformat(isoFormatDate(endDate))+ datetime.timedelta(days=1)))): #Główna pętla while. Zapisuj do pliku tak długo, aż data początkowa nie równa się dacie końca+jeden dodatkowy dzień. Gdyby nie dodano dnia, nie wykonałaby się ostatnia iteracja
        newrow={'TimeStamp':""} #Inicjalizacja nowego wiersza w pliku csv
        courses = courses_collection.find({'TimeStamp': {'$regex':startDate}})
        list_cur = list(courses)
        obj = json.loads(dumps(list_cur)) #Wyszukanie z bazy danych pomiarów z odpowiedniego dnia  oraz zamiana ich w format json
        startDate = formatDate2((str(datetime.date.fromisoformat(isoFormatDate(startDate))+ datetime.timedelta(days=1)))) #Data startowa jest zwiększana o kolejny dzień
        for TimeStamp in obj: #Pierwsza pętla for, odpowiedzialna za kolejne TimeStampy z danego dnia
            newrow['TimeStamp']=TimeStamp['TimeStamp']
            for name, unitname in zip(quantities, units): #Druga pętla for, wypełniająca wiersze z TimeStampami odpowiednimi pomiarami
                try:
                    if name =='IntSolIrr' or name =='TmpAmb_C' or name =='envhmdt': # W przypadku pomiarów ze stacji pogodowych liczona jest średnia arytmetyczna z dwóch stacji
                        newrow[name + ' ' + unitname]=round((float(TimeStamp[name].replace(',', '.'))+float(TimeStamp[name+'_1'].replace(',', '.')))/2, 2)
                    elif name == "E_Total": #Jeżeli zaznaczono opcję Energia całkowita to należy wykonać następujący algorytm
                        E_Total = float(TimeStamp[name].replace(',', '.'))
                        E_Total_1 = float(TimeStamp[name + '_1'].replace(',', '.'))
                        E_Total_2 = float(TimeStamp[name + '_2'].replace(',', '.')) #Zapisanie w tabeli wartości całkowitej oddanej energii od momentu rozpoczęcia pracy trzech falowników
                        if E_Total != 0:
                            E_Total_temp.append(E_Total)
                        if E_Total_1 != 0:
                            E_Total_temp_1.append(E_Total_1)
                        if E_Total_2 != 0: #Kiedy energia nie jest oddawana, to do bazy danych trafiają zera. Powyższe ify zapobiegają dodania ich do tabel, dzięki czemu poprawnie działa funkcja min
                            E_Total_temp_2.append(E_Total_2)
                        if TimeStamp['TimeStamp'][11:16] == '23:55': #Na koniec dnia zliczana jest całkowita oddana energia poprzez zsumowanie różnic pomiędzy energią na początku i końcu dnia na każdym z falowników
                            newrow[name + ' ' + unitname] = round((max(E_Total_temp)-min(E_Total_temp))+(max(E_Total_temp_1)-min(E_Total_temp_1))+(max(E_Total_temp_2)-min(E_Total_temp_2)), 2)
                            E_Total_temp, E_Total_temp_1, E_Total_temp_2 = ([] for i in range(3))
                        else:
                            newrow[name + ' ' + unitname] = None #Jeśli nie jest to koniec dnia, to pole w pliku csv jest zostawiane puste
                    else:
                        newrow[name + ' ' + unitname]=float(TimeStamp[name].replace(',', '.')) #Wypełnienie pliku csv w każdym innym przypadku
                except:
                    newrow[name + ' ' + unitname]=0
                    msg = name + ' dnia' + ' ' + TimeStamp['TimeStamp'][0:10]
                    if not msg in errors:
                        errors.append(msg)#Dodanie błędu to tablicy z błędami
            cw.writerow(newrow) #Zapisanie nowego wiersza
     
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=export.csv"
    output.headers["Content-type"] = "text/csv" 
    output.headers['Errors'] = errors #Informacja wysyłana do klienta posiada dwa nagłówki. Jeden z plikiem csv, drugi z ewentualnymi błędami
    return output 
    
        
