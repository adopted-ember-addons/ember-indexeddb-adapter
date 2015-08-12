import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | find all', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('find-all works', function(assert) {
  visit('/create-record');

  fillIn('input[type="text"]', 'Find All');
  fillIn('input[type="number"]', '20');
  click('#create-record');

  andThen(function() {
    assert.ok(find('a:contains("Find All")').length > 0);
  });
});
