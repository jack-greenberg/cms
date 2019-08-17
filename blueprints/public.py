from flask import Blueprint, render_template

public = Blueprint('public', __name__, template_folder='../theme/templates', static_folder='../theme/static')

@public.route('/')
def public_index():
    return render_template('index.j2')
