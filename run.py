from flask import Flask, render_template, url_for, Blueprint, jsonify
import click
import sys
import config
# from flask_pymongo import PyMongo
from modules.pagelist import pages

app = Flask(__name__, static_folder='./site/static/build', template_folder='./site/templates')

# mongo = PyMongo(app, uri="mongodb://localhost:27017/cms", username="jackg", password="observe coleman sullivan guam")

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
    return render_template('home.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/module-list', methods=['POST', 'GET'])
def send_modules():
    return jsonify(pages)

if __name__ == '__main__':
    run()
