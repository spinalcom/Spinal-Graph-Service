import {
  SpinalContext,
  SpinalGraph,
  SpinalNode
} from "spinal-model-graph";

const G_root = typeof window == "undefined" ? global : window;

/**
 *  @param bindedNode {Map<String, Map<Object, function>>} NodeId => Caller => Callback. All nodes that are bind
 *  @param binders {Map<String, function>} NodeId => CallBack from bind method.
 *  @param listeners {Map<Object, function>} caller => callback. List of all listeners on node added
 *  @param nodes {Object} containing all SpinalNode currently loaded
 *  @param graph {SpinalGraph}
 */
class GraphManagerService {

  /**
   * @param viewerEnv if defined load graph from getModel
   */
  constructor( viewerEnv ) {
    this.bindedNode = new Map();
    this.binders = new Map();
    this.listeners = new Map();
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
   * @returns {*}
   */
  setGraphFromForgeFile( forgeFile ) {

    if (!forgeFile.hasOwnProperty( 'graph' )) {
      forgeFile.add_attr( {
        graph: new SpinalGraph()
      } );
    }
    this.setGraph( forgeFile.graph );

  }

  setGraph( graph ) {

    if (typeof this.graph.getId === "function" && this.nodes.hasOwnProperty( this.graph.getId().get() )) {
      delete this.nodes[this.graph.getId().get()];
    }
    this.graph = graph;
    this.nodes[this.graph.getId().get()] = this.graph;
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
   * @returns {{}|*}
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
   * Return all children of a node
   * @param id
   * @param relationNames {Array}
   * @returns Promise<Array<SpinalNode>>
   */
  getChildren( id, relationNames ) {
    if (!this.nodes.hasOwnProperty( id )) {
      return Promise.reject( Error( "Node id: " + id + " not found" ) );
    }
    if (this.nodes[id] instanceof SpinalContext) {
      return this.nodes[id].getChildrenInContext().then( children => {

          const res = [];
          for (let i = 0; i < children.length; i++) {
            this._addNode( children[i] );
            res.push( this.getInfo( children[i].getId().get() ) );
          }
          return res;
        }
      );
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

  getInfo( nodeId ) {

    if (!this.nodes.hasOwnProperty( nodeId )) {
      return;
    }
    const res = {};
    const node = this.nodes[nodeId];
    res['info'] = node.info;
    res['info']["childrenIds"] = node.getChildrenIds();
    res['info']['contextIds'] = node.contextIds;
    res['info']['element'] = node.element;
    return res['info'];
  }

  listenOnNodeAdded( caller, callback ) {
    this.listeners.set( caller, callback );
    return this.stopListening.bind( this, caller );
  }

  stopListening( caller ) {
    return this.listeners.delete( caller );
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
      this.bindedNode.set( nodeId, new Map( [[caller, callback]] ) );
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
   * @returns Promise<boolean>
   */
  removeChild( nodeId, childId, relationName, relationType, stop = false ) {

    if (!this.nodes.hasOwnProperty( nodeId )) {
      return Promise.reject( Error( "nodeId unknown." ) );
    }

    if (this.nodes.hasOwnProperty( nodeId )) {
      if (!this.nodes.hasOwnProperty( childId ) && !stop) {
        return this.getChildren( nodeId )
          .then( () => this.removeChild( nodeId, childId, relationName, relationType, true ) )
          .catch( e => console.error( e ) );
      } else if (this.nodes.hasOwnProperty( childId )) {
        this.nodes[nodeId].removeChild( this.nodes[childId], relationName, relationType );
        return Promise.resolve( true );
      } else {
        return Promise.reject( Error( "childId unknown. It might already been removed from the parent node" ) );
      }
    }

  }

  /**
   * Add a context to the graph
   * @param context
   * @returns {*|Promise<boolean>}
   */
  addContext( name, type, elt ) {

    const context = new SpinalContext( name, type, elt );
    this.nodes[context.info.id.get()] = context;
    this.graph.addContext( context );
    return context;
  }

  /**
   *
   * @param name
   * @returns {*}
   */
  getContext( name ) {
    for (let key in this.nodes) {
      const node = this.nodes[key];
      if (node instanceof SpinalContext && node.getName().get() === name) {
        return node;
      }
      return;
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
    const node = new SpinalNode();
    if (!info.hasOwnProperty( 'type' )) {
      info['type'] = node.getType().get();
    }
    const nodeId = node.info.id.get();
    info['id'] = nodeId;
    node.mod_attr( 'info', info );
    node.element.ptr.set( element );
    this.nodes[nodeId] = node;

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
   * @returns {boolean} return true if the child could be added false otherwise.
   */
  addChild( parentId, childId, relationName, relationType ) {

    if (!this.nodes.hasOwnProperty( parentId ) || !this.nodes.hasOwnProperty( childId )) {
      return false;
    }

    this.nodes[parentId].addChild( this.nodes[childId], relationName, relationType );

    return true;
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

      for (let callback of this.listeners.values()) {
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
