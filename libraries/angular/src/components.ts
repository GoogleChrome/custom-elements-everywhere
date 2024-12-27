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
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-with-event';
import 'ce-without-properties';

@Component({
  template: `
    <div>
      <ce-without-children id="wc"></ce-without-children>
    </div>
  `
})
export class ComponentWithoutChildren {
}

@Component({
  template: `
    <div>
      <ce-with-children id="wc"></ce-with-children>
    </div>
  `
})
export class ComponentWithChildren {
}

@Component({
  template: `
    <div>
      <ce-with-children id="wc">{{count}}</ce-with-children>
    </div>
  `
})
export class ComponentWithChildrenRerender implements OnInit, OnDestroy {
  count = 1;
  interval = undefined;
  ngOnInit() {
    this.interval = setInterval(() =>
      this.count += 1, 1000);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

@Component({
  template: `
    <ce-with-children id="wc" *ngIf="showWC; else elseBlock"></ce-with-children>
    <ng-template #elseBlock><div id="dummy">Dummy view</div></ng-template>
  `
})
export class ComponentWithDifferentViews {
  showWC = true;
  toggle() {
    this.showWC = !this.showWC;
  }
}

@Component({
  template: `
    <div>
      <ce-with-properties id="wc"
        [bool]="data.bool"
        [num]="data.num"
        [str]="data.str"
        [arr]="data.arr"
        [obj]="data.obj"
        [camelCaseObj]="data.camelCaseObj"
      ></ce-with-properties>
    </div>
  `
})
export class ComponentWithProperties {
  data = {
    bool: true,
    num: 42,
    str: 'Angular',
    arr: ['A', 'n', 'g', 'u', 'l', 'a', 'r'],
    obj: { org: 'angular', repo: 'angular' },
    camelCaseObj: { label: "passed" }
  }
}

@Component({
  template: `
    <div>
      <ce-without-properties amethod="method" agetter="getter" areadonly="readonly" id="wc"></ce-without-properties>
    </div>
  `
})
export class ComponentWithoutProperties {}

@Component({
  template: `
    <div>
      <ce-unregistered id="wc"
        [attr.bool]="data.bool"
        [attr.num]="data.num"
        [attr.str]="data.str"
        [arr]="data.arr"
        [obj]="data.obj"
      ></ce-unregistered>
    </div>
  `
})
export class ComponentWithUnregistered {
  data = {
    bool: true,
    num: 42,
    str: 'Angular',
    arr: ['A', 'n', 'g', 'u', 'l', 'a', 'r'],
    obj: { org: 'angular', repo: 'angular' }
  }
}

@Component({
  template: `
    <div>
      <div id="handled">{{eventHandled}}</div>
      <ce-with-event #customEl id="wc"></ce-with-event>
    </div>
  `
})
export class ComponentWithImperativeEvent implements AfterViewInit {
  @ViewChild('customEl') customEl: ElementRef;
  eventHandled = false;
  ngAfterViewInit() {
    this.handleTestEvent = this.handleTestEvent.bind(this);
    this.customEl.nativeElement
      .addEventListener('camelEvent', this.handleTestEvent);
  }
  handleTestEvent() {
    this.eventHandled = true;
  }
}

@Component({
  template: `
    <div>
      <div id="lowercase">{{lowercaseHandled}}</div>
      <div id="kebab">{{kebabHandled}}</div>
      <div id="camel">{{camelHandled}}</div>
      <div id="caps">{{capsHandled}}</div>
      <div id="pascal">{{pascalHandled}}</div>
      <ce-with-event id="wc"
        (lowercaseevent)="handleLowercaseEvent()"
        (kebab-event)="handleKebabEvent()"
        (camelEvent)="handleCamelEvent()"
        (CAPSevent)="handleCapsEvent()"
        (PascalEvent)="handlePascalEvent()"
      ></ce-with-event>
    </div>
  `
})
export class ComponentWithDeclarativeEvent {
  lowercaseHandled = false;
  kebabHandled = false;
  camelHandled = false;
  capsHandled = false;
  pascalHandled = false;
  handleLowercaseEvent() {
    this.lowercaseHandled = true;
  }
  handleKebabEvent() {
    this.kebabHandled = true;
  }
  handleCamelEvent() {
    this.camelHandled = true;
  }
  handleCapsEvent() {
    this.capsHandled = true;
  }
  handlePascalEvent() {
    this.pascalHandled = true;
  }
}
