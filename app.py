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
@cache.cached(timeout=60*10) # cache for 10 min
def index():

  try:
    conn = boto.connect_s3()
    bucket = conn.get_bucket('il-elections')

    # for geting folder listings: http://docs.pythonboto.org/en/latest/ref/s3.html?highlight=s3connection#boto.s3.bucket.Bucket.list
    receipts_list = [key for key in bucket.list("Receipts/", "/")]
    expenditures_list = [key for key in bucket.list("Expenditures/", "/")]
    file_list = [key for key in bucket.list()]

  except ValueError:
      print "Error opening S3 bucket"

  return render_app_template('index.html', receipts_list=receipts_list, expenditures_list=expenditures_list)

# UTILITY
@app.context_processor
def utility_processor():
    def format_file(num):
      for x in ['bytes','KB','MB','GB','TB']:
          if num < 1024.0:
              return "%3.1f %s" % (num, x)
          num /= 1024.0
    def format_datetime(str):
      return datetime.strptime(str, "%Y-%m-%dT%H:%M:%S.000Z").strftime("%b %e, %Y %I:%M %p")

    return dict(format_file=format_file, format_datetime=format_datetime)

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
