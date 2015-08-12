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
  visit('/create-record');
  click('#create-record');
  click('a:contains("Dummy")');

  andThen(function() {
    assert.equal(find('#record-name').text(), 'Dummy');
    assert.equal(find('#record-age').text(), '20');
  });
});
