export function setupIndexedDB(hooks: NestedHooks) {
  hooks.beforeEach(async function() {
    const dbs = await window.indexedDB.databases();

    await Promise.all(dbs.map(db => window.indexedDB.deleteDatabase(db.name)));
  });
}
