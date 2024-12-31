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

import {expect} from 'chai'

function skip() {
  this.skip();
  return {};
}

export default function (
  {
    renderComponentWithoutChildren = skip,
    renderComponentWithChildren = skip,
    renderComponentWithChildrenRerender = skip,
    renderComponentWithDifferentViews = skip,
    renderComponentWithProperties = skip,
    renderComponentWithImperativeEvent = skip,
  }) {

  describe('basic support', function () {

    describe('no children', function () {
      it('can display a Custom Element with no children', async function () {
        this.weight = 3
        const { wc } = await renderComponentWithoutChildren.call(this);
        expect(wc).to.exist
      })
    })

    describe('with children', function () {
      function expectHasChildren(wc) {
        expect(wc).to.exist
        let shadowRoot = wc.shadowRoot
        let heading = shadowRoot.querySelector('h1')
        expect(heading).to.exist
        expect(heading.textContent).to.eql('Test h1')
        let paragraph = shadowRoot.querySelector('p')
        expect(paragraph).to.exist
        expect(paragraph.textContent).to.eql('Test p')
      }

      it('can display a Custom Element with children in a Shadow Root', async function () {
        this.weight = 3
        const { wc } = await renderComponentWithChildren.call(this);
        expectHasChildren(wc)
      })

      it('can display a Custom Element with children in a Shadow Root and pass in Light DOM children', async function () {
        this.weight = 3
        const { wc } = await renderComponentWithChildrenRerender.call(this);
        expectHasChildren(wc)
        expect(wc.textContent.includes('2')).to.be.true
      })

      it('can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element', async function () {
        this.weight = 3
        const { wc, toggle, root = document } = await renderComponentWithDifferentViews.call(this);
        expectHasChildren(wc)
        await toggle()
        const dummy = root.querySelector('#dummy')
        expect(dummy).to.exist
        expect(dummy.textContent).to.eql('Dummy view')
        await toggle()
        expectHasChildren(wc)
      })
    })

    describe('attributes and properties', function () {
      it('will pass boolean data as either an attribute or a property', async function () {
        this.weight = 3
        const { wc } = await renderComponentWithProperties.call(this);
        let data = wc.bool || wc.hasAttribute('bool')
        expect(data).to.be.true
      })

      it('will pass numeric data as either an attribute or a property', async function () {
        this.weight = 3
        const { wc } = await renderComponentWithProperties.call(this);
        let data = wc.num || wc.getAttribute('num')
        expect(parseInt(data, 10)).to.eql(42)
      })

      it('will pass string data as either an attribute or a property', async function () {
        this.weight = 3
        const { wc } = await renderComponentWithProperties.call(this);
        let data = wc.str || wc.getAttribute('str')
        expect(data).to.eql('custom')
      })
    })

    describe('events', async function () {
      it('can imperatively listen to a DOM event dispatched by a Custom Element', async function () {
        this.weight = 3
        const { wc, click = wc.click.bind(wc), root = document } = await renderComponentWithImperativeEvent.call(this)
        expect(wc).to.exist
        let handled = root.querySelector('#handled')
        expect(handled.textContent).to.eql('false')
        await click()
        expect(handled.textContent).to.eql('true')
      })
    })
  })
}