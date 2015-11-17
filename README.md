# Ember Data IndexedDB Adapter

This is an adapter for Ember Data that lets you store your application data offline using IndexedDB.

* To know more about Ember Data, click [here](https://github.com/emberjs/data).
* To know more about IndexedDB, click [here](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

## Compatibility

This adapter aligns itself with the latest [Ember CLI](http://www.ember-cli.com/) release
and it's corresponding Ember Data version.

As of the moment, the latest version is compatible with Ember CLI v1.13.12.

## Usage

To install this addon using Ember CLI, use this command:

```bash
$ ember install ember-indexeddb-adapter
```

After installing the addon, generate the app adapter by using this command:

```bash
$ ember generate adapter application
```

We then override the adapter similar to this:

```js
//app/adapters/application.js
import IndexedDBAdapter from 'ember-indexeddb-adapter/adapters/indexeddb';

export default IndexedDBAdapter.extend({
  /**
   * Name of your IndexedDB
   * @type {string}
   */
  dbName: 'DummyDatabase',

  /**
   * Version of your IndexedDB.
   * If you have an existing IDB and you want to update it's schema, the value
   * of this variable should be higher than the version of your existing IDB.
   * @type {number}
   */
  version: 1,

  /**
   * Array containing the name of your models.
   * @type {Array.<string>}
   */
  models: ['user', 'post']
});
```
