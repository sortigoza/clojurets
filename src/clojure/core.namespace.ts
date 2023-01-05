import { Namespace } from '../namespace';

function ns(name) {
  Namespace.set(name.value);
}

ns.macro = true;

const namespace = {
  ns,
};
export { namespace };
