import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | find all', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
    window.indexedDB.deleteDatabase('DummyDatabase');
  }
});

test('find-all works', function(assert) {
  assert.expect(6);

  visit('/posts');

  andThen(function() {
    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    Ember.run.later(() => {
      assert.ok(find('#find-all li').length === 3);
      assert.ok(find('#find-all div p:contains("Foo")').length > 0);
      assert.ok(find('#find-all div p:contains("Bar")').length > 0);
      assert.ok(find('#find-all a p:contains("Dummy 1")').length > 0);
      assert.ok(find('#find-all a p:contains("Dummy 2")').length > 0);
      assert.ok(find('#find-all a p:contains("Dummy 3")').length > 0);
    }, 500);
  });
});
