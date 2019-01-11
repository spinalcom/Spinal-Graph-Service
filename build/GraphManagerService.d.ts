import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-model-graph';
import { SpinalNodePointer } from 'spinal-model-graph/build/SpinalNodePointer';
import { SpinalSet } from 'spinal-model-graph/build/SpinalSet';
import { Model } from 'spinal-core-connectorjs_type';
/**
 * @class SpinalNodeRef
 * @extends {Model}
 * @template T
 */
declare class SpinalNodeRef<T extends spinal.Model> extends Model {
    childrenIds: string[];
    contextIds: SpinalSet;
    element: SpinalNodePointer<T>;
    hasChildren: boolean;
    constructor(model: spinal.Model, childrenIds: string[], contextIds: SpinalSet, element: SpinalNodePointer<T>, hasChildren: boolean);
}
interface InfoModel extends spinal.Model {
    id: string | spinal.Str;
    [key: string]: any;
}
interface SpinalNodeObject<T extends spinal.Model> {
    info: InfoModel;
    element?: T;
    [key: string]: any;
}
interface ICreateNodeInfo {
    type?: string | spinal.Str;
    id?: string | spinal.Str;
    [key: string]: any;
}
declare type ObjectKeyNode<T extends spinal.Model> = {
    [nodeId: string]: SpinalNode<T>;
};
/**
 * @type (...args: any[]) => any
 */
declare type callback = (...args: any[]) => any;
/**
 *  @property {Map<string, Map<any, callback>>} bindedNode
 *    NodeId => Caller => Callback. All nodes that are bind
 *  @property {Map<String, spinal.Process>} binders NodeId => CallBack from bind method.
 *  @property {Map<any, callback>} listenersOnNodeAdded
 *  @property {Map<any, callback>} listenerOnNodeRemove
 *  @property {ObjectKeyNode<any>} nodes containing all SpinalNode currently loaded
 *  @property {SpinalGraph<any>} graph
 */
