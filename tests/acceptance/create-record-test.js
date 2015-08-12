import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | create record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('find-record works', function(assert) {
  visit('/create-record');

  click('#create-record');

  andThen(function() {
    assert.equal(find('#status-message').text(), 'Create record success!');
  });
});
