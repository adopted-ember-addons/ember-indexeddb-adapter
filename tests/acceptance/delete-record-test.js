import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | delete record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('delete-record works', function(assert) {
  assert.expect(2);

  visit('/create-record');
  fillIn('input[type="text"]', 'Delete');
  fillIn('input[type="number"]', '20');
  click('#create-record');
  click('a:contains("Delete")');
  click('#delete-record');

  andThen(function() {
    assert.equal(currentURL(), '/create-record');
    assert.ok(find('a:contains("Delete")').length === 0);
  });
});
