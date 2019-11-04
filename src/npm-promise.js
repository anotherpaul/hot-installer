/* eslint global-require: "off", import/no-dynamic-require: "off" */
const path = require('path');
const npm = require('npm');

const npmConfig = {
  depth: 0,
  json: true,
  save: true,
  logLevel: 'warn',
};

function install(installPath, packageUrl) {
  return new Promise((resolve, reject) => {
    npm.commands.install(installPath, packageUrl, err => (err ? reject(err) : resolve()));
  });
}

function getPackageInfo(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  delete require.cache[require.resolve(packageJsonPath)];
  return require(packageJsonPath);
}

function requireNoCache(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');

  delete require.cache[require.resolve(packagePath)];
  delete require.cache[require.resolve(packageJsonPath)];

  const exports = require(packagePath);
  const info = require(packageJsonPath);

  return { exports, info };
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
  getPackageInfo,
  load,
  list,
};
