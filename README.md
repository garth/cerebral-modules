# cerebral-react-modules

Create cerebral modules that can be reused, shared, imported or just simply keep your app tidy.

## Creating a module

A module needs to export the following:

```js
export default {
  name: 'uniqueModuleName',
  init(controller) {
    // register signals and do other module setup
  },
  routes(controller) {
    // return a cerebral-router route object that defines the routes for this module
  },
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
import home from './modules/home';
import notFound from './modules/notFound';

// init the modules (this will also render the app)
import loadModules from 'cerebral-react-modules/load';
loadModules(controller, [ external, home, notFound ]);
```

## Route Signals

In your module routing signals you need to specify which module should be rendered. This can be done using the `setActiveModule` action.

```js
import setActiveModule from 'cerebral-react-modules/setActiveModule';

controller.signal('home.routed', [
  setActiveModule('home')
]);
```

## Contribute

Fork repo

* `npm install`
* `npm run dev` runs dev mode which watches for changes and auto lints, tests and builds
* `npm test` runs the tests
* `npm run lint` lints the code
* `npm run build` compiles es6 to es5
