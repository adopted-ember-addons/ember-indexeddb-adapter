# Ember Data IndexedDB Adapter

This is an adapter for Ember Data that lets you store your application data offline using IndexedDB.

* To know more about Ember Data, click [here](https://github.com/emberjs/data).
* To know more about IndexedDB, click [here](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

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

and the serializer must be this:
```ts
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  // the reason we use override this is so that the attribute keys
  // don't become hyphenated
  keyForAttribute(key: string) {
    return key;
  },
});
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
