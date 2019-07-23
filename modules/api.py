from flask import jsonify, request
import json
from bson import json_util, dbref, ObjectId
from werkzeug.utils import secure_filename
from flask.views import MethodView
from flask_jwt_extended import fresh_jwt_required
from modules.database import db
from datetime import datetime
from modules.image_processor import process_image
import os
from pymongo import ReturnDocument

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
            post_data = db.posts.find_one({'_id': ObjectId(post_id)})
            for i in range(len(post_data['content'])): # for each ObjectId in the content array
                content_id = post_data['content'][i]
                content_result = db.content.find_one({'_id': content_id})

                post_data['content'][i] = content_result

                if content_result is None:
                    db.posts.update({}, {
                        "$pull": {'content': content_id}
                    })
            post_data['content'] = [ i for i in post_data['content'] if i != None ]
            return jsonify(json.loads(json_util.dumps(post_data)))

    def post(self):
        if (request.files['image']):
            # For uploading a file for a post
            image = request.files['image']
            post_id = request.form['postID']
            image_id = request.form['imageID']
            hash = request.form['hash']

            print('-------')
            print('Filename: %s' % image.filename)
            print('Filetype: %s' % image.mimetype)
            print('Post ID: %s' % post_id)
            print('Image ID: %s' % image_id)
            print('Hash: %s' % hash)
            print('-------')

            if image.mimetype not in ['image/png', 'image/jpeg', 'image/jpg']:
                return (jsonify("Wrong filetype!", 400))

            file_extension = image.mimetype.split('/')[-1]

            filename = '%s.%s.%s.%s' % (post_id, hash, image_id, file_extension)
            image.save(os.getcwd() + '/tmp/' + secure_filename(filename))
            new_files = process_image(filename)

            return (jsonify(new_files), 201)

        # This is for when the POST request is empty, so it just creates a blank blog post
        lastID = db.posts.find_one({}, {'postID': 1}, sort=[("postID", -1)])
        emptyPost = {
            "postID": lastID + 1,
            "title": "",
            "author": "",
            "status": "draft",
            "lastEdited": datetime.now(),
            "published": None,
            "tags": [],
            "content": [],
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
        new_doc = db.posts.find_one_and_update({'_id': ObjectId(post_id)}, {
            "$set": requestData,
        }, return_document=ReturnDocument.AFTER)
        return jsonify(json.loads(json_util.dumps(new_doc))), 201

class ContentAPI(MethodView):
    decorators = [fresh_jwt_required]
    def get(self, content_id):
        if post_id is None:
            return
        else:
            return jsonify("Test"), 200
    def post(self):
        requestData = json.loads(request.get_data(as_text=True))
        type = requestData['type']
        postId = requestData['postId']

        if type == 'text':
            new_doc = {
                '_id': ObjectId(),
                'type': type,
                'postId': ObjectId(postId),
                'value': ''
            }
        elif type == 'image':
            new_doc = {
                '_id': ObjectId(),
                'type': type,
                'postId': ObjectId(postId),
                'value': {
                    'src': '',
                    'srcset': [],
                    'altText': '',
                    'caption': '',
                    'imageId': '',
                }
            }
        elif type == 'video':
            new_doc = {
                '_id': ObjectId(),
                'type': type,
                'postId': ObjectId(postId),
                'value': ''
            }
        else:
            return jsonify("Wrong type"), 400
        new_id = db.content.insert_one(new_doc).inserted_id

        db.posts.update({'_id': ObjectId(postId)}, {
            '$push': {'content': new_id}
        })

        return jsonify(json.loads(json_util.dumps(new_doc))), 201
    def put(self, content_id):
        requestData = json.loads(request.get_data(as_text=True))
        newdoc = db.content.find_one_and_update({'_id': ObjectId(content_id)}, {
            "$set": requestData,
        }, return_document=ReturnDocument.AFTER)
        return jsonify(json.loads(json_util.dumps(new_doc))), 201


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
