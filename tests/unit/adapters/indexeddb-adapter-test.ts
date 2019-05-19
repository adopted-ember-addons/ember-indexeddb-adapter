import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import DS from "ember-data";
import StoreService from "ember-data/store";
import Model from "ember-data/model";
import attr from "ember-data/attr";
import { hasMany, belongsTo } from "ember-data/relationships";

import { setupIndexedDB } from "dummy/tests/helpers/setupIndexedDB";

module("Unit | Adapter | indexeddb adapter", function(hooks) {
  setupTest(hooks);
  setupIndexedDB(hooks);

  // Replace this with your real tests.
  test("it exists", function(assert) {
    let adapter = this.owner.lookup("adapter:application");
    assert.ok(adapter);
  });

  module("the database is opened", function(hooks) {
    let adapter;
    let db;

    hooks.beforeEach(async function() {
      adapter = this.owner.lookup("adapter:application");
      db = await adapter.openDatabase();
    });

    hooks.afterEach(async function() {
      await db.close();
    });

    test("it creates an indexeddb", function(assert) {
      assert.equal(
        db.name,
        adapter.dbName,
        "database with adapters name is created"
      );
      assert.equal(
        db.objectStoreNames.length,
        adapter.models.length,
        "there is one object store per specified model"
      );
    });

    module("there exists a model", function(hooks) {
      let store: StoreService;

      hooks.beforeEach(function() {
        class Post extends Model {
          @attr() name;
        }

        this.owner.register("model:post", Post);
        store = this.owner.lookup("service:store");
      });

      module("a model record can be created", function(hooks) {
        hooks.beforeEach(async function() {
          let record = store.createRecord("post", { name: "first post " });

          await record.save();
        });

        test("the indexeddb has stored the record in json:api format", async function(assert) {
          let posts = await store.findAll("post");

          assert.equal(posts.length, 1, "the post is stored");
        });
      });
    });

    module("there is a model with a hasMany relationship", function(hooks) {
      let store: StoreService;

      hooks.beforeEach(function() {
        class Comment extends Model {
          @attr() text?: string;

          @belongsTo("post", { async: false }) post;
        }
        class Post extends Model {
          @attr() name;

          @hasMany("comment", { async: false }) comments;
        }

        this.owner.register("model:post", Post);
        this.owner.register("model:comment", Comment);

        store = this.owner.lookup("service:store");
      });

      module("records are created", function(hooks) {
        let post: Model;

        hooks.beforeEach(async function() {
          post = store.createRecord("post", { name: "first" });
          let comment = store.createRecord("comment", { post, text: "hi" });
          let comment2 = store.createRecord("comment", { post, text: "hi2" });

          await post.save();
          await comment.save();
          await comment2.save();
        });

        test("the models are related", async function(assert) {
          assert.expect(3);

          let storedPost = await store.findRecord("post", post.id);
          assert.equal(storedPost.comments.length, 2, "the post has two comments");

          let [firstId, secondId] = storedPost.comments.map(c => c.id);

          let comment1 = await store.findRecord('comment', firstId);
          let comment2 = await store.findRecord('comment', secondId);


          assert.equal(
            comment1.post,
            storedPost,
            "the comment belongsTo a post"
          );
          assert.equal(
            comment2.post,
            storedPost,
            "the comment belongsTo a post"
          );
        });
      });
    });
  });
});
