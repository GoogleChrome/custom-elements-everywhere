// Runs npm ci in each of the libraries

import {libraries} from './common.mjs';
import * as util from 'util';
import {exec as baseExec} from 'child_process';
import * as pathlib from 'path';
import ora from 'ora';
import { fileURLToPath } from 'url';
const exec = util.promisify(baseExec);

const __dirname = pathlib.dirname(fileURLToPath(import.meta.url));
const join = pathlib.join;

// Runs npm ci in every one of our subpackages.
async function install() {
  const allLibs = [
    ...libraries,
    {name: join('__shared__', 'karma-plugins', 'karma-custom-html-reporter')},
    {name: join('__shared__', 'karma-plugins' , 'karma-custom-json-reporter')},
    {name: join('__shared__', 'karma-plugins', 'karma-mocha')},
    {name: join('__shared__', 'tests')},
    {name: join('__shared__', 'webcomponents')},
  ];
  const packages = allLibs.map((lib) => join(__dirname, '..', 'libraries', lib.name));
  packages.push(join(__dirname, '..', 'docs'));
  const progress = ora('Installing deps of subpackages').start();
  for (const pkg of packages) {
    progress.text = `Running \`npm ci\` in ${pkg}`;
    await exec("npm ci", { cwd: pkg });
  }
  progress.succeed("Installed deps of all subpackages");
}

install();
