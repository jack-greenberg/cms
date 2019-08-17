from pymongo import MongoClient
import sys
from os.path import dirname, join
# from app import production_mode
import yaml

file = open(join(dirname(__file__), "../private/config.yml"))

# database_name = 'dev' if production_mode is 'dev' else 'production'
database_name = 'dev' if True else 'production'

db_data = yaml.load(file.read(), Loader=yaml.SafeLoader)[database_name]['db']

client = MongoClient(
    db_data['host'] + ':' + str(db_data['port']),
    username=db_data['user'],
    password=db_data['pw'],
    authSource=db_data['dbName']
)
db = client[db_data['dbName']]
