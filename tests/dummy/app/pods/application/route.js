import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    this.store.createRecord('person', {
      name: 'Dummy 1',
      age: 20
    }).save();

    this.store.createRecord('person', {
      name: 'Dummy 2',
      age: 25
    }).save();

    this.store.createRecord('person', {
      name: 'Dummy 3',
      age: 20
    }).save();
  }
});
