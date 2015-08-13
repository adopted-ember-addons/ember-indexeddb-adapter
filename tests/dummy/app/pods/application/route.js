import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    let fooUser = this.store.createRecord('user', {
      name: 'Foo'
    });

    let barUser = this.store.createRecord('user', {
      name: 'Bar'
    });

    let post1 = this.store.createRecord('post', {
      title: 'Dummy 1',
      body: 'Dummy'
    });

    let post2 = this.store.createRecord('post', {
      title: 'Dummy 2',
      body: 'Dumdum'
    });

    let post3 = this.store.createRecord('post', {
      title: 'Dummy 3',
      body: 'Dummy'
    });

    fooUser.get('posts').addObjects([post1, post2]);
    barUser.get('posts').addObject(post3);

    post1.save().then(() => post2.save().then(() => fooUser.save()));
    post3.save().then(() => barUser.save());
  }
});
