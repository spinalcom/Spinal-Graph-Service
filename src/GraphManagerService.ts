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

// tslint:disable:function-name

import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-model-graph';
import * as qrcode from 'qrcode-generator';
import * as q from 'q';
import type { SpinalNodeRef } from './interfaces/SpinalNodeRef';
import type { SpinalNodeObject } from './interfaces/SpinalNodeObject';
import {
  type SpinalNodeFindPredicateFunc,
  DEFAULT_PREDICATE,
} from './interfaces/SpinalNodeFindPredicateFunc';
import { Model } from 'spinal-core-connectorjs_type';

const G_ROOT = typeof window === 'undefined' ? global : window;

/**
 * @type (node: string | SpinalNodeRef) => any
 */
type callback = (node: string | SpinalNodeRef) => any;

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
  bindedNode: Map<string, Map<any, callback>>;
  binders: Map<String, spinal.Process>;
  listenersOnNodeAdded: Map<any, callback>;
  listenerOnNodeRemove: Map<any, callback>;
  initialized: Promise<boolean>;
  nodes: { [nodeId: string]: SpinalNode<any> };
  nodesInfo: { [nodeId: string]: SpinalNodeRef };
  graph: SpinalGraph<any>;
  initProm: q.Deferred<SpinalGraph<any>>;
  /**
   * @param viewerEnv {boolean} if defined load graph from getModel
   */
  constructor(viewerEnv?: number) {
    this.bindedNode = new Map();
    this.binders = new Map();
    this.listenersOnNodeAdded = new Map();
    this.listenerOnNodeRemove = new Map();
    this.initProm = q.defer();
    this.nodes = {};
    this.graph = undefined;
    this.nodesInfo = {};
    if (typeof viewerEnv !== 'undefined') {
      (<any>G_ROOT).spinal.spinalSystem
        .getModel()
        .then((obj: any) => {
          if (obj instanceof SpinalGraph) {
            this.setGraph(obj);
          } else {
            this.setGraphFromForgeFile(obj);
          }
        })
        .catch((e: Error) => console.error(e));
    }
  }

  /**
   * Change the current graph with the one of the forgeFile if there is one create one if note
   * @param {*} forgeFile
   * @returns {Promise<String>}
   * @memberof GraphManagerService
   */
  setGraphFromForgeFile(forgeFile: spinal.Model): Promise<String> {
    console.warn('deprecated use set graph instead');
    if (forgeFile instanceof SpinalNode) return this.setGraph(<any>forgeFile);
    if (!forgeFile.hasOwnProperty('graph')) {
      forgeFile.add_attr({
        graph: new SpinalGraph(),
      });
    }
    return this.setGraph(forgeFile.graph);
  }

  /**
   * @param {SpinalGraph<any>} graph
   * @returns {Promise<String>} the id of the graph
   * @memberof GraphManagerService
   */
  async setGraph(graph: SpinalGraph<any>): Promise<String> {
    if (
      this.graph &&
      typeof this.graph.getId === 'function' &&
      this.nodes.hasOwnProperty(this.graph.getId().get())
    ) {
      delete this.nodes[this.graph.getId().get()];
    }
    this.graph = graph;
    this.nodes[this.graph.getId().get()] = this.graph;
    await this.getChildren(this.graph.getId().get(), []);
    this.initProm.resolve(this.graph);
    return this.graph.getId().get();
  }

  /**
   * @returns {q.Promise<SpinalGraph<any>>}
   * @memberof GraphManagerService
   */
  waitForInitialization(): q.Promise<SpinalGraph<any>> {
    return this.initProm.promise;
  }

  /**
   * Find a node with it id
   * @param id
   * @param stop
   */
  async findNode(id: string, stop = false): Promise<SpinalNodeRef> {
    if (this.nodes.hasOwnProperty(id)) {
      return this.getInfo(id);
    }

    for (const key in this.nodesInfo) {
      if (this.nodesInfo.hasOwnProperty(key) && this.haveChildId(key, id)) {
        const children = await this.getChildren(key);
        for (const child of children) {
          if (child.id.get() === id) return child;
        }
      }
    }
    return undefined;
  }

  haveChildId(nodeId: string, searchId: string): boolean {
    const nodeRef = this.nodesInfo[nodeId];
    if (!nodeRef) return false;
    return nodeRef.childrenIds.includes(searchId);
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
  async findNodes(
    startId: string,
    relationNames: string[],
    predicate: (node) => boolean
  ): Promise<SpinalNode<any>[]> {
    let node: SpinalNode<any> = this.graph;
    if (this.nodes.hasOwnProperty(startId)) {
      node = this.nodes[startId];
    }
    const found = await node.find(relationNames, predicate);
    for (const n of found) {
      this._addNode(n);
    }
    return found;
  }

  /**
   * Find all nodes with the type "nodeType"
   *  @param startId {String} starting point of the search if note found the
   * search will start at the beginning of the graph
   * @param relationNames {String[]} the relations that will be follow
   * during the search if empty follow all relations
   * @param nodeType type of node to search
   * @return all nodes with the type "nodeType"
   */
  public findNodesByType(
    startId: string,
    relationNames: string[],
    nodeType: string
  ): Promise<any> {
    return this.findNodes(startId, relationNames, (node) => {
      return node.getType().get() === nodeType;
    });
  }

  /**
   * Recursively finds all the children nodes and classify them by type.
   * @param {String} startId  starting point of the search if note found the
   * search will start at the beginning of the graph
   * @param {string|string[]} relationNames Array containing the relation names to follow
   * @returns {Object<{types : string[], data : Object<string : SpinalNode[]>}>}
   * @throws {TypeError} If the relationNames are neither an array, a string or omitted
   * @throws {TypeError} If an element of relationNames is not a string
   * @throws {TypeError} If the predicate is not a function
   */
  public async browseAnClassifyByType(
    startId: string,
    relationNames: string[]
  ): Promise<any> {
    let dataStructure = {
      types: [],
      data: {},
    };

    await this.findNodes(startId, relationNames, (node) => {
      let type = node.getType().get();

      if (dataStructure.types.indexOf(type) === -1) {
        dataStructure.types.push(type);
      }

      if (typeof dataStructure.data[type] === 'undefined') {
        dataStructure.data[type] = [];
      }

      dataStructure.data[type].push(node.info);

      return false;
    });

    return dataStructure;
  }

  /**
   * Recursively finds all the children nodes in the context for which the predicate is true..
   * @param {string} startId starting point of the search if note found the
   * search will start at the beginning of the graph
   * @param {string} contextId Context to use for the search
   * @param {findPredicate} predicate Function returning true if the node needs to be returned
   * @returns {Promise<Array<SpinalNode>>} The nodes that were found
   * @throws {TypeError} If context is not a SpinalContext
   * @throws {TypeError} If the predicate is not a function
   */
  public async findInContext(
    startId: string,
    contextId: string,
    predicate: SpinalNodeFindPredicateFunc = DEFAULT_PREDICATE
  ): Promise<any> {
    let contextNode = this.getRealNode(contextId);
    let startNode = this.getRealNode(startId);

    if (contextNode && startNode) {
      return startNode.findInContext(contextNode, predicate).then((found) => {
        if (found) {
          return found.map((el) => el.info);
        }
      });
    }
  }

  /**
   * Recursively finds all the children nodes in the context for which the predicate is true..
   * @param {string} startId starting point of the search if note found the
   * search will start at the beginning of the graph
   * @param {string} contextId Context to use for the search
   * @param nodeType type of node to search
   * @returns {Promise<Array<SpinalNode>>} The nodes that were found
   * @throws {TypeError} If context is not a SpinalContext
   * @throws {TypeError} If the predicate is not a function
   */
  public findInContextByType(
    startId: string,
    contextId: string,
    nodeType: string
  ): Promise<any> {
    return this.findInContext(startId, contextId, (node) => {
      if (node.getType().get() === nodeType) {
        this._addNode(node);
        return true;
      }
      return false;
    });
  }

  /**
   * Recursively finds all the children nodes in the context and classify them by type.
   * @param {string} startId starting point of the search if note found the
   * search will start at the beginning of the graph
   * @param {string} contextId Context to use for the search
   * @returns {Object<{types : string[], data : Object<string : any[]>}>}
   * @throws {TypeError} If the relationNames are neither an array, a string or omitted
   * @throws {TypeError} If an element of relationNames is not a string
   * @throws {TypeError} If the predicate is not a function
   */

  public async browseAndClassifyByTypeInContext(
    startId: string,
    contextId: string
  ): Promise<any> {
    let dataStructure = {
      types: [],
      data: {},
    };

    await this.findInContext(startId, contextId, (node) => {
      let type = node.getType().get();

      if (dataStructure.types.indexOf(type) === -1) {
        dataStructure.types.push(type);
      }

      if (typeof dataStructure.data[type] === 'undefined') {
        dataStructure.data[type] = [];
      }

      dataStructure.data[type].push(node.info);

      return false;
    });

    return dataStructure;
  }

  generateQRcode(nodeId: string): string {
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
  getNodes(): { [nodeId: string]: SpinalNode<any> } {
    return this.nodes;
  }

  /**
   * Return all loaded Nodes
   * @returns {{[nodeId: string]: SpinalNodeRef}}
   * @memberof GraphManagerService
   */
  getNodesInfo(): { [nodeId: string]: SpinalNodeRef } {
    return this.nodesInfo;
  }

  /**
   * Return the information about the node with the given id
   * @param id of the wanted node
   * @returns {SpinalNodeRef | undefined}
   */
  getNode(id: string): SpinalNodeRef {
    if (this.nodes.hasOwnProperty(id)) {
      return this.getInfo(id);
    }
  }

  /**
   * Return the information about the node with the given id
   * @param id of the wanted node
   * @returns {SpinalNodeRef | undefined}
   */
  async getNodeAsync(id: string): Promise<SpinalNodeRef> {
    try {
      const node = await this.findNode(id);
      return this.getInfo(node.id.get());
    } catch {
      return undefined;
    }
  }

  /**
   * return the current graph
   * @returns {undefined|SpinalNode<any>}
   */
  getGraph(): SpinalGraph<any> {
    return this.graph;
  }

  /**
   * Return the node with the given id
   * @param {string} id of the wanted node
   * @returns {SpinalNode<any>}
   * @memberof GraphManagerService
   */
  getRealNode(id: string): SpinalNode<any> {
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
  getRelationNames(id: string): string[] {
    const relationNames = [];
    if (this.nodes.hasOwnProperty(id)) {
      for (const [, relationMap] of this.nodes[id].children) {
        if (relationMap && relationMap.keys) {
          relationNames.push(...relationMap.keys());
        }
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
  async getChildren(
    id: string,
    relationNames: string[] = []
  ): Promise<SpinalNodeRef[]> {
    if (!this.nodes.hasOwnProperty(id)) {
      return Promise.reject(Error(`Node id: ${id} not found`));
    }

    if (relationNames.length === 0) {
      for (const [, relationMap] of this.nodes[id].children) {
        if (relationMap && relationMap.keys) {
          relationNames.push(...relationMap.keys());
        }
      }
    }

    const children = await this.nodes[id].getChildren(relationNames);
    return children.map((n) => {
      this._addNode(n);
      return this.getInfo(n.info.id.get());
    });
  }

  /**
   * Return the children of the node that are registered in the context
   * @param {string} parentId id of the parent node
   * @param {string} contextId id of the context node
   * @returns {Promise<SpinalNodeRef[]>} The info of the children that were found
   * @memberof GraphManagerService
   */
  async getChildrenInContext(
    parentId: string,
    contextId: string
  ): Promise<SpinalNodeRef[]> {
    if (
      !this.nodes.hasOwnProperty(parentId) ||
      !this.nodes.hasOwnProperty(contextId)
    ) {
      throw new Error('parentId or contextId not found');
    }

    const children = await this.nodes[parentId].getChildrenInContext(
      this.nodes[contextId]
    );
    return children.map((n) => {
      this._addNode(n);
      return this.getInfo(n.info.id.get());
    });
  }

  /**
   * Return the node info aggregated with its childrenIds, contextIds and element
   * @param {string} nodeId
   * @returns {SpinalNodeRef}
   * @memberof GraphManagerService
   */
  getInfo(nodeId: string): SpinalNodeRef {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return;
    }
    if (this.nodesInfo.hasOwnProperty(nodeId)) {
      return this.nodesInfo[nodeId];
    }

    const node = this.nodes[nodeId];
    const res = <any>new Model();
    for (const key of node.info._attribute_names) {
      if (Object.prototype.hasOwnProperty.call(node.info, key)) {
        const element = node.info[key];
        res.add_attr(key, element);
      }
    }
    res['childrenIds'] = node.getChildrenIds();
    res['contextIds'] = node.contextIds;
    res['element'] = node.element;
    res['hasChildren'] = res['childrenIds'].length > 0;

    this.nodesInfo[nodeId] = <SpinalNodeRef>res;
    return <SpinalNodeRef>res;
  }

  /**
   * Update the node info aggregated with
   * its childrenIds, contextIds and element
   * @param {string} nodeId
   * @returns {SpinalNodeRef}
   * @memberof GraphManagerService
   */
  setInfo(nodeId: string): void {
    const node = this.nodes[nodeId];
    if (node)
      return console.error(
        `trying to setInfo of ${nodeId} but not registered.`
      );
    let res = this.nodesInfo[nodeId];
    if (!res) {
      res = this.getInfo(nodeId);
    } else {
      for (const key of node.info._attribute_names) {
        if (Object.prototype.hasOwnProperty.call(node.info, key)) {
          const element = node.info[key];
          if (!res[key]) {
            res.add_attr(key, element);
          } else if (element !== res[key]) {
            res.mod_attr(key, element);
          }
        }
      }
      res['childrenIds'] = node.getChildrenIds();
      res['contextIds'] = node.contextIds;
      res['element'] = node.element;
      res['hasChildren'] = res['childrenIds'].length > 0;
    }
  }

  /**
   * @param {string} nodeId
   * @returns {string[]}
   * @memberof GraphManagerService
   */
  getChildrenIds(nodeId: string): string[] {
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
  listenOnNodeAdded(caller: any, callback: callback): boolean {
    this.listenersOnNodeAdded.set(caller, callback);
    return this.stopListeningOnNodeAdded.bind(this, caller);
  }

  /**
   * @param {any} caller
   * @param {callback} callback
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  listenOnNodeRemove(caller: any, callback: callback): boolean {
    this.listenerOnNodeRemove.set(caller, callback);
    return this.stopListeningOnNodeRemove.bind(this, caller);
  }

  /**
   * @param {string} caller
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  stopListeningOnNodeAdded(caller: any): boolean {
    return this.listenersOnNodeAdded.delete(caller);
  }

  /**
   * @param {string} caller
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  stopListeningOnNodeRemove(caller: any): boolean {
    return this.listenerOnNodeRemove.delete(caller);
  }

  /**
   * @param nodeId id of the desired node
   * @param info new info for the node
   * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
   * @memberof GraphManagerService
   */
  modifyNode(nodeId: string, info: SpinalNodeRef): boolean {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return false;
    }
    for (const key in info) {
      if (
        !this.nodes[nodeId].info.hasOwnProperty(key) &&
        info.hasOwnProperty(key)
      ) {
        const tmp = {};
        tmp[key] = info[key];
        this.nodes[nodeId].info.add_attr(tmp);
      } else if (info.hasOwnProperty(key)) {
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
  bindNode(nodeId: string, caller: any, callback: callback): Function {
    if (
      !this.nodes.hasOwnProperty(nodeId) ||
      typeof caller !== 'object' ||
      typeof callback !== 'function'
    ) {
      return undefined;
    }

    if (this.bindedNode.has(nodeId)) {
      this.bindedNode.get(nodeId).set(caller, callback);
    } else {
      this.bindedNode.set(nodeId, new Map([[caller, callback]]));
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
  async moveChild(
    fromId: string,
    toId: string,
    childId: string,
    relationName: string,
    relationType: string
  ): Promise<boolean> {
    if (!this.nodes.hasOwnProperty(fromId)) {
      return Promise.reject(`fromId: ${fromId} not found`);
    }
    if (!this.nodes.hasOwnProperty(toId)) {
      return Promise.reject(`toId: ${toId} not found`);
    }
    if (!this.nodes.hasOwnProperty(childId)) {
      return Promise.reject(`childId: ${childId} not found`);
    }
    await this.nodes[fromId].removeChild(
      this.nodes[childId],
      relationName,
      relationType
    );
    await this.nodes[toId].addChild(
      this.nodes[childId],
      relationName,
      relationType
    );
    return true;
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
  async moveChildInContext(
    fromId: string,
    toId: string,
    childId: string,
    contextId: string,
    relationName: string,
    relationType: string
  ): Promise<boolean> {
    if (!this.nodes.hasOwnProperty(fromId)) {
      return Promise.reject(`fromId: ${fromId} not found`);
    }
    if (!this.nodes.hasOwnProperty(toId)) {
      return Promise.reject(`toId: ${toId} not found`);
    }
    if (!this.nodes.hasOwnProperty(childId)) {
      return Promise.reject(`childId: ${childId} not found`);
    }

    await this.nodes[fromId].removeChild(
      this.nodes[childId],
      relationName,
      relationType
    );
    await this.nodes[toId].addChildInContext(
      this.nodes[childId],
      relationName,
      relationType,
      this.nodes[contextId]
    );
    return true;
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
  async removeChild(
    nodeId: string,
    childId: string,
    relationName: string,
    relationType: string,
    stop: boolean = false
  ): Promise<boolean> {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return Promise.reject(Error('nodeId unknown.'));
    }

    if (!this.nodes.hasOwnProperty(childId) && !stop) {
      try {
        await this.getChildren(nodeId, []);
        return await this.removeChild(
          nodeId,
          childId,
          relationName,
          relationType,
          true
        );
      } catch (e) {
        console.error(e);
      }
    }
    if (this.nodes.hasOwnProperty(childId)) {
      for (const callback of this.listenerOnNodeRemove.values()) {
        callback(nodeId);
      }
      await this.nodes[nodeId].removeChild(
        this.nodes[childId],
        relationName,
        relationType
      );
      console.log('remove child', this.nodes[childId]);
      return true;
    }
    return Promise.reject(
      Error(
        'childId unknown. It might already been removed from the parent node'
      )
    );
  }

  /**
   * Add a context to the graph
   * @param {string} name of the context
   * @param {string} type of the context
   * @param {spinal.Model} elt element of the context if needed
   * @returns {Promise<SpinalContext>}
   * @memberof GraphManagerService
   */
  addContext(
    name: string,
    type?: string,
    elt?: spinal.Model
  ): Promise<SpinalContext<any>> {
    const context = new SpinalContext(name, type, elt);
    this.nodes[context.info.id.get()] = context;

    return this.graph.addContext(context);
  }

  /**
   * @param {string} name
   * @returns {SpinalContext}
   * @memberof GraphManagerService
   */
  getContext(name: string): SpinalContext<any> {
    for (const key in this.nodes) {
      if (this.nodes.hasOwnProperty(key)) {
        const node = this.nodes[key];
        if (node instanceof SpinalContext && node.getName().get() === name) {
          return node;
        }
      }
    }
  }

  /**
   * Return all context with type
   * @param type
   */
  getContextWithType(type: string) {
    const res = [];
    for (const key in this.nodes) {
      if (this.nodes.hasOwnProperty(key)) {
        const node = this.nodes[key];
        if (node instanceof SpinalContext && node.getType().get() === type) {
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
  getNodeByType(type: string) {
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
  removeFromGraph(id: string): Promise<void> {
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
   * @param {spinal.Model} [element] element pointed by the node
   * @returns {string} return the child identifier
   * @memberof GraphManagerService
   */
  createNode(info: { [key: string]: any }, element?: spinal.Model): string {
    const node = new SpinalNode(undefined, undefined, element);
    if (!info.hasOwnProperty('type')) {
      info['type'] = node.getType().get();
    }
    const nodeId = node.info.id.get();
    info['id'] = nodeId;
    for (const key in info) {
      if (!node.info._attribute_names.includes(key)) {
        node.info.add_attr(key, info[key]);
      } else {
        node.info[key].set(info[key]);
      }
    }
    this._addNode(node);
    return nodeId;
  }

  /**
   * d
   * @param {string} parentId
   * @param {string} childId
   * @param {string} contextId
   * @param {string} relationName
   * @param {number} relationType
   * @returns {Promise<SpinalNode<any>>}
   * @memberof GraphManagerService
   */
  addChildInContext(
    parentId: string,
    childId: string,
    contextId: string,
    relationName: string,
    relationType: string
  ): Promise<SpinalNode<any>> {
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
    return this.nodes[parentId].addChildInContext(
      child,
      relationName,
      relationType,
      context
    );
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
  async addChild(
    parentId: string,
    childId: string,
    relationName: string,
    relationType: string
  ): Promise<boolean> {
    if (!this.nodes.hasOwnProperty(parentId)) {
      return Promise.resolve(false);
    }
    if (!this.nodes.hasOwnProperty(childId)) {
      return Promise.resolve(false);
    }
    await this.nodes[parentId].addChild(
      this.nodes[childId],
      relationName,
      relationType
    );
    return true;
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
  addChildAndCreateNode(
    parentId: string,
    node: SpinalNodeObject,
    relationName: string,
    relationType: string
  ): Promise<boolean> {
    if (!node.hasOwnProperty('info')) {
      return Promise.reject(false);
    }

    const nodeId = this.createNode(node.info, node.element);
    return this.addChild(parentId, nodeId, relationName, relationType);
  }

  async isChild(parentId: string, childId: string, linkRelationName: string[]) {
    if (!this.nodes.hasOwnProperty(parentId)) {
      return Promise.resolve(false);
    }
    const children = await this.nodes[parentId].getChildren(linkRelationName);
    let res = false;
    for (const child of children) {
      this._addNode(child);
      if (child.info.id.get() === childId) {
        res = true;
      }
    }
    return res;
  }

  /**
   * add a node to the set of node
   * @param {SpinalNode<any>} node
   * @memberof GraphManagerService
   */
  _addNode(node: SpinalNode<any>) {
    if (!this.nodes.hasOwnProperty(node.getId().get())) {
      this.nodes[node.info.id.get()] = node;

      for (const callback of this.listenersOnNodeAdded.values()) {
        callback(node.info.id.get());
      }
    }
  }

  /**
   * Check if all children from a node are loaded
   * @private
   * @param {string} nodeId id of the desired node
   * @returns {boolean} return true if all children of the node is loaded false otherwise
   * @memberof GraphManagerService
   */
  private _areAllChildrenLoaded(nodeId: string): boolean {
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
  private _bindNode(nodeId: string): void {
    if (this.binders.has(nodeId) || !this.nodes.hasOwnProperty(nodeId)) {
      return;
    }
    this.binders.set(
      nodeId,
      this.nodes[nodeId].bind(this._bindFunc.bind(this, nodeId))
    );
  }

  /**
   * call the callback method of all the binder of the node
   * @private
   * @param {string} nodeId
   * @memberof GraphManagerService
   */
  private _bindFunc(nodeId: string): void {
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
  private _unBind(nodeId: string, binder: any): boolean {
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

  public hasChildInContext(nodeId: string, contextId: string) {
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

  /**
   * Return all parents for the relation names no matter the type of relation
   * @param {string} nodeId The node id whose parents are recovered
   * @param {String[]} [relationNames=[]] Array containing the relation names of the desired parents
   * @returns {Promise<Array<SpinalNode<any>>>} Promise containing the parents that were found
   * @throws {TypeError} If the relationNames are neither an array, a string or omitted
   * @throws {TypeError} If an element of relationNames is not a string
   */
  public async getParents(
    nodeId: string,
    relationNames: string | string[]
  ): Promise<any> {
    let node = this.nodes[nodeId];

    if (node) {
      const result = await node.getParents(relationNames);
      const parents = result.filter((parent) => parent instanceof SpinalNode);
      return parents.map((parent_1) => {
        this._addNode(parent_1);
        return this.getInfo(parent_1.getId().get());
      });
    }
  }
}

export default GraphManagerService;
export { GraphManagerService };
