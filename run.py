from flask import Flask
import config

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello to the World of Flask!'

if __name__ == '__main__':
    app.config.from_object('config.DevelopmentConfig')
    app.run()
