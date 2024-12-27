import fs from 'fs-extra';
import { join } from "path";
import * as chai from "chai";
import fetch from "node-fetch";
import {opts, libraries} from './common.mjs';

/**
 * wireit has ensured that all of the libraries results have been built.
 * This command copies those results into the docs folder, and verifies that
 * they match our expected results. We also fetch metadata about each library,
 * like how many stars it has on github.
 */
async function copyAndVerifyLibraryResults() {
  const verb = opts['update-goldens'] ? "Updating test goldens" : "Testing";
  console.log(`\n### ${verb}\n`);
  await Promise.all(libraries.map(async (library) => {
    await verifyResults(library);
    await fetchMetadata(library);
    await copyDocs(library);
  }));
}

async function fetchMetadata(library) {
  const repoMeta = (await (await fetch(`https://api.github.com/repos/${library.packageJson.library_repo}`)).json());
  const stargazers_count = repoMeta.stargazers_count;
  const html_url = repoMeta.html_url;
  const repoJson = JSON.stringify({ stargazers_count, html_url });
  fs.writeFileSync(join(library.resultsPath, "repo.json"), repoJson);
}

/**
 * Verify the tests generated results and all other required files are present
 * before copying things over to the docs site.
 * @param {*} library
 */
async function verifyResults(library) {
  const { metaPath, resultsPath } = library;
  // Verify files, throw otherwise
  if (!fs.existsSync(join(metaPath, `issues.json`)))
    throw new Error(`Missing issues.json in ${library.name}`);
  if (!fs.existsSync(join(metaPath, `summary.md`)))
    throw new Error(`Missing summary.md in ${library.name}`);
  if (!fs.existsSync(join(resultsPath, `results.json`)))
    throw new Error(`Missing results.json in ${library.name}`);
  if (!fs.existsSync(join(resultsPath, `results.html`)))
    throw new Error(`missing results.html in ${library.name}`);
  compareResultsAgainstGoldens(library);
}

function compareResultsAgainstGoldens(library) {
  let actual;
  try {
    actual = JSON.parse(fs.readFileSync(join(library.resultsPath, "results.json"))).summary;
  } catch (err) {
    throw new Error(`Could not read results.json for ${library.name}: ${err}`);
  }
  const goldensLocation = join(library.metaPath, "expectedResults.json");
  if (opts['update-goldens']) {
    fs.writeFileSync(goldensLocation, JSON.stringify(actual, null, 2));
    return;
  }
  let expected;
  try {
    expected = JSON.parse(fs.readFileSync(join(library.metaPath, "expectedResults.json")));
  } catch (err) {
    throw new Error(`Could not read expectedResults.json for ${library.name}:\n    ${err}`);
  }
  // A constant, to make sure that if we add/remove any tests, that we add that test to all
  // tested libraries.
  const numberOfTests = 34;
  chai.assert.equal(actual.success + actual.failed, numberOfTests, `${library.name} has incorrect total tests`);
  chai.assert.deepEqual(actual, expected, `${library.name} has incorrect deep results equal`);
}


/**
 * Copy the new test results to the docs site.
 * @param {*} library
 */
async function copyDocs(library) {
  const { metaPath, resultsPath, docsPath } = library;
  fs.copySync(metaPath, join(docsPath, "meta"));
  fs.copySync(resultsPath, join(docsPath, "results"));
}


copyAndVerifyLibraryResults()
