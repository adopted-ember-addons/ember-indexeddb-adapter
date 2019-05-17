import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return hash({
      posts: this.store.findAll('post'),
      queryPost: this.store.queryRecord(
          'post', {title: 'Dummy 3', body: 'Dummy'}),
      queryPosts: this.store.query('post', {body: 'Dummy'})
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
