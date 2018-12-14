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
    if (this.nodes.hasOwnProperty( id )) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJhZGRDaGlsZEluQ29udGV4dCIsInBhcmVudElkIiwiY2hpbGRJZCIsImNvbnRleHRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsImhhc093blByb3BlcnR5IiwiY2hpbGQiLCJjb250ZXh0IiwiUHJvbWlzZSIsInJlamVjdCIsIkVycm9yIiwiYWRkQ2hpbGQiLCJyZXNvbHZlIiwiYWRkQ2hpbGRBbmRDcmVhdGVOb2RlIiwibm9kZSIsIm5vZGVJZCIsImNyZWF0ZU5vZGUiLCJpbmZvIiwiZWxlbWVudCIsImFkZENvbnRleHQiLCJuYW1lIiwidHlwZSIsImVsdCIsIlNwaW5hbENvbnRleHQiLCJpZCIsImdldCIsImJpbmROb2RlIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJ1bmRlZmluZWQiLCJoYXMiLCJzZXQiLCJfYmluZE5vZGUiLCJfdW5CaW5kIiwiYmluZCIsIlNwaW5hbE5vZGUiLCJnZXRUeXBlIiwibW9kX2F0dHIiLCJfYWRkTm9kZSIsImdldE5vZGVzIiwiZ2V0Tm9kZSIsImdldEluZm8iLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwiZ2V0Q2hpbGRyZW4iLCJyZWxhdGlvbk5hbWVzIiwibGVuZ3RoIiwiY2hpbGRyZW4iLCJyZWxhdGlvbk1hcCIsInB1c2giLCJrZXlzIiwicmVzIiwiaSIsImdldElkIiwiZ2V0Q2hpbGRyZW5JbkNvbnRleHQiLCJkZWVwX2NvcHkiLCJnZXRDaGlsZHJlbklkcyIsImNvbnRleHRJZHMiLCJzaXplIiwiZ2V0Q29udGV4dCIsImtleSIsImdldE5hbWUiLCJnZXRSZWxhdGlvbk5hbWVzIiwiZGVsZXRlRWxlbWVudCIsInNldEVsZW1lbnQiLCJsaXN0ZW5Pbk5vZGVBZGRlZCIsInN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCIsImxpc3Rlbk9uTm9kZVJlbW92ZSIsInN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUiLCJtb2RpZnlOb2RlIiwicmVtb3ZlQ2hpbGQiLCJzdG9wIiwibGlzdGVuZXJzIiwidmFsdWVzIiwicmVtb3ZlRnJvbUdyYXBoIiwiYWRkX2F0dHIiLCJTcGluYWxHcmFwaCIsInNldEdyYXBoIiwiZGVsZXRlIiwiX2FyZUFsbENoaWxkcmVuTG9hZGVkIiwiY2hpbGRyZW5JZHMiLCJoYXNBbGxDaGlsZCIsIl9iaW5kRnVuYyIsImJpbmRlciIsInVuYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQU1BLE1BQU1BLE1BQU0sR0FBRyxPQUFPQyxNQUFQLElBQWlCLFdBQWpCLEdBQStCQyxNQUEvQixHQUF3Q0QsTUFBdkQ7QUFFQTs7Ozs7Ozs7QUFPQSxNQUFNRSxtQkFBTixDQUEwQjtBQUV4Qjs7O0FBR0FDLEVBQUFBLFdBQVcsQ0FBRUMsU0FBRixFQUFjO0FBQ3ZCLFNBQUtDLFVBQUwsR0FBa0IsSUFBSUMsR0FBSixFQUFsQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJRCxHQUFKLEVBQWY7QUFDQSxTQUFLRSxvQkFBTCxHQUE0QixJQUFJRixHQUFKLEVBQTVCO0FBQ0EsU0FBS0csb0JBQUwsR0FBNEIsSUFBSUgsR0FBSixFQUE1QjtBQUNBLFNBQUtJLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEVBQWI7O0FBQ0EsUUFBSSxPQUFPUCxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBRXBDTCxNQUFBQSxNQUFN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RDs7QUFFRCxXQUFPb0MsR0FBUDtBQUNEOztBQTlldUI7O2VBaWZYeEUsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBTcGluYWxDb250ZXh0LFxuICBTcGluYWxHcmFwaCxcbiAgU3BpbmFsTm9kZVxufSBmcm9tIFwic3BpbmFsLW1vZGVsLWdyYXBoXCI7XG5cbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcblxuLyoqXG4gKiAgQHByb3BlcnR5IHtNYXA8U3RyaW5nLCBNYXA8T2JqZWN0LCBmdW5jdGlvbj4+fSBiaW5kZWROb2RlIE5vZGVJZCA9PiBDYWxsZXIgPT4gQ2FsbGJhY2suIEFsbCBub2RlcyB0aGF0IGFyZSBiaW5kXG4gKiAgQHByb3BlcnR5IHtNYXA8U3RyaW5nLCBmdW5jdGlvbj59IGJpbmRlcnMgTm9kZUlkID0+IENhbGxCYWNrIGZyb20gYmluZCBtZXRob2QuXG4gKiAgQHByb3BlcnR5IHtNYXA8T2JqZWN0LCBmdW5jdGlvbj59IGxpc3RlbmVycyBjYWxsZXIgPT4gY2FsbGJhY2suIExpc3Qgb2YgYWxsIGxpc3RlbmVycyBvbiBub2RlIGFkZGVkXG4gKiAgQHByb3BlcnR5IHtPYmplY3R9IG5vZGVzIGNvbnRhaW5pbmcgYWxsIFNwaW5hbE5vZGUgY3VycmVudGx5IGxvYWRlZFxuICogIEBwcm9wZXJ0eSB7U3BpbmFsR3JhcGh9IGdyYXBoXG4gKi9cbmNsYXNzIEdyYXBoTWFuYWdlclNlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gdmlld2VyRW52IHtib29sZWFufSBpZiBkZWZpbmVkIGxvYWQgZ3JhcGggZnJvbSBnZXRNb2RlbFxuICAgKi9cbiAgY29uc3RydWN0b3IoIHZpZXdlckVudiApIHtcbiAgICB0aGlzLmJpbmRlZE5vZGUgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5iaW5kZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGlzdGVuZXJzT25Ob2RlQWRkZWQgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5saXN0ZW5lck9uTm9kZVJlbW92ZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLm5vZGVzID0ge307XG4gICAgdGhpcy5ncmFwaCA9IHt9O1xuICAgIGlmICh0eXBlb2Ygdmlld2VyRW52ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cbiAgICAgIEdfcm9vdC5zcGluYWwuc3BpbmFsU3lzdGVtLmdldE1vZGVsKClcbiAgICAgICAgLnRoZW4oXG4gICAgICAgICAgZm9yZ2VGaWxlID0+IHRoaXMuc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCggZSA9PiBjb25zb2xlLmVycm9yKCBlICkgKTtcbiAgICB9XG4gIH1cblxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm5vZGVzW2NvbnRleHRJZF07XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGRJbkNvbnRleHQoIGNoaWxkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgY29udGV4dCApO1xuICAgIH1cbiAgICAvL1RPRE8gb3B0aW9uIHBhcnNlclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoICdOb2RlIGlkJyArIHBhcmVudElkICsgJyBub3QgZm91bmQnICkgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBjaGlsZElkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2hpbGRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IHJldHVybiB0cnVlIGlmIHRoZSBjaGlsZCBjb3VsZCBiZSBhZGRlZCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhZGRDaGlsZCggcGFyZW50SWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBub2RlIGFuZCBhZGQgaXQgYXMgY2hpbGQgdG8gdGhlIHBhcmVudElkLlxuICAgKiBAcGFyYW0gcGFyZW50SWQge3N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBub2RlIHtPYmplY3R9IG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2luZm8nIGFuZCBjYW4gaGF2ZSBhbiBhdHRyaWJ1dGUgJ2VsZW1lbnQnXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge3N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgd2FzIGNyZWF0ZWQgYWRkZWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBhZGRDaGlsZEFuZENyZWF0ZU5vZGUoIHBhcmVudElkLCBub2RlLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoICdpbmZvJyApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUlkID0gdGhpcy5jcmVhdGVOb2RlKCBub2RlLmluZm8sIG5vZGUuZWxlbWVudCApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoIHBhcmVudElkLCBub2RlSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udGV4dCB0byB0aGUgZ3JhcGhcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIGVsdCB7TW9kZWx9IGVsZW1lbnQgb2YgdGhlIGNvbnRleHQgaWYgbmVlZGVkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNwaW5hbENvbnRleHQ+fVxuICAgKi9cbiAgYWRkQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICkge1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgU3BpbmFsQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICk7XG4gICAgdGhpcy5ub2Rlc1tjb250ZXh0LmluZm8uaWQuZ2V0KCldID0gY29udGV4dDtcbiAgICByZXR1cm4gdGhpcy5ncmFwaC5hZGRDb250ZXh0KCBjb250ZXh0ICk7XG4gIH1cblxuICAvKipcbiAgICogQmluZCBhIG5vZGUgYW5kIHJldHVybiBhIGZ1bmN0aW9uIHRvIHVuYmluZCB0aGUgc2FtZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNhbGxlciB7T2JqZWN0fSB1c3VhbGx5ICd0aGlzJ1xuICAgKiBAcGFyYW0gY2FsbGJhY2sge2Z1bmN0aW9ufSB0byBiZSBjYWxsIGV2ZXJ5IGNoYW5nZSBvZiB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkIHwgZnVuY3Rpb259IHJldHVybiBhIGZ1bmN0aW9uIHRvIGFsbG93IHRvIG5vZGUgdW5iaW5kaW5nIGlmIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gbm9kZUlkIGV4aXN0IHVuZGVmaW5lZCBhbmQgY2FsbGVyIGlzIGFuIG9iamVjdCBhbmQgY2FsbGJhY2sgaXMgYSBmdW5jdGlvbiBvdGhlcndpc2VcbiAgICovXG4gIGJpbmROb2RlKCBub2RlSWQsIGNhbGxlciwgY2FsbGJhY2sgKSB7XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSB8fCB0eXBlb2YgY2FsbGVyICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zZXQoIGNhbGxlciwgY2FsbGJhY2sgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5iaW5kZWROb2RlLnNldCggbm9kZUlkLCBuZXcgTWFwKCBbXG4gICAgICAgIFtjYWxsZXIsIGNhbGxiYWNrXVxuICAgICAgXSApICk7XG4gICAgICB0aGlzLl9iaW5kTm9kZSggbm9kZUlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3VuQmluZC5iaW5kKCB0aGlzLCBub2RlSWQsIGNhbGxlciApO1xuICB9XG5cbiAgY3JlYXRlTm9kZSggaW5mbywgZWxlbWVudCApIHtcbiAgICBjb25zdCBub2RlID0gbmV3IFNwaW5hbE5vZGUoIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBlbGVtZW50ICk7XG4gICAgaWYgKCFpbmZvLmhhc093blByb3BlcnR5KCAndHlwZScgKSkge1xuICAgICAgaW5mb1sndHlwZSddID0gbm9kZS5nZXRUeXBlKCkuZ2V0KCk7XG4gICAgfVxuICAgIGNvbnN0IG5vZGVJZCA9IG5vZGUuaW5mby5pZC5nZXQoKTtcbiAgICBpbmZvWydpZCddID0gbm9kZUlkO1xuICAgIG5vZGUubW9kX2F0dHIoICdpbmZvJywgaW5mbyApO1xuICAgIHRoaXMuX2FkZE5vZGUoIG5vZGUgKTtcbiAgICByZXR1cm4gbm9kZUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgbG9hZGVkIE5vZGVzXG4gICAqL1xuICBnZXROb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge09iamVjdCB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldE5vZGUoIGlkICkge1xuXG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluZm8oIGlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgZ3JhcGhcbiAgICogQHJldHVybnMge3t9fFNwaW5hbEdyYXBofVxuICAgKi9cbiAgZ2V0R3JhcGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge1NwaW5hbE5vZGUgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXRSZWFsTm9kZSggaWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgY2hpbGRyZW4gb2YgYSBub2RlXG4gICAqIEBwYXJhbSBpZFxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lcyB7QXJyYXl9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5PFNwaW5hbE5vZGVSZWY+Pn1cbiAgICovXG4gIGdldENoaWxkcmVuKCBpZCwgcmVsYXRpb25OYW1lcyA9IFtdICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJOb2RlIGlkOiBcIiArIGlkICsgXCIgbm90IGZvdW5kXCIgKSApO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGlvbk5hbWVzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICBmb3IgKGxldCByZWxhdGlvbk1hcCBvZiB0aGlzLm5vZGVzW2lkXS5jaGlsZHJlbikge1xuICAgICAgICByZWxhdGlvbk5hbWVzLnB1c2goIC4uLnJlbGF0aW9uTWFwLmtleXMoKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXS5nZXRDaGlsZHJlbiggcmVsYXRpb25OYW1lcyApXG4gICAgICAudGhlbiggKCBjaGlsZHJlbiApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjaGlsZHJlbiBvZiB0aGUgbm9kZSB0aGF0IGFyZSByZWdpc3RlcmVkIGluIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfSBpZCBvZiB0aGUgcGFyZW50IG5vZGVcbiAgICogQHBhcmFtIGNvbnRleHRJZCB7U3RyaW5nfSBpZCBvZiB0aGUgY29udGV4dCBub2RlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5PE9iamVjdD4+fSBUaGUgaW5mbyBvZiB0aGUgY2hpbGRyZW4gdGhhdCB3ZXJlIGZvdW5kXG4gICAqL1xuICBnZXRDaGlsZHJlbkluQ29udGV4dCggcGFyZW50SWQsIGNvbnRleHRJZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjb250ZXh0SWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmdldENoaWxkcmVuSW5Db250ZXh0KCB0aGlzLm5vZGVzW2NvbnRleHRJZF0gKS50aGVuKCBjaGlsZHJlbiA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIGluZm8gYWdncmVnYXRlZCB3aXRoIGl0cyBjaGlsZHJlbklkcywgY29udGV4dElkcyBhbmQgZWxlbWVudFxuICAgKiBAcGFyYW0gbm9kZUlkXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0SW5mbyggbm9kZUlkICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1tub2RlSWRdO1xuICAgIGNvbnN0IHJlcyA9IG5vZGUuaW5mby5kZWVwX2NvcHkoKTtcbiAgICByZXNbJ2NoaWxkcmVuSWRzJ10gPSBub2RlLmdldENoaWxkcmVuSWRzKCk7XG4gICAgcmVzWydjb250ZXh0SWRzJ10gPSBub2RlLmNvbnRleHRJZHM7XG4gICAgcmVzWydlbGVtZW50J10gPSBub2RlLmVsZW1lbnQ7XG4gICAgcmVzWydoYXNDaGlsZHJlbiddID0gbm9kZS5jaGlsZHJlbi5zaXplID4gMDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW5JZHMoIG5vZGVJZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge1NwaW5hbENvbnRleHR8dW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Q29udGV4dCggbmFtZSApIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGtleSApKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW2tleV07XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgU3BpbmFsQ29udGV4dCAmJiBub2RlLmdldE5hbWUoKS5nZXQoKSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCB0aGUgcmVsYXRpb24gbmFtZXMgb2YgdGhlIG5vZGUgY29yZXNwb25kaW5nIHRvIGlkXG4gICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBvZiB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn1cbiAgICovXG4gIGdldFJlbGF0aW9uTmFtZXMoIGlkICkge1xuICAgIGNvbnN0IHJlbGF0aW9uTmFtZXMgPSBbXTtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgZm9yIChsZXQgcmVsYXRpb25NYXAgb2YgdGhpcy5ub2Rlc1tpZF0uY2hpbGRyZW4pIHtcbiAgICAgICAgcmVsYXRpb25OYW1lcy5wdXNoKCAuLi5yZWxhdGlvbk1hcC5rZXlzKCkgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0aW9uTmFtZXM7XG4gIH1cblxuICAvKioqXG4gICAqIERlbGV0ZSB0aGUgZWxlbWVudCBvZiB0aGUgZVxuICAgKiBAcGFyYW0gaWRcbiAgICovXG4gIGRlbGV0ZUVsZW1lbnQoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKVxuICAgIHtcbiAgICAgIHRoaXMubm9kZXNbaWRdLmVsZW1lbnQuc2V0KCAwICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZWxlbWVudCBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gaWRcbiAgICogQHBhcmFtIGVsdFxuICAgKi9cbiAgc2V0RWxlbWVudChpZCwgZWx0KXtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0uZWxlbWVudC5zZXQoZWx0KTtcbiAgICB9XG4gIH1cblxuICBsaXN0ZW5Pbk5vZGVBZGRlZCggY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZC5iaW5kKCB0aGlzLCBjYWxsZXIgKTtcbiAgfVxuXG4gIGxpc3Rlbk9uTm9kZVJlbW92ZSggY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUuYmluZCggdGhpcywgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEBwYXJhbSBpbmZvIG5ldyBpbmZvIGZvciB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgaXMgTG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgbW9kaWZ5Tm9kZSggbm9kZUlkLCBpbmZvICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRPIERPIDogY2hhbmdlIHRoZSBmb2xsb3dpbmcgXCJtb2RfYXR0clxuICAgIC8vIHRvIGEgZGlyZWN0IFwidXBkYXRlXCIgb2YgdGhlIGV4aXN0aW5nIG1vZGVsLlxuICAgIC8vIFRoaXMgd2lsbCByZWR1Y2UgdGhlIGNyZWF0aW9uIG9mIG1vZGVsIGJ1dFxuICAgIHRoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHN0b3AgPSBmYWxzZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwibm9kZUlkIHVua25vd24uXCIgKSApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCB0cnVlICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlSWQgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0ucmVtb3ZlQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiY2hpbGRJZCB1bmtub3duLiBJdCBtaWdodCBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgbm9kZVwiICkgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBub2RlIHJlZmVyZW5jZWQgYnkgaWQgZnJvbSB0aCBncmFwaC5cbiAgICogQHBhcmFtIGlkXG4gICAqL1xuICByZW1vdmVGcm9tR3JhcGgoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICB0aGlzLm5vZGVzW2lkXS5yZW1vdmVGcm9tR3JhcGgoKTtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUudmFsdWVzKCkpIHtcbiAgICAgICAgY2FsbGJhY2soIGlkICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgY3VycmVudCBncmFwaCB3aXRoIHRoZSBvbmUgb2YgdGhlIGZvcmdlRmlsZSBpZiB0aGVyZSBpcyBvbmUgY3JlYXRlIG9uZSBpZiBub3RlXG4gICAqIEBwYXJhbSBmb3JnZUZpbGVcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RyaW5nPn0gdGhlIGlkIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKSB7XG5cbiAgICBpZiAoIWZvcmdlRmlsZS5oYXNPd25Qcm9wZXJ0eSggJ2dyYXBoJyApKSB7XG4gICAgICBmb3JnZUZpbGUuYWRkX2F0dHIoIHtcbiAgICAgICAgZ3JhcGg6IG5ldyBTcGluYWxHcmFwaCgpXG4gICAgICB9ICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldEdyYXBoKCBmb3JnZUZpbGUuZ3JhcGggKTtcblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoKCBncmFwaCApIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5nZXRJZCA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICBkZWxldGUgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldO1xuICAgIH1cbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldID0gdGhpcy5ncmFwaDtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpLCBbXSApXG4gICAgICAudGhlbiggKCkgPT4ge3JldHVybiB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCk7fSApO1xuXG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQoIGNhbGxlciApIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5kZWxldGUoIGNhbGxlciApO1xuICB9XG5cbiAgc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZSggY2FsbGVyICkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLmRlbGV0ZSggY2FsbGVyICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=