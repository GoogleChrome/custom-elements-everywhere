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

import { expect } from "chai";
import { define } from "hybrids";

import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenCount,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithDeclarativeEvent,
  ComponentWithoutProperties,
} from "./components";

describe("basic support", function() {
  // Setup the test harness. This will get cleaned out with every test.
  const app = document.createElement("div");
  app.id = "app";
  document.body.appendChild(app);

  let root; // This will hold the actual element under test.

  beforeEach(function() {
    root = document.createElement("div");
    app.appendChild(root);
  });

  afterEach(function() {
    app.innerHTML = "";
    root = null;
  });

  describe("no children", function() {
    define("component-without-children", ComponentWithoutChildren);

    it("can display a Custom Element with no children", function(done) {
      this.weight = 3;
      root.appendChild(document.createElement("component-without-children"));

      requestAnimationFrame(() => {
        let wc = root.firstElementChild.shadowRoot.querySelector("#wc");
        expect(wc).to.exist;
        done();
      });
    });
  });

  describe("with children", function() {
    define("component-with-children", ComponentWithChildren);
    define("component-with-children-count", ComponentWithChildrenCount);
    define("component-with-different-views", ComponentWithDifferentViews);

    function expectHasChildren(wc) {
      expect(wc).to.exist;
      let shadowRoot = wc.shadowRoot;
      let heading = shadowRoot.querySelector("h1");
      expect(heading).to.exist;
      expect(heading.textContent).to.eql("Test h1");
      let paragraph = shadowRoot.querySelector("p");
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.eql("Test p");
    }

    it("can display a Custom Element with children in a Shadow Root", function(done) {
      this.weight = 3;
      root.appendChild(document.createElement("component-with-children"));

      requestAnimationFrame(() => {
        const wc = root.firstElementChild.shadowRoot.querySelector("#wc");
        expectHasChildren(wc);
        done();
      });
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", function(done) {
      this.weight = 3;
      root.appendChild(document.createElement("component-with-children-count"));
      requestAnimationFrame(() => {
        const wc = root.firstElementChild.shadowRoot.querySelector("#wc");
        expectHasChildren(wc);

        expect(wc.textContent).to.equal("1");

        root.firstElementChild.count = 2;

        requestAnimationFrame(() => {
          expect(wc.textContent).to.equal("2")
          done();
        });
      });
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", function(done) {
      this.weight = 3;
      const ce = root.appendChild(document.createElement("component-with-different-views"));
      requestAnimationFrame(() => {
        expectHasChildren(ce.shadowRoot.querySelector("#wc"));
        ce.showWc = false;

        requestAnimationFrame(() => {
          let dummy = ce.shadowRoot.querySelector("#dummy");
          expect(dummy).to.exist;
          expect(dummy.textContent).to.eql("Dummy view");

          ce.showWc = true;
          requestAnimationFrame(() => {
            expectHasChildren(ce.shadowRoot.querySelector("#wc"));
            done();
          });
        });
      });
    });
  });

  describe("attributes and properties", function() {
    define("component-with-properties", ComponentWithProperties);

    beforeEach(() => {
      root.appendChild(document.createElement("component-with-properties"));
    })

    it("will pass boolean data as either an attribute or a property", function(done) {
      this.weight = 3;
      requestAnimationFrame(() => {
        const wc = root.firstElementChild.shadowRoot.querySelector('#wc');
        const data = wc.bool || wc.hasAttribute("bool");
        expect(data).to.be.true;
        done();
      });
    });

    it("will pass numeric data as either an attribute or a property", function(done) {
      this.weight = 3;
      requestAnimationFrame(() => {
        const wc = root.firstElementChild.shadowRoot.querySelector('#wc');
        const data = wc.num || wc.getAttribute("num");
        expect(parseInt(data, 10)).to.eql(42);
        done();
      });
    });

    it("will pass string data as either an attribute or a property", function(done) {
      this.weight = 3;
      requestAnimationFrame(() => {
        const wc = root.firstElementChild.shadowRoot.querySelector('#wc');
        const data = wc.str || wc.getAttribute("str");
        expect(data).to.eql("hybrids");
        done();
      });
    });
  });

  describe('without properties', function () {
    define("component-without-properties", ComponentWithoutProperties);

    beforeEach(() => {
      root.appendChild(document.createElement("component-without-properties"));
    });

    it('will not overwrite unwriteable properties', function () {
      this.weight = 3;
      requestAnimationFrame(() => {
        const wc = root.firstElementChild.shadowRoot.querySelector('#wc');
        expect(wc.getAttribute('amethod')).to.eql('method');
        expect(wc.getAttribute('agetter')).to.eql('getter');
        expect(wc.getAttribute('areadonly')).to.eql('readonly');
        expect(wc.innerHTML).to.eql('Success');
      })
    });
  });

  describe("events", function() {
    define("component-with-declarative-event", ComponentWithDeclarativeEvent);

    it("can imperatively listen to a DOM event dispatched by a Custom Element", function(done) {
      this.weight = 3;
      const ce = root.appendChild(document.createElement("component-with-declarative-event"));

      requestAnimationFrame(() => {
        const wc = ce.shadowRoot.querySelector("#wc");
        expect(wc).to.exist;
        expect(ce.camelHandled).to.eql(false);
        wc.click();
        expect(ce.camelHandled).to.eql(true);
        done();
      });
    });
  });
});
