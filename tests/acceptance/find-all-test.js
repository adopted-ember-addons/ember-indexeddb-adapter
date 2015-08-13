import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | find all', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    clearObjectStore('user');
    clearObjectStore('post');
    Ember.run(this.application, 'destroy');
  }
});

test('find-all works', function(assert) {
  assert.expect(6);

  visit('/posts');

  andThen(function() {
    assert.ok(find('#find-all li').length === 3);
    assert.ok(find('#find-all div p:contains("Foo")').length > 0);
    assert.ok(find('#find-all div p:contains("Bar")').length > 0);
    assert.ok(find('#find-all a p:contains("Dummy 1")').length > 0);
    assert.ok(find('#find-all a p:contains("Dummy 2")').length > 0);
    assert.ok(find('#find-all a p:contains("Dummy 3")').length > 0);
  });
});