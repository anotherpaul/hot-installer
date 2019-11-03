# HOTLOADER

Install and load npm-packages during runtime from your code.

## Installation

```
npm i hotloader
```

## Usage

```
const createHotloader = require('hotloader');
const hotloader = createHotloader({ installPath: '/packages' });

(async () => {
  const installedPackages = await hotloader.init();
  await hotloader.install('http://myserver.net/mypackage-0.0.1.tar');
  const myPackage = await hotloader.load('mypackage');
  myPackage.exports.myMethod('yeah!');
})();

```

## API

### constructor

```
const createHotloader = require('hotloader');
const hotloader = createHotloader({ installPath });
```

Creates an instance of the hotloader with the specified path in the file system.

### hotloader.init

```
const installedPackages = await hotloader.init();
```

Creates empty package.json file in the provided installPath if necessary. Loads all previously installed packages and returns their information as an array of objects (see hotloader.load).

### hotloader.install

```
await hotloader.install(packageUrl);
```

Installs a tarball from given url;

### hotloader.load

```
const packageInfo = await hotloader.load(packageName);
```

Loads a package into memory deleting require cache beforehand.
Returns an object with package exports and information from package.json:

```
{
  name: 'myPackage',
  version: '0.0.1',
  path: '/packages/node_modules/mypackage',
  packageUrl: 'http://myserver.net/mypackage-0.0.1.tar',
  exports, // actual contents of the package
}
```