declare class GraphManagerService {
    bindedNode: Map<string, Map<any, callback>>;
    binders: Map<String, spinal.Process>;
    listenersOnNodeAdded: Map<any, callback>;
    listenerOnNodeRemove: Map<any, callback>;
    nodes: ObjectKeyNode<any>;
    graph: SpinalGraph<any>;
    /**
     *Creates an instance of GraphManagerService.
     * @param {number} [viewerEnv] if defined load graph from getModel
     * @memberof GraphManagerService
     */
    constructor(viewerEnv?: number);
    /**
     * Change the current graph with the one of the forgeFile
     * if there is one create one if note
     * @param {spinal.Model} forgeFile
     * @returns {Promise<String>}
     * @memberof GraphManagerService
     */
    setGraphFromForgeFile(forgeFile: spinal.Model): Promise<String>;
    /**
     * @param {SpinalGraph<any>} graph
     * @returns {Promise<String>} the id of the graph
     * @memberof GraphManagerService
     */
    setGraph(graph: SpinalGraph<any>): Promise<String>;
    /**
     * Return all loaded Nodes
     * @returns {ObjectKeyNode<any>}
     * @memberof GraphManagerService
     */
    getNodes(): ObjectKeyNode<any>;
    /**
     * Return the information about the node with the given id
     * @template T extends spinal.Model = Eleemnt
     * @param {string} id of the wanted node
     * @returns {SpinalNodeRef<T>}
     * @memberof GraphManagerService
     */
    getNode<T extends spinal.Model>(id: string): SpinalNodeRef<T>;
    /**
     * return the current graph
     * @returns {(SpinalGraph<any>|{})}
     * @memberof GraphManagerService
     */
    getGraph(): SpinalGraph<any> | {};
    /**
     * Return the node with the given id
     * @template T extends spinal.Model = Eleemnt
     * @param {string} id of the wanted node
     * @returns {SpinalNode<T>}
     * @memberof GraphManagerService
     */
    getRealNode<T extends spinal.Model>(id: string): SpinalNode<T>;
    /**
     * Return all the relation names of the node coresponding to id
     * @param {string} id of the node
     * @returns {string[]}
     * @memberof GraphManagerService
     */
    getRelationNames(id: string): string[];
    /**
     * Return all children of a node
     * @param {string} id
     * @param {string[]} [relationNames=[]]
     * @returns {Promise<Array<SpinalNodeRef<any>>>}
     * @memberof GraphManagerService
     */
    getChildren(id: string, relationNames?: string[]): Promise<SpinalNodeRef<any>[]>;
    /**
     * Return the children of the node that are registered in the context
     * @param {string} parentId id of the parent node
     * @param {string} contextId id of the context node
     * @returns {Promise<SpinalNodeRef[]>} The info of the children that were found
     * @memberof GraphManagerService
     */
    getChildrenInContext(parentId: string, contextId: string): Promise<SpinalNodeRef<any>[]>;
    /**
     * Return the node info aggregated with its childrenIds, contextIds and element
     * @param {string} nodeId
     * @returns {SpinalNodeRef}
     * @memberof GraphManagerService
     */
    getInfo<T extends spinal.Model>(nodeId: string): SpinalNodeRef<T>;
    /**
     * @param {string} nodeId
     * @returns {Array<string>}
     * @memberof GraphManagerService
     */
    getChildrenIds(nodeId: string): string[];
    /**
     * @param {any} caller
     * @param {callback} callback
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    listenOnNodeAdded(caller: any, callback: callback): boolean;
    /**
     * @param {string} caller
     * @param {callback} callback
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    listenOnNodeRemove(caller: any, callback: callback): boolean;
    /**
     * @param {string} caller
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    stopListeningOnNodeAdded(caller: any): boolean;
    /**
     * @param {string} caller
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    stopListeningOnNodeRemove(caller: any): boolean;
    /**
     */
    /**
     * @param nodeId id of the desired node
     * @param info new info for the node
     * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
     * @memberof GraphManagerService
     */
    modifyNode<T extends spinal.Model>(nodeId: string, info: SpinalNodeRef<T>): boolean;
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
    bindNode(nodeId: string, caller: any, callback: callback): Function;
    /**
     * @param {string} fromId
     * @param {string} toId
     * @param {string} childId
     * @param {number} relationName
     * @param {string} relationType
     * @returns
     * @memberof GraphManagerService
     */
    moveChild(fromId: string, toId: string, childId: string, relationName: string, relationType: string): Promise<boolean>;
    /**
     * Remoce the child corresponding to childId from the node corresponding to parentId.
     * @param nodeId {String}
     * @param childId {String}
     * @param relationName {String}
     * @param relationType {Number}
     * @param stop
     * @returns {Promise<boolean>}
     */
    removeChild(nodeId: string, childId: string, relationName: string, relationType: string, stop?: boolean): Promise<boolean>;
    /**
     * Add a context to the graph
     * @param {string} name of the context
     * @param {string} type of the context
     * @param {spinal.Model} elt element of the context if needed
     * @returns {Promise<SpinalContext>}
     * @memberof GraphManagerService
     */
    addContext(name: string, type: string, elt: spinal.Model): Promise<SpinalContext<any>>;
    /**
     * @param {string} name
     * @returns {SpinalContext}
     * @memberof GraphManagerService
     */
    getContext<T extends spinal.Model>(name: string): SpinalContext<T>;
    /**
     * Remove the node referenced by id from th graph.
     * @param {string} id
     * @returns {Promise<void>}
     * @memberof GraphManagerService
     */
    removeFromGraph(id: string): Promise<void>;
    /**
     * Create a new node.
     * The node newly created is volatile
     * i.e it won't be store in the filesystem as long it's not added as child to another node
     * @param {ICreateNodeInfo} info information of the node
     * @param {spinal.Model} element element pointed by the node
     * @returns {string} return the child identifier
     * @memberof GraphManagerService
     */
    createNode<T extends spinal.Model>(info: ICreateNodeInfo, element: T): string;
    /**
     * @param {string} parentId
     * @param {string} childId
     * @param {string} contextId
     * @param {string} relationName
     * @param {string} relationType
     * @returns {Promise<SpinalNode<any>>}
     * @memberof GraphManagerService
     */
    addChildInContext(parentId: string, childId: string, contextId: string, relationName: string, relationType: string): Promise<SpinalNode<any>>;
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
    addChild(parentId: string, childId: string, relationName: string, relationType: string): Promise<boolean>;
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
    addChildAndCreateNode<T extends spinal.Model>(parentId: string, node: SpinalNodeObject<T>, relationName: string, relationType: string): Promise<boolean>;
    /**
     * add a node to the set of node
     * @private
     * @param {SpinalNode} node
     * @memberof GraphManagerService
     */
    private _addNode;
    /**
     * Check if all children from a node are loaded
     * @private
     * @param {string} nodeId id of the desired node
     * @returns {boolean} return true if all children of the node is loaded false otherwise
     * @memberof GraphManagerService
     */
    private _areAllChildrenLoaded;
    /**
     * Bind the node if needed and save the callback function
     * @private
     * @param {string} nodeId
     * @returns {void}
     * @memberof GraphManagerService
     */
    private _bindNode;
    /**
     * call the callback method of all the binder of the node
     * @private
     * @param {string} nodeId
     * @memberof GraphManagerService
     */
    private _bindFunc;
    /**
     *
     *
     * @private
     * @param {string} nodeId
     * @param {*} binder
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    private _unBind;
}
export default GraphManagerService;
export { GraphManagerService };
