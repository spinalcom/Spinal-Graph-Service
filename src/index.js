import SpinalGraphServiceClass from "./GraphManagerService";

export {
  SPINAL_RELATION_TYPE,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalContext,
  SpinalNode,
  SpinalGraph
}
  from 'spinal-model-graph';
const G_root = typeof window == "undefined" ? global : window;

if (typeof G_root.spinal === "undefined") G_root.spinal = {};
if (typeof G_root.spinal.spinalGraphService === "undefined") {
  if (typeof G_root.spinal.spinalSystem !== "undefined") {
    G_root.spinal.spinalGraphService = new SpinalGraphServiceClass(1);
  } else {
    G_root.spinal.spinalGraphService = new SpinalGraphServiceClass();
  }
}


const SpinalGraphService = G_root.spinal.spinalGraphService;
export {
  SpinalGraphService
};
