import QUnit, { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, settled, render, find } from "@ember/test-helpers";

import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent,
} from "ember-cee-app/components/cee-scenarios";

module("advanced support", function (hooks) {
  setupRenderingTest(hooks);

  module("attributes and properties", function() {
    test("will pass array data as a property", async function(assert) {
      await render(
        <template>
          <ComponentWithProperties />
        </template>
      );

      let wc = find('#wc');
      assert.deepEqual(wc.arr, ['E', 'm', 'b', 'e', 'r']);
    });

    test("will pass object data as a property", async function(assert) {
      await render(
        <template>
          <ComponentWithProperties />
        </template>
      );

      let wc = find('#wc');
      assert.deepEqual(wc.obj, { org: 'emberjs', repo: 'ember.js' });
    });

    test("will pass object data to a camelCase-named property", async  function(assert) {
      await render(
        <template>
          <ComponentWithProperties />
        </template>
      );

      let wc = find('#wc');
      assert.deepEqual(wc.camelCaseObj, { label: 'passed' });
    });
  });

  module('events', function() {
    test("can declaratively listen to a lowercase DOM event dispatched by a Custom Element", async function(assert) {
      await render(
        <template>
          <ComponentWithDeclarativeEvent />
        </template>
      );

      assert.dom('#wc').exists();
      assert.dom('#lowercase').hasText('false');

      await click('#wc');
      assert.dom('#lowercase').hasText('true');
    });


    test("can declaratively listen to a kebab-case DOM event dispatched by a Custom Element", async function(assert) {
      await render(
        <template>
          <ComponentWithDeclarativeEvent />
        </template>
      );

      assert.dom('#wc').exists();
      assert.dom('#kebab').hasText('false');

      await click('#wc');
      assert.dom('#kebab').hasText('true');
    });


    test("can declaratively listen to a camelCase DOM event dispatched by a Custom Element", async function(assert) {
      await render(
        <template>
          <ComponentWithDeclarativeEvent />
        </template>
      );

      assert.dom('#wc').exists();
      assert.dom('#camel').hasText('false');

      await click('#wc');
      assert.dom('#camel').hasText('true');
    });

    test("can declaratively listen to a CAPScase DOM event dispatched by a Custom Element", async function(assert) {
      await render(
        <template>
          <ComponentWithDeclarativeEvent />
        </template>
      );

      assert.dom('#wc').exists();
      assert.dom('#caps').hasText('false');

      await click('#wc');
      assert.dom('#caps').hasText('true');
    });

    test("can declaratively listen to a PascalCase DOM event dispatched by a Custom Element", async function(assert) {
      await render(
        <template>
          <ComponentWithDeclarativeEvent />
        </template>
      );

      assert.dom('#wc').exists();
      assert.dom('#pascal').hasText('false');

      await click('#wc');
      assert.dom('#pascal').hasText('true');
    });
  });
});
