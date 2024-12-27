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

import "ce-without-children"
import "ce-with-children"
import "ce-with-properties"
import "ce-with-event"
import "ce-without-properties"

import { app, h, text } from "hyperapp"

export const ComponentWithoutChildren = node =>
  app({
    node,
    init: {},
    view: () => h("div", {}, [h("ce-without-children", { id: "wc" })]),
  })

export const ComponentWithChildren = node =>
  app({
    node,
    init: {},
    view: () => h("div", {}, [h("ce-with-children", { id: "wc" })]),
  })

export const ComponentWithChildrenRerender = node => {
  const _afterRender = (dispatch, { action }) =>
    requestAnimationFrame(_ => dispatch(action))
  const afterRender = action => [_afterRender, { action }]
  const Increment = state => ({ ...state, count: state.count + 1 })
  app({
    node,
    init: [{ count: 1 }, afterRender(Increment)],
    view: state =>
      h("div", {}, [h("ce-with-children", { id: "wc" }, [text(state.count)])]),
  })
}

export const ComponentWithDifferentViews = node => {
  const dispatch = app({
    node,
    init: { showWC: true },
    view: ({ showWC }) =>
      h("div", {}, [
        showWC
          ? h("ce-with-children", { id: "wc" })
          : h("div", { id: "dummy" }, text("Dummy view")),
      ]),
  })
  return () => dispatch(({ showWC }) => ({ showWC: !showWC }))
}

export const ComponentWithProperties = node =>
  app({
    node,
    init: {},
    view: () =>
      h("div", {}, [
        h("ce-with-properties", {
          id: "wc",
          bool: true,
          num: 42,
          str: "Hyperapp",
          arr: ["H", "y", "p", "e", "r", "a", "p", "p"],
          obj: { org: "Hyperapp", repo: "hyperapp.js" },
          camelCaseObj: { label: "passed" },
        }),
      ]),
  })

export const ComponentWithoutProperties = node =>
  app({
    node,
    init: {},
    view: () =>
      h('div', {}, [
        h('ce-without-properties', {
          amethod: 'method',
          agetter: 'getter',
          areadonly: 'readonly'
        }),
      ]),
  })

export const ComponentWithImperativeEvent = node => {
  const _withElem = (_, opts) =>
    requestAnimationFrame(_ => {
      let elem = document.querySelector(opts.selector)
      if (elem) opts.fn(elem)
    })
  const withElem = (selector, fn) => [_withElem, { selector, fn }]
  const eventListener = (sel, name, handler) =>
    withElem(sel, el => el.addEventListener(name, handler))

  const dispatch = app({
    node,
    init: [
      { handled: false },
      eventListener("#wc", "camelEvent", ev => {
        dispatch({ handled: true })
      }),
    ],
    view: ({ handled }) =>
      h("div", {}, [
        h("div", { id: "handled" }, text(handled ? "true" : "false")),
        h("ce-with-event", { id: "wc" }),
      ]),
  })
}

export const ComponentWithDeclarativeEvent = node =>
  app({
    node,
    init: {
      lowercaseHandled: false,
      kebabHandled: false,
      capsHandled: false,
      pascalHandled: false,
    },
    view: state =>
      h("div", {}, [
        h(
          "div",
          { id: "lowercase" },
          text(state.lowercaseHandled ? "true" : "false")
        ),
        h("div", { id: "kebab" }, text(state.kebabHandled ? "true" : "false")),
        h("div", { id: "camel" }, text(state.camelHandled ? "true" : "false")),
        h("div", { id: "caps" }, text(state.capsHandled ? "true" : "false")),
        h(
          "div",
          { id: "pascal" },
          text(state.pascalHandled ? "true" : "false")
        ),
        h("ce-with-event", {
          id: "wc",
          onlowercaseevent: state => ({ ...state, lowercaseHandled: true }),
          "onkebab-event": state => ({ ...state, kebabHandled: true }),
          oncamelEvent: state => ({ ...state, camelHandled: true }),
          onCAPSevent: state => ({ ...state, capsHandled: true }),
          onPascalEvent: state => ({ ...state, pascalHandled: true }),
        }),
      ]),
  })
