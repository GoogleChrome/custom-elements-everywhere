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

module("basic support", function (hooks) {
  setupRenderingTest(hooks);

  module("no children", function () {
    test("can display a Custom Element with no children", async function (assert) {
      await render(
        <template>
          <ComponentWithoutChildren />
        </template>
      );

      assert.dom('ce-without-children').exists();
    });
  });

  module('with children', function () {
    function expectHasChildren(wc) {
      const { assert } = QUnit;

      wc ||= find('#wc');

      assert.dom(wc).exists();

      let shadowRoot = wc.shadowRoot;
      let heading = shadowRoot.querySelector("h1");

      assert.dom(heading).exists();
      assert.strictEqual(heading.textContent, "Test h1");

      let paragraph = shadowRoot.querySelector("p");

      assert.dom(paragraph).exists();
      assert.strictEqual(paragraph.textContent, "Test p");
    }

    test("can display a Custom Element with children in a Shadow Root", async function(assert) {

      await render(
        <template>
          <ComponentWithChildren />
        </template>
      );

      let wc = find('ce-with-children');

      assert.dom(wc).exists();

      expectHasChildren(wc);
    });


    test("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function(assert) {

      await render(
        <template>
          <ComponentWithChildrenRerender />
        </template>
      );

      let wc = find('ce-with-children');

      assert.dom(wc).exists();

      expectHasChildren(wc);

      assert.dom(wc).hasText('2')
    });


    test("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", async function(assert) {
      let toggle;
      const setToggle = (callback) => {
        toggle = async () => {
          callback();
          // rendering is async
          await settled();
        };
      };

      await render(
        <template>
          <ComponentWithDifferentViews @setToggle={{setToggle}} />
        </template>
      );

      expectHasChildren();
      await toggle();

      assert.dom('#dummy').exists();
      assert.dom('#dummy').hasText('Dummy view');

      await toggle();
      expectHasChildren();
    });
  });

  module('attributes and properties', function () {
    test("will pass boolean data as either an attribute or a property", async function(assert) {
      await render(
        <template>
          <ComponentWithProperties />
        </template>
      );

      let wc = find('#wc');
      assert.strictEqual(wc.bool, true);
    });

    test("will pass numeric data as either an attribute or a property", async function(assert) {
      await render(
        <template>
          <ComponentWithProperties />
        </template>
      );

      let wc = find('#wc');
      assert.strictEqual(parseInt(wc.num, 10), 42);
    });

    test("will pass string data as either an attribute or a property", async function(assert) {
      await render(
        <template>
          <ComponentWithProperties />
        </template>
      );

      let wc = find('#wc');
      assert.strictEqual(wc.str, 'Ember');
    });
  });

  module('events', function () {
    test("can imperatively listen to a DOM event dispatched by a Custom Element", async function(assert) {
      await render(
        <template>
          <ComponentWithImperativeEvent />
        </template>
      );

      assert.dom('#handled').hasText('false');

      await click('#wc');

      assert.dom('#handled').hasText('true');
    });
  });
});
