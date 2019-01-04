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

import {
  SpinalContext,
  SpinalGraph,
  SpinalNode
} from "spinal-model-graph";

const G_root = typeof window == "undefined" ? global : window;
/**
 *  @property {Map<String, Map<Object, function>>} bindedNode NodeId => Caller => Callback. All nodes that are bind
 *  @property {Map<String, function>} binders NodeId => CallBack from bind method.
 *  @property {Map<Object, function>} listeners caller => callback. List of all listeners on node added
 *  @property {Object} nodes containing all SpinalNode currently loaded
 *  @property {SpinalGraph} graph
 */
class GraphManagerService {

  /**
   * @param viewerEnv {boolean} if defined load graph from getModel
   */
  constructor( viewerEnv ) {
    this.bindedNode = new Map();
    this.binders = new Map();
    this.listenersOnNodeAdded = new Map();
    this.listenerOnNodeRemove = new Map();
    this.nodes = {};
    this.graph = {};
    if (typeof viewerEnv !== "undefined") {

      G_root.spinal.spinalSystem.getModel()
        .then(
          forgeFile => this.setGraphFromForgeFile( forgeFile )
        )
        .catch( e => console.error( e ) );
    }
  }

  /**
   * Change the current graph with the one of the forgeFile if there is one create one if note
   * @param forgeFile
   * @returns {Promise<String>} the id of the graph
   */
  setGraphFromForgeFile( forgeFile ) {

    if (!forgeFile.hasOwnProperty( 'graph' )) {
      forgeFile.add_attr( {
        graph: new SpinalGraph()
      } );
    }
    return this.setGraph( forgeFile.graph );

  }

  /**
   *
   * @param graph {SpinalGraph}
   * @returns {Promise<String>} the id of the graph
   */
  setGraph( graph ) {

    if (typeof this.graph.getId === "function" && this.nodes.hasOwnProperty( this.graph.getId().get() )) {
      delete this.nodes[this.graph.getId().get()];
    }
    this.graph = graph;
    this.nodes[this.graph.getId().get()] = this.graph;
    return this.getChildren( this.graph.getId().get(), [] )
      .then( () => {return this.graph.getId().get();} );

  }

  /**
   * Return all loaded Nodes
   */
  getNodes() {
    return this.nodes;
  }

  /**
   * Return the information about the node with the given id
   * @param id of the wanted node
   * @returns {Object | undefined}
   */
  getNode( id ) {

    if (this.nodes.hasOwnProperty( id )) {
      return this.getInfo( id );
    }

    return undefined;
  }

  /**
   * return the current graph
   * @returns {{}|SpinalGraph}
   */
  getGraph() {
    return this.graph;
  }

  /**
   * Return the node with the given id
   * @param id of the wanted node
   * @returns {SpinalNode | undefined}
   */
  getRealNode( id ) {
    if (this.nodes.hasOwnProperty( id )) {
      return this.nodes[id];
    }

    return undefined;
  }

  /**
   * Return all the relation names of the node coresponding to id
   * @param id {String} of the node
   * @returns {Array<String>}
   */
  getRelationNames( id ) {
    const relationNames = [];
    if (this.nodes.hasOwnProperty( id )) {
      for (let relationMap of this.nodes[id].children) {
        relationNames.push( ...relationMap.keys() );
      }
    }
    return relationNames;
  }

  /**
   * Return all children of a node
   * @param id
   * @param relationNames {Array}
   * @returns {Promise<Array<SpinalNodeRef>>}
   */
  getChildren( id, relationNames = [] ) {
    if (!this.nodes.hasOwnProperty( id )) {
      return Promise.reject( Error( "Node id: " + id + " not found" ) );
    }

    if (relationNames.length === 0) {

      for (let relationMap of this.nodes[id].children) {
        relationNames.push( ...relationMap.keys() );
      }
    }

    return this.nodes[id].getChildren( relationNames )
      .then( ( children ) => {
        const res = [];
        for (let i = 0; i < children.length; i++) {
          this._addNode( children[i] );
          res.push( this.getInfo( children[i].getId().get() ) );
        }
        return res;
      } );
  }


  /**
   * Return the children of the node that are registered in the context
   * @param parentId {String} id of the parent node
   * @param contextId {String} id of the context node
   * @returns {Promise<Array<Object>>} The info of the children that were found
   */
  getChildrenInContext( parentId, contextId ) {
    if (this.nodes.hasOwnProperty( parentId ) && this.nodes.hasOwnProperty( contextId )) {
      return this.nodes[parentId].getChildrenInContext( this.nodes[contextId] ).then( children => {
        const res = [];

        for (let i = 0; i < children.length; i++) {
          this._addNode( children[i] );
          res.push( this.getInfo( children[i].getId().get() ) );
        }

        return res;
      } );
    }
  }

