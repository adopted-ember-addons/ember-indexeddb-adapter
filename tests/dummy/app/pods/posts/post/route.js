import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      post: this.store.findRecord('post', params.post_id),
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
