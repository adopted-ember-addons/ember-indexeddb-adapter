import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    this.store.createRecord('person', {
      id: 'testId',
      name: 'Dummy',
      age: 20
    }).save();
  },

  model() {
    return Ember.RSVP.hash({
      person: this.store.findRecord('person', 'testId')
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
