import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | create record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    clearObjectStore('post');
    Ember.run(this.application, 'destroy');
  }
});

test('create-record works', function(assert) {
  visit('/posts');

  click('button:contains("New Post")');

  andThen(function() {
    assert.ok(find('#find-all a').length === 4);
    assert.ok(find('#find-all a p:contains("New Dummy")').length > 0);
  });
});
