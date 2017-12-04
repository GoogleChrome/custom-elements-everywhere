/**
 * This is a modified version of the karma-structured-json-reporter created by Joe Shaw
 * https://github.com/tanenbaum/karma-structured-json-reporter
 * 
 * This fork restyles the output generated by karma-structured-json-reporter.
 */

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

var path = require('path');
var fs = require('fs');

function writeOutput(config, output, helper, logger) {

  var log = logger.create('karma-structured-json-reporter');

  // Add in library name and version
  let pkg = require(path.join(process.cwd(), './package.json'));
  let libraryVersion = pkg.dependencies[process.env.LIBRARY_NAME];
  output.library = {
    name: process.env.LIBRARY_NAME,
    version: libraryVersion
  };

  if (config.outputFile) {
    helper.mkdirIfNotExists(path.dirname(config.outputFile), function() {
      if (config.isSynchronous) {
        log.debug('Writing test results to JSON file ' + config.outputFile);
        try {
          fs.writeFileSync(config.outputFile, JSON.stringify(output, null, 4));
        } catch (err) {
          log.warn('Cannot write test results to JSON file\n\t' + err.message);
        }
      } else {
        fs.writeFile(config.outputFile, JSON.stringify(output, null, 4), function(err) {
          if (err) {
            log.warn('Cannot write test results to JSON file\n\t' + err.message);
          } else {
            log.debug('Test results were written to JSON file ' + config.outputFile);
          }
        });
      }
    });
  } else {
    process.stdout.write(JSON.stringify(output));
  }
}

var JsonResultReporter = function(baseReporterDecorator, formatError, config, helper, logger) {

  var self = this;

  baseReporterDecorator(self);

  var logMessageFormater = function(error) {
    return formatError(error)
  };

  function getBrowser(browser) {
    var b = self.browsers[browser.id];

    if (b) {
      return b;
    }

    var newRecord = {
      browser: browser,
      errors: [],
      results: []
    };

    self.browsers[browser.id] = newRecord;

    return newRecord;
  }

  self.clear = function() {
    self.browsers = {};
  };

  self.onBrowserError = function(browser, error) {
    getBrowser(browser).errors.push(error);
  };

  self.onSpecComplete = function(browser, result) {
    // convert newlines into array and flatten
    result.log = [].concat.apply([], result.log.map(function(message) {
      return message.split('\n');
    }));
    getBrowser(browser).results.push(result);
  };

  self.onRunComplete = function(browsers, summary) {
    var browserResults = [];

    for (var browserId in self.browsers) {
      var browser = self.browsers[browserId];
      browser.errors = browser.errors.map(logMessageFormater);
      browserResults.push(browser);
    }

    var output = {
      summary: summary,
      browsers: browserResults
    };

    output = addendumOutput(output);

    writeOutput(config, output, helper, logger);

    self.clear();
  };

  self.clear();
};

// Cram extra stuff onto the output object to summarize and score the results
function addendumOutput(output) {
  var newOutput = Object.assign({}, output);
  newOutput.summary.score = scoreResults(output);
  newOutput.summary.basicSupport = sumResults('basic support', output);
  newOutput.summary.advancedSupport = sumResults('advanced support', output);
  return newOutput;
}

function scoreResults(results) {
  // sumTests = (score x weight) + (score x weight) + ...
  // sumWeights = weight + weight ...
  // sumTests / sumWeights
  var tests = [];
  results.browsers.forEach(browser => {
    tests = tests.concat(browser.results);
  });

  var sumTests = 0;
  var sumWeights = 0;
  tests.forEach(test => {
    var score = test.success ? 100 : 0;
    var weight = test.weight;
    if (typeof weight === 'undefined') {
      throw new Error(`Missing weight! Test: ${test.description}`);
    }
    sumTests = sumTests + (score * weight);
    sumWeights = sumWeights + weight;
  });
  return Math.round(sumTests / sumWeights);
}

function sumResults(type, results) {
  var sum = {
    total: 0,
    failed: 0,
    passed: 0
  };
  results.browsers.forEach(browser => {
    var tests = browser.results.filter(result => result.suite.includes(type));
    sum.total = sum.total + tests.length;
    sum.failed = sum.failed + tests.filter(test => test.success === false).length;
    sum.passed = sum.passed + tests.filter(test => test.success === true).length;
  });
  return sum;
}

JsonResultReporter.$inject = ['baseReporterDecorator', 'formatError', 'config.jsonResultReporter', 'helper', 'logger'];

module.exports = {
  'reporter:custom-json': ['type', JsonResultReporter]
};
