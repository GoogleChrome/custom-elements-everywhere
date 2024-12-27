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

import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import "ce-without-children";
import "ce-with-children";
import "ce-with-properties";
import "ce-without-properties";
import "ce-with-event";

export const ComponentWithoutChildren = () => <ce-without-children />;

export const ComponentWithChildren = () => <ce-with-children />;

export const ComponentWithChildrenRerender = () => {
  const [count, setCount] = createSignal(1);
  Promise.resolve().then(() => setCount(count() + 1));
  return <ce-with-children>{count}</ce-with-children>;
};

export const ComponentWithDifferentViews = ({ setToggle }) => {
  const [show, setShow] = createSignal(true);
  setToggle(() => setShow(!show()));
  return (
    <Show when={show()} fallback={<div id="dummy">Dummy view</div>}>
      <ce-with-children id="wc" />
    </Show>
  );
};

export const ComponentWithProperties = () => {
  const data = {
    bool: true,
    num: 42,
    str: "Solid",
    arr: ["S", "o", "l", "i", "d"],
    obj: { org: "ryansolid", repo: "solid" },
    camelCaseObj: { label: "passed" },
  };
  return (
    <ce-with-properties
      bool={data.bool}
      num={data.num}
      str={data.str}
      arr={data.arr}
      obj={data.obj}
      prop:camelCaseObj={data.camelCaseObj} // verbatim prop syntax, otherwise defaults to dash-case-to-camel-case
    />
  );
};

export const ComponentWithoutProperties = () => {
  const data = {
    getter: 'getter',
    method: 'method',
    readonly: 'readonly',
  }
  return (
    <ce-without-properties
      attr:agetter={data.getter}
      attr:amethod={data.method}
      attr:areadonly={data.readonly}
    />
  )
}

export const ComponentWithUnregistered = () => {
  const data = {
    bool: true,
    num: 42,
    str: "Solid",
    arr: ["S", "o", "l", "i", "d"],
    obj: { org: "ryansolid", repo: "solid" },
  };
  return (
    <ce-unregistered
      bool={data.bool}
      num={data.num}
      str={data.str}
      arr={data.arr}
      obj={data.obj}
    />
  );
};

export const ComponentWithImperativeEvent = () => {
  const [eventHandled, setHandled] = createSignal(false),
    handleTestEvent = () => setHandled(true),
    handleCamel = (wc) => wc.addEventListener("camelEvent", handleTestEvent);
  return (
    <>
      <div>{eventHandled().toString()}</div>
      <ce-with-event id="wc" ref={handleCamel} />
    </>
  );
};

export const ComponentWithDeclarativeEvent = () => {
  const [state, setState] = createStore({
      lowercaseHandled: false,
      kebabHandled: false,
      camelHandled: false,
      capsHandled: false,
      pascalHandled: false,
    }),
    handleLowercaseEvent = () => setState("lowercaseHandled", true),
    handleKebabEvent = () => setState("kebabHandled", true),
    handleCamelEvent = () => setState("camelHandled", true),
    handleCapsEvent = () => setState("capsHandled", true),
    handlePascalEvent = () => setState("pascalHandled", true);

  return (
    <>
      <div id="lowercase">{state.lowercaseHandled.toString()}</div>
      <div id="kebab">{state.kebabHandled.toString()}</div>
      <div id="camel">{state.camelHandled.toString()}</div>
      <div id="caps">{state.capsHandled.toString()}</div>
      <div id="pascal">{state.pascalHandled.toString()}</div>
      <ce-with-event
        id="wc"
        on:lowercaseevent={handleLowercaseEvent}
        on:kebab-event={handleKebabEvent}
        on:camelEvent={handleCamelEvent}
        on:CAPSevent={handleCapsEvent}
        on:PascalEvent={handlePascalEvent}
      />
    </>
  );
};
