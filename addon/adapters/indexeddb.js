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
          db.createObjectStore('person', {keyPath: 'id'});
        }
      }
    };
  },

  /**
   * Open IndexedDB
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
   */
  createRecord(store, type, snapshot) {
    let data = this.serialize(snapshot, {includeId: true});
    let modelName = type.modelName;

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let transaction = db.transaction([modelName], 'readwrite');
        let objectStore = transaction.objectStore(modelName);
        let request = null;

        db.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };

        request = objectStore.add(data);

        request.onsuccess = function() {
          db.close();
          Ember.run(null, resolve, data);
        };
      });
    });
  },

  /**
   * Find record by it's ID
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {string} id ID
   * param {object} snapshot DS.Snapshot
   */
  findRecord(store, type, id) {
    let modelName = type.modelName;

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let transaction = db.transaction([modelName]);
        let objectStore = transaction.objectStore(modelName);
        let request = null;

        db.onerror = function(event) {
          console.log('IndexedDB error: ' + event.target.errorCode);
          db.close();
          Ember.run(null, reject, event);
        };

        request = objectStore.get(id);

        request.onsuccess = function() {
          db.close();
          Ember.run(null, resolve, request.result);
        };
      });
    });
  },
});
