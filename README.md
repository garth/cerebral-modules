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
  init(controller, moduleName, modules) {
    // initialise the module here
    // register some signals with controller(moduleName + '.somethingHapenned, [])
    // extend controller with services, register event listeners, etc
    // modules attribute is intended for app level modules that configure a modules
    return { // all parts are optional
      state: {}, // piece of scoped initial state. would be placed to ['modules', moduleName]
      init: [], // init chain will be executed on app start
      extend: {
        // anything placed here will extend module's properties
      }
    };
  },
  detach: function (controller, moduleName, modules) {} // cleanup
  // you can add any app specific fields here (not recommended for external modules)
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
import course from './modules/course';
import notFound from './modules/notFound';
import moduleSwitcher from './modules/moduleSwitcher';
import router from './modules/router';
import app from './modules/app';

let modules = {
  external,
  configurable: configurable('dbName'),
  home,
  course,
  notFound,
  moduleSwitcher,
  app,
  router
}

import setupModules from 'cerebral-modules';
setupModules(controller, modules);

ReactDOM.render(<Container controller={controller} app={modules.app.Component}/>, root);

```

## Contribute

Fork repo

* `npm install`
* `npm run dev` runs dev mode which watches for changes and auto lints, tests and builds
* `npm test` runs the tests
* `npm run lint` lints the code
* `npm run build` compiles es6 to es5
