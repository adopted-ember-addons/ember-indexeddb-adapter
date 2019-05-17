import { click, findAll, currentURL, visit } from '@ember/test-helpers';
import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | delete record', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    window.indexedDB.deleteDatabase('DummyDatabase');
  });

  test('delete-record works', async function(assert) {
    assert.expect(2);

    await visit('/posts');

    await click('a:contains("Dummy 1")');
    await click('div:contains("Delete Post")');

    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    later(() => {
      assert.equal(currentURL(), '/posts');
      assert.ok(findAll('#find-all a:contains("Dummy 1")').length === 0);
    }, 500);
  });
});
