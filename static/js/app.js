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
  host: 'http://localhost:11080'
});


App.Contact = DS.Model.extend({
  first: DS.attr('string'),
  last: DS.attr('string'),
  avatar: DS.attr('string'),
  github: DS.attr('string'),
  twitter: DS.attr('string'),
  notes: DS.attr('string')
});

App.Router.map(function() {
  this.resource('contact', {path: '/contact/:contact_id'});
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    //return App.Contact.find();
    return this.store.find('contact')
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
    return this.store.find('contact', params.contact_id)
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