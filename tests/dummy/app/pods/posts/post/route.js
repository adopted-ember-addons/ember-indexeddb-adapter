import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return hash({
      post: this.store.findRecord('post', params.post_id),
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
