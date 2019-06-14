from flask import Flask, render_template, url_for, Blueprint, jsonify, redirect, make_response
from werkzeug.security import check_password_hash, generate_password_hash
import click
import functools
import sys
import config
# from modules.page_data import page_data, page_list
from modules.auth import User, authenticate #, auth_needed
from modules.database import db
from bson import json_util
import json

app = Flask(__name__, static_folder='./static/build')

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
    app.run()

@app.route('/')
def index():
    return "coming soon"
    return render_template('site/home.j2', page_title="Home", module_data=page_data['Home'])

@app.route('/<page>')
def subpage(page):
    return "coming soon"
    page_list = []
    for page in db.pages.find():
        page_list.append(page["name"])

    if page in page_list:
        if page == 'home':
            return redirect(url_for('index'))
        else:
            return render_template('site/home.j2', page_title=page, module_data=page_list[page])
    else:
        return render_template('404.j2'), 404


@app.route('/admin/')
def admin_root():
    return render_template('admin/admin.j2')

@app.route('/admin/<page>/')
def admin_sub(page=None):
    return render_template('admin/admin.j2')


# API
@app.route('/api/<request>/', methods=['POST'])
def response(request):
    if (request == 'backend-data'):
        backend_data = {}
        robot_text = ""

        with app.open_resource('robots.txt') as f:
            robot_text = f.read()

        for doc in db.siteData.find():
            backend_data[doc["name"]] = (json.loads(json_util.dumps(doc)));

        backend_data["seo"]["data"]["robots"] = robot_text.decode()
        return jsonify(backend_data);
    elif (request == 'page-list'):
        page_list = []

        for page in db.pages.find():
            page_list.append(page["name"])
        return jsonify(page_list)
    elif (request == 'robots'):
        response = ""
        robots = f.open('robots.txt')
        for line in robots:
            response += line + '\n'
        return jsonify(response)
    else:
        return jsonify("No endpoint requested")

if __name__ == '__main__':
    run()
