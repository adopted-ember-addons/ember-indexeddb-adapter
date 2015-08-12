import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  store: Ember.inject.service(),
  statusMessage: null,

  actions: {
    /**
     * Create dummy record
     */
    createRecord() {
      this.get('store').createRecord('person', {
        name: 'Dummy',
        age: 20
      }).save().then(() => this.set('statusMessage', 'Create record success!'));
    }
  }
});
