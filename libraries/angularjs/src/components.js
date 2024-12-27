import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-with-event';

const ComponentWithoutChildren = {
  template: `
    <div>
      <ce-without-children id="wc"></ce-without-children>
    </div>
    `
};

const ComponentWithChildren = {
  template: `
    <div>
      <ce-with-children id="wc"></ce-with-children>
    </div>
  `
};

const ComponentWithChildrenRerender = {
  template: `
    <div>
      <ce-with-children id="wc">{{$ctrl.count}}</ce-with-children>
    </div>
    `,
  controller: class {
    constructor($interval) {
      angular.extend(this, { $interval });
    }
    $onInit() {
      this.count = 1;
      this.interval = this.$interval(() => {
        this.count++;
      }, 1000);
    }
    $onDestroy() {
      this.$interval.cancel(this.interval);
    }
  }
}

const ComponentWithDifferentViews = {
  template: `
    <div>
      <ce-with-children id="wc" ng-if="$ctrl.showWc"></ce-with-children>
      <div id="dummy" ng-if="!$ctrl.showWc">Dummy view</div>
    </div>
  `,
  bindings: {
    showWc: '<'
  }
}

const ComponentWithProps = {
  template: `
    <div>
      <ce-with-properties id="wc"
        ng-prop-bool="$ctrl.bool"
        ng-prop-num="$ctrl.num"
        ng-prop-str="$ctrl.str"
        ng-prop-arr="$ctrl.arr"
        ng-prop-obj="$ctrl.obj"
        ng-prop-camel-case-obj="$ctrl.camelCaseObj"
      ></ce-with-properties>
    </div>
  `,
  controller: class {
    constructor() {}
    $onInit() {
      angular.extend(this, {
        bool: true,
        num: 42,
        str: 'Angular',
        arr: ['A', 'n', 'g', 'u', 'l', 'a', 'r'],
        obj: { org: 'angular', repo: 'angular' },
        camelCaseObj: { label: "passed" }
      });
    }
  }
};

const ComponentWithoutProps = {
  template: `
    <div>
      <ce-without-properties id="wc"
        ng-attr-amethod="{{ $ctrl.method }}"
        ng-attr-agetter="{{ $ctrl.getter }}"
        ng-attr-areadonly="{{ $ctrl.readonly }}"
      ></ce-without-properties>
    </div>
  `,
  controller: class {
    constructor() {}
    $onInit() {
      angular.extend(this, {
        method: 'method',
        getter: 'getter',
        readonly: 'readonly'
      })
    }
  }
}

const ComponentWithImperativeEvent = {
  template: `
    <div>
      <div id="handled">{{$ctrl.eventHandled}}</div>
      <ce-with-event id="wc"></ce-with-event>
    </div>
  `,
  controller: class {
    constructor($element) {
      angular.extend(this, { $element });
    }
    $onInit() {
      this.eventHandled = false;
      this.handleTestEvent = this.handleTestEvent.bind(this);
      this.$element.find('ce-with-event')
        .on('camelEvent', this.handleTestEvent);
    }
    handleTestEvent() {
      this.eventHandled = true;
    }
  }
};

const ComponentWithDeclarativeEvent = {
  template: `
    <div>
      <div id="lowercase">{{$ctrl.lowercaseHandled}}</div>
      <div id="kebab">{{$ctrl.kebabHandled}}</div>
      <div id="camel">{{$ctrl.camelHandled}}</div>
      <div id="caps">{{$ctrl.capsHandled}}</div>
      <div id="pascal">{{$ctrl.pascalHandled}}</div>
      <ce-with-event id="wc"
        ng-on-lowercaseevent="$ctrl.handleLowercaseEvent()"
        ng-on-kebab-event="$ctrl.handleKebabEvent()"
        ng-on-camel_Event="$ctrl.handleCamelEvent()"
        ng-on-_C_A_P_Sevent="$ctrl.handleCapsEvent()"
        ng-on-_Pascal_Event="$ctrl.handlePascalEvent()"
      ></ce-with-event>
    </div>
  `,
  controller: class {
    constructor() {}
    $onInit() {
      this.lowercaseHandled = false;
      this.kebabHandled = false;
      this.camelHandled = false;
      this.capsHandled = false;
      this.pascalHandled = false;
    }
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
};

export {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProps,
  ComponentWithoutProps,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
}
