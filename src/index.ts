/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { GraphManagerService as GraphManagerServiceClass } from './GraphManagerService';
export { SpinalSet, SpinalNodePointer, SpinalMap } from 'spinal-model-graph';
export * from './GraphManagerService';
export * from './interfaces/InfoModel';
export * from './interfaces/SpinalNodeFindPredicateFunc';
export * from './interfaces/SpinalNodeObject';
export * from './interfaces/SpinalNodeRef';

export {
  SPINAL_RELATION_TYPE,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalContext,
  SpinalNode,
  SpinalGraph,
} from 'spinal-model-graph';

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
export { SpinalGraphService };
