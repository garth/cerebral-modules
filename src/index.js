const modulesPath = ['modules'];

function setInitialState (initialState) {
  return function setInitialStateAction (input, state) {
    state.set(modulesPath, initialState);
  };
}

export default function load (controller, modules = {}) {
  let initialState = {};
  let initChain = [];

  Object.keys(modules).forEach(moduleName => {
    let module = modules[moduleName];

    // init the module passing controller and registered module name
    const {
      init,
      state,
      extend
    } = typeof module.init === 'function' ? module.init(controller, moduleName, modules) || {} : {};

    // add the module init chain to the modules init chain
    if (Array.isArray(init)) {
      initChain.push(...init);
    }

    if (state) {
      initialState[moduleName] = state;
    }

    if (extend) {
      modules[moduleName] = { ...module, ...extend };
    }
  });

  // if one or more modules had an init chain, execute the module.init signal
  if (initChain.length || Object.keys(initialState).length) {
    controller.signal('modules.init', [setInitialState(initialState), ...initChain]);
    controller.signals.modules.init();
  }

  return modules;
}
