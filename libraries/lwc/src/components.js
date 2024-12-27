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

import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-without-properties';
import 'ce-with-event';

import { createElement } from 'lwc';

import WithoutChildren from 'x/withoutChildren';
import WithChildren from 'x/withChildren';
import WithChildrenRerender from 'x/withChildrenRerender';
import WithDifferentViews from 'x/withDifferentViews';
import WithProperties from 'x/withProperties';
import WithoutProperties from 'x/withoutProperties';
import WithImperativeEvent from 'x/withImperativeEvent';
import WithDeclarativeEvent from 'x/withDeclarativeEvent';

export function createComponentWithoutChildren() {
  return createElement('x-without-children', { is: WithoutChildren });
}

export function createComponentWithChildren() {
  return createElement('x-with-children', { is: WithChildren });
}

export function createComponentWithChildrenRerender() {
  return createElement('x-with-children-rerender', { is: WithChildrenRerender });
}

export function createComponentWithDifferentViews() {
  return createElement('x-with-different-views', { is: WithDifferentViews });
}

export function createComponentWithProperties() {
  return createElement('x-with-properties', { is: WithProperties });
}

export function createComponentWithoutProperties() {
  return createElement('x-without-properties', { is: WithoutProperties });
}

export function createComponentWithImperativeEvent() {
  return createElement('x-with-imperative-event', { is: WithImperativeEvent });
}

export function createComponentWithDeclarativeEvent() {
  return createElement('x-with-declarative-event', { is: WithDeclarativeEvent });
}
