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

const hbs = require("handlebars");
const path = require("path");
const fs = require("fs");
const marked = require("marked");
const libraryMap = {
  angular: "Angular",
  angularjs: "AngularJS (1.x)",
  dio: "DIO",
  dojo: "Dojo",
  hybrids: "hybrids",
  hyperapp: "Hyperapp",
  hyperhtml: "hyperHTML",
  lit: "Lit",
  lwc: "LWC",
  mithril: "Mithril",
  omi: "Omi",
  polymer: "Polymer",
  preact: "Preact",
  react: "React",
  riot: "Riot.js",
  skate: "Skate w/ Preact",
  solid: "Solid",
  stencil: "Stencil",
  surplus: "Surplus",
  svelte: "Svelte",
  vue: "Vue"
};

// When renaming a library, keep an alias so that old URLs still work.
const aliasMap = {
  'lit': ['litelement'],
};
const libraries = Object.keys(libraryMap);

hbs.registerPartial(
  "octocat",
  fs.readFileSync(path.join(__dirname, "..", "partials", "octocat.handlebars"), "utf8")
);

// Helper to color progress bar based on test scores
// https://bulma.io/documentation/elements/progress/#colors
hbs.registerHelper("warning-level", function (score) {
  if (score > 75) {
    return "is-primary";
  } else if (score > 50) {
    return "is-warning";
  } else {
    return "is-danger";
  }
});

const tmpl = fs.readFileSync(path.join(__dirname, "..","index.handlebars"), "utf8");
const render = hbs.compile(tmpl);
const out = render({ libraries: buildContext(libraries) });

function buildContext(libraries) {
  return libraries.map(library => {
    const repo = require(path.resolve(
      __dirname,
      "..",
      "libraries",
      library,
      "results/repo.json"
    ));

    return {
      name: library,
      fullName: libraryMap[library],
      repo,
      results: getTestResults(library),
      issues: getIssues(library),
      summary: getSummary(library),
      aliases: aliasMap[library] || [],
    };
  }).sort((a, b) => {
    return b.repo.stargazers_count - a.repo.stargazers_count
  });
}

// Collect important test data like number of successes, fails, totals, etc.
function getTestResults(library) {
  const json = require(path.resolve(
    __dirname,
    "..",
    "libraries",
    library,
    "results/results.json"
  ));
  const libraryVersion = json.library.version;
  const summary = json.summary;

  return { libraryVersion, summary };
}

// Collect any relevant GitHub issues
function getIssues(library) {
  return require(path.resolve(
    __dirname,
    "..",
    "libraries",
    library,
    "meta/issues.json"
  ));
}

// Collect markdown summary of library, process markdown, and return as string.
function getSummary(library) {
  const md = fs.readFileSync(
    path.resolve(__dirname, "..", "libraries", library, "meta/summary.md"),
    "utf8"
  );
  const content = marked.parse(md);

  return { content };
}

fs.mkdirSync(path.resolve(__dirname, '../../out'), {recursive: true});
fs.writeFileSync(path.resolve(__dirname, '../../out/index.html'), out);
