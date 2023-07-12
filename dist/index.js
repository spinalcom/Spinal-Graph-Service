"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalGraphService = exports.SpinalGraph = exports.SpinalNode = exports.SpinalContext = exports.SPINAL_RELATION_PTR_LST_TYPE = exports.SPINAL_RELATION_LST_PTR_TYPE = exports.SPINAL_RELATION_TYPE = exports.SpinalMap = exports.SpinalNodePointer = exports.SpinalSet = void 0;
const GraphManagerService_1 = require("./GraphManagerService");
var spinal_model_graph_1 = require("spinal-model-graph");
Object.defineProperty(exports, "SpinalSet", { enumerable: true, get: function () { return spinal_model_graph_1.SpinalSet; } });
Object.defineProperty(exports, "SpinalNodePointer", { enumerable: true, get: function () { return spinal_model_graph_1.SpinalNodePointer; } });
Object.defineProperty(exports, "SpinalMap", { enumerable: true, get: function () { return spinal_model_graph_1.SpinalMap; } });
__exportStar(require("./GraphManagerService"), exports);
__exportStar(require("./interfaces/InfoModel"), exports);
__exportStar(require("./interfaces/SpinalNodeFindPredicateFunc"), exports);
__exportStar(require("./interfaces/SpinalNodeObject"), exports);
__exportStar(require("./interfaces/SpinalNodeRef"), exports);
var spinal_model_graph_2 = require("spinal-model-graph");
Object.defineProperty(exports, "SPINAL_RELATION_TYPE", { enumerable: true, get: function () { return spinal_model_graph_2.SPINAL_RELATION_TYPE; } });
Object.defineProperty(exports, "SPINAL_RELATION_LST_PTR_TYPE", { enumerable: true, get: function () { return spinal_model_graph_2.SPINAL_RELATION_LST_PTR_TYPE; } });
Object.defineProperty(exports, "SPINAL_RELATION_PTR_LST_TYPE", { enumerable: true, get: function () { return spinal_model_graph_2.SPINAL_RELATION_PTR_LST_TYPE; } });
Object.defineProperty(exports, "SpinalContext", { enumerable: true, get: function () { return spinal_model_graph_2.SpinalContext; } });
Object.defineProperty(exports, "SpinalNode", { enumerable: true, get: function () { return spinal_model_graph_2.SpinalNode; } });
Object.defineProperty(exports, "SpinalGraph", { enumerable: true, get: function () { return spinal_model_graph_2.SpinalGraph; } });
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