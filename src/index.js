const _modules = {};

function setActiveModuleAction(name) {
  return function setActiveModule(input, state) {
    if (state.get(['activeModule']) !== name) {
      state.set(['activeModule'], name);
    }
  };
}

export default function load(controller, modules) {
  const appChains = {};

  if (!Array.isArray(modules) || !modules.length) {
    console.error('No modules loaded');
  } else {
    const initChain = [];

    modules.forEach(mod => {
      if (!mod.name) {
        console.error('Cannot load unnamed module', mod);
      } else if (_modules[mod.name]) {
        console.error('Module name clash', _modules[mod.name], mod);
      } else {

        // load the module
        _modules[mod.name] = mod;
        const chains = typeof mod.init === 'function' ? mod.init(controller) || {} : {};

        // add the module init chain to the modules init chain
        if (Array.isArray(chains.init)) {
          initChain.push(...chains.init);
        }

        // add the module's external chains
        if (mod.isService) {
          appChains[mod.name] = chains;
        } else {
          appChains[mod.name] = {};
          // all non-service modules need an opened chain
          if (!Array.isArray(chains.opened)) {
            chains.opened = [];
          }
          // non-service modules should be set as active when external chains are run
          Object.keys(chains).forEach(chain =>
            appChains[mod.name][chain] = [setActiveModuleAction(mod.name), ...chains[chain]]
          );
        }
      }
    });

    // if one or more modules had an init chain, execute the module.init signal
    if (initChain.length) {
      controller.signal('modules.init', initChain);
      controller.signals.modules.init();
    }
  }

  return appChains;
}

export function _getModules() {
  return _modules;
}
