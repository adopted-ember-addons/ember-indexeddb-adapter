import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      person: this.store.findRecord('person', params.person_id),
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
