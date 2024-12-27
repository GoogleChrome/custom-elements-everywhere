/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {createApp, nextTick} from 'vue';
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent,
  ComponentWithoutProperties
} from "./components";
import { expect } from "chai";

// Setup the test harness. This will get cleaned out with every test.
const container = document.createElement("div");
document.body.appendChild(container);
let scratch; // This will hold the actual element under test.

const isCustomElement = (tagName) => {
  return window.customElements.get(tagName) !== undefined;
}

beforeEach(function() {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  container.appendChild(scratch);
});

afterEach(function() {
  container.innerHTML = "";
  scratch = null;
});

describe("basic support", function() {

  describe("no children", function() {
    it("can display a Custom Element with no children", function() {
      this.weight = 3;
      const app = createApp(ComponentWithoutChildren)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      expect(wc).to.exist;
    });
  });

  describe("with children", function() {
    function expectHasChildren(wc) {
      expect(wc).to.exist;
      const shadowRoot = wc.shadowRoot;
      const heading = shadowRoot.querySelector("h1");
      expect(heading).to.exist;
      expect(heading.textContent).to.eql("Test h1");
      const paragraph = shadowRoot.querySelector("p");
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.eql("Test p");
    }

    it("can display a Custom Element with children in a Shadow Root", function() {
      this.weight = 3;
      const app = createApp(ComponentWithChildren)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function() {
      this.weight = 3;
      const app = createApp(ComponentWithChildrenRerender)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      // Waits for the tick in ComponentWithChildrenRerender's mount function
      await nextTick();
      // Waits for the increment inside that tick to appear in the DOM.
      await nextTick();
      expectHasChildren(wc);
      expect(wc.textContent.includes("2")).to.be.true;
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", async function() {
      this.weight = 3;
      const app = createApp(ComponentWithDifferentViews)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const toggler = scratch.querySelector('#toggler');
      let wc = scratch.querySelector("#wc");
      expectHasChildren(wc);
      toggler.click();
      await nextTick();
      const dummy = scratch.querySelector("#dummy");
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");
      toggler.click();
      await nextTick();
      wc = scratch.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function() {
    it("will pass boolean data as either an attribute or a property", function() {
      this.weight = 3;
      const app = createApp(ComponentWithProperties)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      const data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", function() {
      this.weight = 3;
      const app = createApp(ComponentWithProperties)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      const data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function() {
      this.weight = 3;
      const app = createApp(ComponentWithProperties)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      const data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("Vue");
    });

    it("will not overwrite unwriteable properties", function () {
     this.weight = 3;
     const app = createApp(ComponentWithoutProperties);
     app.mount(scratch);
     const wc = scratch.querySelector('#wc');
     expect(wc.getAttribute('amethod')).to.eql('method');
     expect(wc.getAttribute('agetter')).to.eql('getter');
     expect(wc.getAttribute('areadonly')).to.eql('readonly');
     expect(wc.innerHTML).to.eql('Success');
    })

    // it('will set boolean attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = new ComponentWithUnregistered().$mount(scratch).$el;
    //   let wc = root.querySelector('#wc');
    //   expect(wc.hasAttribute('bool')).to.be.true;
    // });

    // it('will set numeric attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = new ComponentWithUnregistered().$mount(scratch).$el;
    //   let wc = root.querySelector('#wc');
    //   expect(wc.getAttribute('num')).to.eql('42');
    // });

    // it('will set string attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = new ComponentWithUnregistered().$mount(scratch).$el;
    //   let wc = root.querySelector('#wc');
    //   expect(wc.getAttribute('str')).to.eql('Vue');
    // });

    // it('will set array properties on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = new ComponentWithUnregistered().$mount(scratch).$el;
    //   let wc = root.querySelector('#wc');
    //   expect(wc.arr).to.eql(['V', 'u', 'e']);
    // });

    // it('will set object properties on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = new ComponentWithUnregistered().$mount(scratch).$el;
    //   let wc = root.querySelector('#wc');
    //   expect(wc.obj).to.eql({ org: 'vuejs', repo: 'vue' });
    // });
  });

  describe("events", function() {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", async function() {
      this.weight = 3;
      const app = createApp(ComponentWithImperativeEvent)
      app.config.compilerOptions.isCustomElement = isCustomElement;
      app.mount(scratch);
      const wc = scratch.querySelector("#wc");
      const handled = scratch.querySelector("#handled");
      expect(handled.textContent).to.eql("false");
      wc.click();
      await nextTick();
      expect(handled.textContent).to.eql("true");
    });
  });

});
