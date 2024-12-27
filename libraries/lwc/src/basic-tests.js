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

import {
  createComponentWithChildren,
  createComponentWithoutChildren,
  createComponentWithChildrenRerender,
  createComponentWithDifferentViews,
  createComponentWithProperties,
  createComponentWithoutProperties,
  createComponentWithImperativeEvent,
} from './components';

import { expect } from 'chai';

// Setup the test harness. This will get cleaned out with every test.
const container = document.createElement('div');
document.body.appendChild(container);

let scratch; // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement('div');
  container.appendChild(scratch);
});

afterEach(function() {
  container.innerHTML = '';
  scratch = null;
});

describe('basic support', function() {

  describe('no children', function() {
    it('can display a Custom Element with no children', function() {
      this.weight = 3;
      const cmp = createComponentWithoutChildren();
      scratch.appendChild(cmp);

      expect(cmp.shadowRoot.querySelector('ce-without-children')).to.exist;
    });
  });

  describe('with children', function() {
    function expectHasChildren(wc) {
      expect(wc).to.exist;
      const heading = wc.shadowRoot.querySelector('h1');
      expect(heading).to.exist;
      expect(heading.textContent).to.eql('Test h1');
      const paragraph = wc.shadowRoot.querySelector('p');
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.eql('Test p');
    }

    it('can display a Custom Element with children in a Shadow Root', function() {
      this.weight = 3;
      const cmp = createComponentWithChildren();
      scratch.appendChild(cmp);

      expectHasChildren(cmp.shadowRoot.querySelector('ce-with-children'));
    });

    it('can display a Custom Element with children in a Shadow Root and pass in Light DOM children', async function() {
      this.weight = 3;
      const cmp = createComponentWithChildrenRerender();
      scratch.appendChild(cmp);

      const wc = cmp.shadowRoot.querySelector('ce-with-children');
      expect(wc.textContent.includes('1')).to.be.true;
      await Promise.resolve();
      expect(wc.textContent.includes('2')).to.be.true;
    });

    it('can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element', async function() {
      this.weight = 3;
      const cmp = createComponentWithDifferentViews();
      scratch.appendChild(cmp);

      expectHasChildren(cmp.shadowRoot.querySelector('ce-with-children'));

      const toggler = cmp.shadowRoot.querySelector('button');
      toggler.click();
      await Promise.resolve();

      const elm = cmp.shadowRoot.querySelector('#dummy');
      expect(elm).to.exist;
      expect(elm.textContent).to.eql('Dummy view');

      toggler.click();
      await Promise.resolve();
      expectHasChildren(cmp.shadowRoot.querySelector('ce-with-children'));
    });
  });

  describe('attributes and properties', function() {
    it('will pass boolean data as either an attribute or a property', function() {
      this.weight = 3;
      const cmp = createComponentWithProperties();
      scratch.appendChild(cmp);

      const wc = cmp.shadowRoot.querySelector('ce-with-properties');
      const data = wc.bool || wc.hasAttribute('bool');
      expect(data).to.be.true;
    });

    it('will pass numeric data as either an attribute or a property', function() {
      this.weight = 3;
      const cmp = createComponentWithProperties();
      scratch.appendChild(cmp);

      const wc = cmp.shadowRoot.querySelector('ce-with-properties');
      const data = wc.num || wc.getAttribute('num');
      expect(parseInt(data, 10)).to.eql(42);
    });

    it('will pass string data as either an attribute or a property', function() {
      this.weight = 3;
      const cmp = createComponentWithProperties();
      scratch.appendChild(cmp);

      const wc = cmp.shadowRoot.querySelector('ce-with-properties');
      const data = wc.str || wc.getAttribute('str');
      expect(data).to.eql('lwc');
    });

    it("will not overwrite unwriteable properties", function () {
      this.weight = 3;
      const cmp = createComponentWithoutProperties();
      scratch.appendChild(cmp);
      const wc = cmp.shadowRoot.querySelector('ce-without-properties');
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });
  });

  describe('events', function() {
    it('can imperatively listen to a DOM event dispatched by a Custom Element', async function() {
      this.weight = 3;
      const cmp = createComponentWithImperativeEvent();
      scratch.appendChild(cmp);

      const handled = cmp.shadowRoot.querySelector('.handled');
      expect(handled.textContent).to.eql('false');

      cmp.shadowRoot.querySelector('ce-with-event').click();
      await Promise.resolve();
      expect(handled.textContent).to.eql('true');
    });
  });

});
