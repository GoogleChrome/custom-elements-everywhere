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

import HyperHTMLELement from 'hyperhtml-element/esm';
const { hyper } = HyperHTMLELement;

export const ComponentWithoutChildren = () => hyper`
  <div>
    <ce-without-children id="wc"></ce-without-children>
  </div>`;

export const ComponentWithChildren = () => hyper`
  <div>
    <ce-with-children id="wc"></ce-with-children>
  </div>`;

export class ComponentWithChildrenRerender extends HyperHTMLELement {
  get defaultState() { return {count: 1}; }
  created() {
    this.render(); // first render with default state.count
  }
  connectedCallback() {
    // increment by one and auto-render
    this.setState({count: this.state.count + 1});
  }
  render() { this.html`
    <div>
      <ce-with-children id="wc">${this.state.count}</ce-with-children>
    </div>`;
  }
}
ComponentWithChildrenRerender.define('with-children');

export class ComponentWithDifferentViews extends HyperHTMLELement {
  get defaultState() { return {showWC: true}; }
  created() { this.render(); }
  toggle() { this.setState((prev) => ({showWC: !prev.showWC})); }
  render() { this.html`
    <div>
    showWC: ${this.state.showWC /* just to show-off */}
    ${this.state.showWC ?
      // wire the node with an ID to relate once sub components
      hyper(this, ':ce')`<ce-with-children id="wc"></ce-with-children>` :
      hyper(this, ':dummy')`<div id="dummy">Dummy view</div>`
    }
    </div>`;
  }
}
ComponentWithDifferentViews.define('with-children-diff-views');

export const ComponentWithProperties = (root) => hyper(root)`
  <div>
    <ce-with-properties id="wc"
      bool=${true}
      num=${42}
      str=${'hyperHTML'}
      arr=${['h', 'y', 'p', 'e', 'r', 'H', 'T', 'M', 'L']}
      obj=${{org: 'viperHTML', repo: 'hyperHTML'}}
      camelCaseObj=${{ label: "passed" }}
    ></ce-with-properties>
  </div>`;

export const ComponentWithoutProperties = (root) => hyper(root)`
  <div>
    <ce-without-properties id="wc"
      amethod="${"method"}"
      agetter="${"getter"}"
      areadonly="${"readonly"}"
    ></ce-without-properties>
  </div>
`

export class ComponentWithImperativeEvent extends HyperHTMLELement {
  created() {
    this.eventClicks = 0;
    this.eventHandled = false;
    this.render();
  }
  handleCamel() {
    this.eventClicks++;
    this.eventHandled = true;
    this.render();
  }
  render() {
    (this.html`
      <div>
        <div id="handled">${this.eventHandled}</div>
        <ce-with-event id="wc"></ce-with-event>
      </div>`
    ) .querySelector('ce-with-event')
      .addEventListener('camelEvent', this.handleCamel);
  }
}
ComponentWithImperativeEvent.define('with-imperative-event');

export class ComponentWithDeclarativeEvent extends HyperHTMLELement {
  get defaultState() { return {
    lowercaseHandled: false,
    kebabHandled: false,
    camelHandled: false,
    capsHandled: false,
    pascalHandled: false
  }; }
  created() { this.render(); }
  handleLower() { this.setState({lowercaseHandled: true}); }
  handleKebab() { this.setState({kebabHandled: true}); }
  handleCamel() { this.setState({camelHandled: true}); }
  handleCAPS() { this.setState({capsHandled: true}); }
  handlePascal() { this.setState({pascalHandled: true}); }
  render() {
    const state = this.state;
    this.html`
    <div>
      <div id="lowercase">${state.lowercaseHandled}</div>
      <div id="kebab">${state.kebabHandled}</div>
      <div id="camel">${state.camelHandled}</div>
      <div id="caps">${state.capsHandled}</div>
      <div id="pascal">${state.pascalHandled}</div>
      <ce-with-event id="wc"
        onlowercaseevent=${this.handleLower}
        onkebab-event=${this.handleKebab}
        oncamelEvent=${this.handleCamel}
        onCAPSevent=${this.handleCAPS}
        onPascalEvent=${this.handlePascal}
      ></ce-with-event>
    </div>`;
  }
}
ComponentWithDeclarativeEvent.define('with-declarative-event');
