"use strict";

Object.defineProperty( exports, "__esModule", {
  value: true
} );
exports.default = void 0;

var _spinalModelGraph = require( "spinal-model-graph" );

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
  constructor(viewerEnv) {
    this.bindedNode = new Map();
    this.binders = new Map();
    this.listenersOnNodeAdded = new Map();
    this.listenerOnNodeRemove = new Map();
    this.nodes = {};
    this.graph = {};

    if (typeof viewerEnv !== "undefined") {
      G_root.spinal.spinalSystem.getModel().then(forgeFile => this.setGraphFromForgeFile(forgeFile)).catch(e => console.error(e));
    }
  }

  addChildInContext( parentId, childId, contextId, relationName, relationType ) {
    if (this.nodes.hasOwnProperty( parentId ) && this.nodes.hasOwnProperty( childId ) && this.nodes.hasOwnProperty( contextId )) {
      const child = this.nodes[childId];
      const context = this.nodes[contextId];
      return this.nodes[parentId].addChildInContext( child, relationName, relationType, context );
    } //TODO option parser


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
  /**
   * Add a context to the graph
   * @param name {String} of the context
   * @param type {String} of the context
   * @param elt {Model} element of the context if needed
   * @returns {Promise<SpinalContext>}
   */


  addContext( name, type, elt ) {
    const context = new _spinalModelGraph.SpinalContext( name, type, elt );
    this.nodes[context.info.id.get()] = context;
    return this.graph.addContext( context );
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

  createNode( info, element ) {
    const node = new _spinalModelGraph.SpinalNode( undefined, undefined, element );

    if (!info.hasOwnProperty( 'type' )) {
      info['type'] = node.getType().get();
    }

    const nodeId = node.info.id.get();
    info['id'] = nodeId;
    node.mod_attr( 'info', info );

    this._addNode( node );

    return nodeId;
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


  getNode(id) {
    if (this.nodes.hasOwnProperty(id)) {
      return this.getInfo(id);
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


  getRealNode(id) {
    if (this.nodes.hasOwnProperty(id)) {
      return this.nodes[id];
    }

    return undefined;
  }
  /**
   * Return all children of a node
   * @param id
   * @param relationNames {Array}
   * @returns {Promise<Array<SpinalNodeRef>>}
   */


  getChildren( id, relationNames = [] ) {
    if (!this.nodes.hasOwnProperty(id)) {
      return Promise.reject(Error("Node id: " + id + " not found"));
    }

    if (relationNames.length === 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.nodes[id].children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let relationMap = _step.value;
          relationNames.push( ...relationMap.keys() );
        }
      } catch ( err ) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    return this.nodes[id].getChildren(relationNames).then(children => {
      const res = [];

      for (let i = 0; i < children.length; i++) {
        this._addNode(children[i]);

        res.push(this.getInfo(children[i].getId().get()));
      }

      return res;
    });
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
    if (!this.nodes.hasOwnProperty(nodeId)) {
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

  /**
   * @param name
   * @returns {SpinalContext|undefined}
   */


  getContext( name ) {
    for (let key in this.nodes) {
      if (this.nodes.hasOwnProperty( key )) {
        const node = this.nodes[key];

        if (node instanceof _spinalModelGraph.SpinalContext && node.getName().get() === name) {
          return node;
        }
      }
    }
  }

  /**
   * Return all the relation names of the node coresponding to id
   * @param id {String} of the node
   * @returns {Array<String>}
   */


  getRelationNames( id ) {
    const relationNames = [];

    if (this.nodes.hasOwnProperty( id )) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.nodes[id].children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let relationMap = _step2.value;
          relationNames.push( ...relationMap.keys() );
        }
      } catch ( err ) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    return relationNames;
  }

  /***
   * Delete the element of the e
   * @param id
   */


  deleteElement( id ) {
    if (this.nodes.hasOwnProperty( id )) ;
    {
      this.nodes[id].element.set( 0 );
    }
  }

  /**
   * Set the element of the node
   * @param id
   * @param elt
   */


  setElement( id, elt ) {
    if (this.nodes.hasOwnProperty( id )) {
      this.nodes[id].element.set( elt );
    }
  }

  listenOnNodeAdded(caller, callback) {
    this.listenersOnNodeAdded.set( caller, callback );
    return this.stopListeningOnNodeAdded.bind( this, caller );
  }

  listenOnNodeRemove( caller, callback ) {
    this.listenerOnNodeRemove.set( caller, callback );
    return this.stopListeningOnNodeRemove.bind( this, caller );
  }
  /**
   * @param nodeId id of the desired node
   * @param info new info for the node
   * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
   */


  modifyNode(nodeId, info) {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return false;
    } // TO DO : change the following "mod_attr
    // to a direct "update" of the existing model.
    // This will reduce the creation of model but


    this.nodes[nodeId].mod_attr('info', info);
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


  removeChild(nodeId, childId, relationName, relationType, stop = false) {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return Promise.reject(Error("nodeId unknown."));
    }

    if (!this.nodes.hasOwnProperty( childId ) && !stop) {
      return this.getChildren( nodeId, [] ).then( () => this.removeChild( nodeId, childId, relationName, relationType, true ) ).catch( e => console.error( e ) );
    } else if (this.nodes.hasOwnProperty( childId )) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.listeners.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let callback = _step3.value;
          callback( nodeId );
        }
      } catch ( err ) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return this.nodes[nodeId].removeChild( this.nodes[childId], relationName, relationType );
    } else {
      return Promise.reject( Error( "childId unknown. It might already been removed from the parent node" ) );
    }
  }
  /**
   * Remove the node referenced by id from th graph.
   * @param id
   */


  removeFromGraph( id ) {
    if (this.nodes.hasOwnProperty( id )) {
      this.nodes[id].removeFromGraph();
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.listenerOnNodeRemove.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let callback = _step4.value;
          callback( id );
        }
      } catch ( err ) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }
  /**
   * Create a new node.
   * The node newly created is volatile i.e it won't be store in the filesystem as long it's not added as child to another node
   * @param info {Object} information of the node
   * @param element {Model} element pointed by the node
   * @returns {String} return the child identifier
   */

  /**
   * Change the current graph with the one of the forgeFile if there is one create one if note
   * @param forgeFile
   * @returns {Promise<String>} the id of the graph
   */


  setGraphFromForgeFile( forgeFile ) {
    if (!forgeFile.hasOwnProperty( 'graph' )) {
      forgeFile.add_attr( {
        graph: new _spinalModelGraph.SpinalGraph()
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
    return this.getChildren( this.graph.getId().get(), [] ).then( () => {
      return this.graph.getId().get();
    });
  }

  stopListeningOnNodeAdded( caller ) {
    return this.listenersOnNodeAdded.delete( caller );
  }

  stopListeningOnNodeRemove( caller ) {
    return this.listenerOnNodeRemove.delete( caller );
  }
  /***
   * add a node to the set of node
   * @param node
   * @private
   */


  _addNode(node) {
    if (!this.nodes.hasOwnProperty(node.getId().get())) {
      this.nodes[node.info.id.get()] = node;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.listenersOnNodeAdded.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          let callback = _step5.value;
          callback( node.info.id.get() );
        }
      } catch ( err ) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }
  /**
   * Check if all children from a node are loaded
   * @param nodeId id of the desired node
   * @returns {boolean} return true if all children of the node is loaded false otherwise
   * @private
   */


  _areAllChildrenLoaded(nodeId) {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return false;
    }

    const childrenIds = this.nodes[nodeId].getChildrenIds();
    let hasAllChild = true;

    for (let i = 0; i < childrenIds.length && hasAllChild; i++) {
      hasAllChild = this.nodes.hasOwnProperty(childrenIds[i]);
    }

    return hasAllChild;
  }
  /**
   * Bind the node if needed and save the callback function
   * @param nodeId
   * @private
   */


  _bindNode(nodeId) {
    if (this.binders.has(nodeId) || !this.nodes.hasOwnProperty(nodeId)) {
      return;
    }

    this.binders.set(nodeId, this.nodes[nodeId].bind(this._bindFunc.bind(this, nodeId)));
  }
  /**
   * call the callback method of all the binder of the node
   * @param nodeId
   * @private
   */


  _bindFunc(nodeId) {
    if (this.bindedNode.has(nodeId)) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.bindedNode.get( nodeId ).values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          let callback = _step6.value;
          callback( this.nodes[nodeId] );
        }
      } catch ( err ) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
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

}

