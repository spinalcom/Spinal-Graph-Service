"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GraphManagerService_1 = require("./GraphManagerService");
const spinal_model_graph_1 = require("spinal-model-graph");
exports.SpinalSet = spinal_model_graph_1.SpinalSet;
exports.SpinalNodePointer = spinal_model_graph_1.SpinalNodePointer;
exports.SpinalMap = spinal_model_graph_1.SpinalMap;
var spinal_model_graph_2 = require("spinal-model-graph");
exports.SPINAL_RELATION_TYPE = spinal_model_graph_2.SPINAL_RELATION_TYPE;
exports.SPINAL_RELATION_LST_PTR_TYPE = spinal_model_graph_2.SPINAL_RELATION_LST_PTR_TYPE;
exports.SPINAL_RELATION_PTR_LST_TYPE = spinal_model_graph_2.SPINAL_RELATION_PTR_LST_TYPE;
exports.SpinalContext = spinal_model_graph_2.SpinalContext;
exports.SpinalNode = spinal_model_graph_2.SpinalNode;
exports.SpinalGraph = spinal_model_graph_2.SpinalGraph;
const G_ROOT = typeof window === 'undefined' ? global : window;
if (typeof G_ROOT.spinal === 'undefined')
    G_ROOT.spinal = {};
if (typeof G_ROOT.spinal.spinalGraphService === 'undefined') {
    if (typeof G_ROOT.spinal.spinalSystem !== 'undefined') {
        G_ROOT.spinal.spinalGraphService = new GraphManagerService_1.GraphManagerService(1);
    }
    else {
        G_ROOT.spinal.spinalGraphService = new GraphManagerService_1.GraphManagerService();
    }
}
// tslint:disable-next-line:variable-name
const SpinalGraphService = G_ROOT.spinal.spinalGraphService;
exports.SpinalGraphService = SpinalGraphService;
//# sourceMappingURL=index.js.map