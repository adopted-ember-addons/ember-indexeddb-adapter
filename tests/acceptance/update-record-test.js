import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | update record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('update-record works', function(assert) {
  visit('/create-record');
  click('#create-record');
  click('a:contains("Dummy")');
  click('#update-record');

  andThen(function() {
    assert.equal(find('#record-name').text(), 'Dummy');
    assert.equal(find('#record-age').text(), '25');
  });
});
