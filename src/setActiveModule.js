export default function (name) {

  return function setActiveModule(input, state) {
    state.set(['activeModule'], name);
  };

}