var _default = GraphManagerService;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJhZGRDaGlsZEluQ29udGV4dCIsInBhcmVudElkIiwiY2hpbGRJZCIsImNvbnRleHRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsImhhc093blByb3BlcnR5IiwiY2hpbGQiLCJjb250ZXh0IiwiUHJvbWlzZSIsInJlamVjdCIsIkVycm9yIiwiYWRkQ2hpbGQiLCJyZXNvbHZlIiwiYWRkQ2hpbGRBbmRDcmVhdGVOb2RlIiwibm9kZSIsIm5vZGVJZCIsImNyZWF0ZU5vZGUiLCJpbmZvIiwiZWxlbWVudCIsImFkZENvbnRleHQiLCJuYW1lIiwidHlwZSIsImVsdCIsIlNwaW5hbENvbnRleHQiLCJpZCIsImdldCIsImJpbmROb2RlIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJ1bmRlZmluZWQiLCJoYXMiLCJzZXQiLCJfYmluZE5vZGUiLCJfdW5CaW5kIiwiYmluZCIsIlNwaW5hbE5vZGUiLCJnZXRUeXBlIiwibW9kX2F0dHIiLCJfYWRkTm9kZSIsImdldE5vZGVzIiwiZ2V0Tm9kZSIsImdldEluZm8iLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwiZ2V0Q2hpbGRyZW4iLCJyZWxhdGlvbk5hbWVzIiwibGVuZ3RoIiwiY2hpbGRyZW4iLCJyZWxhdGlvbk1hcCIsInB1c2giLCJrZXlzIiwicmVzIiwiaSIsImdldElkIiwiZ2V0Q2hpbGRyZW5JbkNvbnRleHQiLCJkZWVwX2NvcHkiLCJnZXRDaGlsZHJlbklkcyIsImNvbnRleHRJZHMiLCJzaXplIiwiZ2V0Q29udGV4dCIsImtleSIsImdldE5hbWUiLCJnZXRSZWxhdGlvbk5hbWVzIiwiZGVsZXRlRWxlbWVudCIsInNldEVsZW1lbnQiLCJsaXN0ZW5Pbk5vZGVBZGRlZCIsInN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCIsImxpc3Rlbk9uTm9kZVJlbW92ZSIsInN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUiLCJtb2RpZnlOb2RlIiwicmVtb3ZlQ2hpbGQiLCJzdG9wIiwibGlzdGVuZXJzIiwidmFsdWVzIiwicmVtb3ZlRnJvbUdyYXBoIiwiYWRkX2F0dHIiLCJTcGluYWxHcmFwaCIsInNldEdyYXBoIiwiZGVsZXRlIiwiX2FyZUFsbENoaWxkcmVuTG9hZGVkIiwiY2hpbGRyZW5JZHMiLCJoYXNBbGxDaGlsZCIsIl9iaW5kRnVuYyIsImJpbmRlciIsInVuYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQU1BLE1BQU1BLE1BQU0sR0FBRyxPQUFPQyxNQUFQLElBQWlCLFdBQWpCLEdBQStCQyxNQUEvQixHQUF3Q0QsTUFBdkQ7QUFFQTs7Ozs7Ozs7QUFPQSxNQUFNRSxtQkFBTixDQUEwQjtBQUV4Qjs7O0FBR0FDLEVBQUFBLFdBQVcsQ0FBRUMsU0FBRixFQUFjO0FBQ3ZCLFNBQUtDLFVBQUwsR0FBa0IsSUFBSUMsR0FBSixFQUFsQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJRCxHQUFKLEVBQWY7QUFDQSxTQUFLRSxvQkFBTCxHQUE0QixJQUFJRixHQUFKLEVBQTVCO0FBQ0EsU0FBS0csb0JBQUwsR0FBNEIsSUFBSUgsR0FBSixFQUE1QjtBQUNBLFNBQUtJLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEVBQWI7O0FBQ0EsUUFBSSxPQUFPUCxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBRXBDTCxNQUFBQSxNQUFN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QXhCO0FBQ0Q7O0FBRUQsV0FBT29DLEdBQVA7QUFDRDs7QUE5ZXVCOztlQWlmWHhFLG1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgU3BpbmFsQ29udGV4dCxcbiAgU3BpbmFsR3JhcGgsXG4gIFNwaW5hbE5vZGVcbn0gZnJvbSBcInNwaW5hbC1tb2RlbC1ncmFwaFwiO1xuXG5jb25zdCBHX3Jvb3QgPSB0eXBlb2Ygd2luZG93ID09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG5cbi8qKlxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgTWFwPE9iamVjdCwgZnVuY3Rpb24+Pn0gYmluZGVkTm9kZSBOb2RlSWQgPT4gQ2FsbGVyID0+IENhbGxiYWNrLiBBbGwgbm9kZXMgdGhhdCBhcmUgYmluZFxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgZnVuY3Rpb24+fSBiaW5kZXJzIE5vZGVJZCA9PiBDYWxsQmFjayBmcm9tIGJpbmQgbWV0aG9kLlxuICogIEBwcm9wZXJ0eSB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBsaXN0ZW5lcnMgY2FsbGVyID0+IGNhbGxiYWNrLiBMaXN0IG9mIGFsbCBsaXN0ZW5lcnMgb24gbm9kZSBhZGRlZFxuICogIEBwcm9wZXJ0eSB7T2JqZWN0fSBub2RlcyBjb250YWluaW5nIGFsbCBTcGluYWxOb2RlIGN1cnJlbnRseSBsb2FkZWRcbiAqICBAcHJvcGVydHkge1NwaW5hbEdyYXBofSBncmFwaFxuICovXG5jbGFzcyBHcmFwaE1hbmFnZXJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQHBhcmFtIHZpZXdlckVudiB7Ym9vbGVhbn0gaWYgZGVmaW5lZCBsb2FkIGdyYXBoIGZyb20gZ2V0TW9kZWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKCB2aWV3ZXJFbnYgKSB7XG4gICAgdGhpcy5iaW5kZWROb2RlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmluZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMuZ3JhcGggPSB7fTtcbiAgICBpZiAodHlwZW9mIHZpZXdlckVudiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXG4gICAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbFN5c3RlbS5nZXRNb2RlbCgpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgIGZvcmdlRmlsZSA9PiB0aGlzLnNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlIClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfVxuICB9XG5cblxuICBhZGRDaGlsZEluQ29udGV4dCggcGFyZW50SWQsIGNoaWxkSWQsIGNvbnRleHRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNvbnRleHRJZCApKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IHRoaXMubm9kZXNbY2hpbGRJZF07XG4gICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5ub2Rlc1tjb250ZXh0SWRdO1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkSW5Db250ZXh0KCBjaGlsZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIGNvbnRleHQgKTtcbiAgICB9XG4gICAgLy9UT0RPIG9wdGlvbiBwYXJzZXJcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCAnTm9kZSBpZCcgKyBwYXJlbnRJZCArICcgbm90IGZvdW5kJyApICk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBhcyBjaGlsZCB0byB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJlbnRJZFxuICAgKiBAcGFyYW0gcGFyZW50SWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fSByZXR1cm4gdHJ1ZSBpZiB0aGUgY2hpbGQgY291bGQgYmUgYWRkZWQgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgYWRkQ2hpbGQoIHBhcmVudElkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSB8fCAhdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCBmYWxzZSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5hZGRDaGlsZCggdGhpcy5ub2Rlc1tjaGlsZElkXSwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKS50aGVuKCAoKSA9PiB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ICk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbm9kZSBhbmQgYWRkIGl0IGFzIGNoaWxkIHRvIHRoZSBwYXJlbnRJZC5cbiAgICogQHBhcmFtIHBhcmVudElkIHtzdHJpbmd9IGlkIG9mIHRoZSBwYXJlbnQgbm9kZVxuICAgKiBAcGFyYW0gbm9kZSB7T2JqZWN0fSBtdXN0IGhhdmUgYW4gYXR0cmlidXRlICdpbmZvJyBhbmQgY2FuIGhhdmUgYW4gYXR0cmlidXRlICdlbGVtZW50J1xuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtzdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybiB0cnVlIGlmIHRoZSBub2RlIHdhcyBjcmVhdGVkIGFkZGVkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkIHN1Y2Nlc3NmdWxseVxuICAgKi9cbiAgYWRkQ2hpbGRBbmRDcmVhdGVOb2RlKCBwYXJlbnRJZCwgbm9kZSwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKSB7XG4gICAgaWYgKCFub2RlLmhhc093blByb3BlcnR5KCAnaW5mbycgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5vZGVJZCA9IHRoaXMuY3JlYXRlTm9kZSggbm9kZS5pbmZvLCBub2RlLmVsZW1lbnQgKTtcblxuICAgIHJldHVybiB0aGlzLmFkZENoaWxkKCBwYXJlbnRJZCwgbm9kZUlkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRleHQgdG8gdGhlIGdyYXBoXG4gICAqIEBwYXJhbSBuYW1lIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSBlbHQge01vZGVsfSBlbGVtZW50IG9mIHRoZSBjb250ZXh0IGlmIG5lZWRlZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTcGluYWxDb250ZXh0Pn1cbiAgICovXG4gIGFkZENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApIHtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IFNwaW5hbENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApO1xuICAgIHRoaXMubm9kZXNbY29udGV4dC5pbmZvLmlkLmdldCgpXSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGguYWRkQ29udGV4dCggY29udGV4dCApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgYSBub2RlIGFuZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bmJpbmQgdGhlIHNhbWUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjYWxsZXIge09iamVjdH0gdXN1YWxseSAndGhpcydcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtmdW5jdGlvbn0gdG8gYmUgY2FsbCBldmVyeSBjaGFuZ2Ugb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge3VuZGVmaW5lZCB8IGZ1bmN0aW9ufSByZXR1cm4gYSBmdW5jdGlvbiB0byBhbGxvdyB0byBub2RlIHVuYmluZGluZyBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBleGlzdCB1bmRlZmluZWQgYW5kIGNhbGxlciBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24gb3RoZXJ3aXNlXG4gICAqL1xuICBiaW5kTm9kZSggbm9kZUlkLCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkgfHwgdHlwZW9mIGNhbGxlciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5zZXQoIG5vZGVJZCwgbmV3IE1hcCggW1xuICAgICAgICBbY2FsbGVyLCBjYWxsYmFja11cbiAgICAgIF0gKSApO1xuICAgICAgdGhpcy5fYmluZE5vZGUoIG5vZGVJZCApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91bkJpbmQuYmluZCggdGhpcywgbm9kZUlkLCBjYWxsZXIgKTtcbiAgfVxuXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYWxsIGxvYWRlZCBOb2Rlc1xuICAgKi9cbiAgZ2V0Tm9kZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBpZFxuICAgKiBAcGFyYW0gaWQgb2YgdGhlIHdhbnRlZCBub2RlXG4gICAqIEByZXR1cm5zIHtPYmplY3QgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXROb2RlKCBpZCApIHtcblxuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJbmZvKCBpZCApO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBjdXJyZW50IGdyYXBoXG4gICAqIEByZXR1cm5zIHt7fXxTcGluYWxHcmFwaH1cbiAgICovXG4gIGdldEdyYXBoKCkge1xuICAgIHJldHVybiB0aGlzLmdyYXBoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBpZFxuICAgKiBAcGFyYW0gaWQgb2YgdGhlIHdhbnRlZCBub2RlXG4gICAqIEByZXR1cm5zIHtTcGluYWxOb2RlIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0UmVhbE5vZGUoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYWxsIGNoaWxkcmVuIG9mIGEgbm9kZVxuICAgKiBAcGFyYW0gaWRcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZXMge0FycmF5fVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxTcGluYWxOb2RlUmVmPj59XG4gICAqL1xuICBnZXRDaGlsZHJlbiggaWQsIHJlbGF0aW9uTmFtZXMgPSBbXSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiTm9kZSBpZDogXCIgKyBpZCArIFwiIG5vdCBmb3VuZFwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpb25OYW1lcy5sZW5ndGggPT09IDApIHtcblxuICAgICAgZm9yIChsZXQgcmVsYXRpb25NYXAgb2YgdGhpcy5ub2Rlc1tpZF0uY2hpbGRyZW4pIHtcbiAgICAgICAgcmVsYXRpb25OYW1lcy5wdXNoKCAuLi5yZWxhdGlvbk1hcC5rZXlzKCkgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF0uZ2V0Q2hpbGRyZW4oIHJlbGF0aW9uTmFtZXMgKVxuICAgICAgLnRoZW4oICggY2hpbGRyZW4gKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgdGhhdCBhcmUgcmVnaXN0ZXJlZCBpbiB0aGUgY29udGV4dFxuICAgKiBAcGFyYW0gcGFyZW50SWQge1N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBjb250ZXh0SWQge1N0cmluZ30gaWQgb2YgdGhlIGNvbnRleHQgbm9kZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxPYmplY3Q+Pn0gVGhlIGluZm8gb2YgdGhlIGNoaWxkcmVuIHRoYXQgd2VyZSBmb3VuZFxuICAgKi9cbiAgZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHBhcmVudElkLCBjb250ZXh0SWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5nZXRDaGlsZHJlbkluQ29udGV4dCggdGhpcy5ub2Rlc1tjb250ZXh0SWRdICkudGhlbiggY2hpbGRyZW4gPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSBpbmZvIGFnZ3JlZ2F0ZWQgd2l0aCBpdHMgY2hpbGRyZW5JZHMsIGNvbnRleHRJZHMgYW5kIGVsZW1lbnRcbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEluZm8oIG5vZGVJZCApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXNbbm9kZUlkXTtcbiAgICBjb25zdCByZXMgPSBub2RlLmluZm8uZGVlcF9jb3B5KCk7XG4gICAgcmVzWydjaGlsZHJlbklkcyddID0gbm9kZS5nZXRDaGlsZHJlbklkcygpO1xuICAgIHJlc1snY29udGV4dElkcyddID0gbm9kZS5jb250ZXh0SWRzO1xuICAgIHJlc1snZWxlbWVudCddID0gbm9kZS5lbGVtZW50O1xuICAgIHJlc1snaGFzQ2hpbGRyZW4nXSA9IG5vZGUuY2hpbGRyZW4uc2l6ZSA+IDA7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdldENoaWxkcmVuSWRzKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtTcGluYWxDb250ZXh0fHVuZGVmaW5lZH1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBrZXkgKSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgdGhlIHJlbGF0aW9uIG5hbWVzIG9mIHRoZSBub2RlIGNvcmVzcG9uZGluZyB0byBpZFxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge0FycmF5PFN0cmluZz59XG4gICAqL1xuICBnZXRSZWxhdGlvbk5hbWVzKCBpZCApIHtcbiAgICBjb25zdCByZWxhdGlvbk5hbWVzID0gW107XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIGZvciAobGV0IHJlbGF0aW9uTWFwIG9mIHRoaXMubm9kZXNbaWRdLmNoaWxkcmVuKSB7XG4gICAgICAgIHJlbGF0aW9uTmFtZXMucHVzaCggLi4ucmVsYXRpb25NYXAua2V5cygpICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZWxhdGlvbk5hbWVzO1xuICB9XG5cbiAgLyoqKlxuICAgKiBEZWxldGUgdGhlIGVsZW1lbnQgb2YgdGhlIGVcbiAgICogQHBhcmFtIGlkXG4gICAqL1xuICBkZWxldGVFbGVtZW50KCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkgO1xuICAgIHtcbiAgICAgIHRoaXMubm9kZXNbaWRdLmVsZW1lbnQuc2V0KCAwICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZWxlbWVudCBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gaWRcbiAgICogQHBhcmFtIGVsdFxuICAgKi9cbiAgc2V0RWxlbWVudChpZCwgZWx0KXtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0uZWxlbWVudC5zZXQoZWx0KTtcbiAgICB9XG4gIH1cblxuICBsaXN0ZW5Pbk5vZGVBZGRlZCggY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZC5iaW5kKCB0aGlzLCBjYWxsZXIgKTtcbiAgfVxuXG4gIGxpc3Rlbk9uTm9kZVJlbW92ZSggY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUuYmluZCggdGhpcywgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEBwYXJhbSBpbmZvIG5ldyBpbmZvIGZvciB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgaXMgTG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgbW9kaWZ5Tm9kZSggbm9kZUlkLCBpbmZvICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRPIERPIDogY2hhbmdlIHRoZSBmb2xsb3dpbmcgXCJtb2RfYXR0clxuICAgIC8vIHRvIGEgZGlyZWN0IFwidXBkYXRlXCIgb2YgdGhlIGV4aXN0aW5nIG1vZGVsLlxuICAgIC8vIFRoaXMgd2lsbCByZWR1Y2UgdGhlIGNyZWF0aW9uIG9mIG1vZGVsIGJ1dFxuICAgIHRoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHN0b3AgPSBmYWxzZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwibm9kZUlkIHVua25vd24uXCIgKSApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCB0cnVlICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlSWQgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0ucmVtb3ZlQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiY2hpbGRJZCB1bmtub3duLiBJdCBtaWdodCBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgbm9kZVwiICkgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBub2RlIHJlZmVyZW5jZWQgYnkgaWQgZnJvbSB0aCBncmFwaC5cbiAgICogQHBhcmFtIGlkXG4gICAqL1xuICByZW1vdmVGcm9tR3JhcGgoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICB0aGlzLm5vZGVzW2lkXS5yZW1vdmVGcm9tR3JhcGgoKTtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUudmFsdWVzKCkpIHtcbiAgICAgICAgY2FsbGJhY2soIGlkICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgY3VycmVudCBncmFwaCB3aXRoIHRoZSBvbmUgb2YgdGhlIGZvcmdlRmlsZSBpZiB0aGVyZSBpcyBvbmUgY3JlYXRlIG9uZSBpZiBub3RlXG4gICAqIEBwYXJhbSBmb3JnZUZpbGVcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RyaW5nPn0gdGhlIGlkIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKSB7XG5cbiAgICBpZiAoIWZvcmdlRmlsZS5oYXNPd25Qcm9wZXJ0eSggJ2dyYXBoJyApKSB7XG4gICAgICBmb3JnZUZpbGUuYWRkX2F0dHIoIHtcbiAgICAgICAgZ3JhcGg6IG5ldyBTcGluYWxHcmFwaCgpXG4gICAgICB9ICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldEdyYXBoKCBmb3JnZUZpbGUuZ3JhcGggKTtcblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoKCBncmFwaCApIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5nZXRJZCA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICBkZWxldGUgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldO1xuICAgIH1cbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldID0gdGhpcy5ncmFwaDtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpLCBbXSApXG4gICAgICAudGhlbiggKCkgPT4ge3JldHVybiB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCk7fSApO1xuXG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQoIGNhbGxlciApIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5kZWxldGUoIGNhbGxlciApO1xuICB9XG5cbiAgc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZSggY2FsbGVyICkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLmRlbGV0ZSggY2FsbGVyICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=