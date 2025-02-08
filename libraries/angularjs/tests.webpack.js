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

import 'angular';
import 'angular-mocks';
import prodApp from "./src/app.module";

import basicTests from "basic-tests";
import advancedTests from "advanced-tests"

describe('', function () {
  beforeEach(angular.mock.module(prodApp));

  let compile;
  let scope;
  let interval;

  beforeEach(
    inject(($compile, $rootScope, $interval) => {
      compile = $compile;
      scope = $rootScope;
      interval = $interval;
    })
  );

  function render(component) {
    const root = compile(component)(scope)[0];
    scope.$apply();
    const wc = root.querySelector('#wc');
    return { wc, root }
  }

  const renderers = {
    renderComponentWithoutChildren() {
      return render('<comp-no-children>')
    },
    renderComponentWithChildren() {
      return render('<comp-with-children>')
    },
    renderComponentWithChildrenRerender() {
      const result = render('<comp-with-children-rerender>');
      interval.flush(1000);
      return result;
    },
    renderComponentWithDifferentViews() {
      scope.showWc = true;
      const { wc, root } = render('<comp-with-different-views show-wc="showWc">');

      function toggle() {
        scope.showWc = !scope.showWc;
        scope.$apply();
      }

      return { wc, toggle, root }
    },
    renderComponentWithProperties() {
      return render('<comp-with-props>')
    },
    renderComponentWithImperativeEvent() {
      const { wc, root } = render('<comp-with-imperative-event>');
      function click() {
        wc.click();
        scope.$digest();
      }
      return { wc, click, root };
    },
    renderComponentWithDeclarativeEvent() {
      const { wc, root } = render('<comp-with-declarative-event>');
      function click() {
        wc.click();
        scope.$digest();
      }
      return { wc, click, root };
    }
  };

  basicTests(renderers);
  advancedTests(renderers);
});
