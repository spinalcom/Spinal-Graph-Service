"use strict";
/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */
// tslint:disable:function-name
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_model_graph_1 = require("spinal-model-graph");
const qrcode = require("qrcode-generator");
const q = require("q");
const G_ROOT = typeof window === 'undefined' ? global : window;
/**
 *  @property {Map<string, Map<any, Callback>>} bindedNode
 *    NodeId => Caller => Callback. All nodes that are bind
 *  @property {Map<String, callback>} binders NodeId => CallBack from bind method.
 *  @property {Map<any, callback>} listeners
 *    caller => callback. List of all listeners on node added
 *  @property {{[nodeId: string]: SpinalNode<any>}} nodes containing all SpinalNode currently loaded
 *  @property {SpinalGraph<any>} graph
 */
class GraphManagerService {
    /**
     * @param viewerEnv {boolean} if defined load graph from getModel
     */
    constructor(viewerEnv) {
        this.bindedNode = new Map();
        this.binders = new Map();
        this.listenersOnNodeAdded = new Map();
        this.listenerOnNodeRemove = new Map();
        this.initProm = q.defer();
        this.nodes = {};
        this.graph = undefined;
        this.nodesInfo = {};
        if (typeof viewerEnv !== 'undefined') {
            G_ROOT.spinal.spinalSystem.getModel()
                .then((obj) => {
                if (obj instanceof spinal_model_graph_1.SpinalGraph) {
                    this.setGraph(obj);
                }
                else {
                    this.setGraphFromForgeFile(obj);
                }
            })
                .catch((e) => console.error(e));
        }
    }
    /**
     * Change the current graph with the one of the forgeFile if there is one create one if note
     * @param {*} forgeFile
     * @returns {Promise<String>}
     * @memberof GraphManagerService
     */
    setGraphFromForgeFile(forgeFile) {
        console.warn('deprecated use set graph instead');
        if (forgeFile instanceof spinal_model_graph_1.SpinalNode)
            return this.setGraph(forgeFile);
        if (!forgeFile.hasOwnProperty('graph')) {
            forgeFile.add_attr({
                graph: new spinal_model_graph_1.SpinalGraph(),
            });
        }
        return this.setGraph(forgeFile.graph);
    }
    /**
     * @param {SpinalGraph<any>} graph
     * @returns {Promise<String>} the id of the graph
     * @memberof GraphManagerService
     */
    setGraph(graph) {
        if (this.graph && typeof this.graph.getId === 'function' &&
            this.nodes.hasOwnProperty(this.graph.getId().get())) {
            delete this.nodes[this.graph.getId().get()];
        }
        this.graph = graph;
        this.nodes[this.graph.getId().get()] = this.graph;
        return this.getChildren(this.graph.getId().get(), [])
            .then(() => {
            this.initProm.resolve(this.graph);
            return this.graph.getId().get();
        });
    }
    /**
     * @returns {q.Promise<SpinalGraph<any>>}
     * @memberof GraphManagerService
     */
    waitForInitialization() {
        return this.initProm.promise;
    }
    /**
     * Find a node with it id
     * @param id
     * @param stop
     */
    findNode(id, stop = false) {
        const promises = [];
        if (this.nodes.hasOwnProperty(id)) {
            return Promise.resolve(this.getInfo(id));
        }
        if (stop) {
            Promise.resolve(undefined);
        }
        for (const key in this.nodes) {
            if (this.nodes.hasOwnProperty(key)) {
                promises.push(this.getChildren(this.nodes[key].getId().get(), []));
            }
        }
        return Promise.all(promises).then(() => {
            return this.findNode(id, true);
        });
    }
    /**
     * Find all the nodes that validate the predicate
     *
     * @param startId {String} starting point of the search if note found the
     * search will start at the beginning of the graph
     * @param relationNames {String[]} the relations that will be follow
     * during the search if empty follow all relations
     * @param predicate {(node) => boolean} function that return true if the
     * node if valid
     * @return all node that validate the predicate
     */
    findNodes(startId, relationNames, predicate) {
        let node = this.graph;
        if (this.nodes.hasOwnProperty(startId)) {
            node = this.nodes[startId];
        }
        return node.find(relationNames, predicate).then((found) => {
            for (const n of found) {
                this._addNode(n);
            }
            return found;
        });
    }
    generateQRcode(nodeId) {
        const typeNumber = 0;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(nodeId);
        qr.make();
        return qr.createDataURL();
    }
    /**
     * Return all loaded Nodes
     * @returns {{[nodeId: string]: SpinalNode<any>}}
     * @memberof GraphManagerService
     */
    getNodes() {
        return this.nodes;
    }
    /**
     * Return all loaded Nodes
     * @returns {{[nodeId: string]: SpinalNodeRef}}
     * @memberof GraphManagerService
     */
    getNodesInfo() {
        return this.nodesInfo;
    }
    /**
     * Return the information about the node with the given id
     * @param id of the wanted node
     * @returns {SpinalNodeRef | undefined}
     */
    getNode(id) {
        console.warn('deprecated use getNodeAsync instead');
        if (this.nodes.hasOwnProperty(id)) {
            return this.getInfo(id);
        }
    }
    /**
     * Return the information about the node with the given id
     * @param id of the wanted node
     * @returns {SpinalNodeRef | undefined}
     */
    getNodeAsync(id) {
        return this.findNode(id)
            .then((node) => {
            return this.getInfo(node.id.get());
        })
            .catch(() => {
            return undefined;
        });
    }
    /**
     * return the current graph
     * @returns {undefined|SpinalNode<any>}
     */
    getGraph() {
        return this.graph;
    }
    /**
     * Return the node with the given id
     * @param {string} id of the wanted node
     * @returns {SpinalNode<any>}
     * @memberof GraphManagerService
     */
    getRealNode(id) {
        if (this.nodes.hasOwnProperty(id)) {
            return this.nodes[id];
        }
        return undefined;
    }
    /**
     * Return all the relation names of the node coresponding to id
     * @param {string} id of the node
     * @returns {string[]}
     * @memberof GraphManagerService
     */
    getRelationNames(id) {
        const relationNames = [];
        if (this.nodes.hasOwnProperty(id)) {
            for (const [, relationMap] of this.nodes[id].children) {
                relationNames.push(...relationMap.keys());
            }
        }
        return relationNames;
    }
    /**
     * Return all children of a node
     * @param {string} id
     * @param {string[]} [relationNames=[]]
     * @returns {Promise<SpinalNodeRef[]>}
     * @memberof GraphManagerService
     */
    getChildren(id, relationNames = []) {
        if (!this.nodes.hasOwnProperty(id)) {
            return Promise.reject(Error(`Node id: ${id} not found`));
        }
        if (relationNames.length === 0) {
            for (const [, relationMap] of this.nodes[id].children) {
                relationNames.push(...relationMap.keys());
            }
        }
        return this.nodes[id].getChildren(relationNames)
            .then((children) => {
            return children.map((n) => {
                this._addNode(n);
                return this.getInfo[n.info.id.get()];
            });
        });
    }
    /**
     * Return the children of the node that are registered in the context
     * @param {string} parentId id of the parent node
     * @param {string} contextId id of the context node
     * @returns {Promise<SpinalNodeRef[]>} The info of the children that were found
     * @memberof GraphManagerService
     */
    getChildrenInContext(parentId, contextId) {
        if (!this.nodes.hasOwnProperty(parentId) || !this.nodes.hasOwnProperty(contextId)) {
            throw new Error('parentId or contextId not found');
        }
        return this.nodes[parentId].getChildrenInContext(this.nodes[contextId])
            .then((children) => {
            return children.map((n) => {
                this._addNode(n);
                return this.getInfo[n.info.id.get()];
            });
        });
    }
    /**
     * Return the node info aggregated with its childrenIds, contextIds and element
     * @param {string} nodeId
     * @returns {SpinalNodeRef}
     * @memberof GraphManagerService
     */
    getInfo(nodeId) {
        if (!this.nodes.hasOwnProperty(nodeId)) {
            return;
        }
        if (this.nodesInfo.hasOwnProperty(nodeId)) {
            return this.nodesInfo[nodeId];
        }
        const node = this.nodes[nodeId];
        const res = node.info.deep_copy();
        res['childrenIds'] = node.getChildrenIds();
        res['contextIds'] = node.contextIds;
        res['element'] = node.element;
        res['hasChildren'] = res['childrenIds'].length > 0;
        this.nodesInfo[nodeId] = res;
        return res;
    }
    /**
     * Return the node info aggregated with its childrenIds, contextIds and element
     * @param {string} nodeId
     * @returns {SpinalNodeRef}
     * @memberof GraphManagerService
     */
    setInfo(nodeId) {
        const node = this.nodes[nodeId];
        const res = node.info.deep_copy();
        res['childrenIds'] = node.getChildrenIds();
        res['contextIds'] = node.contextIds;
        res['element'] = node.element;
        res['hasChildren'] = res['childrenIds'].length > 0;
        this.nodesInfo[nodeId] = res;
    }
    /**
     * @param {string} nodeId
     * @returns {string[]}
     * @memberof GraphManagerService
     */
    getChildrenIds(nodeId) {
        if (this.nodes.hasOwnProperty(nodeId)) {
            return this.nodes[nodeId].getChildrenIds();
        }
    }
    /**
     * @param {any} caller
     * @param {callback} callback
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    listenOnNodeAdded(caller, callback) {
        this.listenersOnNodeAdded.set(caller, callback);
        return this.stopListeningOnNodeAdded.bind(this, caller);
    }
    /**
     * @param {any} caller
     * @param {callback} callback
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    listenOnNodeRemove(caller, callback) {
        this.listenerOnNodeRemove.set(caller, callback);
        return this.stopListeningOnNodeRemove.bind(this, caller);
    }
    /**
     * @param {string} caller
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    stopListeningOnNodeAdded(caller) {
        return this.listenersOnNodeAdded.delete(caller);
    }
    /**
     * @param {string} caller
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    stopListeningOnNodeRemove(caller) {
        return this.listenerOnNodeRemove.delete(caller);
    }
    /**
     * @param nodeId id of the desired node
     * @param info new info for the node
     * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
     * @memberof GraphManagerService
     */
    modifyNode(nodeId, info) {
        if (!this.nodes.hasOwnProperty(nodeId)) {
            return false;
        }
        for (const key in info) {
            if (!this.nodes[nodeId].info.hasOwnProperty(key) && info.hasOwnProperty(key)) {
                const tmp = {};
                tmp[key] = info[key];
                this.nodes[nodeId].info.add_attr(tmp);
            }
            else if (info.hasOwnProperty(key)) {
                this.nodes[nodeId].info.mod_attr(key, info[key]);
            }
        }
        return true;
    }
    /**
     * Bind a node and return a function to unbind the same node
     * @param {string} nodeId
     * @param {*} caller usually 'this'
     * @param {callback} callback to be call every change of the node
     * @returns {Function} return a function to allow to node unbinding
     * if the node corresponding to nodeId exist
     * undefined and caller is an object and callback is a function otherwise
     * @memberof GraphManagerService
     */
    bindNode(nodeId, caller, callback) {
        if (!this.nodes.hasOwnProperty(nodeId) ||
            typeof caller !== 'object' ||
            typeof callback !== 'function') {
            return undefined;
        }
        if (this.bindedNode.has(nodeId)) {
            this.bindedNode.get(nodeId).set(caller, callback);
        }
        else {
            this.bindedNode.set(nodeId, new Map([
                [caller, callback],
            ]));
            this._bindNode(nodeId);
        }
        return this._unBind.bind(this, nodeId, caller);
    }
    /**
     * @param {string} fromId
     * @param {string} toId
     * @param {string} childId
     * @param {string} relationName
     * @param {string} relationType
     * @returns
     * @memberof GraphManagerService
     */
    moveChild(fromId, toId, childId, relationName, relationType) {
        if (!this.nodes.hasOwnProperty(fromId)) {
            return Promise.reject(`fromId: ${fromId} not found`);
        }
        if (!this.nodes.hasOwnProperty(toId)) {
            return Promise.reject(`toId: ${toId} not found`);
        }
        if (!this.nodes.hasOwnProperty(childId)) {
            return Promise.reject(`childId: ${childId} not found`);
        }
        return this.nodes[fromId].removeChild(this.nodes[childId], relationName, relationType)
            .then(() => {
            return this.nodes[toId].addChild(this.nodes[childId], relationName, relationType);
        }).then(() => true);
    }
    /**
     * @param {string} fromId
     * @param {string} toId
     * @param {string} childId
     * @param {string} contextId
     * @param {number} relationName
     * @param {string} relationType
     * @returns
     * @memberof GraphManagerService
     */
    moveChildInContext(fromId, toId, childId, contextId, relationName, relationType) {
        if (!this.nodes.hasOwnProperty(fromId)) {
            return Promise.reject(`fromId: ${fromId} not found`);
        }
        if (!this.nodes.hasOwnProperty(toId)) {
            return Promise.reject(`toId: ${toId} not found`);
        }
        if (!this.nodes.hasOwnProperty(childId)) {
            return Promise.reject(`childId: ${childId} not found`);
        }
        return this.nodes[fromId].removeChild(this.nodes[childId], relationName, relationType)
            .then(() => {
            return this.nodes[toId].addChildInContext(this.nodes[childId], relationName, relationType, this.nodes[contextId]);
        }).then(() => true);
    }
    /**
     * Remove the child corresponding to childId from the node corresponding to parentId.
     * @param nodeId {String}
     * @param childId {String}
     * @param relationName {String}
     * @param relationType {string}
     * @param stop
     * @returns {Promise<boolean>}
     */
    removeChild(nodeId, childId, relationName, relationType, stop = false) {
        if (!this.nodes.hasOwnProperty(nodeId)) {
            return Promise.reject(Error('nodeId unknown.'));
        }
        if (!this.nodes.hasOwnProperty(childId) && !stop) {
            try {
                return this.getChildren(nodeId, []).then(() => {
                    return this.removeChild(nodeId, childId, relationName, relationType, true);
                });
            }
            catch (e) {
                console.error(e);
            }
        }
        if (this.nodes.hasOwnProperty(childId)) {
            for (const callback of this.listenerOnNodeRemove.values()) {
                callback(nodeId);
            }
            return this.nodes[nodeId].removeChild(this.nodes[childId], relationName, relationType).then(() => {
                console.log('remove child', this.nodes[childId]);
                return true;
            });
        }
        return Promise.reject(Error('childId unknown. It might already been removed from the parent node'));
    }
    /**
     * Add a context to the graph
     * @param {string} name of the context
     * @param {string} type of the context
     * @param {spinal.Model} elt element of the context if needed
     * @returns {Promise<SpinalContext>}
     * @memberof GraphManagerService
     */
    addContext(name, type, elt) {
        const context = new spinal_model_graph_1.SpinalContext(name, type, elt);
        this.nodes[context.info.id.get()] = context;
        return this.graph.addContext(context);
    }
    /**
     * @param {string} name
     * @returns {SpinalContext}
     * @memberof GraphManagerService
     */
    getContext(name) {
        for (const key in this.nodes) {
            if (this.nodes.hasOwnProperty(key)) {
                const node = this.nodes[key];
                if (node instanceof spinal_model_graph_1.SpinalContext && node.getName().get() === name) {
                    return node;
                }
            }
        }
    }
    /**
     * Return all context with type
     * @param type
     */
    getContextWithType(type) {
        const res = [];
        for (const key in this.nodes) {
            if (this.nodes.hasOwnProperty(key)) {
                const node = this.nodes[key];
                if (node instanceof spinal_model_graph_1.SpinalContext && node.getType().get() === type) {
                    res.push(node);
                }
            }
        }
        return res;
    }
    /**
     * Retr
     * @param type
     */
    getNodeByType(type) {
        const res = [];
        for (const key in this.nodes) {
            if (this.nodes.hasOwnProperty(key)) {
                const node = this.nodes[key];
                if (node.getType().get() === type) {
                    res.push(node);
                }
            }
        }
        return res;
    }
    /**
     * Remove the node referenced by id from th graph.
     * @param {string} id
     * @returns {Promise<void>}
     * @memberof GraphManagerService
     */
    removeFromGraph(id) {
        if (this.nodes.hasOwnProperty(id)) {
            for (const callback of this.listenerOnNodeRemove.values()) {
                callback(id);
            }
            return this.nodes[id].removeFromGraph();
        }
    }
    /**
     * Create a new node.
     * The node newly created is volatile
     * i.e it won't be store in the filesystem as long it's not added as child to another node
     * @param {{[key: string]: any}} info information of the node
     * @param {spinal.Model} element element pointed by the node
     * @returns {string} return the child identifier
     * @memberof GraphManagerService
     */
    createNode(info, element) {
        const node = new spinal_model_graph_1.SpinalNode(undefined, undefined, element);
        if (!info.hasOwnProperty('type')) {
            info['type'] = node.getType().get();
        }
        const nodeId = node.info.id.get();
        info['id'] = nodeId;
        node.mod_attr('info', info);
        this._addNode(node);
        return nodeId;
    }
    /**
     * @param {string} parentId
     * @param {string} childId
     * @param {string} contextId
     * @param {string} relationName
     * @param {number} relationType
     * @returns {Promise<SpinalNode<any>>}
     * @memberof GraphManagerService
     */
    addChildInContext(parentId, childId, contextId, relationName, relationType) {
        if (!this.nodes.hasOwnProperty(parentId)) {
            return Promise.reject(Error(`Node parent id ${parentId} not found`));
        }
        if (!this.nodes.hasOwnProperty(childId)) {
            return Promise.reject(Error(`Node child id ${childId} not found`));
        }
        if (!this.nodes.hasOwnProperty(contextId)) {
            return Promise.reject(Error(`Node context id ${contextId} not found`));
        }
        const child = this.nodes[childId];
        const context = this.nodes[contextId];
        return this.nodes[parentId].addChildInContext(child, relationName, relationType, context);
    }
    /**
     *
     * Add the node corresponding to childId as child to the node corresponding to the parentId
     * @param {string} parentId
     * @param {string} childId
     * @param {string} relationName
     * @param {string} relationType
     * @returns {Promise<boolean>} return true if the child could be added false otherwise.
     * @memberof GraphManagerService
     */
    addChild(parentId, childId, relationName, relationType) {
        if (!this.nodes.hasOwnProperty(parentId)) {
            return Promise.resolve(false);
        }
        if (!this.nodes.hasOwnProperty(childId)) {
            return Promise.resolve(false);
        }
        return this.nodes[parentId].addChild(this.nodes[childId], relationName, relationType)
            .then(() => true);
    }
    /**
     *
     * Create a node and add it as child to the parentId.
     * @param {string} parentId id of the parent node
     * @param {SpinalNodeObject} node must have an attr. 'info' and can have an attr. 'element'
     * @param {string} relationName
     * @param {number} relationType
     * @returns {Promise<boolean>} return true if the node was created added as child
     * to the node corresponding to the parentId successfully
     * @memberof GraphManagerService
     */
    addChildAndCreateNode(parentId, node, relationName, relationType) {
        if (!node.hasOwnProperty('info')) {
            return Promise.reject(false);
        }
        const nodeId = this.createNode(node.info, node.element);
        return this.addChild(parentId, nodeId, relationName, relationType);
    }
    isChild(parentId, childId, linkRelationName) {
        if (!this.nodes.hasOwnProperty(parentId)) {
            return Promise.resolve(false);
        }
        return this.nodes[parentId].getChildren(linkRelationName)
            .then((children) => {
            let res = false;
            for (const child of children) {
                this._addNode(child);
                if (child.info.id.get() === childId) {
                    res = true;
                }
            }
            return res;
        });
    }
    /**
     * add a node to the set of node
     * @private
     * @param {SpinalNode<any>} node
     * @memberof GraphManagerService
     */
    _addNode(node) {
        if (!this.nodes.hasOwnProperty(node.getId().get())) {
            this.nodes[node.info.id.get()] = node;
            for (const callback of this.listenersOnNodeAdded.values()) {
                callback(node.info.id.get());
            }
        }
        else {
            this.setInfo(node.info.id.get());
        }
    }
    /**
     * Check if all children from a node are loaded
     * @private
     * @param {string} nodeId id of the desired node
     * @returns {boolean} return true if all children of the node is loaded false otherwise
     * @memberof GraphManagerService
     */
    _areAllChildrenLoaded(nodeId) {
        if (!this.nodes.hasOwnProperty(nodeId)) {
            return false;
        }
        const childrenIds = this.nodes[nodeId].getChildrenIds();
        let hasAllChild = true;
        for (let i = 0; i < childrenIds.length && hasAllChild; i += 1) {
            hasAllChild = this.nodes.hasOwnProperty(childrenIds[i]);
        }
        return hasAllChild;
    }
    /**
     * Bind the node if needed and save the callback function
     * @private
     * @param {string} nodeId
     * @returns {void}
     * @memberof GraphManagerService
     */
    _bindNode(nodeId) {
        if (this.binders.has(nodeId) || !this.nodes.hasOwnProperty(nodeId)) {
            return;
        }
        this.binders.set(nodeId, this.nodes[nodeId].bind(this._bindFunc.bind(this, nodeId)));
    }
    /**
     * call the callback method of all the binder of the node
     * @private
     * @param {string} nodeId
     * @memberof GraphManagerService
     */
    _bindFunc(nodeId) {
        this.setInfo(nodeId);
        if (this.bindedNode.has(nodeId)) {
            for (const callback of this.bindedNode.get(nodeId).values()) {
                callback(this.getInfo(nodeId));
            }
        }
    }
    /**
     * @private
     * @param {string} nodeId
     * @param {*} binder
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    _unBind(nodeId, binder) {
        if (!this.bindedNode.has(nodeId)) {
            return false;
        }
        const res = this.bindedNode.get(nodeId).delete(binder);
        if (this.bindedNode.get(nodeId).size === 0) {
            this.nodes[nodeId].unbind(this.binders.get(nodeId));
            this.binders.delete(nodeId);
            this.bindedNode.delete(nodeId);
        }
        return res;
    }
    hasChildInContext(nodeId, contextId) {
        if (contextId === nodeId) {
            return true;
        }
        if (this.nodes.hasOwnProperty(nodeId)) {
            const mapMap = this.nodes[nodeId].children;
            for (const [, map] of mapMap) {
                for (const [, rela] of map) {
                    if (rela.contextIds.has(contextId)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
exports.GraphManagerService = GraphManagerService;
exports.default = GraphManagerService;
//# sourceMappingURL=GraphManagerService.js.map