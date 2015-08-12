import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  store: Ember.inject.service(),

  actions: {
    /**
     * Update dummy record
     */
    updateRecord() {
      this.set('person.age', 25);
      this.attrs.person.save();
    },

    /**
     * Delete dummy record
     */
    deleteRecord() {
      this.attrs.person.destroyRecord();
    }
  }
});
