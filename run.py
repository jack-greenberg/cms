from flask import Flask, render_template, url_for, jsonify, redirect, request, session, flash
from flask.views import MethodView
from flask_jwt_extended import JWTManager, fresh_jwt_required, jwt_required, create_access_token, get_jwt_identity, jwt_refresh_token_required, create_refresh_token, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash, safe_str_cmp
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
from modules.api import *
import jinja2, markdown

"""
Set up the Flask instance, and set the JWT options
"""
app = Flask(__name__, static_folder='./static')
app.config['SECRET_KEY'] = b'dev'
app.config['JWT_SECRET_KEY'] = b'dev'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/token-refresh/'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True
jwt = JWTManager(app)


@app.template_filter()
def safe_markdown(text):
    return jinja2.Markup(markdown.markdown(text))

@app.template_filter()
def make_date(date):
    return date.strftime("%b %d, %Y")

@app.template_filter()
def retrieve_content(contentId):
    return db.content.find_one({'_id': contentId})

env = jinja2.Environment(autoescape=True)
env.filters['safe_markdown'] = safe_markdown

"""
Register API from modules/api.py

From http://flask.pocoo.org/docs/1.0/views/#method-views-for-apis
"""
def register_api(view, endpoint, url, pk='id', pk_type='string'):
    view_func = view.as_view(endpoint)
    app.add_url_rule(url, defaults={pk: None},
                     view_func=view_func, methods=['GET',])
    app.add_url_rule(url, view_func=view_func, methods=['POST',])
    app.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), view_func=view_func, methods=['POST', 'GET', 'PUT', 'DELETE'])

register_api(SiteAPI, 'site_api', '/api/v1/siteData/', pk='type', pk_type='string')
register_api(PostAPI, 'post_api', '/api/v1/posts/', pk='post_id', pk_type='string')
register_api(ContentAPI, 'content_api', '/api/v1/content/', pk='content_id', pk_type='string')
register_api(PageAPI, 'page_api', '/api/v1/pages/', pk='page_name', pk_type='string')


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


@app.before_request
def start_session():
    # Before each request, check to see if there is a user logged in. This bit might not be necessary, in which case it will be removed in the future
    try:
        assert session['username']
    except (AssertionError, KeyError):
        session['username'] = ""

@app.route('/')
def index():
    return "coming soon"

@app.route('/tags/')
def tags():
    tagList = json.loads(json_util.dumps(db.posts.find({}, {'tags': 1})))
    noIdTagList = [ item['tags'] for item in tagList ]
    allTags = [ tag for tagGroup in noIdTagList for tag in tagGroup ]
    return render_template('site/tags.j2', tagList=allTags)

@app.route('/tags/<tag>/')
def singleTag(tag):
    _postList = db.posts.find(
        {'tags': tag}
    )
    postList = json.loads(json_util.dumps(_postList))
    return tag

@app.route('/<page>/')
def subpage(page):
    return "coming soon"

@app.route('/login/', methods=['GET', 'POST'])
def login():
    try:
        assert session['username'] # if the user is already logged in, send them to the admin page
        return redirect(url_for('admin_root'))
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
    post_data = db.posts.find_one({'_id': ObjectId(post_id)})
    return render_template('post.j2', post_data=post_data, private=True)

@app.route('/api/token-refresh/', methods=['POST']) # refresh the token
@jwt_refresh_token_required # refresh token is needed to do this
def refresh():
    new_token = create_access_token(identity=get_jwt_identity(), fresh=True)
    response = jsonify({'access_token': new_token})
    return response

if __name__ == '__main__':
    run()
