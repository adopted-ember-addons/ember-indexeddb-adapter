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

  click('#create-record');

  andThen(function() {
    assert.ok(find('a:contains("Dummy")').length > 0);
  });
});
