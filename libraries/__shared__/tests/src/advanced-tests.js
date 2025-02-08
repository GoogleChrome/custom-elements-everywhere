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

import { expect } from 'chai'


function skip() {
  this.skip();
  return {};
}
export default function (
  {
    renderComponentWithProperties = skip,
    renderComponentWithDeclarativeEvent = skip
  }
) {


  describe('advanced support', function () {

    describe('attributes and properties', function () {
      it('will pass array data as a property', async function () {
        this.weight = 2
        const { wc } = await renderComponentWithProperties.call(this)
        let data = wc.arr
        expect(data).to.eql(['c', 'u', 's', 't', 'o', 'm'])
      })

      it('will pass object data as a property', async function () {
        this.weight = 2
        const { wc } = await renderComponentWithProperties.call(this)
        let data = wc.obj
        expect(data).to.eql({org: 'webcomponents', repo: 'custom-elements-everywhere'})
      })

      it('will pass object data to a camelCase-named property', async function () {
        this.weight = 2
        const { wc } = await renderComponentWithProperties.call(this)
        let data = wc.camelCaseObj;
        expect(data).to.eql({label: "passed"});
      })

    })

    describe('events', function () {
      it('can declaratively listen to a lowercase DOM event dispatched by a Custom Element', async function () {
        this.weight = 2
        const { wc, click = wc.click.bind(wc), root = document } = await renderComponentWithDeclarativeEvent.call(this)
        expect(wc).to.exist
        let handled = root.querySelector('#lowercase')
        expect(handled.textContent).to.eql('false')
        await click()
        expect(handled.textContent).to.eql('true')
      })

      it('can declaratively listen to a kebab-case DOM event dispatched by a Custom Element', async function () {
        this.weight = 1
        const { wc, click = wc.click.bind(wc), root = document } = await renderComponentWithDeclarativeEvent.call(this)
        let handled = root.querySelector('#kebab')
        expect(handled.textContent).to.eql('false')
        await click()
        expect(handled.textContent).to.eql('true')
      })

      it('can declaratively listen to a camelCase DOM event dispatched by a Custom Element', async function () {
        this.weight = 1
        const { wc, click = wc.click.bind(wc), root = document } = await renderComponentWithDeclarativeEvent.call(this)
        let handled = root.querySelector('#camel')
        expect(handled.textContent).to.eql('false')
        await click()
        expect(handled.textContent).to.eql('true')
      })

      it('can declaratively listen to a CAPScase DOM event dispatched by a Custom Element', async function () {
        this.weight = 1
        const { wc, click = wc.click.bind(wc), root = document } = await renderComponentWithDeclarativeEvent.call(this)
        let handled = root.querySelector('#caps')
        expect(handled.textContent).to.eql('false')
        await click()
        expect(handled.textContent).to.eql('true')
      })

      it('can declaratively listen to a PascalCase DOM event dispatched by a Custom Element', async function () {
        this.weight = 1
        const { wc, click = wc.click.bind(wc), root = document } = await renderComponentWithDeclarativeEvent.call(this)
        let handled = root.querySelector('#pascal')
        expect(handled.textContent).to.eql('false')
        await click()
        expect(handled.textContent).to.eql('true')
      })
    })
  })
}
