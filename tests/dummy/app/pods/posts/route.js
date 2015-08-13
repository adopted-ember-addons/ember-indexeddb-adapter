import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      posts: this.store.findAll('post'),
      queryPost: this.store.queryRecord(
          'post', {title: 'Dummy 3', body: 'Dummy'})
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
