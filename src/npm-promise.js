/* eslint global-require: "off", import/no-dynamic-require: "off" */
const path = require('path');
const npm = require('npm');
const { exec } = require('child_process');
const { promisify } = require('util');

const npmConfig = {
  depth: 0,
  json: true,
  save: true,
  logLevel: 'warn',
};

function install(installPath, packageUrl) {
  return promisify(exec)(`cd ${installPath} && npm install ${packageUrl}`);
}

function requireNoCache(packagePath) {
  const exports = require(packagePath);
  const requirePath = path.join(packagePath, 'package.json');

  delete require.cache[require.resolve(requirePath)];

  return { exports, info: require(requirePath) };
}

function load(installPath) {
  return new Promise((resolve, reject) => {
    npm.load(npmConfig, (err, data) => {
      if (err) {
        return reject(err);
      }
      npm.localPrefix = installPath; // eslint-disable-line no-param-reassign
      return resolve(data);
    });
  });
}

function list() {
  return new Promise((resolve, reject) => {
    npm.commands.list([], true, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports = {
  install,
  requireNoCache,
  load,
  list,
};
