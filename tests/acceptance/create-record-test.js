import { click, findAll, visit } from '@ember/test-helpers';
import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | create record', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    window.indexedDB.deleteDatabase('DummyDatabase');
  });

  test('create-record works', async function(assert) {
    await visit('/posts');

    await click('button:contains("New Post")');

    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    later(() => {
      assert.ok(findAll('#find-all a').length === 4);
      assert.ok(findAll('#find-all a p:contains("New Dummy")').length > 0);
    }, 500);
  });
});
