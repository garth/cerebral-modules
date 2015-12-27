# cerebral-modules

Create cerebral modules that can be reused, shared, imported or just simply keep your app tidy.

## Install

```
npm install cerebral-modules
```

## Creating a module

A module needs to export the following:

```js
export default {
  name: 'moduleName', // NOT NEEDED ANYMORE
  isService: false, //service modules do not affect the activeModule state
  init(controller, moduleName) {
    // initialise the module here

    // return signal chains, initial state and optional root Component if it requires init
    return {
      state: {},
      chains: {
        init: [] // init chain will be execute on app start
        // other chains that can be used to setup the routing for the app
      }
    };
  },
  // optional root component
  Component: ModuleIndexComponent
}
```

## Loading modules

From your main.js

```js
// import your cerebral controller
import controller from './controller';

// import you app modules
import external form 'external-node-module';
import configurable from 'external-configurable-module';
import home from './modules/home';
import notFound from './modules/notFound';

const modules = {
  external,
  configurable: configurable('dbName'),
  home,
  notFound
}

// init the modules
import setupModules from 'cerebral-modules';
const chains = setupModules(controller, modules);

// use the chains to setup your routing here
// chains.moduleName.chainName
```

## Contribute

Fork repo

* `npm install`
* `npm run dev` runs dev mode which watches for changes and auto lints, tests and builds
* `npm test` runs the tests
* `npm run lint` lints the code
* `npm run build` compiles es6 to es5
