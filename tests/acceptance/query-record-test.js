import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | query record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
    window.indexedDB.deleteDatabase('DummyDatabase');
  }
});

test('query record works', function(assert) {
  assert.expect(2);

  visit('/posts');

  andThen(function() {
    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    Ember.run.later(() => {
      assert.ok(find('#query-record li').length === 1);
      assert.equal(find('#query-record li p:first').text(), 'Dummy 3');
    }, 500);
  });
});
