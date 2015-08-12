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
        name: this.$('input[type="text"]').val(),
        age: parseInt(this.$('input[type="number"]').val())
      }).save().then(() => this.set('statusMessage', 'Create record success!'));
    }
  }
});
