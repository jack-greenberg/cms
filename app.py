from flask import Flask
import jinja2, markdown
from config import ProductionConfig, DevelopmentConfig

production_mode = 'dev'

def create_app(config):
    #* Define app
    app = Flask(__name__)
    app.config.from_object(config)

    #* Set up JWT
    # pylint: disable=unused-variable
    from flask_jwt_extended import JWTManager
    jwt = JWTManager(app)

    #* Set up blueprints
    from blueprints.public import public
    from blueprints.admin import admin
    from blueprints.api import api
    app.register_blueprint(public)
    app.register_blueprint(admin)
    app.register_blueprint(api)

    #* Set up database
    from modules.database import db

    #* Set up Jinja Stuff
    def safe_markdown(text):
        return jinja2.Markup(markdown.markdown(text))
    def make_date(date):
        return date.strftime("%b %d, %Y")
    def retrieve_content(contentId):
        return db.content.find_one({'_id': contentId})

    app.jinja_env.filters['safe_markdown'] = safe_markdown
    app.jinja_env.filters['make_date'] = make_date
    app.jinja_env.filters['retrieve_content'] = retrieve_content

    return app

    # @app.template_filter()
    

    # env = jinja2.Environment(autoescape=True)
    # env.filters['safe_markdown'] = safe_markdown


app = create_app(DevelopmentConfig)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0')
