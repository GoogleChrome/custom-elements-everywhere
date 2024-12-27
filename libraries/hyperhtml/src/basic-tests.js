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

import HyperHTMLELement from "hyperhtml-element";
const { hyper } = HyperHTMLELement;

import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithoutProperties,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
} from "./components";

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
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

describe("basic support", function() {

  describe("no children", function() {
    it("can display a Custom Element with no children", function() {
      this.weight = 3;
      root.appendChild(ComponentWithoutChildren());
      let wc = root.querySelector("#wc");
      expect(wc).to.exist;
    });
  });

  describe("with children", function() {
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

    it("can display a Custom Element with children in a Shadow Root", function() {
      this.weight = 3;
      root.appendChild(ComponentWithChildren());
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", function(done) {
      this.weight = 3;
      root.appendChild(new ComponentWithChildrenRerender());
      setTimeout(function() {
        let wc = root.querySelector("#wc");
        expectHasChildren(wc);
        expect(wc.textContent.includes("2")).to.be.true;
        done();
      }, 10);
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", function(done) {
      this.weight = 3;
      let ce = root.appendChild(new ComponentWithDifferentViews());
      setTimeout(function() {
        let wc = root.querySelector("#wc");
        expectHasChildren(wc);
        ce.toggle();
        let dummy = root.querySelector("#dummy");
        expect(dummy).to.exist;
        expect(dummy.textContent).to.eql("Dummy view");
        ce.toggle();
        expect(wc).to.eql(root.querySelector("#wc"));
        expectHasChildren(wc);
        ce.toggle();
        expect(dummy).to.eql(root.querySelector("#dummy"));
        done();
      }, 10);
    });
  });

  describe("attributes and properties", function() {
    it("will pass boolean data as either an attribute or a property", function() {
      this.weight = 3;
      ComponentWithProperties(root);
      let wc = root.querySelector("#wc");
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", function() {
      this.weight = 3;
      ComponentWithProperties(root);
      let wc = root.querySelector("#wc");
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function() {
      this.weight = 3;
      ComponentWithProperties(root);
      let wc = root.querySelector("#wc");
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("hyperHTML");
    });

    it('will not overwrite unwriteable properties', function () {
      this.weight = 3;
      ComponentWithoutProperties(root);
      let wc = root.querySelector("#wc");
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });
  });

  describe("events", function() {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", function(done) {
      this.weight = 3;
      let ce = root.appendChild(new ComponentWithImperativeEvent());
      setTimeout(function() {
        let wc = root.querySelector("#wc");
        expect(wc).to.exist;
        let handled = root.querySelector("#handled");
        expect(handled.textContent).to.eql("false");
        wc.click();
        expect(handled.textContent).to.eql("true");
        expect(ce.eventClicks).to.eql(1);
        done();
      }, 10);
    });
  });

});
