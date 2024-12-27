import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "ce-without-properties";

class ComponentWithoutProperties extends PolymerElement {
  static get is() {
    return "component-without-properties";
  }
  static get properties() {
    return {
      method: {
        type: String,
        value: 'method'
      },
      getter: {
        type: String,
        value: 'getter'
      },
      readonly: {
        type: String,
        value: 'readonly'
      },
    };
  }
  static get template() {
    return html`
      <div>
        <ce-without-properties id="wc"
          amethod="[[method]]"
          agetter="[[getter]]"
          readonly="[[readonly]]"
        ></ce-without-properties>
      </div>
    `;
  }
}
window.customElements.define(
  ComponentWithoutProperties.is,
  ComponentWithoutProperties
);
