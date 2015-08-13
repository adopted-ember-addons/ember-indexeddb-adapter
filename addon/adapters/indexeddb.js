import DS from 'ember-data';
import Ember from 'ember';

export default DS.Adapter.extend({
  /**
   * Database name
   * @type {string}
   */
  dbName: 'database',

  /**
   * Database version number.
   * Whenever this number is greater than the version number of the existing
   * database, this will update it's schema.
   * @type {number}
   */
  version: 1,

  /**
   * Open IndexedDB and upgrade if necessary
   */
  init() {
    let self = this;
    let request = window.indexedDB.open(this.get('dbName'),this.get('version'));

    request.onerror = function() {
      console.log('Unable to open IndexedDB');
    };

    request.onupgradeneeded = function(event) {
      let db = event.target.result;
      
      db.onerror = function(event) {
        console.log('IndexedDB error: ' + event.target.errorCode);
      };

      for (let model of self.get('models')) {
        if (!db.objectStoreNames.contains(model)) {
          db.createObjectStore(model, {keyPath: 'id'});
        }
      }
    };
  },

  /**
   * Open IndexedDB
   * return {promise} Promise that contains an IDBOpenDBRequest instance
   */
  openDatabase() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let request = window.indexedDB.open(this.get('dbName'));

      request.onerror = function(event) {
        console.log('Unable to open IndexedDB');
        Ember.run(null, reject, event);
      };

      request.onsuccess = function(event) {
        Ember.run(null, resolve, event.target.result);
      };
    });
  },

  /**
   * Generate a random number for ID
   * return {string} Generated ID
   */
  generateIdForRecord() {
    return Math.random().toString(32).slice(2).substr(0, 5);
  },

  /**
   * Create new record
   * param {object} store DS.Store
   * param {object} type DS.Model class of the record
   * param {object} snapshot DS.Snapshot
   * return {promise} Promise that contains the record
   */
  createRecord(store, type, snapshot) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = this.serialize(snapshot, {includeId: true});
        let modelName = type.modelName;
        let objectStore = db.transaction([modelName], 'readwrite').
            objectStore(modelName);
        let request = objectStore.add(data);

        request.onsuccess = function() {
          db.close();
          Ember.run(null, resolve, data);
        };

        request.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };
      });
    });
  },

  /**
   * Find record by it's ID
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {string} id ID
   * return {promise} Promise that contains the record
   */
  findRecord(store, type, id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let modelName = type.modelName;
        let objectStore = db.transaction([modelName]).objectStore(modelName);
        let request = objectStore.get(id);

        request.onsuccess = function() {
          db.close();
          Ember.run(null, resolve, request.result);
        };

        request.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };
      });
    });
  },

  /**
   * Find all records
   * param {object} store DS.Store
   * param {object} type DS.Model
   * return {promise} Promise that contains the record
   */
  findAll(store, type) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = [];
        let modelName = type.modelName;
        let objectStore = db.transaction([modelName]).objectStore(modelName);
        let request = objectStore.openCursor();

        request.onsuccess = function(event) {
          let cursor = event.target.result;

          if (cursor) {
            data.push(cursor.value);
            cursor.continue();
          } else {
            Ember.run(null, resolve, data);
          }
        };
        
        request.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };
      });
    });
  },

  /**
   * Update record
   * param {object} store DS.Store
   * param {object} type DS.Model class of the record
   * param {object} snapshot DS.Snapshot
   * return {promise} Promise that contains the record
   */
  updateRecord(store, type, snapshot) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = this.serialize(snapshot, {includeId: true});
        let modelName = type.modelName;
        let objectStore = db.transaction([modelName], 'readwrite').
            objectStore(modelName);
        let request = objectStore.get(snapshot.id);

        request.onsuccess = function() {
          let requestUpdate = objectStore.put(data);

          requestUpdate.onsuccess = function() {
            db.close();
            Ember.run(null, resolve, data);
          };

          requestUpdate.onerror = function(event) {
            console.log('IndexedDB error: ' + event.target.errorCode);
            db.close();
            Ember.run(null, reject, event);
          };
        };
      });
    });
  },

  /**
   * Delete record
   * param {object} store DS.Store
   * param {object} type DS.Model class of the record
   * param {object} snapshot DS.Snapshot
   * return {promise} Promise that contains the record
   */
  deleteRecord(store, type, snapshot) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = this.serialize(snapshot, {includeId: true});
        let modelName = type.modelName;
        let objectStore = db.transaction([modelName], 'readwrite').
            objectStore(modelName);
        let request = objectStore.delete(snapshot.id);

        request.onsuccess = function() {
          db.close();
          Ember.run(null, resolve, data);
        };

        request.onerror = function() {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };
      });
    });
  },

  /**
   * TODO: See if using index is feasible
   *
   * Find a record that matches the query
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {object} query Query object
   * return {promise} Promise that contains the record
   */
  queryRecord(store, type, query) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let modelName = type.modelName;
        let queryKeys = Object.keys(query);
        let objectStore = db.transaction([modelName]).objectStore(modelName);
        let request = objectStore.openCursor();

        request.onsuccess = function(event) {
          let cursor = event.target.result;

          if (cursor) {
            let queryKeyMatchCount = 0;

            for (let key of queryKeys) {
              if (cursor.value[key] === query[key]) {
                queryKeyMatchCount++;
              }
            }

            if (queryKeyMatchCount === queryKeys.length) {
              db.close();
              Ember.run(null, resolve, cursor.value);
            } else {
              cursor.continue();
            }
          } else {
            db.close();
            Ember.run(null, resolve, null);
          }
        };
        
        request.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };
      });
    });
  },

  /**
   * TODO: See if using index is feasible
   *
   * Find records that matches the query
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {object} query Query object
   * return {promise} Promise that contains the records
   */
  query(store, type, query) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = [];
        let modelName = type.modelName;
        let queryKeys = Object.keys(query);
        let objectStore = db.transaction([modelName]).objectStore(modelName);
        let request = objectStore.openCursor();

        request.onsuccess = function(event) {
          let cursor = event.target.result;

          if (cursor) {
            let queryKeyMatchCount = 0;

            for (let key of queryKeys) {
              if (cursor.value[key] === query[key]) {
                queryKeyMatchCount++;
              }
            }

            if (queryKeyMatchCount === queryKeys.length) {
              data.push(cursor.value);
            }

            cursor.continue();
          } else {
            db.close();
            Ember.run(null, resolve, data);
          }
        };
        
        request.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };
      });
    });
  }
});
