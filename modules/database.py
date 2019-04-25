from pymongo import MongoClient

client = MongoClient(
    "mongodb://localhost:27017/cms",
    username="jackg",
    password="observe coleman sullivan guam",
    authSource="cms"
)
db = client.cms
