from flask import Flask, render_template, url_for, Blueprint, jsonify, redirect
import click
import sys
import config
from modules.page_data import page_data, page_list

app = Flask(__name__, static_folder='./site/static/build', template_folder='./site/templates')

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
    return render_template('home.j2', page_title="Home", module_data=page_data[0])

@app.route('/<page>')
def subpage(page):
    if page in page_list:
        if page == 'home':
            return redirect(url_for('index'))
        else:
            return render_template('home.j2', page_title=page, module_data=list(page_data.keys()))
    else:
        return render_template('404.j2'), 404

@app.route('/admin')
def admin():
    return render_template('admin.j2')

@app.route('/page-data', methods=['POST', 'GET'])
def send_modules():
    return jsonify(page_data)

if __name__ == '__main__':
    run()
