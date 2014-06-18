var App = Ember.Application.create();

/*App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.RESTAdapter.create({
    url: 'http://addressbook-api.herokuapp.com'
  })
});
*/

App.Store = DS.Store.extend({  
  adapter: DS.RESTAdapter
});  

DS.RESTAdapter.reopen({
  /*host: 'http://addressbook-api.herokuapp.com'*/
  host: 'http://localhost:11080/api'
});

// change this to stories for content management on landing page
App.Contact = DS.Model.extend({
  first: DS.attr('string'),
  last: DS.attr('string'),
  avatar: DS.attr('string'),
  github: DS.attr('string'),
  twitter: DS.attr('string'),
  notes: DS.attr('string')
});

App.User = DS.Model.extend({
  creation_date: DS.attr('string'),
  creation_author: DS.attr('string'),
  modification_date: DS.attr('string'),
  modification_author: DS.attr('string'),
  avatar: DS.attr('string'),
  email: DS.attr('string'),
  certification: DS.attr('string'),
  level: DS.attr('string')
});

App.Dive = DS.Model.extend({
  creation_date: DS.attr('string'),
  creation_author: DS.attr('string'),
  modification_date: DS.attr('string'),
  modification_author: DS.attr('string')
});

App.Router.map(function() {
  this.resource('app');
  this.resource('contact', {path: '/contact/:contact_id'});
  this.resource('users', {path: '/users'});
  this.resource('user', {path: '/users/:user_id'});
  this.resource('dives', {path: '/dives'});
  this.resource('dive', {path: '/dives/dive_id'});
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    //return App.Contact.find();
    return this.store.find('contact');
  },
  actions: {
    createUser: function() {
      contact = this.store.createRecord('contact', {
        first: '',
        last: '',
        avatar: ''
      });
      this.transitionTo('contact', contact);
    },
  }
});

App.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('contact', params.contact_id);
  },
  actions: {
  	save: function() {
  		var contact = this.modelFor('contact');
  		contact.save()
  	},
   deleteContact: function() {
    var contact = this.modelFor('contact');

    contact.deleteRecord();
    contact.save();    	
  }
}
});

App.UsersRoute =  Ember.Route.extend({
  model: function() {
    return this.store.find('user');
  },

});

App.UserRoute =  Ember.Route.extend({
  model: function() {
    return this.store.find('user', params.contact_id);
  },

});

App.DivesRoute =  Ember.Route.extend({
  model: function() {
    return this.store.find('dive');
  },

});

App.DiveRoute =  Ember.Route.extend({
  model: function() {
    return this.store.find('dive', params.contact_id);
  },

});