from pymongo import MongoClient
import certifi


conn = "mongodb+srv://Dustin:<password>@cluster0.texal2d.mongodb.net/"
# conn = "mongodb+srv://__USER__:__PWD__@__ENDPOINT__/?readPreference=secondary"
client = MongoClient(conn, tlsCAFile=certifi.where())
db = client.test

pipleine = [
    {"$match":{"fullDocument.status": "argent"}}
]

stream = db.test.watch(pipeline=pipleine)

for document in stream:
    print(document)