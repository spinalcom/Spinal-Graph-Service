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

import {
  SpinalContext,
  SpinalGraph,
  SpinalNode,
} from 'spinal-model-graph';
import { SpinalNodePointer } from 'spinal-model-graph/build/SpinalNodePointer';
import { SpinalSet } from 'spinal-model-graph/build/SpinalSet';

/**
 * @class SpinalNodeRef
 * @extends {spinal.Model}
 * @template T
 */
class SpinalNodeRef<T extends spinal.Model> extends spinal.Model {
  childrenIds: string[];
  contextIds: SpinalSet;
  element: SpinalNodePointer<T>;
  hasChildren: boolean;
  constructor(
              model: spinal.Model,
              childrenIds: string[],
              contextIds: SpinalSet,
              element: SpinalNodePointer<T>,
              hasChildren: boolean,
              ) {
    super();
    for (let index = 0; index < model._attribute_names.length; index += 1) {
      const key = model._attribute_names[index];
      this.add_attr(key, model[key].deep_copy());
    }

    this.childrenIds = childrenIds;
    this.contextIds = contextIds;
    this.element = element;
    this.hasChildren = hasChildren;
  }
}

interface InfoModel extends spinal.Model {
  id: string|spinal.Str;
  [key: string]: any;
}

interface SpinalNodeObject<T extends spinal.Model> {
  info: InfoModel;
  element?: T;
  [key: string]: any;
}

interface ICreateNodeInfo {
  type?: string|spinal.Str;
  id?: string|spinal.Str;
  [key: string]: any;
}

type ObjectKeyNode<T extends spinal.Model> = {[nodeId: string]: SpinalNode<T>};

const G_ROOT = typeof window === 'undefined' ? global : window;

/**
 * @type (...args: any[]) => any
 */
type callback = (...args: any[]) => any;

/**
 *  @property {Map<string, Map<any, Callback>>} bindedNode
 *    NodeId => Caller => Callback. All nodes that are bind
 *  @property {Map<String, callback>} binders NodeId => CallBack from bind method.
 *  @property {Map<any, callback>} listeners
 *    caller => callback. List of all listeners on node added
 *  @property {{[nodeId: string]: SpinalNode}} nodes containing all SpinalNode currently loaded
 *  @property {SpinalGraph} graph
 */
class GraphManagerService {
  bindedNode : Map<string, Map<any, callback>>;
  binders : Map<String, spinal.Process>;
  listenersOnNodeAdded : Map<string, callback>;
  listenerOnNodeRemove : Map<string, callback>;
  nodes : ObjectKeyNode<any>;
  graph: SpinalGraph<any>;

  /**
   *Creates an instance of GraphManagerService.
   * @param {number} [viewerEnv] if defined load graph from getModel
   * @memberof GraphManagerService
   */
  constructor(viewerEnv?: number) {
    this.bindedNode = new Map();
    this.binders = new Map();
    this.listenersOnNodeAdded = new Map();
    this.listenerOnNodeRemove = new Map();
    this.nodes = {};
    this.graph = null;
    if (typeof viewerEnv !== 'undefined') {

      (<any>G_ROOT).spinal.spinalSystem.getModel()
        .then(
          (forgeFile: any) => this.setGraphFromForgeFile(forgeFile),
        )
        .catch((e: Error) => console.error(e));
    }
  }

  /**
   * Change the current graph with the one of the forgeFile
   * if there is one create one if note
   * @param {spinal.Model} forgeFile
   * @returns {Promise<String>}
   * @memberof GraphManagerService
   */
  setGraphFromForgeFile(forgeFile: spinal.Model): Promise<String> {

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

    if (this.graph && typeof this.graph.getId === 'function' &&
    this.nodes.hasOwnProperty(this.graph.getId().get())) {
      delete this.nodes[this.graph.getId().get()];
    }
    this.graph = graph;
    this.nodes[this.graph.getId().get()] = this.graph;
    await this.getChildren(this.graph.getId().get(), []);
    return this.graph.getId().get();
  }

  /**
   * Return all loaded Nodes
   * @returns {ObjectKeyNode<any>}
   * @memberof GraphManagerService
   */
  getNodes(): ObjectKeyNode<any> {
    return this.nodes;
  }

  /**
   * Return the information about the node with the given id
   * @template T extends spinal.Model = Eleemnt
   * @param {string} id of the wanted node
   * @returns {SpinalNodeRef<T>}
   * @memberof GraphManagerService
   */
  getNode<T extends spinal.Model>(id: string): SpinalNodeRef<T> {

    if (this.nodes.hasOwnProperty(id)) {
      return this.getInfo(id);
    }

    return undefined;
  }

  /**
   * return the current graph
   * @returns {(SpinalGraph<any>|{})}
   * @memberof GraphManagerService
   */
  getGraph(): SpinalGraph<any>|{} {
    return this.graph || {};
  }

