from api.extentions import mongo

class RevokedTokenModel():
    def __init__(self, jti):
        
        self.jti = jti

    def add(self):
        collection = mongo.db.revoked_tokens
        log = {
            "jti" : self.jti
        }
        collection.insert_one(log)

    @staticmethod
    def is_jti_blacklisted(jti):
        collection = mongo.db.revoked_tokens
        query = collection.find_one({'jti': jti})
        return bool(query)
