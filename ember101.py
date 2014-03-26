#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import urllib
import logging
import webapp2
import datetime
import cgi

from webapp2_extras.routes import RedirectRoute
from webapp2_extras import jinja2
import json

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.api import mail
from google.appengine.api import memcache
from google.appengine.ext import ndb

class Contact(ndb.Model):
	first = ndb.StringProperty()
	last = ndb.StringProperty()
	avatar = ndb.StringProperty()


HTTP_DATE_FMT = "%a, %d %b %Y %H:%M:%S GMT"

def jinja2_factory(app):
	j = jinja2.Jinja2(app)
	j.environment.filters.update({
        #'naturaldelta':naturaldelta,
        })
	j.environment.globals.update({
        # 'Post': Post,
        #'ndb': ndb, # could be used for ndb.OR in templates
        })
	return j

class BaseHandler(webapp2.RequestHandler):
	@webapp2.cached_property
	def jinja2(self):
	# Returns a Jinja2 renderer cached in the app registry.
		return jinja2.get_jinja2(factory=jinja2_factory)

	def render_response(self, _template, **context):
		# Renders a template and writes the result to the response.
		rv = self.jinja2.render_template(_template, **context)
		self.response.write(rv)
	# def handle_exception(self, exception, debug):
	# 	# Log the error.
	# 	logging.exception(exception)
	# 	# Set a custom message.
	# 	self.response.write("An error occurred.")
	# 	# If the exception is a HTTPException, use its error code.
	# 	# Otherwise use a generic 500 error code.
	# 	if isinstance(exception, webapp2.HTTPException):
	# 		self.response.set_status(exception.code)
	# 	else:
	# 		self.response.set_status(500)
	def render_error(self, message):
		logging.exception("Error 500: {0}".format(message))
		self.response.write("Error 500: {0}".format(message))
		return self.response.set_status(500)		



class RootHandler(BaseHandler):
	def get(self):
		return self.render_response("main.html")

class ContactsHandler(BaseHandler):
	def get(self):
		contacts = Contact.query().fetch()
		#logging.info(obj)
		obj = dict()
		obj['contacts'] = list()
		for contact in contacts:
			current = dict()
			current['id'] = contact.key.id()
			current['first'] = contact.first
			current['last'] = contact.last
			current['avatar'] = contact.avatar
			obj['contacts'].append(current)
		logging.info(obj)

		self.response.headers['Content-Type'] = 'application/json'   
		return self.response.out.write(json.dumps(obj))
		# return self.response.write('{"contacts":[{"id":"abcdefg","first":"Ryan","last":"Florence","avatar":"http://www.gravatar.com/avatar/749001c9fe6927c4b069a45c2a3d68f7.jpg"},{"id":"123456","first":"Stanley","last":"Stuart","avatar":"https://si0.twimg.com/profile_images/3579590697/63fd9d3854d38fee706540ed6611eba7.jpeg"},{"id":"1a2b3c","first":"Eric","last":"Berry","avatar":"https://si0.twimg.com/profile_images/3254281604/08df82139b53dfa4a3a5adfa7e99426e.jpeg"}]}')


	def post(self):
		request = json.loads(cgi.escape(self.request.body))
		contact = Contact(first = request['contact']['first'],
						  last = request['contact']['last'],
						  avatar = request['contact']['avatar'])
		contact.put()
		# return self.redirect('/#/contacts/')

class ContactHandler(BaseHandler):
	def get(self, contact_id):
		contact.get_by_id(contact_id)

	def put(self, contact_id):
		request = json.loads(cgi.escape(self.request.body))
		contact = Contact.get_by_id(int(contact_id))
		contact.first = request['contact']['first']
		contact.last = request['contact']['last']
		contact.avatar = request['contact']['avatar']
		contact.put()

	def delete(self, contact_id):
		ndb.Key(Contact, int(contact_id)).delete()




application = webapp2.WSGIApplication([
	webapp2.Route(r'/', RootHandler, name='RootHandler'),
	webapp2.Route(r'/contacts', ContactsHandler, name='ContactsHandler'),
	webapp2.Route(r'/contacts/<contact_id:([^/]+)?>', ContactHandler, name='ContactHandler'),


	], debug=True)