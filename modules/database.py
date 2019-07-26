from pymongo import MongoClient
import sys
from os.path import dirname, join
import yaml

file = open(join(dirname(__file__), "../admin/pw.yaml"))

db_data = yaml.load(file.read())['production' if True else 'dev']['db']

client = MongoClient(
    db_data['host'] + ':' + str(db_data['port']),
    username=db_data['user'],
    password=db_data['pw'],
    authSource=db_data['dbName']
)
db = client[db_data['dbName']]
