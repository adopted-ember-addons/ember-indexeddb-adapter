import { findAll, visit } from '@ember/test-helpers';
import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | find all', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    window.indexedDB.deleteDatabase('DummyDatabase');
  });

  test('find-all works', async function(assert) {
    assert.expect(6);

    await visit('/posts');

    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    later(() => {
      assert.ok(findAll('#find-all li').length === 3);
      assert.ok(findAll('#find-all div p:contains("Foo")').length > 0);
      assert.ok(findAll('#find-all div p:contains("Bar")').length > 0);
      assert.ok(findAll('#find-all a p:contains("Dummy 1")').length > 0);
      assert.ok(findAll('#find-all a p:contains("Dummy 2")').length > 0);
      assert.ok(findAll('#find-all a p:contains("Dummy 3")').length > 0);
    }, 500);
  });
});