  /**
   * Return the node with the given id
   * @template T extends spinal.Model = Eleemnt
   * @param {string} id of the wanted node
   * @returns {SpinalNode<T>}
   * @memberof GraphManagerService
   */
  getRealNode<T extends spinal.Model>(id: string): SpinalNode<T> {
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
      for (const relationMap of this.nodes[id].children) {
        relationNames.push(...relationMap.keys());
      }
    }
    return relationNames;
  }

  /**
   * Return all children of a node
   * @param {string} id
   * @param {string[]} [relationNames=[]]
   * @returns {Promise<Array<SpinalNodeRef<any>>>}
   * @memberof GraphManagerService
   */
  getChildren(id: string, relationNames: string[] = []): Promise<SpinalNodeRef<any>[]> {
    if (!this.nodes.hasOwnProperty(id)) {
      return Promise.reject(Error(`Node id: ${id} not found`));
    }

    if (relationNames.length === 0) {

      for (const [, relationMap] of this.nodes[id].children) {
        relationNames.push(...relationMap.keys());
      }
    }

    return this.nodes[id].getChildren(relationNames)
      .then((children: SpinalNode<any>[]) => {
        const res: SpinalNodeRef<any>[] = [];
        for (let i = 0; i < children.length; i += 1) {
          this._addNode(children[i]);
          res.push(this.getInfo(children[i].getId().get()));
        }
        return res;
      });
  }

  /**
   * Return the children of the node that are registered in the context
   * @param {string} parentId id of the parent node
   * @param {string} contextId id of the context node
   * @returns {Promise<SpinalNodeRef[]>} The info of the children that were found
   * @memberof GraphManagerService
   */
  async getChildrenInContext(parentId: string, contextId: string): Promise<SpinalNodeRef<any>[]> {
    if (this.nodes.hasOwnProperty(parentId) && this.nodes.hasOwnProperty(contextId)) {
      const children: SpinalNode<any>[] =
        await this.nodes[parentId].getChildrenInContext(this.nodes[contextId]);
      const res = [];

      for (let i = 0; i < children.length; i += 1) {
        this._addNode(children[i]);
        res.push(this.getInfo(children[i].getId().get()));
      }
      return res;
    }
  }

  /**
   * Return the node info aggregated with its childrenIds, contextIds and element
   * @param {string} nodeId
   * @returns {SpinalNodeRef}
   * @memberof GraphManagerService
   */
  getInfo<T extends spinal.Model>(nodeId: string): SpinalNodeRef<T> {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return;
    }
    const node = this.nodes[nodeId];
    const res: SpinalNodeRef<T> = new SpinalNodeRef(
      node.info,
      node.getChildrenIds(),
      node.contextIds,
      node.element,
      node.children.size > 0,
    );
    return res;
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
   * @param {string} caller
   * @param {callback} callback
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  listenOnNodeAdded(caller: string, callback: callback): boolean {
    this.listenersOnNodeAdded.set(caller, callback);
    return this.stopListeningOnNodeAdded.bind(this, caller);
  }

  /**
   * @param {string} caller
   * @param {callback} callback
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  listenOnNodeRemove(caller: string, callback: callback): boolean {
    this.listenerOnNodeRemove.set(caller, callback);
    return this.stopListeningOnNodeRemove.bind(this, caller);
  }

  /**
   * @param {string} caller
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  stopListeningOnNodeAdded(caller: string): boolean {
    return this.listenersOnNodeAdded.delete(caller);
  }

  /**
   * @param {string} caller
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  stopListeningOnNodeRemove(caller: string): boolean {
    return this.listenerOnNodeRemove.delete(caller);
  }

  /**
   */
  /**
   * @param nodeId id of the desired node
   * @param info new info for the node
   * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
   * @memberof GraphManagerService
   */
  modifyNode<T extends spinal.Model>(nodeId: string, info: SpinalNodeRef<T>): boolean {

    if (!this.nodes.hasOwnProperty(nodeId)) {
      return false;
    }

    // TO DO : change the following "mod_attr
    // to a direct "update" of the existing model.
    // This will reduce the creation of model but
    this.nodes[nodeId].mod_attr('info', info);

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
    if (!this.nodes.hasOwnProperty(nodeId) ||
        typeof caller !== 'object' ||
        typeof callback !== 'function') {
      return undefined;
    }

    if (this.bindedNode.has(nodeId)) {
      this.bindedNode.get(nodeId).set(caller, callback);
    } else {
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
   * @param {number} relationName
   * @param {string} relationType
   * @returns
   * @memberof GraphManagerService
   */
  async moveChild(fromId: string, toId: string, childId: string,
                  relationName: string, relationType: string): Promise<boolean> {
    if (!this.nodes.hasOwnProperty(fromId)) {
      return Promise.reject(`fromId: ${fromId} not found`);
    }
    if (!this.nodes.hasOwnProperty(toId)) {
      return Promise.reject(`toId: ${toId} not found`);
    }
    if (!this.nodes.hasOwnProperty(childId)) {
      return Promise.reject(`childId: ${childId} not found`);
    }

    await this.nodes[fromId].removeChild(this.nodes[childId], relationName, relationType);
    await this.nodes[toId].addChild(this.nodes[childId], relationName, relationType);
    return true;
  }

  /**
   * Remoce the child corresponding to childId from the node corresponding to parentId.
   * @param nodeId {String}
   * @param childId {String}
   * @param relationName {String}
   * @param relationType {Number}
   * @param stop
   * @returns {Promise<boolean>}
   */
  async removeChild(nodeId: string, childId: string, relationName: string,
                    relationType: string, stop: boolean = false): Promise<boolean> {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return Promise.reject(Error('nodeId unknown.'));
    }

    if (!this.nodes.hasOwnProperty(childId) && !stop) {
      try {
        await this.getChildren(nodeId, []);
        return this.removeChild(nodeId, childId, relationName, relationType, true);
      } catch (e) {
        console.error(e);
      }
    } if (this.nodes.hasOwnProperty(childId)) {
      for (const callback of this.listenerOnNodeRemove.values()) {
        callback(nodeId);
      }
      return this.nodes[nodeId].removeChild(
          this.nodes[childId], relationName, relationType,
          ).then(() => true);
    }
    return Promise.reject(
        Error('childId unknown. It might already been removed from the parent node'),
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
  addContext(name: string, type: string, elt: spinal.Model): Promise<SpinalContext<any>> {
    const context = new SpinalContext(name, type, elt);
    this.nodes[context.info.id.get()] = context;

    return this.graph.addContext(context);
  }

  /**
   * @param {string} name
   * @returns {SpinalContext}
   * @memberof GraphManagerService
   */
  getContext<T extends spinal.Model>(name: string): SpinalContext<T> {
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
   * Remove the node referenced by id from th graph.
   * @param {string} id
   * @returns {Promise<void>}
   * @memberof GraphManagerService
   */
  removeFromGraph(id: string): Promise<void> {
    if (this.nodes.hasOwnProperty(id)) {
      return this.nodes[id].removeFromGraph();
    }
  }

  /**
   * Create a new node.
   * The node newly created is volatile
   * i.e it won't be store in the filesystem as long it's not added as child to another node
   * @param {ICreateNodeInfo} info information of the node
   * @param {spinal.Model} element element pointed by the node
   * @returns {string} return the child identifier
   * @memberof GraphManagerService
   */
  createNode<T extends spinal.Model>(info: ICreateNodeInfo, element: T): string {
    const node = new SpinalNode(undefined, undefined, element);
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
   * @param {string} relationType
   * @returns {Promise<SpinalNode<any>>}
   * @memberof GraphManagerService
   */
  addChildInContext(parentId: string, childId: string, contextId: string,
                    relationName: string, relationType: string): Promise<SpinalNode<any>> {
    if (this.nodes.hasOwnProperty(parentId) &&
      this.nodes.hasOwnProperty(childId) &&
      this.nodes.hasOwnProperty(contextId)) {
      const child = this.nodes[childId];
      const context = this.nodes[contextId];
      return this.nodes[parentId].addChildInContext(child, relationName, relationType, context);
    }
      // TODO option parser
    return Promise.reject(Error(`Node id ${parentId} not found`));
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
  async addChild(parentId: string, childId: string, relationName: string, relationType: string)
    : Promise<boolean> {
    if (!this.nodes.hasOwnProperty(parentId) || !this.nodes.hasOwnProperty(childId)) {
      return Promise.resolve(false);
    }
    await this.nodes[parentId].addChild(this.nodes[childId], relationName, relationType);
    return true;
  }

  /**
   *
   * Create a node and add it as child to the parentId.
   * @template T
   * @param {string} parentId id of the parent node
   * @param {SpinalNodeObject<T>} node must have an attr. 'info' and can have an attr. 'element'
   * @param {string} relationName
   * @param {string} relationType
   * @returns {Promise<boolean>} return true if the node was created added as child
   * to the node corresponding to the parentId successfully
   * @memberof GraphManagerService
   */
  addChildAndCreateNode<T extends spinal.Model>(
      parentId: string, node: SpinalNodeObject<T>,
      relationName: string, relationType: string): Promise<boolean> {
    if (!node.hasOwnProperty('info')) {
      return Promise.reject(false);
    }

    const nodeId: string = this.createNode(node.info, node.element);
    return this.addChild(parentId, nodeId, relationName, relationType);
  }

  /**
   * add a node to the set of node
   * @private
   * @param {SpinalNode} node
   * @memberof GraphManagerService
   */
  private _addNode<T extends spinal.Model>(node: SpinalNode<T>) {
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
    this.binders.set(nodeId,
                     this.nodes[nodeId].bind(this._bindFunc.bind(this, nodeId)));
  }

  /**
   * call the callback method of all the binder of the node
   * @private
   * @param {string} nodeId
   * @memberof GraphManagerService
   */
  private _bindFunc(nodeId: string): void {
    if (this.bindedNode.has(nodeId)) {

      for (const callback of this.bindedNode.get(nodeId).values()) {
        callback(this.nodes[nodeId]);
      }
    }
  }

  /**
   *
   *
   * @private
   * @param {string} nodeId
   * @param {*} binder
   * @returns {boolean}
   * @memberof GraphManagerService
   */
  private _unBind(nodeId: string, binder: any) : boolean {

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
}

export default GraphManagerService;
export { GraphManagerService };
