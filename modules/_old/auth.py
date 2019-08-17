from modules.database import db
from bson import json_util
import json
import pprint
import bcrypt
import functools

class User:
    def __init__(self, id, uname, phash):
        self.id = id
        self.uname = uname
        self.phash = phash

def authenticate(username, password):
    for userdata in db.users.find({'uname': username}):
        stored_hash = userdata["phash"]
        if bcrypt.checkpw(password.encode(), stored_hash.encode()):
            return True
        else:
            return False

# def auth_needed(function, username, password):
#     def wrapper(*args, **kwargs):
#         if (function(*args, **kwargs)):
#             return True
#         else:
#             return False
#     return wrapper

# def auth_needed(view):
#     @functools.wraps(view)
#     def wrapped_view(**kwargs):
#         if g.user is None:
#             return redirect(url_for('admin.login'))
#
#         return view(**kwargs)
#
#     return wrapped_view
