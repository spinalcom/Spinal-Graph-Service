import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-model-graph';
import * as q from 'q';
import type { SpinalNodeRef } from './interfaces/SpinalNodeRef';
import type { SpinalNodeObject } from './interfaces/SpinalNodeObject';
import { type SpinalNodeFindPredicateFunc } from './interfaces/SpinalNodeFindPredicateFunc';
/**
 * @type (node: string | SpinalNodeRef) => any
 */
declare type callback = (node: string | SpinalNodeRef) => any;
/**
 *  @property {Map<string, Map<any, Callback>>} bindedNode
 *    NodeId => Caller => Callback. All nodes that are bind
 *  @property {Map<String, callback>} binders NodeId => CallBack from bind method.
 *  @property {Map<any, callback>} listeners
 *    caller => callback. List of all listeners on node added
 *  @property {{[nodeId: string]: SpinalNode<any>}} nodes containing all SpinalNode currently loaded
 *  @property {SpinalGraph<any>} graph
 */
declare class GraphManagerService {
    bindedNode: Map<string, Map<any, callback>>;
    binders: Map<String, spinal.Process>;
    listenersOnNodeAdded: Map<any, callback>;
    listenerOnNodeRemove: Map<any, callback>;
    initialized: Promise<boolean>;
    nodes: {
        [nodeId: string]: SpinalNode<any>;
    };
    nodesInfo: {
        [nodeId: string]: SpinalNodeRef;
    };
    graph: SpinalGraph<any>;
    initProm: q.Deferred<SpinalGraph<any>>;
    /**
     * @param viewerEnv {boolean} if defined load graph from getModel
     */
    constructor(viewerEnv?: number);
    /**
     * Change the current graph with the one of the forgeFile if there is one create one if note
     * @param {*} forgeFile
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
     * @returns {q.Promise<SpinalGraph<any>>}
     * @memberof GraphManagerService
     */
    waitForInitialization(): q.Promise<SpinalGraph<any>>;
    /**
     * Find a node with it id
     * @param id
     * @param stop
     */
    findNode(id: string, stop?: boolean): Promise<SpinalNodeRef>;
    haveChildId(nodeId: string, searchId: string): boolean;
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
    findNodes(startId: string, relationNames: string[], predicate: (node: any) => boolean): Promise<SpinalNode<any>[]>;
    /**
     * Find all nodes with the type "nodeType"
     *  @param startId {String} starting point of the search if note found the
     * search will start at the beginning of the graph
     * @param relationNames {String[]} the relations that will be follow
     * during the search if empty follow all relations
     * @param nodeType type of node to search
     * @return all nodes with the type "nodeType"
     */
    findNodesByType(startId: string, relationNames: string[], nodeType: string): Promise<any>;
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
    browseAnClassifyByType(startId: string, relationNames: string[]): Promise<any>;
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
    findInContext(startId: string, contextId: string, predicate?: SpinalNodeFindPredicateFunc): Promise<any>;
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
    findInContextByType(startId: string, contextId: string, nodeType: string): Promise<any>;
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
    browseAndClassifyByTypeInContext(startId: string, contextId: string): Promise<any>;
    generateQRcode(nodeId: string): string;
    /**
     * Return all loaded Nodes
     * @returns {{[nodeId: string]: SpinalNode<any>}}
     * @memberof GraphManagerService
     */
    getNodes(): {
        [nodeId: string]: SpinalNode<any>;
    };
    /**
     * Return all loaded Nodes
     * @returns {{[nodeId: string]: SpinalNodeRef}}
     * @memberof GraphManagerService
     */
    getNodesInfo(): {
        [nodeId: string]: SpinalNodeRef;
    };
    /**
     * Return the information about the node with the given id
     * @param id of the wanted node
     * @returns {SpinalNodeRef | undefined}
     */
    getNode(id: string): SpinalNodeRef;
    /**
     * Return the information about the node with the given id
     * @param id of the wanted node
     * @returns {SpinalNodeRef | undefined}
     */
    getNodeAsync(id: string): Promise<SpinalNodeRef>;
    /**
     * return the current graph
     * @returns {undefined|SpinalNode<any>}
     */
    getGraph(): SpinalGraph<any>;
    /**
     * Return the node with the given id
     * @param {string} id of the wanted node
     * @returns {SpinalNode<any>}
     * @memberof GraphManagerService
     */
    getRealNode(id: string): SpinalNode<any>;
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
     * @returns {Promise<SpinalNodeRef[]>}
     * @memberof GraphManagerService
     */
    getChildren(id: string, relationNames?: string[]): Promise<SpinalNodeRef[]>;
    /**
     * Return the children of the node that are registered in the context
     * @param {string} parentId id of the parent node
     * @param {string} contextId id of the context node
     * @returns {Promise<SpinalNodeRef[]>} The info of the children that were found
     * @memberof GraphManagerService
     */
    getChildrenInContext(parentId: string, contextId: string): Promise<SpinalNodeRef[]>;
    /**
     * Return the node info aggregated with its childrenIds, contextIds and element
     * @param {string} nodeId
     * @returns {SpinalNodeRef}
     * @memberof GraphManagerService
     */
    getInfo(nodeId: string): SpinalNodeRef;
    /**
     * Update the node info aggregated with
     * its childrenIds, contextIds and element
     * @param {string} nodeId
     * @returns {SpinalNodeRef}
     * @memberof GraphManagerService
     */
    setInfo(nodeId: string): void;
    /**
     * @param {string} nodeId
     * @returns {string[]}
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
     * @param {any} caller
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
     * @param nodeId id of the desired node
     * @param info new info for the node
     * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
     * @memberof GraphManagerService
     */
    modifyNode(nodeId: string, info: SpinalNodeRef): boolean;
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
     * @param {string} relationName
     * @param {string} relationType
     * @returns
     * @memberof GraphManagerService
     */
    moveChild(fromId: string, toId: string, childId: string, relationName: string, relationType: string): Promise<boolean>;
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
    moveChildInContext(fromId: string, toId: string, childId: string, contextId: string, relationName: string, relationType: string): Promise<boolean>;
    /**
     * Remove the child corresponding to childId from the node corresponding to parentId.
     * @param nodeId {String}
     * @param childId {String}
     * @param relationName {String}
     * @param relationType {string}
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
    addContext(name: string, type?: string, elt?: spinal.Model): Promise<SpinalContext<any>>;
    /**
     * @param {string} name
     * @returns {SpinalContext}
     * @memberof GraphManagerService
     */
    getContext(name: string): SpinalContext<any>;
    /**
     * Return all context with type
     * @param type
     */
    getContextWithType(type: string): any[];
    /**
     * Retr
     * @param type
     */
    getNodeByType(type: string): any[];
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
     * @param {{[key: string]: any}} info information of the node
     * @param {spinal.Model} [element] element pointed by the node
     * @returns {string} return the child identifier
     * @memberof GraphManagerService
     */
    createNode(info: {
        [key: string]: any;
    }, element?: spinal.Model): string;
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
     * @param {string} parentId id of the parent node
     * @param {SpinalNodeObject} node must have an attr. 'info' and can have an attr. 'element'
     * @param {string} relationName
     * @param {number} relationType
     * @returns {Promise<boolean>} return true if the node was created added as child
     * to the node corresponding to the parentId successfully
     * @memberof GraphManagerService
     */
    addChildAndCreateNode(parentId: string, node: SpinalNodeObject, relationName: string, relationType: string): Promise<boolean>;
    isChild(parentId: string, childId: string, linkRelationName: string[]): Promise<boolean>;
    /**
     * add a node to the set of node
     * @param {SpinalNode<any>} node
     * @memberof GraphManagerService
     */
    _addNode(node: SpinalNode<any>): void;
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
     * @private
     * @param {string} nodeId
     * @param {*} binder
     * @returns {boolean}
     * @memberof GraphManagerService
     */
    private _unBind;
    hasChildInContext(nodeId: string, contextId: string): boolean;
    /**
     * Return all parents for the relation names no matter the type of relation
     * @param {string} nodeId The node id whose parents are recovered
     * @param {String[]} [relationNames=[]] Array containing the relation names of the desired parents
     * @returns {Promise<Array<SpinalNode<any>>>} Promise containing the parents that were found
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     */
    getParents(nodeId: string, relationNames: string | string[]): Promise<any>;
}
export default GraphManagerService;
export { GraphManagerService };
