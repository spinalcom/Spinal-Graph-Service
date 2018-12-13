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
  /**
   * Change the current graph with the one of the forgeFile if there is one create one if note
   * @param forgeFile
   * @returns {Promise<String>} the id of the graph
   */


  setGraphFromForgeFile(forgeFile) {
    if (!forgeFile.hasOwnProperty('graph')) {
      forgeFile.add_attr({
        graph: new _spinalModelGraph.SpinalGraph()
      });
    }

    return this.setGraph( forgeFile.graph );
  }
  /**
   *
   * @param graph {SpinalGraph}
   * @returns {Promise<String>} the id of the graph
   */


  setGraph(graph) {
    if (typeof this.graph.getId === "function" && this.nodes.hasOwnProperty(this.graph.getId().get())) {
      delete this.nodes[this.graph.getId().get()];
    }

    this.graph = graph;
    this.nodes[this.graph.getId().get()] = this.graph;
    return this.getChildren( this.graph.getId().get(), [] ).then( () => {
      return this.graph.getId().get();
    } );
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

  listenOnNodeAdded(caller, callback) {
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
   * Bind a node and return a function to unbind the same node
   * @param nodeId {String}
   * @param caller {Object} usually 'this'
   * @param callback {function} to be call every change of the node
   * @returns {undefined | function} return a function to allow to node unbinding if the node corresponding to nodeId exist undefined and caller is an object and callback is a function otherwise
   */


  bindNode(nodeId, caller, callback) {
    if (!this.nodes.hasOwnProperty(nodeId) || typeof caller !== 'object' || typeof callback !== 'function') {
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.listeners.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let callback = _step2.value;
          callback( nodeId );
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


  addContext(name, type, elt) {
    const context = new _spinalModelGraph.SpinalContext( name, type, elt );
    this.nodes[context.info.id.get()] = context;
    return this.graph.addContext(context);
  }
  /**
   * @param name
   * @returns {SpinalContext|undefined}
   */


  getContext(name) {
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


  createNode(info, element) {
    const node = new _spinalModelGraph.SpinalNode( undefined, undefined, element );

    if (!info.hasOwnProperty('type')) {
      info['type'] = node.getType().get();
    }

    const nodeId = node.info.id.get();
    info['id'] = nodeId;
    node.mod_attr('info', info);

    this._addNode(node);

    return nodeId;
  }

  addChildInContext(parentId, childId, contextId, relationName, relationType) {
    if (this.nodes.hasOwnProperty(parentId) && this.nodes.hasOwnProperty(childId) && this.nodes.hasOwnProperty(contextId)) {
      const child = this.nodes[childId];
      const context = this.nodes[contextId];
      return this.nodes[parentId].addChildInContext(child, relationName, relationType, context);
    } //TODO option parser


    return Promise.reject(Error('Node id' + parentId + ' not found'));
  }
  /**
   * Add the node corresponding to childId as child to the node corresponding to the parentId
   * @param parentId {String}
   * @param childId {String}
   * @param relationName {String}
   * @param relationType {Number}
   * @returns {Promise<boolean>} return true if the child could be added false otherwise.
   */


  addChild(parentId, childId, relationName, relationType) {
    if (!this.nodes.hasOwnProperty(parentId) || !this.nodes.hasOwnProperty(childId)) {
      return Promise.resolve(false);
    }

    return this.nodes[parentId].addChild(this.nodes[childId], relationName, relationType).then(() => {
      return true;
    });
  }
  /**
   * Create a node and add it as child to the parentId.
   * @param parentId {string} id of the parent node
   * @param node {Object} must have an attribute 'info' and can have an attribute 'element'
   * @param relationName {string}
   * @param relationType {Number}
   * @returns {boolean} return true if the node was created added as child to the node corresponding to the parentId successfully
   */


  addChildAndCreateNode(parentId, node, relationName, relationType) {
    if (!node.hasOwnProperty('info')) {
      return false;
    }

    const nodeId = this.createNode(node.info, node.element);
    return this.addChild(parentId, nodeId, relationName, relationType);
  }
  /***
   * add a node to the set of node
   * @param node
   * @private
   */


  _addNode(node) {
    if (!this.nodes.hasOwnProperty(node.getId().get())) {
      this.nodes[node.info.id.get()] = node;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.listenersOnNodeAdded.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let callback = _step3.value;
          callback( node.info.id.get() );
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
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.bindedNode.get( nodeId ).values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let callback = _step4.value;
          callback( this.nodes[nodeId] );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZF9hdHRyIiwiU3BpbmFsR3JhcGgiLCJzZXRHcmFwaCIsImdldElkIiwiZ2V0IiwiZ2V0Q2hpbGRyZW4iLCJnZXROb2RlcyIsImdldE5vZGUiLCJpZCIsImdldEluZm8iLCJ1bmRlZmluZWQiLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwicmVsYXRpb25OYW1lcyIsIlByb21pc2UiLCJyZWplY3QiLCJFcnJvciIsImxlbmd0aCIsImNoaWxkcmVuIiwicmVsYXRpb25NYXAiLCJwdXNoIiwia2V5cyIsInJlcyIsImkiLCJfYWRkTm9kZSIsImdldENoaWxkcmVuSW5Db250ZXh0IiwicGFyZW50SWQiLCJjb250ZXh0SWQiLCJub2RlSWQiLCJub2RlIiwiaW5mbyIsImRlZXBfY29weSIsImdldENoaWxkcmVuSWRzIiwiY29udGV4dElkcyIsImVsZW1lbnQiLCJzaXplIiwibGlzdGVuT25Ob2RlQWRkZWQiLCJjYWxsZXIiLCJjYWxsYmFjayIsInNldCIsInN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCIsImJpbmQiLCJsaXN0ZW5Pbk5vZGVSZW1vdmUiLCJzdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlIiwiZGVsZXRlIiwibW9kaWZ5Tm9kZSIsIm1vZF9hdHRyIiwiYmluZE5vZGUiLCJoYXMiLCJfYmluZE5vZGUiLCJfdW5CaW5kIiwicmVtb3ZlQ2hpbGQiLCJjaGlsZElkIiwicmVsYXRpb25OYW1lIiwicmVsYXRpb25UeXBlIiwic3RvcCIsImxpc3RlbmVycyIsInZhbHVlcyIsImFkZENvbnRleHQiLCJuYW1lIiwidHlwZSIsImVsdCIsImNvbnRleHQiLCJTcGluYWxDb250ZXh0IiwiZ2V0Q29udGV4dCIsImtleSIsImdldE5hbWUiLCJyZW1vdmVGcm9tR3JhcGgiLCJjcmVhdGVOb2RlIiwiU3BpbmFsTm9kZSIsImdldFR5cGUiLCJhZGRDaGlsZEluQ29udGV4dCIsImNoaWxkIiwiYWRkQ2hpbGQiLCJyZXNvbHZlIiwiYWRkQ2hpbGRBbmRDcmVhdGVOb2RlIiwiX2FyZUFsbENoaWxkcmVuTG9hZGVkIiwiY2hpbGRyZW5JZHMiLCJoYXNBbGxDaGlsZCIsIl9iaW5kRnVuYyIsImJpbmRlciIsInVuYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQU1BLE1BQU1BLE1BQU0sR0FBRyxPQUFPQyxNQUFQLElBQWlCLFdBQWpCLEdBQStCQyxNQUEvQixHQUF3Q0QsTUFBdkQ7QUFDQTs7Ozs7Ozs7QUFPQSxNQUFNRSxtQkFBTixDQUEwQjtBQUV4Qjs7O0FBR0FDLEVBQUFBLFdBQVcsQ0FBRUMsU0FBRixFQUFjO0FBQ3ZCLFNBQUtDLFVBQUwsR0FBa0IsSUFBSUMsR0FBSixFQUFsQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJRCxHQUFKLEVBQWY7QUFDQSxTQUFLRSxvQkFBTCxHQUE0QixJQUFJRixHQUFKLEVBQTVCO0FBQ0EsU0FBS0csb0JBQUwsR0FBNEIsSUFBSUgsR0FBSixFQUE1QjtBQUNBLFNBQUtJLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEVBQWI7O0FBQ0EsUUFBSSxPQUFPUCxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBRXBDTCxNQUFBQSxNQUFNLENBQUNhLE1BQVAsQ0FBY0MsWUFBZCxDQUEyQkMsUUFBM0IsR0FDR0MsSUFESCxD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OztBQUFBO0FBRWpDLDhCQUFxQixLQUFLOUMsVUFBTCxDQUFnQnNCLEdBQWhCLENBQXFCd0IsTUFBckIsRUFBOEI2QixNQUE5QixFQUFyQixtSUFBNkQ7QUFBQSxjQUFwRG5CLFFBQW9EO0FBQzNEQSxVQUFBQSxRQUFRLENBQUUsS0FBS25ELEtBQUwsQ0FBV3lDLE1BQVgsQ0FBRixDQUFSO0FBQ0Q7QUFKZ0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtsQztBQUNGO0FBRUQ7Ozs7Ozs7OztBQU9Bc0IsRUFBQUEsT0FBTyxDQUFFdEIsTUFBRixFQUFVb0QsTUFBVixFQUFtQjtBQUV4QixRQUFJLENBQUMsS0FBS2xHLFVBQUwsQ0FBZ0JrRSxHQUFoQixDQUFxQnBCLE1BQXJCLENBQUwsRUFBb0M7QUFDbEMsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsVUFBTU4sR0FBRyxHQUFHLEtBQUt4QyxVQUFMLENBQWdCc0IsR0FBaEIsQ0FBcUJ3QixNQUFyQixFQUE4QmdCLE1BQTlCLENBQXNDb0MsTUFBdEMsQ0FBWjs7QUFFQSxRQUFJLEtBQUtsRyxVQUFMLENBQWdCc0IsR0FBaEIsQ0FBcUJ3QixNQUFyQixFQUE4Qk8sSUFBOUIsS0FBdUMsQ0FBM0MsRUFBOEM7QUFDNUMsV0FBS2hELEtBQUwsQ0FBV3lDLE1BQVgsRUFBbUJxRCxNQUFuQixDQUEyQixLQUFLakcsT0FBTCxDQUFhb0IsR0FBYixDQUFrQndCLE1BQWxCLENBQTNCO0FBQ0EsV0FBSzVDLE9BQUwsQ0FBYTRELE1BQWIsQ0FBcUJoQixNQUFyQjtBQUNBLFdBQUs5QyxVQUFMLENBQWdCOEQsTUFBaEIsQ0FBd0JoQixNQUF4QjtBQUNEOztBQUVELFdBQU9OLEdBQVA7QUFDRDs7QUFwY3VCOztlQXVjWDNDLG1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgU3BpbmFsQ29udGV4dCxcbiAgU3BpbmFsR3JhcGgsXG4gIFNwaW5hbE5vZGVcbn0gZnJvbSBcInNwaW5hbC1tb2RlbC1ncmFwaFwiO1xuXG5jb25zdCBHX3Jvb3QgPSB0eXBlb2Ygd2luZG93ID09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG4vKipcbiAqICBAcHJvcGVydHkge01hcDxTdHJpbmcsIE1hcDxPYmplY3QsIGZ1bmN0aW9uPj59IGJpbmRlZE5vZGUgTm9kZUlkID0+IENhbGxlciA9PiBDYWxsYmFjay4gQWxsIG5vZGVzIHRoYXQgYXJlIGJpbmRcbiAqICBAcHJvcGVydHkge01hcDxTdHJpbmcsIGZ1bmN0aW9uPn0gYmluZGVycyBOb2RlSWQgPT4gQ2FsbEJhY2sgZnJvbSBiaW5kIG1ldGhvZC5cbiAqICBAcHJvcGVydHkge01hcDxPYmplY3QsIGZ1bmN0aW9uPn0gbGlzdGVuZXJzIGNhbGxlciA9PiBjYWxsYmFjay4gTGlzdCBvZiBhbGwgbGlzdGVuZXJzIG9uIG5vZGUgYWRkZWRcbiAqICBAcHJvcGVydHkge09iamVjdH0gbm9kZXMgY29udGFpbmluZyBhbGwgU3BpbmFsTm9kZSBjdXJyZW50bHkgbG9hZGVkXG4gKiAgQHByb3BlcnR5IHtTcGluYWxHcmFwaH0gZ3JhcGhcbiAqL1xuY2xhc3MgR3JhcGhNYW5hZ2VyU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB2aWV3ZXJFbnYge2Jvb2xlYW59IGlmIGRlZmluZWQgbG9hZCBncmFwaCBmcm9tIGdldE1vZGVsXG4gICAqL1xuICBjb25zdHJ1Y3Rvciggdmlld2VyRW52ICkge1xuICAgIHRoaXMuYmluZGVkTm9kZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJpbmRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubm9kZXMgPSB7fTtcbiAgICB0aGlzLmdyYXBoID0ge307XG4gICAgaWYgKHR5cGVvZiB2aWV3ZXJFbnYgIT09IFwidW5kZWZpbmVkXCIpIHtcblxuICAgICAgR19yb290LnNwaW5hbC5zcGluYWxTeXN0ZW0uZ2V0TW9kZWwoKVxuICAgICAgICAudGhlbihcbiAgICAgICAgICBmb3JnZUZpbGUgPT4gdGhpcy5zZXRHcmFwaEZyb21Gb3JnZUZpbGUoIGZvcmdlRmlsZSApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGN1cnJlbnQgZ3JhcGggd2l0aCB0aGUgb25lIG9mIHRoZSBmb3JnZUZpbGUgaWYgdGhlcmUgaXMgb25lIGNyZWF0ZSBvbmUgaWYgbm90ZVxuICAgKiBAcGFyYW0gZm9yZ2VGaWxlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlICkge1xuXG4gICAgaWYgKCFmb3JnZUZpbGUuaGFzT3duUHJvcGVydHkoICdncmFwaCcgKSkge1xuICAgICAgZm9yZ2VGaWxlLmFkZF9hdHRyKCB7XG4gICAgICAgIGdyYXBoOiBuZXcgU3BpbmFsR3JhcGgoKVxuICAgICAgfSApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRHcmFwaCggZm9yZ2VGaWxlLmdyYXBoICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhcGgge1NwaW5hbEdyYXBofVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fSB0aGUgaWQgb2YgdGhlIGdyYXBoXG4gICAqL1xuICBzZXRHcmFwaCggZ3JhcGggKSB7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuZ3JhcGguZ2V0SWQgPT09IFwiZnVuY3Rpb25cIiAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCkgKSkge1xuICAgICAgZGVsZXRlIHRoaXMubm9kZXNbdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpXTtcbiAgICB9XG4gICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xuICAgIHRoaXMubm9kZXNbdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpXSA9IHRoaXMuZ3JhcGg7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSwgW10gKVxuICAgICAgLnRoZW4oICgpID0+IHtyZXR1cm4gdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpO30gKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgbG9hZGVkIE5vZGVzXG4gICAqL1xuICBnZXROb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge09iamVjdCB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldE5vZGUoIGlkICkge1xuXG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluZm8oIGlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgZ3JhcGhcbiAgICogQHJldHVybnMge3t9fFNwaW5hbEdyYXBofVxuICAgKi9cbiAgZ2V0R3JhcGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge1NwaW5hbE5vZGUgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXRSZWFsTm9kZSggaWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgY2hpbGRyZW4gb2YgYSBub2RlXG4gICAqIEBwYXJhbSBpZFxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lcyB7QXJyYXl9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5PFNwaW5hbE5vZGVSZWY+Pn1cbiAgICovXG4gIGdldENoaWxkcmVuKCBpZCwgcmVsYXRpb25OYW1lcyA9IFtdICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJOb2RlIGlkOiBcIiArIGlkICsgXCIgbm90IGZvdW5kXCIgKSApO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGlvbk5hbWVzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICBmb3IgKGxldCByZWxhdGlvbk1hcCBvZiB0aGlzLm5vZGVzW2lkXS5jaGlsZHJlbikge1xuICAgICAgICByZWxhdGlvbk5hbWVzLnB1c2goIC4uLnJlbGF0aW9uTWFwLmtleXMoKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXS5nZXRDaGlsZHJlbiggcmVsYXRpb25OYW1lcyApXG4gICAgICAudGhlbiggKCBjaGlsZHJlbiApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNoaWxkcmVuIG9mIHRoZSBub2RlIHRoYXQgYXJlIHJlZ2lzdGVyZWQgaW4gdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHBhcmVudElkIHtTdHJpbmd9IGlkIG9mIHRoZSBwYXJlbnQgbm9kZVxuICAgKiBAcGFyYW0gY29udGV4dElkIHtTdHJpbmd9IGlkIG9mIHRoZSBjb250ZXh0IG5vZGVcbiAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXk8T2JqZWN0Pj59IFRoZSBpbmZvIG9mIHRoZSBjaGlsZHJlbiB0aGF0IHdlcmUgZm91bmRcbiAgICovXG4gIGdldENoaWxkcmVuSW5Db250ZXh0KCBwYXJlbnRJZCwgY29udGV4dElkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNvbnRleHRJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHRoaXMubm9kZXNbY29udGV4dElkXSApLnRoZW4oIGNoaWxkcmVuID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX2FkZE5vZGUoIGNoaWxkcmVuW2ldICk7XG4gICAgICAgICAgcmVzLnB1c2goIHRoaXMuZ2V0SW5mbyggY2hpbGRyZW5baV0uZ2V0SWQoKS5nZXQoKSApICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgaW5mbyBhZ2dyZWdhdGVkIHdpdGggaXRzIGNoaWxkcmVuSWRzLCBjb250ZXh0SWRzIGFuZCBlbGVtZW50XG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRJbmZvKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW25vZGVJZF07XG4gICAgY29uc3QgcmVzID0gbm9kZS5pbmZvLmRlZXBfY29weSgpO1xuICAgIHJlc1snY2hpbGRyZW5JZHMnXSA9IG5vZGUuZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICByZXNbJ2NvbnRleHRJZHMnXSA9IG5vZGUuY29udGV4dElkcztcbiAgICByZXNbJ2VsZW1lbnQnXSA9IG5vZGUuZWxlbWVudDtcbiAgICByZXNbJ2hhc0NoaWxkcmVuJ10gPSBub2RlLmNoaWxkcmVuLnNpemUgPiAwO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZXRDaGlsZHJlbklkcyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbbm9kZUlkXS5nZXRDaGlsZHJlbklkcygpO1xuICAgIH1cbiAgfVxuXG4gIGxpc3Rlbk9uTm9kZUFkZGVkKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJzT25Ob2RlQWRkZWQuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZ09uTm9kZUFkZGVkLmJpbmQoIHRoaXMsIGNhbGxlciApO1xuICB9XG5cbiAgbGlzdGVuT25Ob2RlUmVtb3ZlKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZS5iaW5kKCB0aGlzLCBjYWxsZXIgKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCggY2FsbGVyICkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLmRlbGV0ZSggY2FsbGVyICk7XG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlKCBjYWxsZXIgKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuZGVsZXRlKCBjYWxsZXIgKTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEBwYXJhbSBpbmZvIG5ldyBpbmZvIGZvciB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgaXMgTG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgbW9kaWZ5Tm9kZSggbm9kZUlkLCBpbmZvICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRPIERPIDogY2hhbmdlIHRoZSBmb2xsb3dpbmcgXCJtb2RfYXR0clxuICAgIC8vIHRvIGEgZGlyZWN0IFwidXBkYXRlXCIgb2YgdGhlIGV4aXN0aW5nIG1vZGVsLlxuICAgIC8vIFRoaXMgd2lsbCByZWR1Y2UgdGhlIGNyZWF0aW9uIG9mIG1vZGVsIGJ1dFxuICAgIHRoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGEgbm9kZSBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5iaW5kIHRoZSBzYW1lIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2FsbGVyIHtPYmplY3R9IHVzdWFsbHkgJ3RoaXMnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259IHRvIGJlIGNhbGwgZXZlcnkgY2hhbmdlIG9mIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWQgfCBmdW5jdGlvbn0gcmV0dXJuIGEgZnVuY3Rpb24gdG8gYWxsb3cgdG8gbm9kZSB1bmJpbmRpbmcgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgZXhpc3QgdW5kZWZpbmVkIGFuZCBjYWxsZXIgaXMgYW4gb2JqZWN0IGFuZCBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIG90aGVyd2lzZVxuICAgKi9cbiAgYmluZE5vZGUoIG5vZGVJZCwgY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApIHx8IHR5cGVvZiBjYWxsZXIgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuc2V0KCBub2RlSWQsIG5ldyBNYXAoIFtcbiAgICAgICAgW2NhbGxlciwgY2FsbGJhY2tdXG4gICAgICBdICkgKTtcbiAgICAgIHRoaXMuX2JpbmROb2RlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdW5CaW5kLmJpbmQoIHRoaXMsIG5vZGVJZCwgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb2NlIHRoZSBjaGlsZCBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgZnJvbSB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHBhcmVudElkLlxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcGFyYW0gc3RvcFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cbiAgICovXG4gIHJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBzdG9wID0gZmFsc2UgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIm5vZGVJZCB1bmtub3duLlwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiAhc3RvcCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oIG5vZGVJZCwgW10gKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5yZW1vdmVDaGlsZCggbm9kZUlkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgdHJ1ZSApIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApKSB7XG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVycy52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggbm9kZUlkICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLnJlbW92ZUNoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcImNoaWxkSWQgdW5rbm93bi4gSXQgbWlnaHQgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IG5vZGVcIiApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRleHQgdG8gdGhlIGdyYXBoXG4gICAqIEBwYXJhbSBuYW1lIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSBlbHQge01vZGVsfSBlbGVtZW50IG9mIHRoZSBjb250ZXh0IGlmIG5lZWRlZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTcGluYWxDb250ZXh0Pn1cbiAgICovXG4gIGFkZENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApIHtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IFNwaW5hbENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApO1xuICAgIHRoaXMubm9kZXNbY29udGV4dC5pbmZvLmlkLmdldCgpXSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGguYWRkQ29udGV4dCggY29udGV4dCApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtTcGluYWxDb250ZXh0fHVuZGVmaW5lZH1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBrZXkgKSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgbm9kZSByZWZlcmVuY2VkIGJ5IGlkIGZyb20gdGggZ3JhcGguXG4gICAqIEBwYXJhbSBpZFxuICAgKi9cbiAgcmVtb3ZlRnJvbUdyYXBoKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0ucmVtb3ZlRnJvbUdyYXBoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm5vZGVzW2NvbnRleHRJZF07XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGRJbkNvbnRleHQoIGNoaWxkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgY29udGV4dCApO1xuICAgIH1cbiAgICAvL1RPRE8gb3B0aW9uIHBhcnNlclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoICdOb2RlIGlkJyArIHBhcmVudElkICsgJyBub3QgZm91bmQnICkgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBjaGlsZElkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2hpbGRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IHJldHVybiB0cnVlIGlmIHRoZSBjaGlsZCBjb3VsZCBiZSBhZGRlZCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhZGRDaGlsZCggcGFyZW50SWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBub2RlIGFuZCBhZGQgaXQgYXMgY2hpbGQgdG8gdGhlIHBhcmVudElkLlxuICAgKiBAcGFyYW0gcGFyZW50SWQge3N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBub2RlIHtPYmplY3R9IG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2luZm8nIGFuZCBjYW4gaGF2ZSBhbiBhdHRyaWJ1dGUgJ2VsZW1lbnQnXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge3N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgd2FzIGNyZWF0ZWQgYWRkZWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBhZGRDaGlsZEFuZENyZWF0ZU5vZGUoIHBhcmVudElkLCBub2RlLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoICdpbmZvJyApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUlkID0gdGhpcy5jcmVhdGVOb2RlKCBub2RlLmluZm8sIG5vZGUuZWxlbWVudCApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoIHBhcmVudElkLCBub2RlSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=