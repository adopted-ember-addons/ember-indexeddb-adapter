import { findAll, visit } from '@ember/test-helpers';
import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | query', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    window.indexedDB.deleteDatabase('DummyDatabase');
  });

  test('query works', async function(assert) {
    assert.expect(3);

    await visit('/posts');

    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    later(() => {
      assert.ok(findAll('#query li').length === 2);
      assert.ok(findAll('#query p:contains("Dummy 1")').length > 0);
      assert.ok(findAll('#query p:contains("Dummy 3")').length > 0);
    }, 500);
  });
});
