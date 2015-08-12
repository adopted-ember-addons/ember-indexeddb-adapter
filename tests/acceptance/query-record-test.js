import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | query record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('query record works', function(assert) {
  assert.expect(2);

  visit('/query-record');

  andThen(function() {
    assert.ok(find('li').length === 1);
    assert.equal(find('li p:first').text(), 'Dummy 3');
  });
});
