import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout: layout,
  store: service(),

  actions: {
    createPost() {
      this.get('store').createRecord('post', {
        title: 'New Dummy',
        body: 'I\'m a new dummy'
      });
    }
  }
});
