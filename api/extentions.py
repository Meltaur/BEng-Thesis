from flask_pymongo import PyMongo
import json
from bson import ObjectId

mongo = PyMongo()

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)