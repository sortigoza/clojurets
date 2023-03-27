import { logger } from '../logger';
import { Namespace } from '../namespace';
import { maps } from './core.collections.hash_maps';
import { collections } from './core.collections.lists';
import * as functions from './core.functions';
import * as coreIO from './core.io';
import * as macros from './core.macros';
import { misc } from './core.misc';
import { namespace } from './core.namespace';
import { arithmetic } from './core.primitives.numbers.arithmetic';
import { numbers_test } from './core.primitives.numbers.checks';
import * as sequences from './core.sequences';

const core_namespace_name = 'clojure.core';
const core = new Namespace(core_namespace_name);

// Based on http://clojure.org/cheatsheet
use(collections);
use(arithmetic);
use(numbers_test);
use(functions);
use(sequences);
use(misc);
use(macros);
use(coreIO);
use(namespace);
use(maps);

function use(vars) {
  for (const name in vars) {
    core.set(name, vars[name]);
  }
}

export { core };
