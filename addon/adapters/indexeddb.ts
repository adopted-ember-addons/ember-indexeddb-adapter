import { run } from "@ember/runloop";
import { Promise } from "rsvp";
import DS from "ember-data";
import StoreService from "ember-data/store";
import uuid from "uuid";

// NOTE: comments taken from:
// https://github.com/emberjs/data/blob/master/packages/adapter/addon/adapter.js
export default class IndexedDBAdapter extends DS.Adapter {
  /**
   * Database name
   * @type {string}
   */
  dbName = "IDB.Adapter";

  /**
   * The list of models to use in the indexedDb
   * @type {Array<string>}
   */
  models = [];

  // defaults from DS.Adapter
  // coalesceFindRequests: true;
  // shouldBackgroundReloadRecord: true
  // shouldReloadAll: true

  /**
   * Database version number.
   * Whenever this number is greater than the version number of the existing
   * database, this will update it's schema given that there are available
   * migrations to run.
   * @type {number}
   */
  version = 1;

  /**
    @method createRecord
    @param {DS.Store} store
    @param {DS.Model} type   the DS.Model class of the record
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
   */
  createRecord(
    store: StoreService,
    type: typeof DS.Model,
    snapshot: DS.Snapshot
  ) {
    return new Promise((resolve, reject) => {
      this.openDatabase()
        .then(db => {
          let data = this.serialize(snapshot, { includeId: true });
          let modelName = type.modelName;

          let objectStore = db
            .transaction([modelName], "readwrite")
            .objectStore(modelName);

          let request = objectStore.add(data);

          request.onsuccess = function() {
            db.close();
            resolve(data);
          };

          request.onerror = function(event) {
            console.log("IndexedDB error: " + event.target.errorCode);
            db.close();
            reject(event);
          };
        })
        .catch(reject);
    });
  }

  /**
    @method findRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String} id
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
   */
  findRecord(store: StoreService, type: typeof DS.Model, id: string | number) {
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
    @method findAll
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String} sinceToken
    @param {DS.SnapshotRecordArray} snapshotRecordArray
    @return {Promise} promise
   */
  findAll(store: StoreService, type: typeof DS.Model) {
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
    @method updateRecord
    @param {DS.Store} store
    @param {DS.Model} type   the DS.Model class of the record
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
   */
  updateRecord(
    store: StoreService,
    type: typeof DS.Model,
    snapshot: DS.Snapshot
  ) {
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
    @method deleteRecord
    @param {DS.Store} store
    @param {DS.Model} type   the DS.Model class of the record
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
   */
  deleteRecord(
    store: StoreService,
    type: typeof DS.Model,
    snapshot: DS.Snapshot
  ) {
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
    @method queryRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {Object} query
    @return {Promise} promise
   */
  queryRecord(store: StoreService, type: typeof DS.Model, query: object) {
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
    @method query
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} query
    @param {DS.AdapterPopulatedRecordArray} recordArray
    @return {Promise} promise
   */
  query(store: StoreService, type: typeof DS.Model, query: object) {
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

  generateIdForRecord() {
    return uuid();
  }

  /**
   * Open IndexedDB
   * return {promise} Promise that contains an IDBOpenDBRequest instance
   */
  openDatabase() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      // TODO: if we voluntarily want to run a migration,
      //       open takes a second parameter that is the version number
      const openRequest = window.indexedDB.open(this.dbName);

      openRequest.onerror = reject;
      openRequest.onupgradeneeded = event =>
        this.upgradeDatabase(this.models, event);
      openRequest.onsuccess = function(event: any) {
        resolve(event.target.result);
      };
    });
  }

  upgradeDatabase(models: string[], event: IDBVersionChangeEvent) {
    const { oldVersion, newVersion } = event;
    const db = event.target.result;

    // TODO:
    //  - iterate over all known models
    //  - or, shove everything into one object store like localforage-adapter
    // NOTE: may need to cache known models to detect when the schema changes
    //       and ensure that there is an object store for each model
    //    OOOORRRr, we skip this for now, and use a user-specified list
    models.forEach(modelName => this.ensureObjectStore(db, modelName));

    // TODO: find a way to run migrations.
    //       probably need to track versions
    //       and track which migrations have ran.
    console.info(
      `upgradeDatabase not implemented v(${oldVersion} -> ${newVersion})`,
      event
    );
  }

  ensureObjectStore(db, name) {
    if (!db.objectStoreNames.contains(name)) {
      db.createObjectStore(name, { keyPath: "id" });
    }
  }
}
