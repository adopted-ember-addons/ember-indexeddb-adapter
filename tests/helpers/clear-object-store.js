import Ember from 'ember';

/**
 * Clear object store after every acceptance test run.
 * This allows our IndexedDB to have a clean slate whenever an
 * acceptance test runs.
 * param {object} app Don't know this. It's passed in by Ember and is required.
 * param {string} store Store to clear
 */
export default Ember.Test.registerAsyncHelper(
    'clearObjectStore', (app, store) => {
      let request = window.indexedDB.open('DummyDatabase');

      request.onsuccess = function(event) {
        let db = event.target.result;
        let objectStore = db.transaction([store], 'readwrite').
            objectStore(store);

        objectStore.clear();
      };
    });
