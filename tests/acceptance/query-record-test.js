import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | query record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    clearObjectStore('post');
    Ember.run(this.application, 'destroy');
  }
});

test('query record works', function(assert) {
  assert.expect(2);

  visit('/posts');

  andThen(function() {
    assert.ok(find('#query-record li').length === 1);
    assert.equal(find('#query-record li p:first').text(), 'Dummy 3');
  });
});
