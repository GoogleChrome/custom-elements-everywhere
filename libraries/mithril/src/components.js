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

import 'ce-without-children'
import 'ce-with-children'
import 'ce-with-properties'
import 'ce-with-event'
import 'ce-without-properties'

import m from 'mithril'

export const ComponentWithoutChildren = () => ({
  view: () =>
    m('div',
      m('ce-without-children#wc')
    )
})

export const ComponentWithChildren = () => ({
  view: (vnode) =>
    m('div',
      m('ce-with-children#wc', vnode.children)
    )
})

export const ComponentWithChildrenRerender = () => {
  let count = 1

  return {
    oncreate: () => {
      count++
      m.redraw()
    },
    view: () =>
      m('div',
        m('ce-with-children#wc', count)
      )
  }
}

export const ComponentWithDifferentViews = () => {
  let showWC = true

  return {
    oncreate: (vnode) => {
      vnode.dom.toggle = () => {
        showWC = !showWC
        m.redraw()
      }
    },
    view: () =>
      m('div#ce', {
        showWC: showWC
      },
        showWC
          ? m('ce-with-children#wc')
          : m('#dummy', 'Dummy view')
      )
  }
}

export const ComponentWithProperties = () => ({
  view: () =>
    m('div',
      m('ce-with-properties#wc', {
        bool: true,
        num: 42,
        str: 'Mithril',
        arr: ['M', 'i', 't', 'h', 'r', 'i', 'l'],
        obj: { org: 'MithrilJS', repo: 'mithril.js' },
        camelCaseObj: { label: "passed" },
      })
    )
})

export const ComponentWithoutProperties = () => ({
  view: () =>
    m('div',
      m('ce-without-properties#wc', {
        amethod: 'method',
        agetter: 'getter',
        areadonly: 'readonly'
      })
    )
})

export const ComponentWithImperativeEvent = () => {
  let eventHandled = false

  return {
    view: () =>
      m('div',
        m('div#handled', String(eventHandled)),
        m('ce-with-event#wc', {
          oncreate: (vnode) => {
            vnode.dom.addEventListener('camelEvent', e => {
              eventHandled = true
              m.redraw()
            })
          }
        })
      )
  }
}

export const ComponentWithDeclarativeEvent = () => {
  let lowercaseHandled = false
    , kebabHandled = false
    , camelHandled = false
    , capsHandled = false
    , pascalHandled = false

  return {
    view: () =>
      m('div',
        m('div#lowercase', String(lowercaseHandled)),
        m('div#kebab', String(kebabHandled)),
        m('div#camel', String(camelHandled)),
        m('div#caps', String(capsHandled)),
        m('div#pascal', String(pascalHandled)),
        m('ce-with-event#wc', {
          onlowercaseevent: e => lowercaseHandled = true,
          'onkebab-event': e => kebabHandled = true,
          oncamelEvent: e => camelHandled = true,
          onCAPSevent: e => capsHandled = true,
          onPascalEvent: e => pascalHandled = true
        })
      )
  }
}
