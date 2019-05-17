import { findAll, find, visit } from '@ember/test-helpers';
import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | query record', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    window.indexedDB.deleteDatabase('DummyDatabase');
  });

  test('query record works', async function(assert) {
    assert.expect(2);

    await visit('/posts');

    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    later(() => {
      assert.ok(findAll('#query-record li').length === 1);
      assert.dom(find('#query-record li p:first')).hasText('Dummy 3');
    }, 500);
  });
});
