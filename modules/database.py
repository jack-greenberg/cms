from pymongo import MongoClient

# client = MongoClient(
#     "mongodb://localhost:27017/cms",
#     username="jackg",
#     password="observe coleman sullivan guam",
#     authSource="cms"
# )
client = MongoClient(
    "206.189.209.148:27017",
    username="cmsUser",
    password="russell textile classroom does",
    authSource="cms_production"
)
db = client.cms_production
