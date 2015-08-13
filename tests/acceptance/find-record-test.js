import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | find record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    clearObjectStore('post');
    Ember.run(this.application, 'destroy');
  }
});

test('find-record works', function(assert) {
  assert.expect(2);
  
  visit('/posts');

  click('a:contains("Dummy 1")');

  andThen(function() {
    assert.equal(find('#find-record p:first').text(), 'Dummy 1');
    assert.equal(find('#find-record p:last').text(), 'Post about dummy 1');
  });
});
