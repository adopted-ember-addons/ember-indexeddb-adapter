import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      people: this.store.findAll('person'),
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
