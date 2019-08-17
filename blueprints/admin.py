from flask import Blueprint, render_template, request, url_for, session, redirect, jsonify
from functools import wraps
import json
from bson import json_util, ObjectId
from modules.database import db
from flask_jwt_extended import fresh_jwt_required, jwt_required, create_access_token, get_jwt_identity, jwt_refresh_token_required, create_refresh_token, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash, safe_str_cmp
import bcrypt

from blueprints.public import public

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (request.method == 'GET'):
            try:
                if not session['username']:
                    return redirect(url_for('admin.login', redirect=request.path))
            except KeyError:
                return redirect(url_for('admin.login', redirect=request.path))
            return f(*args, **kwargs)
    return decorated_function

admin = Blueprint('admin', __name__, url_prefix='/admin', static_folder='../admin/static', template_folder='../admin/templates')

@admin.route('/')
@login_required
def admin_index():
    siteData = {}
    for doc in db.siteData.find():
        siteData[doc["name"]] = json.loads(json_util.dumps(doc))
    return render_template('admin.j2', siteData=siteData)

@admin.route('/<page>/') # admin subpage (<Pages /> | <Posts /> | <Settings />)
@login_required
def admin_sub(page=None):
    siteData = {}
    for doc in db.siteData.find():
        siteData[doc["name"]] = json.loads(json_util.dumps(doc))
    return render_template('admin.j2', siteData=siteData)

@admin.route('/admin/pages/<page>/') # admin singular page (<SinglePage />)
@login_required
def admin_pages_sub(page=None):
    siteData = {}
    for doc in db.siteData.find():
        siteData[doc["name"]] = json.loads(json_util.dumps(doc))
    return render_template('admin.j2', siteData=siteData)

@admin.route('/posts/<post_id>/') # admin single post (<SinglePost />)
@login_required
def admin_posts_sub(post_id=None):
    siteData = {}
    for doc in db.siteData.find():
        siteData[doc["name"]] = json.loads(json_util.dumps(doc))
    return render_template('admin.j2', siteData=siteData)

@admin.route('/posts/<post_id>/preview/') # admin _private_ post link (needs login)
@login_required
def private_post(post_id=None):
    # get post data from db
    post_data = db.posts.find_one({'_id': ObjectId(post_id) })
    return render_template('post.j2', post_data=post_data, private=True)

@public.route('/api/token-refresh/', methods=['POST']) # refresh the token
@jwt_refresh_token_required # refresh token is needed to do this
def refresh():
    new_token = create_access_token(identity=get_jwt_identity(), fresh=True)
    response = jsonify({'access_token': new_token})
    return response



@admin.route('/login/', methods=['GET', 'POST'])
def login():
    try:
        assert session['username'] # if the user is already logged in, send them to the admin page
        return redirect(url_for('admin.admin_index'))
    except (AssertionError, KeyError):
        pass
    if request.method == 'POST':
        requestData = json.loads(request.get_data(as_text=True))
        username = requestData['username']
        password = requestData['password']
        try:
            permanent_session = requestData['remember'] # check to see if the user wants to stay logged in for 30 days
        except:
            permanent_session = False

        request_path = requestData['redirect'] # Get the redirect path
        if request_path == 'None':
            request_path = 'admin'

        try:
            storedHash = db.users.find_one({'username': username}, {'hash': 1, "_id": 0})['hash']
        except TypeError:
            storedHash = None

        if not storedHash:
            # If there is no storedHash, there is no user by that name
            return jsonify("No user found"), 400

        if (bcrypt.checkpw(password.encode(), storedHash.encode())): # check the submitted password against the stored hash
            session.clear()
            if (permanent_session):
                session['username'] = username
            else:
                session.pop('username', None)

            # Create access_ and refresh_ tokens for the authenticated user
            access_token = create_access_token(identity=username, fresh=True)
            refresh_token = create_refresh_token(identity=username)

            # response = redirect(request_path) if request_path else redirect(url_for('admin_root'))

            return jsonify(access_token=access_token, refresh_token=refresh_token, redirect=request_path), 200
        else:
            return jsonify("Wrong password"), 400

    return render_template('admin.j2', siteData=False)

@admin.route('/logout/')
def logout():
    session.pop('username', None)
    return redirect(url_for('admin.admin_index'))
