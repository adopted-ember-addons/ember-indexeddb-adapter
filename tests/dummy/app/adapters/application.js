import IndexedDBAdapter from 'ember-indexeddb-adapter/adapters/indexeddb';

export default IndexedDBAdapter.extend({
  dbName: 'DummyDatabase',
  version: 1,
  models: ['person']
});
