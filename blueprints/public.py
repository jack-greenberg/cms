from flask import Blueprint, render_template
import json
from bson import json_util
from modules.database import db

public = Blueprint('public', __name__, template_folder='../theme/templates', static_folder='../theme/static', static_url_path='/theme/static')

@public.route('/')
def public_index():
    post_list = []
    recent_posts = db.posts.find({'status': 'live'}).sort([("published", 1)]).limit(3)
    for post in recent_posts:
        post_list.append(post)
    
    site_data = {}
    for doc in db.siteData.find():
        site_data[doc["name"]] = json.loads(json_util.dumps(doc))
    return render_template('index.j2', recent_posts=post_list, site_data=site_data)

@public.route('/resume')
def public_resume():
    return render_template('resume.html')
