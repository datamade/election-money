from flask import Flask, request, make_response, render_template
from flask.ext.cache import Cache
from datetime import date, datetime, timedelta
from operator import itemgetter
import json
import re
import os
import operator
import boto

app = Flask(__name__)
cache = Cache(config={'CACHE_TYPE': 'simple'})
cache.init_app(app)

app.config['DEBUG'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True

# ROUTES
@app.route('/')
# @cache.cached(timeout=60*10) # cache for 10 min
def index():
  return render_app_template('index.html')

@app.route('/about')
# @cache.cached(timeout=60*10) # cache for 10 min
def about():
  return render_app_template('about.html')

@app.route('/list/<list_type>/')
def get_list_type(list_type):
    conn = boto.connect_s3()
    bucket = conn.get_bucket('il-elections')
    bucket_list = bucket.list(list_type.title())
    list_list = [key for key in bucket_list]
    resp_list = []
    for key in list_list:
        if key.size > 0:
            d = {
                'bucket': key.bucket.name,
                'size': format_file(key.size),
                'size_bytes': key.size,
                'name': key.name.encode('utf-8'),
                'modified_date': format_datetime(key.last_modified),
                'last_modified': key.last_modified,
            }
            resp_list.append(d)
    resp = make_response(json.dumps(resp_list))
    resp.headers['Content-Type'] = 'application/json'
    return resp

# UTILITY
@app.template_filter('format_file')
def format_file(num):
  for x in ['bytes','KB','MB','GB','TB']:
      if num < 1024.0:
          return "%3.1f %s" % (num, x)
      num /= 1024.0

app.jinja_env.filters['format_file'] = format_file

@app.template_filter('format_datetime')
def format_datetime(str):
  return datetime.strptime(str, "%Y-%m-%dT%H:%M:%S.000Z").strftime("%b %e, %Y %I:%M %p")

app.jinja_env.filters['format_datetime'] = format_datetime


def render_app_template(template, **kwargs):
    '''Add some goodies to all templates.'''

    if 'config' not in kwargs:
        kwargs['config'] = app.config
    return render_template(template, **kwargs)

def sizeof_fmt(num):
    for x in ['bytes','KB','MB','GB','TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0

# INIT
if __name__ == "__main__":
    app.run(debug=True, port=9999)
