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
        for (var _iterator3 = this.listeners.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZF9hdHRyIiwiU3BpbmFsR3JhcGgiLCJzZXRHcmFwaCIsImdldElkIiwiZ2V0IiwiZ2V0Q2hpbGRyZW4iLCJnZXROb2RlcyIsImdldE5vZGUiLCJpZCIsImdldEluZm8iLCJ1bmRlZmluZWQiLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwicmVsYXRpb25OYW1lcyIsIlByb21pc2UiLCJyZWplY3QiLCJFcnJvciIsImxlbmd0aCIsImNoaWxkcmVuIiwicmVsYXRpb25NYXAiLCJwdXNoIiwia2V5cyIsInJlcyIsImkiLCJfYWRkTm9kZSIsImdldENoaWxkcmVuSW5Db250ZXh0IiwicGFyZW50SWQiLCJjb250ZXh0SWQiLCJub2RlSWQiLCJub2RlIiwiaW5mbyIsImRlZXBfY29weSIsImdldENoaWxkcmVuSWRzIiwiY29udGV4dElkcyIsImVsZW1lbnQiLCJzaXplIiwibGlzdGVuT25Ob2RlQWRkZWQiLCJjYWxsZXIiLCJjYWxsYmFjayIsInNldCIsInN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCIsImJpbmQiLCJsaXN0ZW5Pbk5vZGVSZW1vdmUiLCJzdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlIiwiZGVsZXRlIiwibW9kaWZ5Tm9kZSIsIm1vZF9hdHRyIiwiYmluZE5vZGUiLCJoYXMiLCJfYmluZE5vZGUiLCJfdW5CaW5kIiwicmVtb3ZlQ2hpbGQiLCJjaGlsZElkIiwicmVsYXRpb25OYW1lIiwicmVsYXRpb25UeXBlIiwic3RvcCIsImxpc3RlbmVycyIsInZhbHVlcyIsImFkZENvbnRleHQiLCJuYW1lIiwidHlwZSIsImVsdCIsImNvbnRleHQiLCJTcGluYWxDb250ZXh0IiwiZ2V0Q29udGV4dCIsImtleSIsImdldE5hbWUiLCJyZW1vdmVGcm9tR3JhcGgiLCJjcmVhdGVOb2RlIiwiU3BpbmFsTm9kZSIsImdldFR5cGUiLCJhZGRDaGlsZEluQ29udGV4dCIsImNoaWxkIiwiYWRkQ2hpbGQiLCJyZXNvbHZlIiwiYWRkQ2hpbGRBbmRDcmVhdGVOb2RlIiwiX2FyZUFsbENoaWxkcmVuTG9hZGVkIiwiY2hpbGRyZW5JZHMiLCJoYXNBbGxDaGlsZCIsIl9iaW5kRnVuYyIsImJpbmRlciIsInVuYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBLE1BQU1BLE1BQU0sR0FBRyxPQUFPQyxNQUFQLElBQWlCLFdBQWpCLEdBQStCQyxNQUEvQixHQUF3Q0QsTUFBdkQ7QUFDQTs7Ozs7Ozs7QUFPQSxNQUFNRSxtQkFBTixDQUEwQjtBQUV4Qjs7O0FBR0FDLEVBQUFBLFdBQVcsQ0FBRUMsU0FBRixFQUFjO0FBQ3ZCLFNBQUtDLFVBQUwsR0FBa0IsSUFBSUMsR0FBSixFQUFsQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJRCxHQUFKLEVBQWY7QUFDQSxTQUFLRSxvQkFBTCxHQUE0QixJQUFJRixHQUFKLEVBQTVCO0FBQ0EsU0FBS0csb0JBQUwsR0FBNEIsSUFBSUgsR0FBSixFQUE1QjtBQUNBLFNBQUtJLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEVBQWI7O0FBQ0EsUUFBSSxPQUFPUCxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBRXBDTCxNQUFBQSxNQUFNLENBQUNhLE1BQVAsQ0FBY0MsWUFBZCxDQUEyQkMsUUFBM0IsR0FDR0MsSUFESCxD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QUE7QUFFakMsOEJBQXFCLEtBQUs5QyxVQUFMLENBQWdCc0IsR0FBaEIsQ0FBcUJ3QixNQUFyQixFQUE4QjZCLE1BQTlCLEVBQXJCLG1JQUE2RDtBQUFBLGNBQXBEbkIsUUFBb0Q7QUFDM0RBLFVBQUFBLFFBQVEsQ0FBRSxLQUFLbkQsS0FBTCxDQUFXeUMsTUFBWCxDQUFGLENBQVI7QUFDRDtBQUpnQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS2xDO0FBQ0Y7QUFFRDs7Ozs7Ozs7O0FBT0FzQixFQUFBQSxPQUFPLENBQUV0QixNQUFGLEVBQVVvRCxNQUFWLEVBQW1CO0FBRXhCLFFBQUksQ0FBQyxLQUFLbEcsVUFBTCxDQUFnQmtFLEdBQWhCLENBQXFCcEIsTUFBckIsQ0FBTCxFQUFvQztBQUNsQyxhQUFPLEtBQVA7QUFDRDs7QUFFRCxVQUFNTixHQUFHLEdBQUcsS0FBS3hDLFVBQUwsQ0FBZ0JzQixHQUFoQixDQUFxQndCLE1BQXJCLEVBQThCZ0IsTUFBOUIsQ0FBc0NvQyxNQUF0QyxDQUFaOztBQUVBLFFBQUksS0FBS2xHLFVBQUwsQ0FBZ0JzQixHQUFoQixDQUFxQndCLE1BQXJCLEVBQThCTyxJQUE5QixLQUF1QyxDQUEzQyxFQUE4QztBQUM1QyxXQUFLaEQsS0FBTCxDQUFXeUMsTUFBWCxFQUFtQnFELE1BQW5CLENBQTJCLEtBQUtqRyxPQUFMLENBQWFvQixHQUFiLENBQWtCd0IsTUFBbEIsQ0FBM0I7QUFDQSxXQUFLNUMsT0FBTCxDQUFhNEQsTUFBYixDQUFxQmhCLE1BQXJCO0FBQ0EsV0FBSzlDLFVBQUwsQ0FBZ0I4RCxNQUFoQixDQUF3QmhCLE1BQXhCO0FBQ0Q7O0FBRUQsV0FBT04sR0FBUDtBQUNEOztBQXBjdUI7O2VBdWNYM0MsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTcGluYWxDb250ZXh0LCBTcGluYWxHcmFwaCwgU3BpbmFsTm9kZSB9IGZyb20gXCJzcGluYWwtbW9kZWwtZ3JhcGhcIjtcbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbi8qKlxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgTWFwPE9iamVjdCwgZnVuY3Rpb24+Pn0gYmluZGVkTm9kZSBOb2RlSWQgPT4gQ2FsbGVyID0+IENhbGxiYWNrLiBBbGwgbm9kZXMgdGhhdCBhcmUgYmluZFxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgZnVuY3Rpb24+fSBiaW5kZXJzIE5vZGVJZCA9PiBDYWxsQmFjayBmcm9tIGJpbmQgbWV0aG9kLlxuICogIEBwcm9wZXJ0eSB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBsaXN0ZW5lcnMgY2FsbGVyID0+IGNhbGxiYWNrLiBMaXN0IG9mIGFsbCBsaXN0ZW5lcnMgb24gbm9kZSBhZGRlZFxuICogIEBwcm9wZXJ0eSB7T2JqZWN0fSBub2RlcyBjb250YWluaW5nIGFsbCBTcGluYWxOb2RlIGN1cnJlbnRseSBsb2FkZWRcbiAqICBAcHJvcGVydHkge1NwaW5hbEdyYXBofSBncmFwaFxuICovXG5jbGFzcyBHcmFwaE1hbmFnZXJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQHBhcmFtIHZpZXdlckVudiB7Ym9vbGVhbn0gaWYgZGVmaW5lZCBsb2FkIGdyYXBoIGZyb20gZ2V0TW9kZWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKCB2aWV3ZXJFbnYgKSB7XG4gICAgdGhpcy5iaW5kZWROb2RlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmluZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMuZ3JhcGggPSB7fTtcbiAgICBpZiAodHlwZW9mIHZpZXdlckVudiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXG4gICAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbFN5c3RlbS5nZXRNb2RlbCgpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgIGZvcmdlRmlsZSA9PiB0aGlzLnNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlIClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgY3VycmVudCBncmFwaCB3aXRoIHRoZSBvbmUgb2YgdGhlIGZvcmdlRmlsZSBpZiB0aGVyZSBpcyBvbmUgY3JlYXRlIG9uZSBpZiBub3RlXG4gICAqIEBwYXJhbSBmb3JnZUZpbGVcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RyaW5nPn0gdGhlIGlkIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKSB7XG5cbiAgICBpZiAoIWZvcmdlRmlsZS5oYXNPd25Qcm9wZXJ0eSggJ2dyYXBoJyApKSB7XG4gICAgICBmb3JnZUZpbGUuYWRkX2F0dHIoIHtcbiAgICAgICAgZ3JhcGg6IG5ldyBTcGluYWxHcmFwaCgpXG4gICAgICB9ICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldEdyYXBoKCBmb3JnZUZpbGUuZ3JhcGggKTtcblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoKCBncmFwaCApIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5nZXRJZCA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICBkZWxldGUgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldO1xuICAgIH1cbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldID0gdGhpcy5ncmFwaDtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpLCBbXSApXG4gICAgICAudGhlbiggKCkgPT4ge3JldHVybiB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCk7fSApO1xuXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBsb2FkZWQgTm9kZXNcbiAgICovXG4gIGdldE5vZGVzKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0IHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Tm9kZSggaWQgKSB7XG5cbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5mbyggaWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgY3VycmVudCBncmFwaFxuICAgKiBAcmV0dXJucyB7e318U3BpbmFsR3JhcGh9XG4gICAqL1xuICBnZXRHcmFwaCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFwaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7U3BpbmFsTm9kZSB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldFJlYWxOb2RlKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBjaGlsZHJlbiBvZiBhIG5vZGVcbiAgICogQHBhcmFtIGlkXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWVzIHtBcnJheX1cbiAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXk8U3BpbmFsTm9kZVJlZj4+fVxuICAgKi9cbiAgZ2V0Q2hpbGRyZW4oIGlkLCByZWxhdGlvbk5hbWVzID0gW10gKSB7XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIk5vZGUgaWQ6IFwiICsgaWQgKyBcIiBub3QgZm91bmRcIiApICk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aW9uTmFtZXMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIGZvciAobGV0IHJlbGF0aW9uTWFwIG9mIHRoaXMubm9kZXNbaWRdLmNoaWxkcmVuKSB7XG4gICAgICAgIHJlbGF0aW9uTmFtZXMucHVzaCggLi4ucmVsYXRpb25NYXAua2V5cygpICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdLmdldENoaWxkcmVuKCByZWxhdGlvbk5hbWVzIClcbiAgICAgIC50aGVuKCAoIGNoaWxkcmVuICkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX2FkZE5vZGUoIGNoaWxkcmVuW2ldICk7XG4gICAgICAgICAgcmVzLnB1c2goIHRoaXMuZ2V0SW5mbyggY2hpbGRyZW5baV0uZ2V0SWQoKS5nZXQoKSApICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgdGhhdCBhcmUgcmVnaXN0ZXJlZCBpbiB0aGUgY29udGV4dFxuICAgKiBAcGFyYW0gcGFyZW50SWQge1N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBjb250ZXh0SWQge1N0cmluZ30gaWQgb2YgdGhlIGNvbnRleHQgbm9kZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxPYmplY3Q+Pn0gVGhlIGluZm8gb2YgdGhlIGNoaWxkcmVuIHRoYXQgd2VyZSBmb3VuZFxuICAgKi9cbiAgZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHBhcmVudElkLCBjb250ZXh0SWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5nZXRDaGlsZHJlbkluQ29udGV4dCggdGhpcy5ub2Rlc1tjb250ZXh0SWRdICkudGhlbiggY2hpbGRyZW4gPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSBpbmZvIGFnZ3JlZ2F0ZWQgd2l0aCBpdHMgY2hpbGRyZW5JZHMsIGNvbnRleHRJZHMgYW5kIGVsZW1lbnRcbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEluZm8oIG5vZGVJZCApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXNbbm9kZUlkXTtcbiAgICBjb25zdCByZXMgPSBub2RlLmluZm8uZGVlcF9jb3B5KCk7XG4gICAgcmVzWydjaGlsZHJlbklkcyddID0gbm9kZS5nZXRDaGlsZHJlbklkcygpO1xuICAgIHJlc1snY29udGV4dElkcyddID0gbm9kZS5jb250ZXh0SWRzO1xuICAgIHJlc1snZWxlbWVudCddID0gbm9kZS5lbGVtZW50O1xuICAgIHJlc1snaGFzQ2hpbGRyZW4nXSA9IG5vZGUuY2hpbGRyZW4uc2l6ZSA+IDA7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdldENoaWxkcmVuSWRzKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgfVxuICB9XG5cbiAgbGlzdGVuT25Ob2RlQWRkZWQoIGNhbGxlciwgY2FsbGJhY2sgKSB7XG4gICAgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5zZXQoIGNhbGxlciwgY2FsbGJhY2sgKTtcbiAgICByZXR1cm4gdGhpcy5zdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQuYmluZCggdGhpcywgY2FsbGVyICk7XG4gIH1cblxuICBsaXN0ZW5Pbk5vZGVSZW1vdmUoY2FsbGVyLCBjYWxsYmFjaykge1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuc2V0KGNhbGxlciwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUuYmluZCh0aGlzLGNhbGxlcik7XG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQoIGNhbGxlciApIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5kZWxldGUoIGNhbGxlciApO1xuICB9XG5cbiAgc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZShjYWxsZXIpe1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLmRlbGV0ZShjYWxsZXIpO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0gbm9kZUlkIGlkIG9mIHRoZSBkZXNpcmVkIG5vZGVcbiAgICogQHBhcmFtIGluZm8gbmV3IGluZm8gZm9yIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBpcyBMb2FkZWQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBtb2RpZnlOb2RlKCBub2RlSWQsIGluZm8gKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gVE8gRE8gOiBjaGFuZ2UgdGhlIGZvbGxvd2luZyBcIm1vZF9hdHRyXG4gICAgLy8gdG8gYSBkaXJlY3QgXCJ1cGRhdGVcIiBvZiB0aGUgZXhpc3RpbmcgbW9kZWwuXG4gICAgLy8gVGhpcyB3aWxsIHJlZHVjZSB0aGUgY3JlYXRpb24gb2YgbW9kZWwgYnV0XG4gICAgdGhpcy5ub2Rlc1tub2RlSWRdLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgYSBub2RlIGFuZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bmJpbmQgdGhlIHNhbWUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjYWxsZXIge09iamVjdH0gdXN1YWxseSAndGhpcydcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtmdW5jdGlvbn0gdG8gYmUgY2FsbCBldmVyeSBjaGFuZ2Ugb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge3VuZGVmaW5lZCB8IGZ1bmN0aW9ufSByZXR1cm4gYSBmdW5jdGlvbiB0byBhbGxvdyB0byBub2RlIHVuYmluZGluZyBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBleGlzdCB1bmRlZmluZWQgYW5kIGNhbGxlciBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24gb3RoZXJ3aXNlXG4gICAqL1xuICBiaW5kTm9kZSggbm9kZUlkLCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkgfHwgdHlwZW9mIGNhbGxlciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5zZXQoIG5vZGVJZCwgbmV3IE1hcCggW1xuICAgICAgICBbY2FsbGVyLCBjYWxsYmFja11cbiAgICAgIF0gKSApO1xuICAgICAgdGhpcy5fYmluZE5vZGUoIG5vZGVJZCApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91bkJpbmQuYmluZCggdGhpcywgbm9kZUlkLCBjYWxsZXIgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHN0b3AgPSBmYWxzZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwibm9kZUlkIHVua25vd24uXCIgKSApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCB0cnVlICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlSWQgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0ucmVtb3ZlQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiY2hpbGRJZCB1bmtub3duLiBJdCBtaWdodCBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgbm9kZVwiICkgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udGV4dCB0byB0aGUgZ3JhcGhcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIGVsdCB7TW9kZWx9IGVsZW1lbnQgb2YgdGhlIGNvbnRleHQgaWYgbmVlZGVkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNwaW5hbENvbnRleHQ+fVxuICAgKi9cbiAgYWRkQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICkge1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgU3BpbmFsQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICk7XG4gICAgdGhpcy5ub2Rlc1tjb250ZXh0LmluZm8uaWQuZ2V0KCldID0gY29udGV4dDtcbiAgICByZXR1cm4gdGhpcy5ncmFwaC5hZGRDb250ZXh0KCBjb250ZXh0ICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge1NwaW5hbENvbnRleHR8dW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Q29udGV4dCggbmFtZSApIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGtleSApKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW2tleV07XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgU3BpbmFsQ29udGV4dCAmJiBub2RlLmdldE5hbWUoKS5nZXQoKSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBub2RlIHJlZmVyZW5jZWQgYnkgaWQgZnJvbSB0aCBncmFwaC5cbiAgICogQHBhcmFtIGlkXG4gICAqL1xuICByZW1vdmVGcm9tR3JhcGgoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICB0aGlzLm5vZGVzW2lkXS5yZW1vdmVGcm9tR3JhcGgoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IG5vZGUuXG4gICAqIFRoZSBub2RlIG5ld2x5IGNyZWF0ZWQgaXMgdm9sYXRpbGUgaS5lIGl0IHdvbid0IGJlIHN0b3JlIGluIHRoZSBmaWxlc3lzdGVtIGFzIGxvbmcgaXQncyBub3QgYWRkZWQgYXMgY2hpbGQgdG8gYW5vdGhlciBub2RlXG4gICAqIEBwYXJhbSBpbmZvIHtPYmplY3R9IGluZm9ybWF0aW9uIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBlbGVtZW50IHtNb2RlbH0gZWxlbWVudCBwb2ludGVkIGJ5IHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHJldHVybiB0aGUgY2hpbGQgaWRlbnRpZmllclxuICAgKi9cbiAgY3JlYXRlTm9kZSggaW5mbywgZWxlbWVudCApIHtcbiAgICBjb25zdCBub2RlID0gbmV3IFNwaW5hbE5vZGUoIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBlbGVtZW50ICk7XG4gICAgaWYgKCFpbmZvLmhhc093blByb3BlcnR5KCAndHlwZScgKSkge1xuICAgICAgaW5mb1sndHlwZSddID0gbm9kZS5nZXRUeXBlKCkuZ2V0KCk7XG4gICAgfVxuICAgIGNvbnN0IG5vZGVJZCA9IG5vZGUuaW5mby5pZC5nZXQoKTtcbiAgICBpbmZvWydpZCddID0gbm9kZUlkO1xuICAgIG5vZGUubW9kX2F0dHIoICdpbmZvJywgaW5mbyApO1xuICAgIHRoaXMuX2FkZE5vZGUoIG5vZGUgKTtcbiAgICByZXR1cm4gbm9kZUlkO1xuICB9XG5cbiAgYWRkQ2hpbGRJbkNvbnRleHQoIHBhcmVudElkLCBjaGlsZElkLCBjb250ZXh0SWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjb250ZXh0SWQgKSkge1xuICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLm5vZGVzW2NoaWxkSWRdO1xuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMubm9kZXNbY29udGV4dElkXTtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5hZGRDaGlsZEluQ29udGV4dCggY2hpbGQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBjb250ZXh0ICk7XG4gICAgfVxuICAgIC8vVE9ETyBvcHRpb24gcGFyc2VyXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggJ05vZGUgaWQnICsgcGFyZW50SWQgKyAnIG5vdCBmb3VuZCcgKSApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWRcbiAgICogQHBhcmFtIHBhcmVudElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn0gcmV0dXJuIHRydWUgaWYgdGhlIGNoaWxkIGNvdWxkIGJlIGFkZGVkIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGFkZENoaWxkKCBwYXJlbnRJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgfHwgIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggZmFsc2UgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkudGhlbiggKCkgPT4ge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSApO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5vZGUgYW5kIGFkZCBpdCBhcyBjaGlsZCB0byB0aGUgcGFyZW50SWQuXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7c3RyaW5nfSBpZCBvZiB0aGUgcGFyZW50IG5vZGVcbiAgICogQHBhcmFtIG5vZGUge09iamVjdH0gbXVzdCBoYXZlIGFuIGF0dHJpYnV0ZSAnaW5mbycgYW5kIGNhbiBoYXZlIGFuIGF0dHJpYnV0ZSAnZWxlbWVudCdcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSB3YXMgY3JlYXRlZCBhZGRlZCBhcyBjaGlsZCB0byB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJlbnRJZCBzdWNjZXNzZnVsbHlcbiAgICovXG4gIGFkZENoaWxkQW5kQ3JlYXRlTm9kZSggcGFyZW50SWQsIG5vZGUsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eSggJ2luZm8nICkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlSWQgPSB0aGlzLmNyZWF0ZU5vZGUoIG5vZGUuaW5mbywgbm9kZS5lbGVtZW50ICk7XG5cbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZCggcGFyZW50SWQsIG5vZGVJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKTtcbiAgfVxuXG4gIC8qKipcbiAgICogYWRkIGEgbm9kZSB0byB0aGUgc2V0IG9mIG5vZGVcbiAgICogQHBhcmFtIG5vZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hZGROb2RlKCBub2RlICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZS5nZXRJZCgpLmdldCgpICkpIHtcbiAgICAgIHRoaXMubm9kZXNbbm9kZS5pbmZvLmlkLmdldCgpXSA9IG5vZGU7XG5cbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=