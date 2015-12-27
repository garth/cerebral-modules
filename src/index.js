const modulesPath = ['modules'];
const activeModulePath = ['modules', 'activeModule'];

function setActiveModule (name) {
  return function setActiveModuleAction(input, state) {
    if (state.get(activeModulePath) !== name) {
      state.set(activeModulePath, name);
    }
  };
}

function setInitialState (initialState) {
  return function setInitialStateAction (input, state) {
    state.set(modulesPath, initialState);
  };
}

export default function load(controller, modules = {}) {
  let chains = {};
  let initialState = {};
  let initChain = [];

  Object.keys('modules').forEach(moduleName => {
    const module = modules[moduleName];

    // init the module passing controller and registered module name
    const {
      chains,
      state,
      Component
    } = typeof module.init === 'function' ? module.init(controller, moduleName) || {} : {};

    if (typeof state === 'object') {
      initialState[moduleName] = state;
    }

    if (Component) {
      module.Component = Component;
    }

    // add the module init chain to the modules init chain
    if (Array.isArray(chains.init)) {
      initChain.push(...chains.init);
    }

    // add the module's external chains
    if (module.isService) {
      chains[moduleName] = chains;
    } else {
      chains[moduleName] = {};
      // all non-service modules need an opened chain
      if (!Array.isArray(chains.opened)) {
        chains.opened = [];
      }
      // non-service modules should be set as active when external chains are run
      Object.keys(chains).forEach(chain =>
        chains[moduleName][chain] = setActiveModule(moduleName, chain).concat(chains[chain])
      );
    }
  });

  // if one or more modules had an init chain, execute the module.init signal
  if (initChain.length) {
    controller.signal('modules.init', [setInitialState(initialState), ...initChain]);
    controller.signals.modules.init();
  }

  return chains;
}
