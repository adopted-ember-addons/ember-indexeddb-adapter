import StoreService from "ember-data/store";
import { run } from "@ember/runloop";
import { Promise } from "rsvp";
import DS from "ember-data";
import uuid from "uuid";

export default class IndexedDBAdapter extends DS.Adapter {
  /**
   * Database name
   * @type {string}
   */
  dbName = "IDB.Adapter";

  /**
   * Database version number.
   * Whenever this number is greater than the version number of the existing
   * database, this will update it's schema given that there are available
   * migrations to run.
   * @type {number}
   */
  version = 1;

  /**
   * Create new record
   * param {object} store DS.Store
   * param {object} type DS.Model class of the record
   * param {object} snapshot DS.Snapshot
   * return {promise} Promise that contains the record
   */
  createRecord(store: StoreService, type: string, snapshot) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = this.serialize(snapshot, { includeId: true });
        let modelName = type.modelName;
        let objectStore = db
          .transaction([modelName], "readwrite")
          .objectStore(modelName);
        let request = objectStore.add(data);

        request.onsuccess = function() {
          db.close();
          run(null, resolve, data);
        };

        request.onerror = function(event) {
          console.log("IndexedDB error: " + event.target.errorCode);
          db.close();
          run(null, reject, event);
        };
      });
    });
  }

  /**
   * Find record by it's ID
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {string} id ID
   * return {promise} Promise that contains the record
   */
  findRecord(store: StoreService, type: string, id: string) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let modelName = type.modelName;
        let objectStore = db.transaction([modelName]).objectStore(modelName);
        let request = objectStore.get(id);

        request.onsuccess = function() {
          db.close();
          run(null, resolve, request.result);
        };

        request.onerror = function(event) {
          console.log("IndexedDB error: " + event.target.errorCode);
          db.close();
          run(null, reject, event);
        };
      });
    });
  }

  /**
   * Find all records
   * param {object} store DS.Store
   * param {object} type DS.Model
   * return {promise} Promise that contains the record
   */
  findAll(store: StoreService, type: string) {
    return new Promise((resolve, reject) => {
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
            run(null, resolve, data);
          }
        };

        request.onerror = function(event) {
          console.log("IndexedDB error: " + event.target.errorCode);
          db.close();
          run(null, reject, event);
        };
      });
    });
  }

  /**
   * Update record
   * param {object} store DS.Store
   * param {object} type DS.Model class of the record
   * param {object} snapshot DS.Snapshot
   * return {promise} Promise that contains the record
   */
  updateRecord(store: StoreService, type: string, snapshot) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = this.serialize(snapshot, { includeId: true });
        let modelName = type.modelName;
        let objectStore = db
          .transaction([modelName], "readwrite")
          .objectStore(modelName);
        let request = objectStore.get(snapshot.id);

        request.onsuccess = function() {
          let requestUpdate = objectStore.put(data);

          requestUpdate.onsuccess = function() {
            db.close();
            run(null, resolve, data);
          };

          requestUpdate.onerror = function(event) {
            console.log("IndexedDB error: " + event.target.errorCode);
            db.close();
            run(null, reject, event);
          };
        };
      });
    });
  }

  /**
   * Delete record
   * param {object} store DS.Store
   * param {object} type DS.Model class of the record
   * param {object} snapshot DS.Snapshot
   * return {promise} Promise that contains the record
   */
  deleteRecord(store: StoreService, type: string, snapshot) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let data = this.serialize(snapshot, { includeId: true });
        let modelName = type.modelName;
        let objectStore = db
          .transaction([modelName], "readwrite")
          .objectStore(modelName);
        let request = objectStore.delete(snapshot.id);

        request.onsuccess = function() {
          db.close();
          run(null, resolve, data);
        };

        request.onerror = function() {
          console.log("IndexedDB error: " + event.target.errorCode);
          db.close();
          run(null, reject, event);
        };
      });
    });
  }

  /**
   * TODO: See if using index is feasible
   *
   * Find a record that matches the query
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {object} query Query object
   * return {promise} Promise that contains the record
   */
  queryRecord(store: StoreService, type: string, query) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then(db => {
        let modelName = type.modelName;
        let queryKeys = Object.keys(query);
        let objectStore = db.transaction([modelName]).objectStore(modelName);
        let request = objectStore.openCursor();

        request.onsuccess = function(event) {
          let cursor = event.target.result;

          if (cursor) {
            let queryKeyMatchCount = 0;

            queryKeys.forEach(key => {
              if (cursor.value[key] === query[key]) {
                queryKeyMatchCount++;
              }
            });

            if (queryKeyMatchCount === queryKeys.length) {
              db.close();
              run(null, resolve, cursor.value);
            } else {
              cursor.continue();
            }
          } else {
            db.close();
            run(null, resolve, null);
          }
        };

        request.onerror = function(event) {
          console.log("IndexedDB error: " + event.target.errorCode);
          db.close();
          run(null, reject, event);
        };
      });
    });
  }

  /**
   * TODO: See if using index is feasible
   *
   * Find records that matches the query
   * param {object} store DS.Store
   * param {object} type DS.Model
   * param {object} query Query object
   * return {promise} Promise that contains the records
   */
  query(store: StoreService, type: string, query: any) {
    return new Promise((resolve, reject) => {
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

            queryKeys.forEach(key => {
              if (cursor.value[key] === query[key]) {
                queryKeyMatchCount++;
              }
            });

            if (queryKeyMatchCount === queryKeys.length) {
              data.push(cursor.value);
            }

            cursor.continue();
          } else {
            db.close();
            run(null, resolve, data);
          }
        };

        request.onerror = function(event) {
          console.log("IndexedDB error: " + event.target.errorCode);
          db.close();
          run(null, reject, event);
        };
      });
    });
  }

  /**
   * Open IndexedDB
   * return {promise} Promise that contains an IDBOpenDBRequest instance
   */
  private openDatabase() {
    return new Promise<IDBOpenDBRequest>((resolve, reject) => {
      const openRequest = window.indexedDB.open(this.dbName);

      openRequest.onerror = reject;
      openRequest.onupgradeneeded = this.upgradeDatabase;
      openRequest.onsuccess = function(event: any) {
        resolve(event.target.result);
      };
    });
  }

  private upgradeDatabase(event: any) {
    const db = event.target.result;
    db.createObjectStore("table-name", {
      autoIncrement: true
    });
    // TODO: find a way to run migrations.
    //       probably need to track versions
    //       and track which migrations have ran.
    console.info("upgradeDatabase not implemented");
  }

  private getTable() {
    // is this how idb works?
  }
}
