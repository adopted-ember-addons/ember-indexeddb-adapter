import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | find record', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
    window.indexedDB.deleteDatabase('DummyDatabase');
  }
});

test('find-record works', function(assert) {
  assert.expect(2);
  
  visit('/posts');

  click('a:contains("Dummy 1")');

  andThen(function() {
    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    Ember.run.later(() => {
      assert.equal(find('#find-record p:first').text(), 'Dummy 1');
      assert.equal(find('#find-record p:last').text(), 'Dummy');
    }, 500);
  });
});
