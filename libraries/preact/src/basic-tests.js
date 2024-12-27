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
import { mount } from 'enzyme';
import { h } from "preact";
import { expect } from "chai";
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithoutProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
} from "./components";

describe("basic support", function() {

  describe("no children", function() {
    it("can display a Custom Element with no children", function() {
      this.weight = 3;
      let root = mount(<ComponentWithoutChildren />).getDOMNode();
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
      let root = mount(<ComponentWithChildren />).getDOMNode();
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function() {
      this.weight = 3;
      let wrapper = mount(<ComponentWithChildrenRerender />);
      let root = wrapper.getDOMNode();
      let wc = root.querySelector("#wc");
      await Promise.resolve();
      wrapper.update();
      expectHasChildren(wc);
      expect(wc.textContent.includes("2")).to.be.true;
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", function() {
      this.weight = 3;
      let wrapper = mount(<ComponentWithDifferentViews />);
      let root = wrapper.getDOMNode();
      let component = wrapper.instance();
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
      component.toggle();
      wrapper.update();
      let dummy = root.querySelector("#dummy");
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");
      component.toggle();
      wrapper.update();
      wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function() {
    it("will pass boolean data as either an attribute or a property", function() {
      this.weight = 3;
      let root = mount(<ComponentWithProperties />).getDOMNode();
      let wc = root.querySelector("#wc");
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", function() {
      this.weight = 3;
      let root = mount(<ComponentWithProperties />).getDOMNode();
      let wc = root.querySelector("#wc");
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function() {
      this.weight = 3;
      let root = mount(<ComponentWithProperties />).getDOMNode();
      let wc = root.querySelector("#wc");
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("Preact");
    });

    it("will not overwrite unwriteable properties", function () {
      this.weight = 3;
      let root = mount(<ComponentWithoutProperties />).getDOMNode();
      let wc = root.querySelector("#wc");
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });


    // it('will set boolean attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = mount(<ComponentWithUnregistered />).getDOMNode();
    //   let wc = root.querySelector('#wc');
    //   expect(wc.hasAttribute('bool')).to.be.true;
    // });

    // it('will set numeric attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = mount(<ComponentWithUnregistered />).getDOMNode();
    //   let wc = root.querySelector('#wc');
    //   expect(wc.getAttribute('num')).to.eql('42');
    // });

    // it('will set string attributes on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = mount(<ComponentWithUnregistered />).getDOMNode();
    //   let wc = root.querySelector('#wc');
    //   expect(wc.getAttribute('str')).to.eql('Preact');
    // });

    // // Related:
    // // https://github.com/developit/preact/issues/678
    // // https://github.com/developit/preact/pull/511
    // it('will set array properties on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = mount(<ComponentWithUnregistered />).getDOMNode();
    //   let wc = root.querySelector('#wc');
    //   expect(wc.arr).to.eql(['P', 'r', 'e', 'a', 'c', 't']);
    // });

    // it('will set object properties on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = mount(<ComponentWithUnregistered />).getDOMNode();
    //   let wc = root.querySelector('#wc');
    //   expect(wc.obj).to.eql({ org: 'developit', repo: 'preact' });
    // });
  });

  describe("events", function() {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", function() {
      this.weight = 3;
      let wrapper = mount(<ComponentWithImperativeEvent />);
      let root = wrapper.getDOMNode();
      let wc = root.querySelector("#wc");
      expect(wc).to.exist;
      let handled = root.querySelector("#handled");
      expect(handled.textContent).to.eql("false");
      wc.click();
      wrapper.update();
      expect(handled.textContent).to.eql("true");
    });
  });

});
