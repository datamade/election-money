from flask import Flask, request, make_response, render_template
from datetime import date, datetime, timedelta
from operator import itemgetter
import json
import re
import os
import operator
import boto

app = Flask(__name__)

# ROUTES
@app.route('/')
def index():

  try:
    conn = boto.connect_s3()
    bucket = conn.get_bucket('il-elections')
    file_list = [key for key in bucket.list()]
    for key in file_list:
        print key.name.encode('utf-8')

  except ValueError:
      print "Error opening S3 bucket"

  return render_app_template('index.html', list=file_list)

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
