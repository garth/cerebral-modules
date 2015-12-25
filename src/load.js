import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'cerebral-react';
import Router from 'cerebral-router';
import ModuleSwitch from './moduleSwitch.js';

const components = {};

export default function load(controller, modules, routerOptions = {}) {

  modules.forEach(item => {

    // init the module (register signals, etc...)
    item.init(controller);

    // register the component
    components[item.name] = item.Component;

  });

  // register the module routes
  Router(
    controller,
    modules.reduce((routes, item) => Object.assign(routes, item.routes(controller)), {}),
    routerOptions);

  // start the app
  const container = document.body.appendChild(document.createElement('div'));
  ReactDOM.render(<Container controller={controller} app={ModuleSwitch}/>, container);

}

export function _components() {
  return components;
}
