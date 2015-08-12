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

test('create-record works', function(assert) {
  visit('/create-record');

  fillIn('input[type="text"]', 'Create');
  fillIn('input[type="number"]', '20');
  click('#create-record');

  andThen(function() {
    assert.equal(find('#status-message').text(), 'Create record success!');
  });
});
