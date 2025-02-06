import "qunit-theme-ember/qunit.css";

import Application from "ember-cee-app/app";
import config from "ember-cee-app/config/environment";
import * as QUnit from "qunit";
import { setApplication } from "@ember/test-helpers";
import { setup } from "qunit-dom";
import { start as qunitStart } from "ember-qunit";

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);

  qunitStart();
}
