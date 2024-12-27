import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "component-without-properties",
  shadow: true
})
export class ComponentWithoutProperties {

  render() {
    const data = {
      getter: 'getter',
      method: 'method',
      readonly: 'readonly'
    }
    return (
      <Host>
        <ce-without-properties
          id="wc"
          amethod={data.method}
          agetter={data.getter}
          areadonly={data.readonly}
        ></ce-without-properties>
      </Host>
    );
  }
}
