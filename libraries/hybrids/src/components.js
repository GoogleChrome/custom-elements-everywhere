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
import 'ce-with-event';
import 'ce-without-properties';

import { html } from 'hybrids';

export const ComponentWithoutChildren = {
  render: () => html`
    <ce-without-children id="wc"></ce-without-children>
  `,
};

export const ComponentWithChildren = {
  render: () => html`
    <ce-with-children id="wc"></ce-with-children>
  `,
};

export const ComponentWithChildrenCount = {
  count: 1,
  render: ({ count }) => html`
    <ce-with-children id="wc">${count}</ce-with-children>
  `,
};

export const ComponentWithDifferentViews = {
  showWc: true,
  render: ({ showWc }) => html`
    ${showWc ? html`<ce-with-children id="wc"></ce-with-children>` : html`<div id="dummy">Dummy view</div>`}
  `
};

export const ComponentWithProperties = {
  render: () => html`
    <ce-with-properties 
      id="wc"
      bool=${true}
      num=${42}
      str=${"hybrids"}
      arr=${["h", "y", "b", "r", "i", "d", "s"]}
      obj=${{ library: "hybrids" }},
      camelCaseObj=${{ label: "passed" }}
    ></ce-with-properties>
  `,
};

export const ComponentWithoutProperties = {
  render: () => html`
    <ce-without-properties
      id="wc"
      amethod="method"
      agetter="getter"
      areadonly="readonly"
    ></ce-without-properties>
  `
}

export const ComponentWithDeclarativeEvent = {
  lowercaseHandled: false,
  kebabHandled: false,
  camelHandled: false,
  capsHandled: false,
  pascalHandled: false,
  render: () => html`
    <ce-with-event
      id="wc" 
      onlowercaseevent="${host => {host.lowercaseHandled = true; }}"
      onkebab-event="${host => {host.kebabHandled = true; }}"
      oncamelEvent="${host => {host.camelHandled = true; }}"
      onCAPSevent="${host => {host.capsHandled = true; }}"
      onPascalEvent="${host => {host.pascalHandled = true; }}"
    >
    </ce-with-event>
  `
};
