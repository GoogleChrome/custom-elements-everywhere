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
import { component } from 'riot'
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithoutProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent
} from './components'

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)
let scratch // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement('div')
  scratch.id = 'scratch'
  app.appendChild(scratch)
})

afterEach(function() {
  app.innerHTML = ''
  scratch = null
})

describe('basic support', function() {

  describe('no children', function() {
    it('can display a Custom Element with no children', function() {
      this.weight = 3
      component(ComponentWithoutChildren)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc).to.exist
    })
  })

  describe('with children', function() {
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

    it('can display a Custom Element with children in a Shadow Root', function() {
      this.weight = 3
      component(ComponentWithChildren)(scratch)
      let wc = scratch.querySelector('#wc')
      expectHasChildren(wc)
    })

    it('can display a Custom Element with children in a Shadow Root and pass in Light DOM children', function() {
      this.weight = 3
      component(ComponentWithChildrenRerender)(scratch)
      let wc = scratch.querySelector('#wc')
      expectHasChildren(wc)
      expect(wc.textContent.includes('2')).to.be.true
    })

    it('can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element', function() {
      this.weight = 3
      const el = component(ComponentWithDifferentViews)(scratch)
      let wc = scratch.querySelector('#wc')
      expectHasChildren(wc)
      el.toggle()
      let dummy = scratch.querySelector('#dummy')
      expect(dummy).to.exist
      expect(dummy.textContent).to.eql('Dummy view')
      el.toggle()
      wc = scratch.querySelector('#wc')
      expectHasChildren(wc)
    })
  })

  describe('attributes and properties', function() {
    it('will pass boolean data as either an attribute or a property', function() {
      this.weight = 3
      component(ComponentWithProperties)(scratch)
      let wc = scratch.querySelector('#wc')
      let data = wc.bool || wc.hasAttribute('bool')
      expect(data).to.be.true
    })

    it('will pass numeric data as either an attribute or a property', function() {
      this.weight = 3
      component(ComponentWithProperties)(scratch)
      let wc = scratch.querySelector('#wc')
      let data = wc.num || wc.getAttribute('num')
      expect(parseInt(data, 10)).to.eql(42)
    })

    it('will pass string data as either an attribute or a property', function() {
      this.weight = 3
      component(ComponentWithProperties)(scratch)
      let wc = scratch.querySelector('#wc')
      let data = wc.str || wc.getAttribute('str')
      expect(data).to.eql('riot')
    })

    it("will not overwrite unwriteable properties", function () {
      this.weight = 3;
      component(ComponentWithoutProperties)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });

    // Riot.js passes all the following tests but they must be commented out
    // being consistent with the other frameworks ¯\_(ツ)_/¯
    /*
    it('will set boolean attributes on a Custom Element that has not already been defined and upgraded', function() {
      component(ComponentWithUnregistered)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc.hasAttribute('bool')).to.be.true
    })

    it('will set numeric attributes on a Custom Element that has not already been defined and upgraded', function() {
      component(ComponentWithUnregistered)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc.getAttribute('num')).to.eql('42')
    })

    it('will set string attributes on a Custom Element that has not already been defined and upgraded', function() {
      component(ComponentWithUnregistered)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc.getAttribute('str')).to.eql('riot')
    })

    it('will set array properties on a Custom Element that has not already been defined and upgraded', function() {
      component(ComponentWithUnregistered)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc.arr).to.eql(['r', 'i', 'o', 't'])
    })

    it('will set object properties on a Custom Element that has not already been defined and upgraded', function() {
      component(ComponentWithUnregistered)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc.obj).to.eql({ org: 'riotjs', repo: 'riot' })
    })
    */
  })

  describe('events', function() {
    it('can imperatively listen to a DOM event dispatched by a Custom Element', function() {
      this.weight = 3
      component(ComponentWithImperativeEvent)(scratch)
      let wc = scratch.querySelector('#wc')
      expect(wc).to.exist
      let handled = scratch.querySelector('#handled')
      expect(handled.textContent).to.eql('false')
      wc.click()
      expect(handled.textContent).to.eql('true')
    })
  })

})
