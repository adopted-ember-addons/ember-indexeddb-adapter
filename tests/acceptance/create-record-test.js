import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | create record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
    window.indexedDB.deleteDatabase('DummyDatabase');
  }
});

test('create-record works', function(assert) {
  visit('/posts');

  click('button:contains("New Post")');

  andThen(function() {
    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    Ember.run.later(() => {
      assert.ok(find('#find-all a').length === 4);
      assert.ok(find('#find-all a p:contains("New Dummy")').length > 0);
    }, 500);
  });
});
