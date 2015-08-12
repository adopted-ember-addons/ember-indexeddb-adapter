import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      person: this.store.queryRecord('person', {name: 'Dummy 3', age: 20})
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
