const _modules = {};

function setActiveModuleAction(name) {

  return function setActiveModule(input, state) {
    state.set(['activeModule'], name);
  };

}

export default function load(controller, modules) {

  const initChain = [];

  const allChains = modules.reduce((chains, item) => {

    _modules[item.name] = item;

    // add the module init chain to the modules init chain
    if (Array.isArray(item.chains.init)) {
      initChain.push(...item.chains.init);
    }

    // add the modules external chains
    if (item.isService) {
      chains[item.name] = item.chains;
    } else {
      Object.keys(item.chains).forEach(chain =>
        chains[item.name][chain] = [setActiveModuleAction(item.name), ...item.chains[chain]]
      );
    }

  }, {});

  // if one more modules had an init chain, execute the modules init chains
  if (initChain.length) {
    controller.signal('modules.init', initChain);
    controller.signals.modules.init();
  }

  return allChains;
}

export function _getModules() {
  return _modules;
}
