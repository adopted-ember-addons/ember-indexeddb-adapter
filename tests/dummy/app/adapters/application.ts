import { IndexedDBAdapter } from "ember-indexeddb-adapter";

export default class Application extends IndexedDBAdapter {
  models = [
    'post',
    'comment',
    'author',
    'adminUser'
  ]
}
