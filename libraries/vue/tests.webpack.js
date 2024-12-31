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
  ComponentWithImperativeEvent, ComponentWithDeclarativeEvent,
} from "./src/components";

// Setup the test harness. This will get cleaned out with every test.
const container = document.createElement("div");
document.body.appendChild(container);
let scratch; // This will hold the actual element under test.

const isCustomElement = (tagName) => {
  return window.customElements.get(tagName) !== undefined;
}

beforeEach(function () {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  container.appendChild(scratch);
});

afterEach(function () {
  container.innerHTML = "";
  scratch = null;
});

import basicTests from 'basic-tests';
import advancedTests from 'advanced-tests';

function render(Component) {
  const app = createApp(Component)
  app.config.compilerOptions.isCustomElement = isCustomElement;
  app.mount(scratch);
  const wc = scratch.querySelector("#wc");
  return {wc}
}

const renderers = {
  renderComponentWithoutChildren() {
    return render(ComponentWithoutChildren);
  },
  renderComponentWithChildren() {
    return render(ComponentWithChildren);
  },
  async renderComponentWithChildrenRerender() {
    const result = render(ComponentWithChildrenRerender);
    // Waits for the tick in ComponentWithChildrenRerender's mount function
    await nextTick();
    // Waits for the increment inside that tick to appear in the DOM.
    await nextTick();
    return result;
  },
  renderComponentWithProperties() {
    return render(ComponentWithProperties);
  },
  renderComponentWithDifferentViews() {
    const { wc } = render(ComponentWithDifferentViews);
    const toggler = scratch.querySelector('#toggler');
    async function toggle() {
      toggler.click();
      await nextTick();
    }
    return { wc, toggle }
  },
  renderComponentWithImperativeEvent() {
    const { wc } = render(ComponentWithImperativeEvent);
    async function click() {
      wc.click();
      await nextTick();
    }
    return { wc, click }
  },
  renderComponentWithDeclarativeEvent() {
    const { wc } = render(ComponentWithDeclarativeEvent);
    async function click() {
      wc.click();
      await nextTick();
    }
    return { wc, click }
  }
}

basicTests(renderers);
advancedTests(renderers);
