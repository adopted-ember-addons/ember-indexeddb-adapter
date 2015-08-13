import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | update record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    clearObjectStore('post');
    Ember.run(this.application, 'destroy');
  }
});

test('update-record works', function(assert) {
  assert.expect(2);

  visit('/posts');

  click('a:contains("Dummy 1")');
  click('button:contains("Update Post")');

  andThen(function() {
    assert.equal(find('p:first').text(), 'Dummy Post');
    assert.equal(find('p:last').text(), 'Dummy');
  });
});
