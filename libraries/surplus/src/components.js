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

import S from 's-js';
import * as Surplus from 'surplus';
import on from 'surplus-mixin-on';
import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-without-properties';
import 'ce-with-event';

export const ComponentWithoutChildren = () =>
    <div>
        <ce-without-children ref={__.wc}></ce-without-children>
    </div>;

export const ComponentWithChildren = () =>
    <div>
        <ce-with-children ref={__.wc}></ce-with-children>
    </div>;

export const ComponentWithChildrenRerender = () => {
    const count = S.data(1);
    Promise.resolve().then(() => count(count() + 1));
    return (
      <div>
        <ce-with-children ref={__.wc}>{count()}</ce-with-children>
      </div>
    );
}

export const ComponentWithDifferentViews = () => {
    const showWC = S.data(true),
      toggle = () => showWC(!showWC());
  let root;
  root = <div ref={root}>
        {showWC() ? (
          <ce-with-children ref={root.wc}></ce-with-children>
        ) : (
          <div ref={root.dummy}>Dummy view</div>
        )}
      </div>
    return { toggle, root };
}

export const ComponentWithProperties = () => {
    const data = {
      bool: true,
      num: 42,
      str: 'Surplus',
      arr: ['S', 'u', 'r', 'p', 'l', 'u', 's'],
      obj: { org: 'adam.haile@gmail.com', repo: 'surplus' },
      camelCaseObj: { label: "passed" }
    };
    return (
      <div>
        <ce-with-properties ref={__.wc}
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

export const ComponentWithoutProperties = () => {
  const data = {
    getter: 'getter',
    method: 'method',
    readonly: 'readonly',
  };
  return (
    <div>
      <ce-without-properties ref={__.wc}
         amethod={data.method}
         agetter={data.getter}
         areadonly={data.readonly}
      ></ce-without-properties>
    </div>
  )
}

export const ComponentWithUnregistered = () => {
    const data = {
      bool: true,
      num: 42,
      str: 'Surplus',
      arr: ['S', 'u', 'r', 'p', 'l', 'u', 's'],
      obj: { org: 'adam.haile@gmail.com', repo: 'surplus' }
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

export const ComponentWithImperativeEvent = () => {
    const eventHandled = S.data(false),
        handleTestEvent = () => eventHandled(true);
    return (
      <div>
        <div ref={__.handled}>{eventHandled().toString()}</div>
        <ce-with-event id="wc" ref={__.wc} fn={wc => wc.addEventListener('camelEvent', handleTestEvent)}></ce-with-event> 
      </div>
    );
}

export const ComponentWithDeclarativeEvent = () => {
    const
      lowercaseHandled = S.data(false),
      kebabHandled = S.data(false),
      camelHandled = S.data(false),
      capsHandled = S.data(false),
      pascalHandled = S.data(false),
      handleLowercaseEvent = () => lowercaseHandled(true),
      handleKebabEvent = () => kebabHandled(true),
      handleCamelEvent = () => camelHandled(true),
      handleCapsEvent = () => capsHandled(true),
      handlePascalEvent = () => pascalHandled(true);
    return (
      <div>
        <div ref={__.lowercase}>{lowercaseHandled().toString()}</div>
        <div ref={__.kebab}>{kebabHandled().toString()}</div>
        <div ref={__.camel}>{camelHandled().toString()}</div>
        <div ref={__.caps}>{capsHandled().toString()}</div>
        <div ref={__.pascal}>{pascalHandled().toString()}</div>
        <ce-with-event id="wc" ref={__.wc}
          fn={on('lowercaseevent', handleLowercaseEvent)}
          fn={on('kebab-event', handleKebabEvent)}
          fn={on('camelEvent', handleCamelEvent)}
          fn={on('CAPSevent', handleCapsEvent)}
          fn={on('PascalEvent', handlePascalEvent)}
        ></ce-with-event> 
      </div>
    );
}
