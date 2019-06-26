from flask import Flask, render_template, url_for, jsonify, redirect, request, session, flash
from flask_jwt_extended import JWTManager, fresh_jwt_required, jwt_required, create_access_token, get_jwt_identity, jwt_refresh_token_required, create_refresh_token, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash, safe_str_cmp
from werkzeug.utils import secure_filename
import click
import functools
import sys, os
import config
from modules.auth import User, authenticate
from modules.database import db
from bson import json_util
import json
import bcrypt
from functools import wraps

"""
Set up the Flask instance, and set the JWT options
"""
app = Flask(__name__, static_folder='./static/build')
app.config['SECRET_KEY'] = b'dev'
app.config['JWT_SECRET_KEY'] = b'dev'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/token-refresh/'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
jwt = JWTManager(app)

# Sets development or production mode (uses info from ./config.py)
@click.command()
@click.option('--mode', '-m', default='development', help='Production mode (production, development)', required=True)
def run(mode):
    if (mode == 'development'):
        app.config.from_object('config.DevelopmentConfig')
    elif (mode == 'production'):
        app.config.from_object('config.ProductionConfig')
    else:
        click.echo("Please use either development or production mode.")
        sys.exit()
    app.run(host='0.0.0.0') # accessible to other devices on the network

"""
A login-required decorator that protects the backend by requiring the user to login

Basically, if there is no username in the session, send the user back to the login page.
"""
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (request.method == 'GET'):
            try:
                if not session['username']:
                    return redirect(url_for('login', redirect=request.path))
            except KeyError:
                return redirect(url_for('login', redirect=request.path))
            return f(*args, **kwargs)
    return decorated_function

# Before each request, check to see if there is a user logged in. This bit might not be necessary, in which case it will be removed in the future
@app.before_request
def start_session():
    try:
        assert session['username']
    except (AssertionError, KeyError):
        session['username'] = ""
        # return redirect(url_for('index'))
    # session.permanent = True

@app.route('/')
def index():
    return "coming soon"
    # return render_template('jacksite/home.j2', page_title="Home", module_data=page_data['Home'])

@app.route('/<page>/')
def subpage(page):
    return "coming soon"
    # page_list = []
    # for page in db.pages.find():
    #     page_list.append(page["name"])
    #
    # if page in page_list:
    #     if page == 'home':
    #         return redirect(url_for('index'))
    #     else:
    #         return render_template('site/home.j2', page_title=page, module_data=page_list[page])
    # else:
    #     return render_template('404.j2'), 404


@app.route('/login/', methods=['GET', 'POST'])
def login():
    try:
        assert session['username'] # if the user is already logged in, send them to the admin page
        return redirect(url_for('admin_root'))
    except (AssertionError, KeyError):
        pass
    if request.method == 'POST':
        # requestData = json.loads(request.get_data(as_text=True))
        username = request.form['username']
        password = request.form['password']
        try:
            permanent_session = request.form['remember'] # check to see if the user wants to stay logged in for 30 days
        except:
            permanent_session = False

        request_path = request.form['redirect'] # Get the redirect path
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

            return jsonify(access_token=access_token, refresh_token=refresh_token), 200
        else:
            return jsonify("Wrong password"), 400

    return render_template('admin/login.j2')

@app.route('/logout/', methods=['POST'])
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    response = jsonify({'success': 'true'})
    return response, 200

@app.route('/admin/') # admin main (<Home />)
@login_required
def admin_root():
    return render_template('admin/admin.j2')

@app.route('/admin/<page>/') # admin subpage (<Pages /> | <Posts /> | <Settings />)
@login_required
def admin_sub(page=None):
    return render_template('admin/admin.j2')

@app.route('/admin/pages/<page>/') # admin singular page (<SinglePage />)
@login_required
def admin_pages_sub(page=None):
    return render_template('admin/admin.j2')

@app.route('/admin/posts/<post_id>/') # admin single post (<SinglePost />)
@login_required
def admin_posts_sub(post_id=None):
    return render_template('admin/admin.j2')

@app.route('/admin/posts/private/<post_id>/') # admin _private_ post link (needs login)
@login_required
def private_post(post_id=None):
    # get post data from db
    post_data = db.posts.find_one({'postID': int(post_id)}, {"_id": 0})
    return render_template('post.j2', post_data=post_data)

@app.route('/api/token-refresh/', methods=['POST']) # refresh the token
@jwt_refresh_token_required # refresh token is needed to do this
def refresh():
    new_token = create_access_token(identity=get_jwt_identity(), fresh=True)
    response = jsonify({'access_token': new_token})
    return response


""" API
get, update, upload (files)
siteData, page-data, post-data, backend-data
"""
@app.route('/api/<action>/<endpoint>/', methods=['POST']) # THE API
@fresh_jwt_required
def response(action, endpoint):
    if (endpoint == 'siteData'):
        site_data = {}

        if (action == 'update'):
            requestData = json.loads(request.get_data(as_text=True))
            _form = requestData['dbForm']
            _name = requestData['dbName']
            _data = requestData['dbData']
            db.siteData.update_one(
                {'name': _form},
                {
                    "$set": {
                        "data." + _name: _data,
                    }
                }
            )
        elif (action == 'upload'):
            _form = request.form['dbForm']
            _name = request.form['dbName']

            f = request.files['dbData']
            f.save(os.getcwd() + '/tmp/' + secure_filename(f.filename))

            db.siteData.update_one(
                {'name': _form},
                {
                    "$set": {
                        "data." + _name: secure_filename(f.filename),
                    }
                }
            )

        for doc in db.siteData.find():
            site_data[doc["name"]] = json.loads(json_util.dumps(doc))

        robot_text = ""
        with app.open_resource('robots.txt') as f:
            robot_text = f.read()

        site_data["seo"]["data"]["robots"] = robot_text.decode()
        return jsonify(site_data)
    elif (endpoint == 'page-data'):
        try:
            requestData = json.loads(request.get_data(as_text=True))
            if (requestData['pageName']):
                post_data = db.pages.find_one({'name': requestData['pageName']}, {"_id": 0})
                return jsonify(json.loads(json_util.dumps(post_data)))
        except:
            pass
        page_data = []

        for doc in db.pages.find():
            page_data.append(json.loads(json_util.dumps(doc)))
        return jsonify(page_data)
    elif (endpoint == 'backend-data'):
        backend_data = {}

        for doc in db.siteData.find():
            backend_data[doc["name"]] = json.loads(json_util.dumps(doc))

        return jsonify(backend_data)
    elif (endpoint == 'robots'):
        response = ""
        robots = f.open('robots.txt')
        for line in robots:
            response += line + '\n'
        return jsonify(response)
    elif (endpoint == 'post-data'):
        try:
            requestData = json.loads(request.get_data(as_text=True))
            if (requestData['postID']):
                post_data = db.posts.find_one({'postID': int(requestData['postID'])}, {"_id": 0})
                return jsonify(json.loads(json_util.dumps(post_data)))
        except json.decoder.JSONDecodeError:
            pass

        post_data = []

        for doc in db.posts.find():
            post_data.append(json.loads(json_util.dumps(doc)))
        return jsonify(post_data)
    else:
        return jsonify("No endpoint requested")

if __name__ == '__main__':
    run()
