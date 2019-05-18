import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { getContext } from '@ember/test-helpers';
import IndexedDBAdapter from 'ember-indexeddb-adapter/adapters/indexeddb';

module('Unit | Adapter | indexeddb adapter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('adapter.indexeddb-adapter', IndexedDBAdapter);
  });

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:indexeddb-adapter');
    assert.ok(adapter);
  });
});