  /**
   * Return the node info aggregated with its childrenIds, contextIds and element
   * @param nodeId
   * @returns {*}
   */
  getInfo( nodeId ) {

    if (!this.nodes.hasOwnProperty( nodeId )) {
      return;
    }
    const node = this.nodes[nodeId];
    const res = node.info.deep_copy();
    res['childrenIds'] = node.getChildrenIds();
    res['contextIds'] = node.contextIds;
    res['element'] = node.element;
    res['hasChildren'] = node.children.size > 0;
    return res;
  }

  getChildrenIds( nodeId ) {
    if (this.nodes.hasOwnProperty( nodeId )) {
      return this.nodes[nodeId].getChildrenIds();
    }
  }

  listenOnNodeAdded( caller, callback ) {
    this.listenersOnNodeAdded.set( caller, callback );
    return this.stopListeningOnNodeAdded.bind( this, caller );
  }

  listenOnNodeRemove( caller, callback ) {
    this.listenerOnNodeRemove.set( caller, callback );
    return this.stopListeningOnNodeRemove.bind( this, caller );
  }

  stopListeningOnNodeAdded( caller ) {
    return this.listenersOnNodeAdded.delete( caller );
  }

  stopListeningOnNodeRemove( caller ) {
    return this.listenerOnNodeRemove.delete( caller );
  }
  /**
   * @param nodeId id of the desired node
   * @param info new info for the node
   * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
   */
  modifyNode( nodeId, info ) {

    if (!this.nodes.hasOwnProperty( nodeId )) {
      return false;
    }

    // TO DO : change the following "mod_attr
    // to a direct "update" of the existing model.
    // This will reduce the creation of model but
    this.nodes[nodeId].mod_attr( 'info', info );

    return true;
  }

