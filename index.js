import SpinalGraphServiceClass from "./GraphManagerService";

export {
  SPINAL_RELATION_TYPE,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalContext,
  SpinalNode,
  SpinalGraph
} from 'spinal-model-graph';
const G_root = typeof window == "undefined" ? global : window;

if (typeof G_root.spinal === "undefined") G_root.spinal = {};
if (typeof G_root.spinal.spinalGraphService === "undefined") {
  G_root.spinal.spinalGraphService = new SpinalGraphServiceClass( 1 );
  G_root.spinal.spinalGraphOrganService = new SpinalGraphServiceClass();
}


const SpinalGraphService = G_root.spinal.spinalGraphService;
const SpinalGraphOrganService = G_root.spinal.spinalGraphOrganService;
export {
  SpinalGraphService,
  SpinalGraphOrganService
};