import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    this.store.createRecord('post', {
      title: 'Dummy 1',
      body: 'Post about dummy 1'
    }).save();

    this.store.createRecord('post', {
      title: 'Dummy 2',
      body: 'Post about dummy 2'
    }).save();

    this.store.createRecord('post', {
      title: 'Dummy 3',
      body: 'Post about dummy 3'
    }).save();
  }
});
