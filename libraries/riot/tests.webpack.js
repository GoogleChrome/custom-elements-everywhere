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

import { component } from 'riot'
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
} from './src/components'

import basicTests from 'basic-tests';
import advancedTests from 'advanced-tests';

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)
let scratch // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement('div')
  scratch.id = 'scratch'
  app.appendChild(scratch)
})

afterEach(function() {
  app.innerHTML = ''
  scratch = null
})

function render(Component) {
  const el = component(Component)(scratch)
  return {wc: scratch.querySelector('#wc'), el}
}

const renderers = {
  renderComponentWithoutChildren() {
    return render(ComponentWithoutChildren)
  },
  renderComponentWithChildren() {
    return render(ComponentWithChildren)
  },
  renderComponentWithChildrenRerender() {
    return render(ComponentWithChildrenRerender)
  },
  renderComponentWithDifferentViews() {
    const {wc, el} = render(ComponentWithDifferentViews)
    return {wc, el, toggle: () => el.toggle()}
  },
  renderComponentWithProperties() {
    return render(ComponentWithProperties)
  },
  renderComponentWithImperativeEvent() {
    return render(ComponentWithImperativeEvent)
  },
  renderComponentWithDeclarativeEvent() {
    return render(ComponentWithDeclarativeEvent)
  }
}

basicTests(renderers);
advancedTests(renderers);