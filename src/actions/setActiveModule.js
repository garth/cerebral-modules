export default function (name) {

  return function setActiveModule(input, state) {
    if (state.get(['activeModule']) !== name) {
      state.set(['activeModule'], name);
    }
  };

}
