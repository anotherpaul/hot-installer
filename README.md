# HOT INSTALLER

Install and load npm-packages during runtime from your code.

## Installation

```
npm i hot-installer
```

## Usage

```
const createHotInstaller = require('hot-installer');

(async () => {
  const hotInstaller = await createHotInstaller({ installPath: '/packages' });
  const installedPackages = await hotInstaller.init();
  await hotInstaller.install('http://myserver.net/mypackage-0.0.1.tar');
  const myPackage = await hotInstaller.load('mypackage');
  myPackage.exports.myMethod('yeah!');
})();

```

## API

### constructor

```
const createHotInstaller = require('hot-installer');
const hotInstaller = createHotInstaller({ installPath });
```

Creates an instance of the hotInstaller with the specified path in the file system.
Creates empty package.json file in the provided installPath if necessary.

### hotInstaller.init

```
const installedPackages = await hotInstaller.init();
```

Loads all previously installed packages and returns their information as an array of objects (see hotInstaller.load).

### hotInstaller.install

```
await hotInstaller.install(packageUrl);
await hotInstaller.install([firstPackageUrl, secondPackageUrl]);
```

Installs a tarball from given url or an array of urls;

### hotInstaller.load

```
const packageInfo = hotInstaller.load(packageName);
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

### hotInstaller.info

```
const packageInfo = hotInstaller.info(packageName);
```

Returns an object with package information from package.json without loading package in memory:

```
{
  name: 'myPackage',
  version: '0.0.1',
  path: '/packages/node_modules/mypackage',
  packageUrl: 'http://myserver.net/mypackage-0.0.1.tar'
}
```
