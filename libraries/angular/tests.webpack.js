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

import 'reflect-metadata/Reflect';
import 'zone.js/dist/zone';
import 'zone.js/dist/webapis-shadydom'; // https://github.com/angular/zone.js/pull/784
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/mocha-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  ComponentWithChildren,
  ComponentWithChildrenRerender, ComponentWithDeclarativeEvent,
  ComponentWithDifferentViews, ComponentWithImperativeEvent,
  ComponentWithoutChildren, ComponentWithProperties, ComponentWithUnregistered
} from "./src/components";

import basicTests from "basic-tests";
import advancedTests from "advanced-tests";


// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Run basic and advanced tests through Karma


beforeEach(function() {
  getTestBed().configureTestingModule({
    declarations: [
      ComponentWithoutChildren,
      ComponentWithChildren,
      ComponentWithChildrenRerender,
      ComponentWithDifferentViews,
      ComponentWithProperties,
      ComponentWithUnregistered,
      ComponentWithImperativeEvent,
      ComponentWithDeclarativeEvent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  });
});

function render(Component) {
  const fixture = getTestBed().createComponent(Component);
  fixture.detectChanges();
  const el = fixture.debugElement.nativeElement;
  const wc = el.querySelector('#wc');
  return { wc, fixture }
}

const renderers = {
  renderComponentWithoutChildren() {
    return render(ComponentWithoutChildren);
  },
  renderComponentWithChildren() {
    return render(ComponentWithChildren);
  },
  async renderComponentWithChildrenRerender() {
    const results = render(ComponentWithChildrenRerender);
    await new Promise((r) => setTimeout(r, 1000));
    results.fixture.detectChanges();
    return results;
  },
  renderComponentWithDifferentViews() {
    const { wc, fixture } = render(ComponentWithDifferentViews);
    function toggle() {
      fixture.componentInstance.toggle();
      fixture.detectChanges();
    }
    return { wc, fixture, toggle }
  },
  renderComponentWithProperties() {
    return render(ComponentWithProperties);
  },
  renderComponentWithImperativeEvent() {
    const { wc, fixture } = render(ComponentWithImperativeEvent);
    function click() {
      wc.click();
      fixture.detectChanges();
    }
    return { wc, fixture, click };
  },
  renderComponentWithDeclarativeEvent() {
    const { wc, fixture } = render(ComponentWithDeclarativeEvent);
    function click() {
      wc.click();
      fixture.detectChanges();
    }
    return { wc, fixture, click };
  }
};

basicTests(renderers);
advancedTests(renderers);

// Finally, start Karma to run the tests.
__karma__.start();
