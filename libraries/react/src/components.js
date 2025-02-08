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

import React, { Component } from 'react';
import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-with-event';

export class ComponentWithoutChildren extends Component {
  render() {
    return (
      <div>
        <ce-without-children ref={(el) => this.wc = el}></ce-without-children>
      </div>
    );
  }
}

export class ComponentWithChildren extends Component {
  render() {
    return (
      <div>
        <ce-with-children ref={(el) => this.wc = el}></ce-with-children>
      </div>
    );
  }
}

export class ComponentWithChildrenRerender extends Component {
  constructor () {
    super();
    this.state = { count: 1 };
  }
  componentDidMount () {
    Promise.resolve().then(_ => this.setState({count: this.state.count += 1}));
  }
  componentWillUnmount () {
    clearInterval(this.interval);
  }
  render () {
    const { count } = this.state;
    return (
      <div>
        <ce-with-children ref={(el) => this.wc = el}>{count}</ce-with-children>
      </div>
    );
  }
}

export class ComponentWithDifferentViews extends Component {
  constructor () {
    super();
    this.state = { showWC: true };
    this.dummy = React.createRef();
  }
  toggle() {
    this.setState({ showWC: !this.state.showWC });
  }
  render () {
    const { showWC } = this.state;
    return (
      <div>
        {showWC ? (
          <ce-with-children ref={(el) => this.wc = el}></ce-with-children>
        ) : (
          <div id="dummy" ref={this.dummy}>Dummy view</div>
        )}
      </div>
    );
  }
}

export class ComponentWithProperties extends Component {
  render () {
    const data = {
      bool: true,
      num: 42,
      str: 'custom',
      arr: ['c', 'u', 's', 't', 'o', 'm'],
      obj: { org: 'webcomponents', repo: 'custom-elements-everywhere' },
      camelCaseObj: { label: "passed" }
    };
    return (
      <div>
        <ce-with-properties ref={(el) => this.wc = el}
          bool={data.bool}
          num={data.num}
          str={data.str}
          arr={data.arr}
          obj={data.obj}
          camelCaseObj={data.camelCaseObj}
        ></ce-with-properties>
      </div>
    );
  }
}

export class ComponentWithUnregistered extends Component {
  render () {
    const data = {
      bool: true,
      num: 42,
      str: 'React',
      arr: ['R', 'e', 'a', 'c', 't'],
      obj: { org: 'facebook', repo: 'react' }
    };
    return (
      <div>
        {/* This element doesn't actually exist.
        It's used to test unupgraded behavior. */}
        <ce-unregistered ref={(el) => this.wc = el}
          bool={data.bool}
          num={data.num}
          str={data.str}
          arr={data.arr}
          obj={data.obj}
        ></ce-unregistered>
      </div>
    );
  }
}

export class ComponentWithImperativeEvent extends Component {
  constructor() {
    super();
    this.state = {
      eventHandled: false
    };
    this.handleTestEvent = this.handleTestEvent.bind(this);
  }
  componentDidMount() {
    this.wc.addEventListener('camelEvent', this.handleTestEvent);
  }
  handleTestEvent(e) {
    this.setState({ eventHandled: true });
  }
  render() {
    let state = this.state;
    return (
      <div>
        <div id="handled" ref={(el) => this.handled = el}>{state.eventHandled.toString()}</div>
        <ce-with-event id="wc" ref={(el) => this.wc = el}></ce-with-event>
      </div>
    );
  }
}

export class ComponentWithDeclarativeEvent extends Component {
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
    this.setState({ lowercaseHandled: true });
  }
  handleKebabEvent(e) {
    this.setState({ kebabHandled: true });
  }
  handleCamelEvent(e) {
    this.setState({ camelHandled: true });
  }
  handleCapsEvent(e) {
    this.setState({ capsHandled: true });
  }
  handlePascalEvent(e) {
    this.setState({ pascalHandled: true });
  }
  render() {
    let state = this.state;
    return (
      <div>
        <div id="lowercase" ref={(el) => this.lowercase = el}>{state.lowercaseHandled.toString()}</div>
        <div id="kebab" ref={(el) => this.kebab = el}>{state.kebabHandled.toString()}</div>
        <div id="camel" ref={(el) => this.camel = el}>{state.camelHandled.toString()}</div>
        <div id="caps" ref={(el) => this.caps = el}>{state.capsHandled.toString()}</div>
        <div id="pascal" ref={(el) => this.pascal = el}>{state.pascalHandled.toString()}</div>
        <ce-with-event id="wc" ref={(el) => this.wc = el}
          onlowercaseevent={this.handleLowercaseEvent}
          onkebab-event={this.handleKebabEvent}
          oncamelEvent={this.handleCamelEvent}
          onCAPSevent={this.handleCapsEvent}
          onPascalEvent={this.handlePascalEvent}
        ></ce-with-event>
      </div>
    );
  }
}
