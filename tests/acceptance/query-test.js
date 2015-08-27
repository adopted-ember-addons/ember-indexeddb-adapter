import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | query', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
    window.indexedDB.deleteDatabase('DummyDatabase');
  }
});

test('query works', function(assert) {
  assert.expect(3);

  visit('/posts');

  andThen(function() {
    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    Ember.run.later(() => {
      assert.ok(find('#query li').length === 2);
      assert.ok(find('#query p:contains("Dummy 1")').length > 0);
      assert.ok(find('#query p:contains("Dummy 3")').length > 0);
    }, 500);
  });
});
