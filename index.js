import SpinalGraphServiceClass from "./GraphManagerService";

const G_root = typeof window == "undefined" ? global : window;

if (typeof G_root.spinal === "undefined") G_root.spinal = {};
if (typeof G_root.spinal.spinalGraphService === "undefined") {
  G_root.spinal.spinalGraphService = new SpinalGraphServiceClass( 1 );
}


const SpinalGraphService = G_root.spinal.spinalGraphService;

export {
  SpinalGraphService,
  SpinalGraphServiceClass
};