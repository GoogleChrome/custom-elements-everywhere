import { LitElement, html } from "lit";
import "ce-without-properties";

class ComponentWithoutProperties extends LitElement {

  static get properties() {
    return {};
  }

  render() {
    return html`
      <div>
        <ce-without-properties
          id="wc"
          amethod="${"method"}"
          agetter="${"getter"}"
          areadonly="${"readonly"}"
        ></ce-without-properties>
      </div>
    `;
  }
}
customElements.define(
  "component-without-properties",
  ComponentWithoutProperties
);
