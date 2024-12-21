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

import "webcomponents/ce-without-children";
import "webcomponents/ce-with-children";
import "webcomponents/ce-with-properties";
import "webcomponents/ce-with-event";

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { modifier as customModifier } from 'ember-modifier';

const { String } = globalThis;

export const ComponentWithoutChildren = <template>
  <ce-without-children />
</template>;

export const ComponentWithChildren = <template>
  <ce-with-children />
</template>;

export class ComponentWithChildrenRerender extends Component {
  @tracked count = 1;

  deferredUpdate = () => {
    Promise.resolve().then(() => {
      this.count++;
    })
  };

  <template>
    {{ (this.deferredUpdate) }}
    <ce-with-children>{{ this.count }}</ce-with-children>
  </template>
}

export class ComponentWithDifferentViews extends Component {
  @tracked show = true;

  constructor() {
    super(...arguments);

    // Allow this component to be externally controlled
    this.args.setToggle(() => this.show = !this.show);
  }

  <template>
    {{#if this.show}}
      <ce-with-children id="wc" />
    {{else}}
      <div id="dummy">Dummy view</div>
    {{/if}}
  </template>
}


const data = {
    bool: true,
    num: 42,
    str: "Ember",
    arr: ["E", "m", "b", "e", "r"],
    obj: { org: "emberjs", repo: "ember.js" },
    camelCaseObj: { label: "passed" },
}

export const ComponentWithProperties =
  <template>
    <ce-with-properties
      id="wc"
      bool={{ data.bool }}
      num={{ data.num }}
      str={{ data.str }}
      arr={{ data.arr }}
      obj={{ data.obj }}
      camelCaseObj={{ data.camelCaseObj }}
    ></ce-with-properties>
  </template>
;

export const ComponentWithUnregistered = <template>
  <ce-unregistered
    bool={{ data.bool }}
    num={{ data.num }}
    str={{ data.str }}
    arr={{ data.arr }}
    obj={{ data.obj }}
  />
</template>;

export class ComponentWithImperativeEvent extends Component {
  @tracked eventHandled = false;

  addEventListenerTheLongWay = customModifier(element => {
    element.addEventListener('camelEvent', () => {
      this.eventHandled = true;
    });
  });

  <template>
    <div id="handled">{{ this.eventHandled }}</div>
    <ce-with-event id="wc" {{this.addEventListenerTheLongWay}}></ce-with-event>
  </template>
}

export class ComponentWithDeclarativeEvent extends Component {
  @tracked lowercaseHandled = false;
  @tracked kebabHandled = false;
  @tracked camelHandled = false;
  @tracked capsHandled = false;
  @tracked pascalHandled = false;

  handleLowercaseEvent = () => this.lowercaseHandled = true;
  handleKebabEvent = () => this.kebabHandled = true;
  handleCamelEvent = () => this.camelHandled = true;
  handleCapsEvent = () => this.capsHandled = true;
  handlePascalEvent = () => this.pascalHandled = true;

  <template>
    <div id="lowercase">{{ this.lowercaseHandled }}</div>
    <div id="kebab">{{ this.kebabHandled }}</div>
    <div id="camel">{{ this.camelHandled }}</div>
    <div id="caps">{{ this.capsHandled }}</div>
    <div id="pascal">{{ this.pascalHandled }}</div>
    <ce-with-event
      id="wc"
      {{on 'lowercaseevent' this.handleLowercaseEvent}}
      {{on 'kebab-event' this.handleKebabEvent}}
      {{on 'camelEvent' this.handleCamelEvent}}
      {{on 'CAPSevent' this.handleCapsEvent}}
      {{on 'PascalEvent' this.handlePascalEvent}}
    />
  </template>
}
