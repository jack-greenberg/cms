from flask import Flask
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
    return app

app = create_app(DevelopmentConfig)

if __name__ == '__main__':
    print('Running...')
    app.run(host='0.0.0.0')
