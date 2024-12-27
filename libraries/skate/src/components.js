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

// @jsx h

import { props, withComponent } from "skatejs";
import withPreact from "@skatejs/renderer-preact";
import { h } from "preact";
import "ce-without-children";
import "ce-with-children";
import "ce-with-properties";
import "ce-without-properties";
import "ce-with-event";

export class ComponentWithoutChildren extends withComponent(withPreact()) {
  render() {
    return (
      <div>
        <ce-without-children id="wc" />
      </div>
    );
  }
}
customElements.define("component-without-children", ComponentWithoutChildren);

export class ComponentWithChildren extends withComponent(withPreact()) {
  render() {
    return (
      <div>
        <ce-with-children id="wc" />
      </div>
    );
  }
}
customElements.define("component-with-children", ComponentWithChildren);

export class ComponentWithChildrenRerender extends withComponent(withPreact()) {
  constructor() {
    super();
    this.state = { count: 1 };
  }
  connected() {
    Promise.resolve().then(
      _ =>
        (this.state = Object.assign({}, this.state, {
          count: (this.state.count += 1)
        }))
    );
  }
  disconnected() {
    clearInterval(this.interval);
  }
  render({ state }) {
    return (
      <div>
        <ce-with-children id="wc">{state.count}</ce-with-children>
      </div>
    );
  }
}
customElements.define(
  "component-with-children-rerender",
  ComponentWithChildrenRerender
);

export class ComponentWithDifferentViews extends withComponent(withPreact()) {
  constructor() {
    super();
    this.state = { showWC: true };
  }
  toggle() {
    this.state = Object.assign({}, this.state, { showWC: !this.state.showWC });
  }
  render({ state }) {
    return (
      <div>
        {state.showWC ? (
          <ce-with-children id="wc" />
        ) : (
          <div id="dummy">Dummy view</div>
        )}
      </div>
    );
  }
}
customElements.define(
  "component-with-different-views",
  ComponentWithDifferentViews
);

export class ComponentWithProperties extends withComponent(withPreact()) {
  render() {
    const data = {
      bool: true,
      num: 42,
      str: "Skate",
      arr: ["S", "k", "a", "t", "e"],
      obj: { org: "skatejs", repo: "skatejs" },
      camelCaseObj: { label: "passed" }
    };
    return (
      <div>
        <ce-with-properties
          id="wc"
          bool={data.bool}
          num={data.num}
          str={data.str}
          arr={data.arr}
          obj={data.obj}
          camelCaseObj={data.camelCaseObj}
        />
      </div>
    );
  }
}
customElements.define("component-with-properties", ComponentWithProperties);

export class ComponentWithoutProperties extends withComponent(withPreact()) {
  render() {
    const data = {
      getter: 'getter',
      readonly: 'readonly',
      method: 'method',
    }
    return (
      <div>
        <ce-without-properties
          id="wc"
          agetter={data.getter}
          areadonly={data.readonly}
          amethod={data.method}
        ></ce-without-properties>
      </div>
    )
  }
}
customElements.define("component-without-properties", ComponentWithoutProperties)

export class ComponentWithUnregistered extends withComponent(withPreact()) {
  render() {
    const data = {
      bool: true,
      num: 42,
      str: "Skate",
      arr: ["S", "k", "a", "t", "e"],
      obj: { org: "skatejs", repo: "skatejs" }
    };
    return (
      <div>
        {/* This element doesn't actually exist.
        It's used to test unupgraded behavior. */}
        <ce-unregistered
          id="wc"
          bool={data.bool}
          num={data.num}
          str={data.str}
          arr={data.arr}
          obj={data.obj}
        />
      </div>
    );
  }
}
customElements.define("component-with-unregistered", ComponentWithUnregistered);

export class ComponentWithImperativeEvent extends withComponent(withPreact()) {
  constructor() {
    super();
    this.state = { eventHandled: false };
    this.handleRef = this.handleRef.bind(this);
    this.handleTestEvent = this.handleTestEvent.bind(this);
  }
  handleRef(el) {
    if (el) {
      el.addEventListener("camelEvent", this.handleTestEvent);
    }
  }
  handleTestEvent(e) {
    this.state = Object.assign({}, this.state, { eventHandled: true });
  }
  render({ state }) {
    return (
      <div>
        <div id="handled">{state.eventHandled.toString()}</div>
        <ce-with-event id="wc" ref={this.handleRef} />
      </div>
    );
  }
}
customElements.define(
  "component-with-imperative-event",
  ComponentWithImperativeEvent
);

class ComponentWithDeclarativeEvent extends withComponent(withPreact()) {
  constructor() {
    super();
    this.state = {
      lowercaseHandled: false,
      kebabHandled: false,
      camelHandled: false,
      capsHandled: false,
      pascalHandled: false
    };
    this.handleLowercaseEvent = this.handleLowercaseEvent.bind(this);
    this.handleKebabEvent = this.handleKebabEvent.bind(this);
    this.handleCamelEvent = this.handleCamelEvent.bind(this);
    this.handleCapsEvent = this.handleCapsEvent.bind(this);
    this.handlePascalEvent = this.handlePascalEvent.bind(this);
  }
  handleLowercaseEvent(e) {
    this.state = Object.assign({}, this.state, { lowercaseHandled: true });
  }
  handleKebabEvent(e) {
    this.state = Object.assign({}, this.state, { kebabHandled: true });
  }
  handleCamelEvent(e) {
    this.state = Object.assign({}, this.state, { camelHandled: true });
  }
  handleCapsEvent(e) {
    this.state = Object.assign({}, this.state, { capsHandled: true });
  }
  handlePascalEvent(e) {
    this.state = Object.assign({}, this.state, { pascalHandled: true });
  }
  render({ state }) {
    return (
      <div>
        <div id="lowercase">{state.lowercaseHandled.toString()}</div>
        <div id="kebab">{state.kebabHandled.toString()}</div>
        <div id="camel">{state.camelHandled.toString()}</div>
        <div id="caps">{state.capsHandled.toString()}</div>
        <div id="pascal">{state.pascalHandled.toString()}</div>
        <ce-with-event
          id="wc"
          onlowercaseevent={this.handleLowercaseEvent}
          onkebab-event={this.handleKebabEvent}
          oncamelEvent={this.handleCamelEvent}
          onCAPSevent={this.handleCapsEvent}
          onPascalEvent={this.handlePascalEvent}
        />
      </div>
    );
  }
}
customElements.define(
  "component-with-declarative-event",
  ComponentWithDeclarativeEvent
);
