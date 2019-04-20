from flask import Flask, render_template, url_for
import click
import sys
import config

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
    return render_template('home.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == '__main__':
    run()
