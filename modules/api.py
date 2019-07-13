from flask import jsonify, request
import json
from bson import json_util
from werkzeug.utils import secure_filename
from flask.views import MethodView
from flask_jwt_extended import fresh_jwt_required
from modules.database import db
from datetime import datetime

""" API
 URL (/api/v1/...)  | METHOD| DESCRIPTION
----------------------------------------------------
 /siteData/         | GET   | Return all the bits
                    |       | of site data
----------------------------------------------------
"""
class SiteAPI(MethodView):
    decorators = [fresh_jwt_required]
    def get(self, type):
        ret = {}
        if type is None:
            for doc in db.siteData.find():
                ret[doc["name"]] = json.loads(json_util.dumps(doc))
            return jsonify(ret)
        else:
            for doc in db.siteData.find({'name': type}):
                ret[type] = json.loads(json_util.dumps(doc))
            return jsonify(ret)

    def post(self, type):
        name = request.form['name']
        f = request.files['data']

        f.save(os.getcwd() + '/tmp/' + secure_filename(f.filename))

        db.siteData.update_one(
            {'name': type},
            {
                "$set": {
                    "data." + name: secure_filename(f.filename),
                }
            }
        )
        return (jsonify("Uploaded"), 201)

    def put(self, type):
        if type is None:
            return 404

        requestData = json.loads(request.get_data(as_text=True))
        name = requestData['name']
        data = requestData['data']
        db.siteData.update_one(
            {'name': type},
            {
                "$set": {
                    "data." + name: data,
                }
            }
        )
        return (jsonify("Updated"), 201)
class PostAPI(MethodView):
    decorators = [fresh_jwt_required]
    def get(self, post_id):
        ret = []
        if post_id is None:
            # return a list of posts
            post_list = db.posts.find()
            for doc in post_list:
                ret.append(json.loads(json_util.dumps(doc)))
            return jsonify(ret)
        else:
            for doc in db.posts.find({'postID': post_id}):
                return jsonify(json.loads(json_util.dumps(doc)))
            return jsonify(ret)

    def post(self):
        lastID = db.posts.find_one({}, {'postID': 1}, sort=[("postID", -1)])
        print("----------------")
        print(lastID)
        emptyPost = {
            "postID": lastID + 1,
            "title": "",
            "author": "",
            "status": "draft",
            "lastEdited": datetime.now(),
            "published": None,
            "tags": [],
            "content": {},
        }
        db.posts.insert_one(emptyPost)
        return jsonify(emptyPost)

    def delete(self, post_id):
        # delete a single post
        pass

    def put(self, post_id):
        # update a single post
        requestData = json.loads(request.get_data(as_text=True))
        try:
            if requestData['status'] == 'live':
                requestData['published'] = datetime.strptime(requestData['published'], "%a, %d %b %Y %H:%M:%S %Z")
        except KeyError:
            pass
        requestData['lastEdited'] = datetime.now()
        db.posts.update_one({'postID': post_id}, {
            "$set": requestData,
        })
        return jsonify("Updated"), 201
class PageAPI(MethodView):
    decorators = [fresh_jwt_required]
    def get(self, page_name):
        ret = []
        if page_name is None:
            # return a list of posts
            page_list = db.pages.find()
            for doc in page_list:
                ret.append(json.loads(json_util.dumps(doc)))
            return jsonify(ret)
        else:
            for doc in db.pages.find({'name': page_name}):
                return jsonify(json.loads(json_util.dumps(doc)))
            return jsonify(ret)
