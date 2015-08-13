import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    this.store.createRecord('post', {
      title: 'Dummy 1',
      body: 'Dummy'
    }).save();

    this.store.createRecord('post', {
      title: 'Dummy 2',
      body: 'Dumdum'
    }).save();

    this.store.createRecord('post', {
      title: 'Dummy 3',
      body: 'Dummy'
    }).save();
  }
});
