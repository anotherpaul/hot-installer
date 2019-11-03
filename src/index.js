const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const npm = require('./npm-promise');

const templateData = require('./template.json');

async function createHotInstaller({ installPath }) {
  const targetPath = path.join(installPath, 'package.json');
  try {
    await promisify(fs.access)(targetPath, fs.constants.F_OK);
  } catch (err) {
    await promisify(fs.writeFile)(targetPath, JSON.stringify(templateData));
  }

  function load(packageName) {
    const packagePath = path.join(installPath, 'node_modules', packageName);
    const { info, exports } = npm.requireNoCache(packagePath);
    return {
      name: packageName,
      version: info.version,
      path: packagePath,
      packageUrl: info._from, // eslint-disable-line no-underscore-dangle
      exports,
    };
  }

  async function install(packageUrl) {
    try {
      await npm.install(installPath, packageUrl);
    } catch (err) {
      throw Error(`error installing package from ${packageUrl}, ${err}`);
    }
  }

  async function init() {
    await npm.load(installPath);
    const { dependencies } = await npm.list();
    return Object.entries(dependencies).map(([id]) => load(id));
  }

  return {
    install,
    init,
    load,
  };
}

module.exports = createHotInstaller;
