"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GraphManagerService_1 = require("./GraphManagerService");
const SpinalSet_1 = require("spinal-model-graph/build/SpinalSet");
exports.SpinalSet = SpinalSet_1.default;
const SpinalNodePointer_1 = require("spinal-model-graph/build/SpinalNodePointer");
exports.SpinalNodePointer = SpinalNodePointer_1.default;
const SpinalMap_1 = require("spinal-model-graph/build/SpinalMap");
exports.SpinalMap = SpinalMap_1.default;
var spinal_model_graph_1 = require("spinal-model-graph");
exports.SPINAL_RELATION_TYPE = spinal_model_graph_1.SPINAL_RELATION_TYPE;
exports.SPINAL_RELATION_LST_PTR_TYPE = spinal_model_graph_1.SPINAL_RELATION_LST_PTR_TYPE;
exports.SPINAL_RELATION_PTR_LST_TYPE = spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE;
exports.SpinalContext = spinal_model_graph_1.SpinalContext;
exports.SpinalNode = spinal_model_graph_1.SpinalNode;
exports.SpinalGraph = spinal_model_graph_1.SpinalGraph;
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