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
import {createRoot} from "react-dom/client";
import {act} from "react-dom/test-utils";
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent,
} from "./src/components";

import basicTests from 'basic-tests';
import advancedTests from 'advanced-tests';

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);
let scratch; // This will hold the actual element under test.

let reactRoot = null;

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

function render(Component) {
  let root;
  act(() => {
    reactRoot.render(
      <Component
        ref={(current) => {
          root = current;
        }}
      />
    );
  });
  return {wc: root.wc, root}
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
    await act(async () => {
      await Promise.resolve();
    });
    return results;
  },
  renderComponentWithProperties() {
    return render(ComponentWithProperties);
  },
  renderComponentWithDifferentViews() {
    const { wc, root } = render(ComponentWithDifferentViews);
    function toggle() {
      act(() => {
        root.toggle();
      });
    }
    return { wc, toggle }
  },
  renderComponentWithImperativeEvent() {
    const { wc, root } = render(ComponentWithImperativeEvent)
    function click() {
      act(() => {
        wc.click();
      });
    }
    return { wc, click }
  },
  renderComponentWithDeclarativeEvent() {
    const { wc } = render(ComponentWithDeclarativeEvent)
    function click() {
      act(() => {
        wc.click();
      });
    }
    return { wc, click }
  }
}

basicTests(renderers);
advancedTests(renderers);
