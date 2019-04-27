from modules.database import db
from bson import json_util
import json

page_data = []
page_list = []

for page in db.pages.find():
    page_data.append(json.loads(json_util.dumps(page)));
    page_list.append(page["name"])
