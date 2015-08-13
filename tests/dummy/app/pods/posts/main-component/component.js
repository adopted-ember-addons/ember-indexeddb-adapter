import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  store: Ember.inject.service(),

  actions: {
    createPost() {
      this.get('store').createRecord('post', {
        title: 'New Dummy',
        body: 'I\'m a new dummy'
      });
    }
  }
});
