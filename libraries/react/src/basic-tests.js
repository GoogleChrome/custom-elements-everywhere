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

import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import * as ReactDOM from "react-dom";
import { expect } from "chai";
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent,
  ComponentWithoutProperties,
} from "./components";

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);
let scratch; // This will hold the actual element under test.

let reactRoot = null;
function render(element) {
  act(() => {
    reactRoot.render(element);
  });
}

before(() => {
  window.IS_REACT_ACT_ENVIRONMENT = true;
});

beforeEach(function () {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  app.appendChild(scratch);

  reactRoot = createRoot(scratch);
});

afterEach(function () {
  app.innerHTML = "";
  scratch = null;

  act(() => {
    reactRoot.unmount();
  });
});

describe("basic support", function () {
  describe("no children", function () {
    it("can display a Custom Element with no children", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithoutChildren
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      expect(wc).to.exist;
    });
  });

  describe("with children", function () {
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

    it("can display a Custom Element with children in a Shadow Root", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithChildren
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithChildrenRerender
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      await act(async () => {
        await Promise.resolve();
      });
      expectHasChildren(wc);
      expect(wc.textContent.includes("2")).to.be.true;
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithDifferentViews
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      expectHasChildren(wc);
      act(() => {
        root.toggle();
      });
      let dummy = root.dummy.current;
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");
      act(() => {
        root.toggle();
      });
      wc = root.wc;
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function () {
    it("will pass boolean data as either an attribute or a property", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithProperties
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithProperties
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithProperties
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("React");
    });

    it('will not overwrite unwriteable properties', function () {
      let wc;
      render(
        <ComponentWithoutProperties
          ref={(current) => {
            wc = current;
          }}
        />
      )
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });

    // TODO: Is it the framework's responsibility to check if the underlying
    // property is defined? Or should it just always assume it is and do its
    // usual default behavior? Preact will actually check if it's defined and
    // use an attribute if it is not, otherwise it prefers properties for
    // everything. Is there a "right" answer in this situation?

    // it('will set boolean attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
    //   let wc = ReactDOM.findDOMNode(root.refs.wc);
    //   expect(wc.hasAttribute('bool')).to.be.true;
    // });

    // it('will set numeric attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
    //   let wc = ReactDOM.findDOMNode(root.refs.wc);
    //   expect(wc.getAttribute('num')).to.eql('42');
    // });

    // it('will set string attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
    //   let wc = ReactDOM.findDOMNode(root.refs.wc);
    //   expect(wc.getAttribute('str')).to.eql('React');
    // });

    // it('will set array attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
    //   let wc = ReactDOM.findDOMNode(root.refs.wc);
    //   expect(wc.getAttribute('arr')).to.eql(JSON.stringify(['R', 'e', 'a', 'c', 't']));
    // });

    // it('will set object attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
    //   let wc = ReactDOM.findDOMNode(root.refs.wc);
    //   expect(wc.getAttribute('obj')).to.eql(JSON.stringify({ org: 'facebook', repo: 'react' }));
    // });
  });

  describe("events", function () {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", function () {
      this.weight = 3;
      let root;
      render(
        <ComponentWithImperativeEvent
          ref={(current) => {
            root = current;
          }}
        />
      );
      let wc = root.wc;
      let handled = root.handled;
      expect(handled.textContent).to.eql("false");
      act(() => {
        wc.click();
      });
      expect(handled.textContent).to.eql("true");
    });
  });
});
