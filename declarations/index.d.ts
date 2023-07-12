import { GraphManagerService as GraphManagerServiceClass } from './GraphManagerService';
export { SpinalSet, SpinalNodePointer, SpinalMap } from 'spinal-model-graph';
export * from './GraphManagerService';
export * from './interfaces/InfoModel';
export * from './interfaces/SpinalNodeFindPredicateFunc';
export * from './interfaces/SpinalNodeObject';
export * from './interfaces/SpinalNodeRef';
export { SPINAL_RELATION_TYPE, SPINAL_RELATION_LST_PTR_TYPE, SPINAL_RELATION_PTR_LST_TYPE, SpinalContext, SpinalNode, SpinalGraph, } from 'spinal-model-graph';
declare const SpinalGraphService: GraphManagerServiceClass;
export { SpinalGraphService };
