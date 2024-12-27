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

import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
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
  ComponentWithoutProperties
} from "./components";

beforeEach(function() {
  TestBed.configureTestingModule({
    declarations: [
      ComponentWithoutChildren,
      ComponentWithChildren,
      ComponentWithChildrenRerender,
      ComponentWithDifferentViews,
      ComponentWithProperties,
      ComponentWithUnregistered,
      ComponentWithImperativeEvent,
      ComponentWithDeclarativeEvent,
      ComponentWithoutProperties
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  });
});

describe("basic support", function() {

  describe("no children", function() {
    it("can display a Custom Element with no children", function() {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithoutChildren);
      fixture.detectChanges();
      let el = fixture.debugElement.nativeElement;
      let wc = el.querySelector("ce-without-children");
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
      let fixture = TestBed.createComponent(ComponentWithChildren);
      fixture.detectChanges();
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", function(
      done
    ) {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithChildrenRerender);
      fixture.detectChanges();
      setTimeout(function() {
        fixture.detectChanges();
        let root = fixture.debugElement.nativeElement;
        let wc = root.querySelector("#wc");
        expectHasChildren(wc);
        expect(wc.textContent.includes("2")).to.be.true;
        done();
      }, 1000);
    });

    it("can display a Custom Element with children in a Shadow Root and handle hiding and showing the element", function() {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithDifferentViews);
      fixture.detectChanges();
      let component = fixture.componentInstance;
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
      component.toggle();
      fixture.detectChanges();
      let dummy = root.querySelector("#dummy");
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");
      component.toggle();
      fixture.detectChanges();
      wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function() {
    it("will pass boolean data as either an attribute or a property", function() {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithProperties);
      fixture.detectChanges();
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", function() {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithProperties);
      fixture.detectChanges();
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function() {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithProperties);
      fixture.detectChanges();
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("Angular");
    });

    it('will not overwrite unwriteable properties', function () {
      let fixture = TestBed.createComponent(ComponentWithoutProperties);
      fixture.detectChanges();
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });
  });

  describe("events", function() {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", function() {
      this.weight = 3;
      let fixture = TestBed.createComponent(ComponentWithImperativeEvent);
      fixture.detectChanges();
      let root = fixture.debugElement.nativeElement;
      let wc = root.querySelector("#wc");
      let handled = root.querySelector("#handled");
      expect(handled.textContent).to.eql("false");
      wc.click();
      fixture.detectChanges();
      expect(handled.textContent).to.eql("true");
    });
  });

});
