from modules.database import db

pages = []

for page in db.pages.find():
    pages.append(page["name"])
