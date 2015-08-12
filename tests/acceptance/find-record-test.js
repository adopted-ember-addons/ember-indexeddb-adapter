import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | find record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('find-record works', function(assert) {
  visit('/find-record');

  andThen(function() {
    assert.equal(find('#find-record p:first').text(), 'Dummy');
    assert.equal(find('#find-record p:last').text(), '20');
  });
});