  /**
   * Bind a node and return a function to unbind the same node
   * @param nodeId {String}
   * @param caller {Object} usually 'this'
   * @param callback {function} to be call every change of the node
   * @returns {undefined | function} return a function to allow to node unbinding if the node corresponding to nodeId exist undefined and caller is an object and callback is a function otherwise
   */
  bindNode( nodeId, caller, callback ) {
    if (!this.nodes.hasOwnProperty( nodeId ) || typeof caller !== 'object' || typeof callback !== 'function') {
      return undefined;
    }

    if (this.bindedNode.has( nodeId )) {
      this.bindedNode.get( nodeId ).set( caller, callback );
    } else {
      this.bindedNode.set( nodeId, new Map( [
        [caller, callback]
      ] ) );
      this._bindNode( nodeId );
    }

    return this._unBind.bind( this, nodeId, caller );
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
  removeChild( nodeId, childId, relationName, relationType, stop = false ) {

    if (!this.nodes.hasOwnProperty( nodeId )) {
      return Promise.reject( Error( "nodeId unknown." ) );
    }

    if (!this.nodes.hasOwnProperty( childId ) && !stop) {
      return this.getChildren( nodeId, [] )
        .then( () => this.removeChild( nodeId, childId, relationName, relationType, true ) )
        .catch( e => console.error( e ) );
    } else if (this.nodes.hasOwnProperty( childId )) {
      for (let callback of this.listenerOnNodeRemove.values()) {
        callback( nodeId );
      }
      return this.nodes[nodeId].removeChild( this.nodes[childId], relationName, relationType );
    } else {
      return Promise.reject( Error( "childId unknown. It might already been removed from the parent node" ) );
    }
  }

  /**
   * Add a context to the graph
   * @param name {String} of the context
   * @param type {String} of the context
   * @param elt {Model} element of the context if needed
   * @returns {Promise<SpinalContext>}
   */
  addContext( name, type, elt ) {
    const context = new SpinalContext( name, type, elt );
    this.nodes[context.info.id.get()] = context;
  
    return this.graph.addContext( context );
  }

  /**
   * @param name
   * @returns {SpinalContext|undefined}
   */
  getContext( name ) {
    for (let key in this.nodes) {
      if (this.nodes.hasOwnProperty( key )) {
        const node = this.nodes[key];
        if (node instanceof SpinalContext && node.getName().get() === name) {
          return node;
        }
      }
    }

  }

  /**
   * Remove the node referenced by id from th graph.
   * @param id
   */
  removeFromGraph( id ) {
    if (this.nodes.hasOwnProperty( id )) {
      this.nodes[id].removeFromGraph();
    }
  }

  /**
   * Create a new node.
   * The node newly created is volatile i.e it won't be store in the filesystem as long it's not added as child to another node
   * @param info {Object} information of the node
   * @param element {Model} element pointed by the node
   * @returns {String} return the child identifier
   */
  createNode( info, element ) {
    const node = new SpinalNode( undefined, undefined, element );
    if (!info.hasOwnProperty( 'type' )) {
      info['type'] = node.getType().get();
    }
    const nodeId = node.info.id.get();
    info['id'] = nodeId;
    node.mod_attr( 'info', info );
    this._addNode( node );
    return nodeId;
  }

  addChildInContext( parentId, childId, contextId, relationName, relationType ) {
    if (this.nodes.hasOwnProperty( parentId ) && this.nodes.hasOwnProperty( childId ) && this.nodes.hasOwnProperty( contextId )) {
      const child = this.nodes[childId];
      const context = this.nodes[contextId];
      return this.nodes[parentId].addChildInContext( child, relationName, relationType, context );
    }
    //TODO option parser
    return Promise.reject( Error( 'Node id' + parentId + ' not found' ) );
  }

  /**
   * Add the node corresponding to childId as child to the node corresponding to the parentId
   * @param parentId {String}
   * @param childId {String}
   * @param relationName {String}
   * @param relationType {Number}
   * @returns {Promise<boolean>} return true if the child could be added false otherwise.
   */
  addChild( parentId, childId, relationName, relationType ) {

    if (!this.nodes.hasOwnProperty( parentId ) || !this.nodes.hasOwnProperty( childId )) {
      return Promise.resolve( false );
    }

    return this.nodes[parentId].addChild( this.nodes[childId], relationName, relationType ).then( () => {
      return true;
    } );
  }

  /**
   * Create a node and add it as child to the parentId.
   * @param parentId {string} id of the parent node
   * @param node {Object} must have an attribute 'info' and can have an attribute 'element'
   * @param relationName {string}
   * @param relationType {Number}
   * @returns {boolean} return true if the node was created added as child to the node corresponding to the parentId successfully
   */
  addChildAndCreateNode( parentId, node, relationName, relationType ) {
    if (!node.hasOwnProperty( 'info' )) {
      return false;
    }

    const nodeId = this.createNode( node.info, node.element );

    return this.addChild( parentId, nodeId, relationName, relationType );
  }

  /***
   * add a node to the set of node
   * @param node
   * @private
   */
  _addNode( node ) {
    if (!this.nodes.hasOwnProperty( node.getId().get() )) {
      this.nodes[node.info.id.get()] = node;

      for (let callback of this.listenersOnNodeAdded.values()) {
        callback( node.info.id.get() );
      }
    }
  }

  /**
   * Check if all children from a node are loaded
   * @param nodeId id of the desired node
   * @returns {boolean} return true if all children of the node is loaded false otherwise
   * @private
   */
  _areAllChildrenLoaded( nodeId ) {

    if (!this.nodes.hasOwnProperty( nodeId )) {
      return false;
    }

    const childrenIds = this.nodes[nodeId].getChildrenIds();
    let hasAllChild = true;

    for (let i = 0; i < childrenIds.length && hasAllChild; i++) {
      hasAllChild = this.nodes.hasOwnProperty( childrenIds[i] );
    }

    return hasAllChild;
  }

  /**
   * Bind the node if needed and save the callback function
   * @param nodeId
   * @private
   */
  _bindNode( nodeId ) {
    if (this.binders.has( nodeId ) || !this.nodes.hasOwnProperty( nodeId )) {
      return;
    }
    this.binders.set( nodeId, this.nodes[nodeId].bind( this._bindFunc.bind( this, nodeId ) ) );
  }

  /**
   * call the callback method of all the binder of the node
   * @param nodeId
   * @private
   */
  _bindFunc( nodeId ) {
    if (this.bindedNode.has( nodeId )) {

      for (let callback of this.bindedNode.get( nodeId ).values()) {
        callback( this.nodes[nodeId] );
      }
    }
  }

  /**
   * unbind a node
   * @param nodeId {String}
   * @param binder {Object}
   * @returns {boolean}
   * @private
   */
  _unBind( nodeId, binder ) {

    if (!this.bindedNode.has( nodeId )) {
      return false;
    }

    const res = this.bindedNode.get( nodeId ).delete( binder );

    if (this.bindedNode.get( nodeId ).size === 0) {
      this.nodes[nodeId].unbind( this.binders.get( nodeId ) );
      this.binders.delete( nodeId );
      this.bindedNode.delete( nodeId );
    }

    return res;
  }
}

export default GraphManagerService;
