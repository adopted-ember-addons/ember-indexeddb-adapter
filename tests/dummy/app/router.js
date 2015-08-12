import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('create-record', function() {
    this.route('find-record', {path: 'find-record/:person_id'});
  });
  this.route('query-record');
});

export default Router;
