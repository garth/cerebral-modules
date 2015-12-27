import setActiveModule from './actions/setActiveModule';

export default function setupModules(controller, modules) {
  const appChains = {};

  if (!Array.isArray(modules) || !modules.length) {
    console.error('No modules loaded');
  } else {
    const initChain = [];

    modules.forEach(mod => {
      if (!mod.name) {
        console.error('Cannot load unnamed module', mod);
      } else {

        // load the module
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
            appChains[mod.name][chain] = [setActiveModule(mod.name), ...chains[chain]]
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
