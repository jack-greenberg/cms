from pymongo import MongoClient

# client = MongoClient(
#     "mongodb://localhost:27017/cms",
#     username="jackg",
#     password="observe coleman sullivan guam",
#     authSource="cms"
# )
client = MongoClient(
    "mongodb://206.189.209.148:27017/cms_dev",
    username="jackg",
    password="starts bidder induction eminem",
    authSource="cms_dev"
)
db = client.cms
