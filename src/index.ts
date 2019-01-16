import { GraphManagerService as GraphManagerServiceClass } from './GraphManagerService';
export {
  SPINAL_RELATION_TYPE,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalContext,
  SpinalNode,
  SpinalGraph,
} from 'spinal-model-graph';

import SpinalSet from 'spinal-model-graph/build/SpinalSet';
import SpinalNodePointer from 'spinal-model-graph/build/SpinalNodePointer';
import SpinalMap from 'spinal-model-graph/build/SpinalMap';
export {
  SpinalSet,
  SpinalNodePointer,
  SpinalMap,
};

// little hack to include spinal in window / global
interface GRoot {
  [key: string]: any;
  spinal?: {
    [key: string]: any;
    spinalSystem?: any;
    spinalGraphService?: GraphManagerServiceClass;
  };
}
const G_ROOT: GRoot = typeof window === 'undefined' ? global : window;

if (typeof G_ROOT.spinal === 'undefined') G_ROOT.spinal = {};
if (typeof G_ROOT.spinal.spinalGraphService === 'undefined') {
  if (typeof G_ROOT.spinal.spinalSystem !== 'undefined') {
    G_ROOT.spinal.spinalGraphService = new GraphManagerServiceClass(1);
  } else {
    G_ROOT.spinal.spinalGraphService = new GraphManagerServiceClass();
  }
}

// tslint:disable-next-line:variable-name
const SpinalGraphService = G_ROOT.spinal.spinalGraphService;
export {
  SpinalGraphService,
};
