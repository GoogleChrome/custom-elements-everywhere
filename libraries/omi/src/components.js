import { define, h } from 'omi'
import 'ce-without-children'
import 'ce-with-children'
import 'ce-with-properties'
import 'ce-with-event'
import 'ce-without-properties'

define('component-without-children', _ => (
  <div>
    <ce-without-children id="wc"></ce-without-children>
  </div>
))

define('component-with-children', _ => (
  <div>
    <ce-with-children id="wc"></ce-with-children>
  </div>
))

define('component-with-children-rerender', _ => (
  <div>
    <ce-with-children id="wc">{_.count}</ce-with-children>
  </div>
), {
    install() {
      this.count = 1
    },
    installed() {
      Promise.resolve().then(_ => {
        this.count++
        this.update()
      });
    },
    uninstall() {
      clearInterval(this.interval);
    }
  })

define('component-with-different-views', _ => (
  <div>
    {_.showWC ? (
      <ce-with-children id="wc"></ce-with-children>
    ) : (
        <div id="dummy">Dummy view</div>
      )}
  </div>
), {
    install() {
      this.showWC = true
      this.toggle = () => {
        this.showWC = !this.showWC
        this.update()
      }
    }
  })

define('component-with-properties', _ => {

  const data = {
    bool: true,
    num: 42,
    str: 'Omi',
    arr: ['O', 'm', 'i'],
    obj: { org: 'tencent', repo: 'omi' },
    camelCaseObj: { label: "passed" }
  };
  return (
    <div>
      <ce-with-properties id="wc"
        bool={data.bool}
        num={data.num}
        str={data.str}
        arr={data.arr}
        obj={data.obj}
        camelCaseObj={data.camelCaseObj}
      ></ce-with-properties>
    </div>
  );

})

define('component-without-properties', _ => {
  const data = {
    method: 'method',
    getter: 'getter',
    readonly: 'readonly'
  }
  return (
    <div>
      <ce-without-properties id="wc"
        amethod={data.method}
        agetter={data.getter}
        areadonly={data.readonly}
      ></ce-without-properties>
    </div>
  )
})




define('component-with-unregistered', _ => {

  const data = {
    bool: true,
    num: 42,
    str: 'Omi',
    arr: ['O', 'm', 'i'],
    obj: { org: 'tencent', repo: 'Omi' }
  };
  return (
    <div>
      {/* This element doesn't actually exist.
      It's used to test unupgraded behavior. */}
      <ce-unregistered id="wc"
        bool={data.bool}
        num={data.num}
        str={data.str}
        arr={data.arr}
        obj={data.obj}
      ></ce-unregistered>
    </div>
  );

})



define('component-with-imperative-event', _ => (
  <div>
    <div id="handled">{_.eventHandled.toString()}</div>
    <ce-with-event id="wc" ref={(el) => _.customEl = el}></ce-with-event>
  </div>
), {
    install() {

      this.eventHandled = false
      this.handleTestEvent = () => {
        this.eventHandled = true
        this.update()
      }
    },
    installed() {
      this.customEl.addEventListener('camelEvent', this.handleTestEvent);
    }
  })




define('component-with-declarative-event', _ => (
  <div>
    <div id="lowercase">{_.data.lowercaseHandled.toString()}</div>
    <div id="kebab">{_.data.kebabHandled.toString()}</div>
    <div id="camel">{_.data.camelHandled.toString()}</div>
    <div id="caps">{_.data.capsHandled.toString()}</div>
    <div id="pascal">{_.data.pascalHandled.toString()}</div>
    <ce-with-event id="wc"
      onlowercaseevent={_.handleLowercaseEvent}
      onkebab-event={_.handleKebabEvent}
      oncamelEvent={_.handleCamelEvent}
      onCAPSevent={_.handleCapsEvent}
      onPascalEvent={_.handlePascalEvent}
    ></ce-with-event>
  </div>
), {
    install() {

      this.data = {
        lowercaseHandled: false,
        kebabHandled: false,
        camelHandled: false,
        capsHandled: false,
        pascalHandled: false
      };
      this.handleLowercaseEvent = () => {
        this.data.lowercaseHandled = true
      }
      this.handleKebabEvent = () => {
        this.data.kebabHandled = true
      }
      this.handleCamelEvent = () => {
        this.data.camelHandled = true
      }
      this.handleCapsEvent = () => {
        this.data.capsHandled = true
      }
      this.handlePascalEvent = () => {
        this.data.pascalHandled = true
      }
    }
  })
