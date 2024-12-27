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

import { v, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-with-event';
import 'ce-without-properties';

const factory = create({ icache });

export const ComponentWithoutChildren = factory(() => {
  return v('div', [
    v('ce-without-children', {})
  ]);
});

export const ComponentWithChildren = factory(() => {
  return v('div', [
    v('ce-with-children', {})
  ]);
});

export const ComponentWithChildrenRerender = factory(({ middleware: { icache } }) => {
  const count = icache.getOrSet('count', async () => {
    return 2;
  }) || 1;
  return v('div', [
    v('ce-with-children', [`${count}`])
  ]);
});

export const ComponentWithDifferentViews = factory(({ middleware: { icache } }) => {
  const show = icache.getOrSet('show', true);
  const child = show ? v('ce-with-children', {}) : v('div', { id: 'dummy' }, ['Dummy view']);
  return v('div', [v('div', [child]), v('button', {
    id: 'toggle', onclick: () => {
      icache.set('show', !icache.get('show'));
    }
  })]);
});

export const ComponentWithProperties = factory(() => {
  const data = {
    bool: true,
    num: 42,
    str: 'Dojo',
    arr: ['d', 'o', 'j', 'o'],
    obj: { org: 'dojo', repo: 'dojo' },
    camelCaseObj: { label: "passed" }
  };
  return v('ce-with-properties', data);
});

export const ComponentWithoutProperties = factory(() => {
  const data = {
    amethod: 'method',
    agetter: 'getter',
    areadonly: 'readonly'
  };
  return v('ce-without-properties', data);
})

export const ComponentWithUnregistered = factory(() => {
  const data = {
    bool: true,
    num: 42,
    str: 'Dojo',
    arr: ['d', 'o', 'j', 'o'],
    obj: { org: 'dojo', repo: 'dojo' }
  };
  return v('div', [
    v('ce-unregistered', data)
  ]);
});

export const ComponentWithImperativeEvent = factory(({ middleware: { icache } }) => {
  const handled = icache.getOrSet('handled', false);
  return v('div', [
    v('ce-with-event', {
      id: 'wc', oncamelEvent: () => {
        icache.set('handled', true);
      }
    }),
    v('dom', { id: 'eventHandled', handled })
  ]);
});

export const ComponentWithDeclarativeEvent = factory(({ middleware: { icache } }) => {
  const lowerCaseHandled = icache.getOrSet('lowerCaseHandled', false);
  const kebabHandled = icache.getOrSet('kebabHandled', false);
  const camelHandled = icache.getOrSet('camelHandled', false);
  const capsHandled = icache.getOrSet('capsHandled', false);
  const pascalHandled = icache.getOrSet('pascalHandled', false);

  return v('div', [
    v('ce-with-event', {
      id: 'wc',
      onlowercaseevent: () => {
        icache.set('lowerCaseHandled', true);
      },
      'onkebab-event': () => {
        icache.set('kebabHandled', true);
      },
      oncamelEvent: () => {
        icache.set('camelHandled', true);
      },
      onCAPSevent: () => {
        icache.set('capsHandled', true);
      },
      onPascalEvent: () => {
        icache.set('pascalHandled', true);
      },
    }),
    v('dom', { id: 'pascal', handled: pascalHandled }),
    v('dom', { id: 'caps', handled: capsHandled }),
    v('dom', { id: 'camel', handled: camelHandled }),
    v('dom', { id: 'kebab', handled: kebabHandled }),
    v('dom', { id: 'lower', handled: lowerCaseHandled })
  ]);
});
