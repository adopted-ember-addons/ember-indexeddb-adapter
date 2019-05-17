import { click, find, visit } from '@ember/test-helpers';
import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | update record', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    window.indexedDB.deleteDatabase('DummyDatabase');
  });

  test('update-record works', async function(assert) {
    assert.expect(2);

    await visit('/posts');

    await click('a:contains("Dummy 1")');
    await click('button:contains("Update Post")');

    // Give 500ms for all promises to finish as an ugly workaround to avoid
    // inFlight errors
    later(() => {
      assert.dom(find('#find-record p:first')).hasText('Dummy Post');
      assert.dom(find('#find-record p:last')).hasText('Dummy');
    }, 500);
  });
});
