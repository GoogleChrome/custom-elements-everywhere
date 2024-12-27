import "ce-without-children";
import "ce-with-children";
import "ce-with-properties";
import "ce-without-properties";
import "ce-with-event";
import { ComponentWithChildren } from "../dist/components/component-with-children.js";
import { ComponentWithChildrenRerender } from "../dist/components/component-with-children-rerender.js";
import { ComponentWithDeclarativeEvent } from "../dist/components/component-with-declarative-event.js";
import { ComponentWithDifferentViews } from "../dist/components/component-with-different-views.js";
import { ComponentWithImperativeEvent } from "../dist/components/component-with-imperative-event.js";
import { ComponentWithProperties } from "../dist/components/component-with-properties.js";
import { ComponentWithoutProperties } from "../dist/components/component-without-properties.js";
import { ComponentWithoutChildren } from "../dist/components/component-without-children.js";

customElements.define("component-without-children", ComponentWithoutChildren);
customElements.define("component-with-children", ComponentWithChildren);
customElements.define(
  "component-with-children-rerender",
  ComponentWithChildrenRerender
);
customElements.define(
  "component-with-different-views",
  ComponentWithDifferentViews
);
customElements.define(
  "component-with-imperative-event",
  ComponentWithImperativeEvent
);
customElements.define(
  "component-with-declarative-event",
  ComponentWithDeclarativeEvent
);
customElements.define("component-with-properties", ComponentWithProperties);
customElements.define('component-without-properties', ComponentWithoutProperties);
