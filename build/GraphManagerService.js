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
    return this.stopListening.bind(this, caller);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZF9hdHRyIiwiU3BpbmFsR3JhcGgiLCJzZXRHcmFwaCIsImdldElkIiwiZ2V0IiwiZ2V0Q2hpbGRyZW4iLCJnZXROb2RlcyIsImdldE5vZGUiLCJpZCIsImdldEluZm8iLCJ1bmRlZmluZWQiLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwicmVsYXRpb25OYW1lcyIsIlByb21pc2UiLCJyZWplY3QiLCJFcnJvciIsImxlbmd0aCIsImNoaWxkcmVuIiwicmVsYXRpb25NYXAiLCJwdXNoIiwia2V5cyIsInJlcyIsImkiLCJfYWRkTm9kZSIsImdldENoaWxkcmVuSW5Db250ZXh0IiwicGFyZW50SWQiLCJjb250ZXh0SWQiLCJub2RlSWQiLCJub2RlIiwiaW5mbyIsImRlZXBfY29weSIsImdldENoaWxkcmVuSWRzIiwiY29udGV4dElkcyIsImVsZW1lbnQiLCJzaXplIiwibGlzdGVuT25Ob2RlQWRkZWQiLCJjYWxsZXIiLCJjYWxsYmFjayIsInNldCIsInN0b3BMaXN0ZW5pbmciLCJiaW5kIiwibGlzdGVuT25Ob2RlUmVtb3ZlIiwic3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZSIsInN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCIsImRlbGV0ZSIsIm1vZGlmeU5vZGUiLCJtb2RfYXR0ciIsImJpbmROb2RlIiwiaGFzIiwiX2JpbmROb2RlIiwiX3VuQmluZCIsInJlbW92ZUNoaWxkIiwiY2hpbGRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsInN0b3AiLCJsaXN0ZW5lcnMiLCJ2YWx1ZXMiLCJhZGRDb250ZXh0IiwibmFtZSIsInR5cGUiLCJlbHQiLCJjb250ZXh0IiwiU3BpbmFsQ29udGV4dCIsImdldENvbnRleHQiLCJrZXkiLCJnZXROYW1lIiwicmVtb3ZlRnJvbUdyYXBoIiwiY3JlYXRlTm9kZSIsIlNwaW5hbE5vZGUiLCJnZXRUeXBlIiwiYWRkQ2hpbGRJbkNvbnRleHQiLCJjaGlsZCIsImFkZENoaWxkIiwicmVzb2x2ZSIsImFkZENoaWxkQW5kQ3JlYXRlTm9kZSIsIl9hcmVBbGxDaGlsZHJlbkxvYWRlZCIsImNoaWxkcmVuSWRzIiwiaGFzQWxsQ2hpbGQiLCJfYmluZEZ1bmMiLCJiaW5kZXIiLCJ1bmJpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQSxNQUFNQSxNQUFNLEdBQUcsT0FBT0MsTUFBUCxJQUFpQixXQUFqQixHQUErQkMsTUFBL0IsR0FBd0NELE1BQXZEO0FBQ0E7Ozs7Ozs7O0FBT0EsTUFBTUUsbUJBQU4sQ0FBMEI7QUFFeEI7OztBQUdBQyxFQUFBQSxXQUFXLENBQUVDLFNBQUYsRUFBYztBQUN2QixTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsR0FBSixFQUFmO0FBQ0EsU0FBS0Usb0JBQUwsR0FBNEIsSUFBSUYsR0FBSixFQUE1QjtBQUNBLFNBQUtHLG9CQUFMLEdBQTRCLElBQUlILEdBQUosRUFBNUI7QUFDQSxTQUFLSSxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUNBLFFBQUksT0FBT1AsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUVwQ0wsTUFBQUEsTUFBTSxDQUFDYSxNQUFQLENBQWNDLFlBQWQsQ0FBMkJDLFFBQTNCLEdBQ0dDLElBREgsQ0FFSUMsU0FBUyxJQUFJLEtBQUtDLHFCQUFMLENBQTRCRCxTQUE1QixDQUZqQixFQUlHRSxLQUpILENBSVVDLENBQUMsSUFBSUMsT0FBTyxDQUFDQyxLQUFSLENBQWVGLENBQWYsQ0FKZjtBQUtEO0FBQ0Y7QUFFRDs7Ozs7OztBQUtBRixFQUFBQSxxQkFBcUIsQ0FBRUQsU0FBRixFQUFjO0FBRWpDLFFBQUksQ0FBQ0EsU0FBUyxDQUFDTSxjQUFWLENBQTBCLE9BQTFCLENBQUwsRUFBMEM7QUFDeENOLE1BQUFBLFNBQVMsQ0FBQ08sUUFBVixDQUFvQjtBQUNsQlosUUFBQUEsS0FBSyxFQUFFLElBQUlhLDZCQUFKO0FBRFcsT0FBcEI7QUFHRDs7QUFDRCxXQUFPLEtBQUtDLFFBQUwsQ0FBZVQsU0FBUyxDQUFDTCxLQUF6QixDQUFQO0FBRUQ7QUFFRDs7Ozs7OztBQUtBYyxFQUFBQSxRQUFRLENBQUVkLEtBQUYsRUFBVTtBQUVoQixRQUFJLE9BQU8sS0FBS0EsS0FBTCxDQUFXZSxLQUFsQixLQUE0QixVQUE1QixJQUEwQyxLQUFLaEIsS0FBTCxDQUFXWSxjQUFYLENBQTJCLEtBQUtYLEtBQUwsQ0FBV2UsS0FBWCxHQUFtQkMsR0FBbkIsRUFBM0IsQ0FBOUMsRUFBcUc7QUFDbkcsYUFBTyxLQUFLakIsS0FBTCxDQUFXLEtBQUtDLEtBQUwsQ0FBV2UsS0FBWCxHQUFtQkMsR0FBbkIsRUFBWCxDQUFQO0FBQ0Q7O0FBQ0QsU0FBS2hCLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtELEtBQUwsQ0FBVyxLQUFLQyxLQUFMLENBQVdlLEtBQVgsR0FBbUJDLEdBQW5CLEVBQVgsSUFBdUMsS0FBS2hCLEtBQTVDO0FBQ0EsV0FBTyxLQUFLaUIsV0FBTCxDQUFrQixLQUFLakIsS0FBTCxDQUFXZSxLQUFYLEdBQW1CQyxHQUFuQixFQUFsQixFQUE0QyxFQUE1QyxFQUNKWixJQURJLENBQ0UsTUFBTTtBQUFDLGFBQU8sS0FBS0osS0FBTCxDQUFXZSxLQUFYLEdBQW1CQyxHQUFuQixFQUFQO0FBQWlDLEtBRDFDLENBQVA7QUFHRDtBQUVEOzs7OztBQUdBRSxFQUFBQSxRQUFRLEdBQUc7QUFDVCxXQUFPLEtBQUtuQixLQUFaO0FBQ0Q7QUFFRDs7Ozs7OztBQUtBb0IsRUFBQUEsT0FBTyxDQUFFQyxFQUFGLEVBQU87QUFFWixRQUFJLEtBQUtyQixLQUFMLENBQVdZLGNBQVgsQ0FBMkJTLEVBQTNCLENBQUosRUFBcUM7QUFDbkMsYUFBTyxLQUFLQyxPQUFMLENBQWNELEVBQWQsQ0FBUDtBQUNEOztBQUVELFdBQU9FLFNBQVA7QUFDRDtBQUVEOzs7Ozs7QUFJQUMsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxLQUFLdkIsS0FBWjtBQUNEO0FBRUQ7Ozs7Ozs7QUFLQXdCLEVBQUFBLFdBQVcsQ0FBRUosRUFBRixFQUFPO0FBQ2hCLFFBQUksS0FBS3JCLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQlMsRUFBM0IsQ0FBSixFQUFxQztBQUNuQyxhQUFPLEtBQUtyQixLQUFMLENBQVdxQixFQUFYLENBQVA7QUFDRDs7QUFFRCxXQUFPRSxTQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7QUFNQUwsRUFBQUEsV0FBVyxDQUFFRyxFQUFGLEVBQU1LLGFBQWEsR0FBRyxFQUF0QixFQUEyQjtBQUNwQyxRQUFJLENBQUMsS0FBSzFCLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQlMsRUFBM0IsQ0FBTCxFQUFzQztBQUNwQyxhQUFPTSxPQUFPLENBQUNDLE1BQVIsQ0FBZ0JDLEtBQUssQ0FBRSxjQUFjUixFQUFkLEdBQW1CLFlBQXJCLENBQXJCLENBQVA7QUFDRDs7QUFFRCxRQUFJSyxhQUFhLENBQUNJLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFOUIsNkJBQXdCLEtBQUs5QixLQUFMLENBQVdxQixFQUFYLEVBQWVVLFFBQXZDLDhIQUFpRDtBQUFBLGNBQXhDQyxXQUF3QztBQUMvQ04sVUFBQUEsYUFBYSxDQUFDTyxJQUFkLENBQW9CLEdBQUdELFdBQVcsQ0FBQ0UsSUFBWixFQUF2QjtBQUNEO0FBSjZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLL0I7O0FBRUQsV0FBTyxLQUFLbEMsS0FBTCxDQUFXcUIsRUFBWCxFQUFlSCxXQUFmLENBQTRCUSxhQUE1QixFQUNKckIsSUFESSxDQUNJMEIsUUFBRixJQUFnQjtBQUNyQixZQUFNSSxHQUFHLEdBQUcsRUFBWjs7QUFDQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLFFBQVEsQ0FBQ0QsTUFBN0IsRUFBcUNNLENBQUMsRUFBdEMsRUFBMEM7QUFDeEMsYUFBS0MsUUFBTCxDQUFlTixRQUFRLENBQUNLLENBQUQsQ0FBdkI7O0FBQ0FELFFBQUFBLEdBQUcsQ0FBQ0YsSUFBSixDQUFVLEtBQUtYLE9BQUwsQ0FBY1MsUUFBUSxDQUFDSyxDQUFELENBQVIsQ0FBWXBCLEtBQVosR0FBb0JDLEdBQXBCLEVBQWQsQ0FBVjtBQUNEOztBQUNELGFBQU9rQixHQUFQO0FBQ0QsS0FSSSxDQUFQO0FBU0Q7QUFHRDs7Ozs7Ozs7QUFNQUcsRUFBQUEsb0JBQW9CLENBQUVDLFFBQUYsRUFBWUMsU0FBWixFQUF3QjtBQUMxQyxRQUFJLEtBQUt4QyxLQUFMLENBQVdZLGNBQVgsQ0FBMkIyQixRQUEzQixLQUF5QyxLQUFLdkMsS0FBTCxDQUFXWSxjQUFYLENBQTJCNEIsU0FBM0IsQ0FBN0MsRUFBcUY7QUFDbkYsYUFBTyxLQUFLeEMsS0FBTCxDQUFXdUMsUUFBWCxFQUFxQkQsb0JBQXJCLENBQTJDLEtBQUt0QyxLQUFMLENBQVd3QyxTQUFYLENBQTNDLEVBQW1FbkMsSUFBbkUsQ0FBeUUwQixRQUFRLElBQUk7QUFDMUYsY0FBTUksR0FBRyxHQUFHLEVBQVo7O0FBRUEsYUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTCxRQUFRLENBQUNELE1BQTdCLEVBQXFDTSxDQUFDLEVBQXRDLEVBQTBDO0FBQ3hDLGVBQUtDLFFBQUwsQ0FBZU4sUUFBUSxDQUFDSyxDQUFELENBQXZCOztBQUNBRCxVQUFBQSxHQUFHLENBQUNGLElBQUosQ0FBVSxLQUFLWCxPQUFMLENBQWNTLFFBQVEsQ0FBQ0ssQ0FBRCxDQUFSLENBQVlwQixLQUFaLEdBQW9CQyxHQUFwQixFQUFkLENBQVY7QUFDRDs7QUFFRCxlQUFPa0IsR0FBUDtBQUNELE9BVE0sQ0FBUDtBQVVEO0FBQ0Y7QUFFRDs7Ozs7OztBQUtBYixFQUFBQSxPQUFPLENBQUVtQixNQUFGLEVBQVc7QUFFaEIsUUFBSSxDQUFDLEtBQUt6QyxLQUFMLENBQVdZLGNBQVgsQ0FBMkI2QixNQUEzQixDQUFMLEVBQTBDO0FBQ3hDO0FBQ0Q7O0FBQ0QsVUFBTUMsSUFBSSxHQUFHLEtBQUsxQyxLQUFMLENBQVd5QyxNQUFYLENBQWI7QUFDQSxVQUFNTixHQUFHLEdBQUdPLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQVo7QUFDQVQsSUFBQUEsR0FBRyxDQUFDLGFBQUQsQ0FBSCxHQUFxQk8sSUFBSSxDQUFDRyxjQUFMLEVBQXJCO0FBQ0FWLElBQUFBLEdBQUcsQ0FBQyxZQUFELENBQUgsR0FBb0JPLElBQUksQ0FBQ0ksVUFBekI7QUFDQVgsSUFBQUEsR0FBRyxDQUFDLFNBQUQsQ0FBSCxHQUFpQk8sSUFBSSxDQUFDSyxPQUF0QjtBQUNBWixJQUFBQSxHQUFHLENBQUMsYUFBRCxDQUFILEdBQXFCTyxJQUFJLENBQUNYLFFBQUwsQ0FBY2lCLElBQWQsR0FBcUIsQ0FBMUM7QUFDQSxXQUFPYixHQUFQO0FBQ0Q7O0FBRURVLEVBQUFBLGNBQWMsQ0FBRUosTUFBRixFQUFXO0FBQ3ZCLFFBQUksS0FBS3pDLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQjZCLE1BQTNCLENBQUosRUFBeUM7QUFDdkMsYUFBTyxLQUFLekMsS0FBTCxDQUFXeUMsTUFBWCxFQUFtQkksY0FBbkIsRUFBUDtBQUNEO0FBQ0Y7O0FBRURJLEVBQUFBLGlCQUFpQixDQUFFQyxNQUFGLEVBQVVDLFFBQVYsRUFBcUI7QUFDcEMsU0FBS3JELG9CQUFMLENBQTBCc0QsR0FBMUIsQ0FBK0JGLE1BQS9CLEVBQXVDQyxRQUF2QztBQUNBLFdBQU8sS0FBS0UsYUFBTCxDQUFtQkMsSUFBbkIsQ0FBeUIsSUFBekIsRUFBK0JKLE1BQS9CLENBQVA7QUFDRDs7QUFFREssRUFBQUEsa0JBQWtCLENBQUNMLE1BQUQsRUFBU0MsUUFBVCxFQUFtQjtBQUNuQyxTQUFLcEQsb0JBQUwsQ0FBMEJxRCxHQUExQixDQUE4QkYsTUFBOUIsRUFBc0NDLFFBQXRDO0FBQ0EsV0FBTyxLQUFLSyx5QkFBTCxDQUErQkYsSUFBL0IsQ0FBb0MsSUFBcEMsRUFBeUNKLE1BQXpDLENBQVA7QUFDRDs7QUFFRE8sRUFBQUEsd0JBQXdCLENBQUVQLE1BQUYsRUFBVztBQUNqQyxXQUFPLEtBQUtwRCxvQkFBTCxDQUEwQjRELE1BQTFCLENBQWtDUixNQUFsQyxDQUFQO0FBQ0Q7O0FBRURNLEVBQUFBLHlCQUF5QixDQUFDTixNQUFELEVBQVE7QUFDL0IsV0FBTyxLQUFLbkQsb0JBQUwsQ0FBMEIyRCxNQUExQixDQUFpQ1IsTUFBakMsQ0FBUDtBQUNEO0FBQ0Q7Ozs7Ozs7QUFLQVMsRUFBQUEsVUFBVSxDQUFFbEIsTUFBRixFQUFVRSxJQUFWLEVBQWlCO0FBRXpCLFFBQUksQ0FBQyxLQUFLM0MsS0FBTCxDQUFXWSxjQUFYLENBQTJCNkIsTUFBM0IsQ0FBTCxFQUEwQztBQUN4QyxhQUFPLEtBQVA7QUFDRCxLQUp3QixDQU16QjtBQUNBO0FBQ0E7OztBQUNBLFNBQUt6QyxLQUFMLENBQVd5QyxNQUFYLEVBQW1CbUIsUUFBbkIsQ0FBNkIsTUFBN0IsRUFBcUNqQixJQUFyQztBQUVBLFdBQU8sSUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7OztBQU9Ba0IsRUFBQUEsUUFBUSxDQUFFcEIsTUFBRixFQUFVUyxNQUFWLEVBQWtCQyxRQUFsQixFQUE2QjtBQUNuQyxRQUFJLENBQUMsS0FBS25ELEtBQUwsQ0FBV1ksY0FBWCxDQUEyQjZCLE1BQTNCLENBQUQsSUFBd0MsT0FBT1MsTUFBUCxLQUFrQixRQUExRCxJQUFzRSxPQUFPQyxRQUFQLEtBQW9CLFVBQTlGLEVBQTBHO0FBQ3hHLGFBQU81QixTQUFQO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLNUIsVUFBTCxDQUFnQm1FLEdBQWhCLENBQXFCckIsTUFBckIsQ0FBSixFQUFtQztBQUNqQyxXQUFLOUMsVUFBTCxDQUFnQnNCLEdBQWhCLENBQXFCd0IsTUFBckIsRUFBOEJXLEdBQTlCLENBQW1DRixNQUFuQyxFQUEyQ0MsUUFBM0M7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLeEQsVUFBTCxDQUFnQnlELEdBQWhCLENBQXFCWCxNQUFyQixFQUE2QixJQUFJN0MsR0FBSixDQUFTLENBQ3BDLENBQUNzRCxNQUFELEVBQVNDLFFBQVQsQ0FEb0MsQ0FBVCxDQUE3Qjs7QUFHQSxXQUFLWSxTQUFMLENBQWdCdEIsTUFBaEI7QUFDRDs7QUFFRCxXQUFPLEtBQUt1QixPQUFMLENBQWFWLElBQWIsQ0FBbUIsSUFBbkIsRUFBeUJiLE1BQXpCLEVBQWlDUyxNQUFqQyxDQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7QUFTQWUsRUFBQUEsV0FBVyxDQUFFeEIsTUFBRixFQUFVeUIsT0FBVixFQUFtQkMsWUFBbkIsRUFBaUNDLFlBQWpDLEVBQStDQyxJQUFJLEdBQUcsS0FBdEQsRUFBOEQ7QUFFdkUsUUFBSSxDQUFDLEtBQUtyRSxLQUFMLENBQVdZLGNBQVgsQ0FBMkI2QixNQUEzQixDQUFMLEVBQTBDO0FBQ3hDLGFBQU9kLE9BQU8sQ0FBQ0MsTUFBUixDQUFnQkMsS0FBSyxDQUFFLGlCQUFGLENBQXJCLENBQVA7QUFDRDs7QUFFRCxRQUFJLENBQUMsS0FBSzdCLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQnNELE9BQTNCLENBQUQsSUFBeUMsQ0FBQ0csSUFBOUMsRUFBb0Q7QUFDbEQsYUFBTyxLQUFLbkQsV0FBTCxDQUFrQnVCLE1BQWxCLEVBQTBCLEVBQTFCLEVBQ0pwQyxJQURJLENBQ0UsTUFBTSxLQUFLNEQsV0FBTCxDQUFrQnhCLE1BQWxCLEVBQTBCeUIsT0FBMUIsRUFBbUNDLFlBQW5DLEVBQWlEQyxZQUFqRCxFQUErRCxJQUEvRCxDQURSLEVBRUo1RCxLQUZJLENBRUdDLENBQUMsSUFBSUMsT0FBTyxDQUFDQyxLQUFSLENBQWVGLENBQWYsQ0FGUixDQUFQO0FBR0QsS0FKRCxNQUlPLElBQUksS0FBS1QsS0FBTCxDQUFXWSxjQUFYLENBQTJCc0QsT0FBM0IsQ0FBSixFQUEwQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUMvQyw4QkFBcUIsS0FBS0ksU0FBTCxDQUFlQyxNQUFmLEVBQXJCLG1JQUE4QztBQUFBLGNBQXJDcEIsUUFBcUM7QUFDNUNBLFVBQUFBLFFBQVEsQ0FBRVYsTUFBRixDQUFSO0FBQ0Q7QUFIOEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFJL0MsYUFBTyxLQUFLekMsS0FBTCxDQUFXeUMsTUFBWCxFQUFtQndCLFdBQW5CLENBQWdDLEtBQUtqRSxLQUFMLENBQVdrRSxPQUFYLENBQWhDLEVBQXFEQyxZQUFyRCxFQUFtRUMsWUFBbkUsQ0FBUDtBQUNELEtBTE0sTUFLQTtBQUNMLGFBQU96QyxPQUFPLENBQUNDLE1BQVIsQ0FBZ0JDLEtBQUssQ0FBRSxxRUFBRixDQUFyQixDQUFQO0FBQ0Q7QUFDRjtBQUVEOzs7Ozs7Ozs7QUFPQTJDLEVBQUFBLFVBQVUsQ0FBRUMsSUFBRixFQUFRQyxJQUFSLEVBQWNDLEdBQWQsRUFBb0I7QUFDNUIsVUFBTUMsT0FBTyxHQUFHLElBQUlDLCtCQUFKLENBQW1CSixJQUFuQixFQUF5QkMsSUFBekIsRUFBK0JDLEdBQS9CLENBQWhCO0FBQ0EsU0FBSzNFLEtBQUwsQ0FBVzRFLE9BQU8sQ0FBQ2pDLElBQVIsQ0FBYXRCLEVBQWIsQ0FBZ0JKLEdBQWhCLEVBQVgsSUFBb0MyRCxPQUFwQztBQUNBLFdBQU8sS0FBSzNFLEtBQUwsQ0FBV3VFLFVBQVgsQ0FBdUJJLE9BQXZCLENBQVA7QUFDRDtBQUVEOzs7Ozs7QUFJQUUsRUFBQUEsVUFBVSxDQUFFTCxJQUFGLEVBQVM7QUFDakIsU0FBSyxJQUFJTSxHQUFULElBQWdCLEtBQUsvRSxLQUFyQixFQUE0QjtBQUMxQixVQUFJLEtBQUtBLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQm1FLEdBQTNCLENBQUosRUFBc0M7QUFDcEMsY0FBTXJDLElBQUksR0FBRyxLQUFLMUMsS0FBTCxDQUFXK0UsR0FBWCxDQUFiOztBQUNBLFlBQUlyQyxJQUFJLFlBQVltQywrQkFBaEIsSUFBaUNuQyxJQUFJLENBQUNzQyxPQUFMLEdBQWUvRCxHQUFmLE9BQXlCd0QsSUFBOUQsRUFBb0U7QUFDbEUsaUJBQU8vQixJQUFQO0FBQ0Q7QUFDRjtBQUNGO0FBRUY7QUFFRDs7Ozs7O0FBSUF1QyxFQUFBQSxlQUFlLENBQUU1RCxFQUFGLEVBQU87QUFDcEIsUUFBSSxLQUFLckIsS0FBTCxDQUFXWSxjQUFYLENBQTJCUyxFQUEzQixDQUFKLEVBQXFDO0FBQ25DLFdBQUtyQixLQUFMLENBQVdxQixFQUFYLEVBQWU0RCxlQUFmO0FBQ0Q7QUFDRjtBQUVEOzs7Ozs7Ozs7QUFPQUMsRUFBQUEsVUFBVSxDQUFFdkMsSUFBRixFQUFRSSxPQUFSLEVBQWtCO0FBQzFCLFVBQU1MLElBQUksR0FBRyxJQUFJeUMsNEJBQUosQ0FBZ0I1RCxTQUFoQixFQUEyQkEsU0FBM0IsRUFBc0N3QixPQUF0QyxDQUFiOztBQUNBLFFBQUksQ0FBQ0osSUFBSSxDQUFDL0IsY0FBTCxDQUFxQixNQUFyQixDQUFMLEVBQW9DO0FBQ2xDK0IsTUFBQUEsSUFBSSxDQUFDLE1BQUQsQ0FBSixHQUFlRCxJQUFJLENBQUMwQyxPQUFMLEdBQWVuRSxHQUFmLEVBQWY7QUFDRDs7QUFDRCxVQUFNd0IsTUFBTSxHQUFHQyxJQUFJLENBQUNDLElBQUwsQ0FBVXRCLEVBQVYsQ0FBYUosR0FBYixFQUFmO0FBQ0EwQixJQUFBQSxJQUFJLENBQUMsSUFBRCxDQUFKLEdBQWFGLE1BQWI7QUFDQUMsSUFBQUEsSUFBSSxDQUFDa0IsUUFBTCxDQUFlLE1BQWYsRUFBdUJqQixJQUF2Qjs7QUFDQSxTQUFLTixRQUFMLENBQWVLLElBQWY7O0FBQ0EsV0FBT0QsTUFBUDtBQUNEOztBQUVENEMsRUFBQUEsaUJBQWlCLENBQUU5QyxRQUFGLEVBQVkyQixPQUFaLEVBQXFCMUIsU0FBckIsRUFBZ0MyQixZQUFoQyxFQUE4Q0MsWUFBOUMsRUFBNkQ7QUFDNUUsUUFBSSxLQUFLcEUsS0FBTCxDQUFXWSxjQUFYLENBQTJCMkIsUUFBM0IsS0FBeUMsS0FBS3ZDLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQnNELE9BQTNCLENBQXpDLElBQWlGLEtBQUtsRSxLQUFMLENBQVdZLGNBQVgsQ0FBMkI0QixTQUEzQixDQUFyRixFQUE2SDtBQUMzSCxZQUFNOEMsS0FBSyxHQUFHLEtBQUt0RixLQUFMLENBQVdrRSxPQUFYLENBQWQ7QUFDQSxZQUFNVSxPQUFPLEdBQUcsS0FBSzVFLEtBQUwsQ0FBV3dDLFNBQVgsQ0FBaEI7QUFDQSxhQUFPLEtBQUt4QyxLQUFMLENBQVd1QyxRQUFYLEVBQXFCOEMsaUJBQXJCLENBQXdDQyxLQUF4QyxFQUErQ25CLFlBQS9DLEVBQTZEQyxZQUE3RCxFQUEyRVEsT0FBM0UsQ0FBUDtBQUNELEtBTDJFLENBTTVFOzs7QUFDQSxXQUFPakQsT0FBTyxDQUFDQyxNQUFSLENBQWdCQyxLQUFLLENBQUUsWUFBWVUsUUFBWixHQUF1QixZQUF6QixDQUFyQixDQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7OztBQVFBZ0QsRUFBQUEsUUFBUSxDQUFFaEQsUUFBRixFQUFZMkIsT0FBWixFQUFxQkMsWUFBckIsRUFBbUNDLFlBQW5DLEVBQWtEO0FBRXhELFFBQUksQ0FBQyxLQUFLcEUsS0FBTCxDQUFXWSxjQUFYLENBQTJCMkIsUUFBM0IsQ0FBRCxJQUEwQyxDQUFDLEtBQUt2QyxLQUFMLENBQVdZLGNBQVgsQ0FBMkJzRCxPQUEzQixDQUEvQyxFQUFxRjtBQUNuRixhQUFPdkMsT0FBTyxDQUFDNkQsT0FBUixDQUFpQixLQUFqQixDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLeEYsS0FBTCxDQUFXdUMsUUFBWCxFQUFxQmdELFFBQXJCLENBQStCLEtBQUt2RixLQUFMLENBQVdrRSxPQUFYLENBQS9CLEVBQW9EQyxZQUFwRCxFQUFrRUMsWUFBbEUsRUFBaUYvRCxJQUFqRixDQUF1RixNQUFNO0FBQ2xHLGFBQU8sSUFBUDtBQUNELEtBRk0sQ0FBUDtBQUdEO0FBRUQ7Ozs7Ozs7Ozs7QUFRQW9GLEVBQUFBLHFCQUFxQixDQUFFbEQsUUFBRixFQUFZRyxJQUFaLEVBQWtCeUIsWUFBbEIsRUFBZ0NDLFlBQWhDLEVBQStDO0FBQ2xFLFFBQUksQ0FBQzFCLElBQUksQ0FBQzlCLGNBQUwsQ0FBcUIsTUFBckIsQ0FBTCxFQUFvQztBQUNsQyxhQUFPLEtBQVA7QUFDRDs7QUFFRCxVQUFNNkIsTUFBTSxHQUFHLEtBQUt5QyxVQUFMLENBQWlCeEMsSUFBSSxDQUFDQyxJQUF0QixFQUE0QkQsSUFBSSxDQUFDSyxPQUFqQyxDQUFmO0FBRUEsV0FBTyxLQUFLd0MsUUFBTCxDQUFlaEQsUUFBZixFQUF5QkUsTUFBekIsRUFBaUMwQixZQUFqQyxFQUErQ0MsWUFBL0MsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7QUFLQS9CLEVBQUFBLFFBQVEsQ0FBRUssSUFBRixFQUFTO0FBQ2YsUUFBSSxDQUFDLEtBQUsxQyxLQUFMLENBQVdZLGNBQVgsQ0FBMkI4QixJQUFJLENBQUMxQixLQUFMLEdBQWFDLEdBQWIsRUFBM0IsQ0FBTCxFQUFzRDtBQUNwRCxXQUFLakIsS0FBTCxDQUFXMEMsSUFBSSxDQUFDQyxJQUFMLENBQVV0QixFQUFWLENBQWFKLEdBQWIsRUFBWCxJQUFpQ3lCLElBQWpDO0FBRG9EO0FBQUE7QUFBQTs7QUFBQTtBQUdwRCw4QkFBcUIsS0FBSzRCLFNBQUwsQ0FBZUMsTUFBZixFQUFyQixtSUFBOEM7QUFBQSxjQUFyQ3BCLFFBQXFDO0FBQzVDQSxVQUFBQSxRQUFRLENBQUVULElBQUksQ0FBQ0MsSUFBTCxDQUFVdEIsRUFBVixDQUFhSixHQUFiLEVBQUYsQ0FBUjtBQUNEO0FBTG1EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNckQ7QUFDRjtBQUVEOzs7Ozs7OztBQU1BeUUsRUFBQUEscUJBQXFCLENBQUVqRCxNQUFGLEVBQVc7QUFFOUIsUUFBSSxDQUFDLEtBQUt6QyxLQUFMLENBQVdZLGNBQVgsQ0FBMkI2QixNQUEzQixDQUFMLEVBQTBDO0FBQ3hDLGFBQU8sS0FBUDtBQUNEOztBQUVELFVBQU1rRCxXQUFXLEdBQUcsS0FBSzNGLEtBQUwsQ0FBV3lDLE1BQVgsRUFBbUJJLGNBQW5CLEVBQXBCO0FBQ0EsUUFBSStDLFdBQVcsR0FBRyxJQUFsQjs7QUFFQSxTQUFLLElBQUl4RCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdUQsV0FBVyxDQUFDN0QsTUFBaEIsSUFBMEI4RCxXQUExQyxFQUF1RHhELENBQUMsRUFBeEQsRUFBNEQ7QUFDMUR3RCxNQUFBQSxXQUFXLEdBQUcsS0FBSzVGLEtBQUwsQ0FBV1ksY0FBWCxDQUEyQitFLFdBQVcsQ0FBQ3ZELENBQUQsQ0FBdEMsQ0FBZDtBQUNEOztBQUVELFdBQU93RCxXQUFQO0FBQ0Q7QUFFRDs7Ozs7OztBQUtBN0IsRUFBQUEsU0FBUyxDQUFFdEIsTUFBRixFQUFXO0FBQ2xCLFFBQUksS0FBSzVDLE9BQUwsQ0FBYWlFLEdBQWIsQ0FBa0JyQixNQUFsQixLQUE4QixDQUFDLEtBQUt6QyxLQUFMLENBQVdZLGNBQVgsQ0FBMkI2QixNQUEzQixDQUFuQyxFQUF3RTtBQUN0RTtBQUNEOztBQUNELFNBQUs1QyxPQUFMLENBQWF1RCxHQUFiLENBQWtCWCxNQUFsQixFQUEwQixLQUFLekMsS0FBTCxDQUFXeUMsTUFBWCxFQUFtQmEsSUFBbkIsQ0FBeUIsS0FBS3VDLFNBQUwsQ0FBZXZDLElBQWYsQ0FBcUIsSUFBckIsRUFBMkJiLE1BQTNCLENBQXpCLENBQTFCO0FBQ0Q7QUFFRDs7Ozs7OztBQUtBb0QsRUFBQUEsU0FBUyxDQUFFcEQsTUFBRixFQUFXO0FBQ2xCLFFBQUksS0FBSzlDLFVBQUwsQ0FBZ0JtRSxHQUFoQixDQUFxQnJCLE1BQXJCLENBQUosRUFBbUM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFakMsOEJBQXFCLEtBQUs5QyxVQUFMLENBQWdCc0IsR0FBaEIsQ0FBcUJ3QixNQUFyQixFQUE4QjhCLE1BQTlCLEVBQXJCLG1JQUE2RDtBQUFBLGNBQXBEcEIsUUFBb0Q7QUFDM0RBLFVBQUFBLFFBQVEsQ0FBRSxLQUFLbkQsS0FBTCxDQUFXeUMsTUFBWCxDQUFGLENBQVI7QUFDRDtBQUpnQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS2xDO0FBQ0Y7QUFFRDs7Ozs7Ozs7O0FBT0F1QixFQUFBQSxPQUFPLENBQUV2QixNQUFGLEVBQVVxRCxNQUFWLEVBQW1CO0FBRXhCLFFBQUksQ0FBQyxLQUFLbkcsVUFBTCxDQUFnQm1FLEdBQWhCLENBQXFCckIsTUFBckIsQ0FBTCxFQUFvQztBQUNsQyxhQUFPLEtBQVA7QUFDRDs7QUFFRCxVQUFNTixHQUFHLEdBQUcsS0FBS3hDLFVBQUwsQ0FBZ0JzQixHQUFoQixDQUFxQndCLE1BQXJCLEVBQThCaUIsTUFBOUIsQ0FBc0NvQyxNQUF0QyxDQUFaOztBQUVBLFFBQUksS0FBS25HLFVBQUwsQ0FBZ0JzQixHQUFoQixDQUFxQndCLE1BQXJCLEVBQThCTyxJQUE5QixLQUF1QyxDQUEzQyxFQUE4QztBQUM1QyxXQUFLaEQsS0FBTCxDQUFXeUMsTUFBWCxFQUFtQnNELE1BQW5CLENBQTJCLEtBQUtsRyxPQUFMLENBQWFvQixHQUFiLENBQWtCd0IsTUFBbEIsQ0FBM0I7QUFDQSxXQUFLNUMsT0FBTCxDQUFhNkQsTUFBYixDQUFxQmpCLE1BQXJCO0FBQ0EsV0FBSzlDLFVBQUwsQ0FBZ0IrRCxNQUFoQixDQUF3QmpCLE1BQXhCO0FBQ0Q7O0FBRUQsV0FBT04sR0FBUDtBQUNEOztBQXBjdUI7O2VBdWNYM0MsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTcGluYWxDb250ZXh0LCBTcGluYWxHcmFwaCwgU3BpbmFsTm9kZSB9IGZyb20gXCJzcGluYWwtbW9kZWwtZ3JhcGhcIjtcbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbi8qKlxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgTWFwPE9iamVjdCwgZnVuY3Rpb24+Pn0gYmluZGVkTm9kZSBOb2RlSWQgPT4gQ2FsbGVyID0+IENhbGxiYWNrLiBBbGwgbm9kZXMgdGhhdCBhcmUgYmluZFxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgZnVuY3Rpb24+fSBiaW5kZXJzIE5vZGVJZCA9PiBDYWxsQmFjayBmcm9tIGJpbmQgbWV0aG9kLlxuICogIEBwcm9wZXJ0eSB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBsaXN0ZW5lcnMgY2FsbGVyID0+IGNhbGxiYWNrLiBMaXN0IG9mIGFsbCBsaXN0ZW5lcnMgb24gbm9kZSBhZGRlZFxuICogIEBwcm9wZXJ0eSB7T2JqZWN0fSBub2RlcyBjb250YWluaW5nIGFsbCBTcGluYWxOb2RlIGN1cnJlbnRseSBsb2FkZWRcbiAqICBAcHJvcGVydHkge1NwaW5hbEdyYXBofSBncmFwaFxuICovXG5jbGFzcyBHcmFwaE1hbmFnZXJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQHBhcmFtIHZpZXdlckVudiB7Ym9vbGVhbn0gaWYgZGVmaW5lZCBsb2FkIGdyYXBoIGZyb20gZ2V0TW9kZWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKCB2aWV3ZXJFbnYgKSB7XG4gICAgdGhpcy5iaW5kZWROb2RlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmluZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMuZ3JhcGggPSB7fTtcbiAgICBpZiAodHlwZW9mIHZpZXdlckVudiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXG4gICAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbFN5c3RlbS5nZXRNb2RlbCgpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgIGZvcmdlRmlsZSA9PiB0aGlzLnNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlIClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgY3VycmVudCBncmFwaCB3aXRoIHRoZSBvbmUgb2YgdGhlIGZvcmdlRmlsZSBpZiB0aGVyZSBpcyBvbmUgY3JlYXRlIG9uZSBpZiBub3RlXG4gICAqIEBwYXJhbSBmb3JnZUZpbGVcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RyaW5nPn0gdGhlIGlkIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKSB7XG5cbiAgICBpZiAoIWZvcmdlRmlsZS5oYXNPd25Qcm9wZXJ0eSggJ2dyYXBoJyApKSB7XG4gICAgICBmb3JnZUZpbGUuYWRkX2F0dHIoIHtcbiAgICAgICAgZ3JhcGg6IG5ldyBTcGluYWxHcmFwaCgpXG4gICAgICB9ICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldEdyYXBoKCBmb3JnZUZpbGUuZ3JhcGggKTtcblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoKCBncmFwaCApIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5nZXRJZCA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICBkZWxldGUgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldO1xuICAgIH1cbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldID0gdGhpcy5ncmFwaDtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpLCBbXSApXG4gICAgICAudGhlbiggKCkgPT4ge3JldHVybiB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCk7fSApO1xuXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBsb2FkZWQgTm9kZXNcbiAgICovXG4gIGdldE5vZGVzKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0IHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Tm9kZSggaWQgKSB7XG5cbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5mbyggaWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgY3VycmVudCBncmFwaFxuICAgKiBAcmV0dXJucyB7e318U3BpbmFsR3JhcGh9XG4gICAqL1xuICBnZXRHcmFwaCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFwaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7U3BpbmFsTm9kZSB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldFJlYWxOb2RlKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBjaGlsZHJlbiBvZiBhIG5vZGVcbiAgICogQHBhcmFtIGlkXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWVzIHtBcnJheX1cbiAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXk8U3BpbmFsTm9kZVJlZj4+fVxuICAgKi9cbiAgZ2V0Q2hpbGRyZW4oIGlkLCByZWxhdGlvbk5hbWVzID0gW10gKSB7XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIk5vZGUgaWQ6IFwiICsgaWQgKyBcIiBub3QgZm91bmRcIiApICk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aW9uTmFtZXMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIGZvciAobGV0IHJlbGF0aW9uTWFwIG9mIHRoaXMubm9kZXNbaWRdLmNoaWxkcmVuKSB7XG4gICAgICAgIHJlbGF0aW9uTmFtZXMucHVzaCggLi4ucmVsYXRpb25NYXAua2V5cygpICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdLmdldENoaWxkcmVuKCByZWxhdGlvbk5hbWVzIClcbiAgICAgIC50aGVuKCAoIGNoaWxkcmVuICkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX2FkZE5vZGUoIGNoaWxkcmVuW2ldICk7XG4gICAgICAgICAgcmVzLnB1c2goIHRoaXMuZ2V0SW5mbyggY2hpbGRyZW5baV0uZ2V0SWQoKS5nZXQoKSApICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgdGhhdCBhcmUgcmVnaXN0ZXJlZCBpbiB0aGUgY29udGV4dFxuICAgKiBAcGFyYW0gcGFyZW50SWQge1N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBjb250ZXh0SWQge1N0cmluZ30gaWQgb2YgdGhlIGNvbnRleHQgbm9kZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxPYmplY3Q+Pn0gVGhlIGluZm8gb2YgdGhlIGNoaWxkcmVuIHRoYXQgd2VyZSBmb3VuZFxuICAgKi9cbiAgZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHBhcmVudElkLCBjb250ZXh0SWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5nZXRDaGlsZHJlbkluQ29udGV4dCggdGhpcy5ub2Rlc1tjb250ZXh0SWRdICkudGhlbiggY2hpbGRyZW4gPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSBpbmZvIGFnZ3JlZ2F0ZWQgd2l0aCBpdHMgY2hpbGRyZW5JZHMsIGNvbnRleHRJZHMgYW5kIGVsZW1lbnRcbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEluZm8oIG5vZGVJZCApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXNbbm9kZUlkXTtcbiAgICBjb25zdCByZXMgPSBub2RlLmluZm8uZGVlcF9jb3B5KCk7XG4gICAgcmVzWydjaGlsZHJlbklkcyddID0gbm9kZS5nZXRDaGlsZHJlbklkcygpO1xuICAgIHJlc1snY29udGV4dElkcyddID0gbm9kZS5jb250ZXh0SWRzO1xuICAgIHJlc1snZWxlbWVudCddID0gbm9kZS5lbGVtZW50O1xuICAgIHJlc1snaGFzQ2hpbGRyZW4nXSA9IG5vZGUuY2hpbGRyZW4uc2l6ZSA+IDA7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdldENoaWxkcmVuSWRzKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgfVxuICB9XG5cbiAgbGlzdGVuT25Ob2RlQWRkZWQoIGNhbGxlciwgY2FsbGJhY2sgKSB7XG4gICAgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5zZXQoIGNhbGxlciwgY2FsbGJhY2sgKTtcbiAgICByZXR1cm4gdGhpcy5zdG9wTGlzdGVuaW5nLmJpbmQoIHRoaXMsIGNhbGxlciApO1xuICB9XG5cbiAgbGlzdGVuT25Ob2RlUmVtb3ZlKGNhbGxlciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLnNldChjYWxsZXIsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcy5zdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlLmJpbmQodGhpcyxjYWxsZXIpO1xuICB9XG5cbiAgc3RvcExpc3RlbmluZ09uTm9kZUFkZGVkKCBjYWxsZXIgKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzT25Ob2RlQWRkZWQuZGVsZXRlKCBjYWxsZXIgKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUoY2FsbGVyKXtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lck9uTm9kZVJlbW92ZS5kZWxldGUoY2FsbGVyKTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEBwYXJhbSBpbmZvIG5ldyBpbmZvIGZvciB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgaXMgTG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgbW9kaWZ5Tm9kZSggbm9kZUlkLCBpbmZvICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRPIERPIDogY2hhbmdlIHRoZSBmb2xsb3dpbmcgXCJtb2RfYXR0clxuICAgIC8vIHRvIGEgZGlyZWN0IFwidXBkYXRlXCIgb2YgdGhlIGV4aXN0aW5nIG1vZGVsLlxuICAgIC8vIFRoaXMgd2lsbCByZWR1Y2UgdGhlIGNyZWF0aW9uIG9mIG1vZGVsIGJ1dFxuICAgIHRoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGEgbm9kZSBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5iaW5kIHRoZSBzYW1lIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2FsbGVyIHtPYmplY3R9IHVzdWFsbHkgJ3RoaXMnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259IHRvIGJlIGNhbGwgZXZlcnkgY2hhbmdlIG9mIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWQgfCBmdW5jdGlvbn0gcmV0dXJuIGEgZnVuY3Rpb24gdG8gYWxsb3cgdG8gbm9kZSB1bmJpbmRpbmcgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgZXhpc3QgdW5kZWZpbmVkIGFuZCBjYWxsZXIgaXMgYW4gb2JqZWN0IGFuZCBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIG90aGVyd2lzZVxuICAgKi9cbiAgYmluZE5vZGUoIG5vZGVJZCwgY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApIHx8IHR5cGVvZiBjYWxsZXIgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuc2V0KCBub2RlSWQsIG5ldyBNYXAoIFtcbiAgICAgICAgW2NhbGxlciwgY2FsbGJhY2tdXG4gICAgICBdICkgKTtcbiAgICAgIHRoaXMuX2JpbmROb2RlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdW5CaW5kLmJpbmQoIHRoaXMsIG5vZGVJZCwgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb2NlIHRoZSBjaGlsZCBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgZnJvbSB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHBhcmVudElkLlxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcGFyYW0gc3RvcFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cbiAgICovXG4gIHJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBzdG9wID0gZmFsc2UgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIm5vZGVJZCB1bmtub3duLlwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiAhc3RvcCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oIG5vZGVJZCwgW10gKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5yZW1vdmVDaGlsZCggbm9kZUlkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgdHJ1ZSApIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApKSB7XG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVycy52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggbm9kZUlkICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLnJlbW92ZUNoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcImNoaWxkSWQgdW5rbm93bi4gSXQgbWlnaHQgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IG5vZGVcIiApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRleHQgdG8gdGhlIGdyYXBoXG4gICAqIEBwYXJhbSBuYW1lIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSBlbHQge01vZGVsfSBlbGVtZW50IG9mIHRoZSBjb250ZXh0IGlmIG5lZWRlZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTcGluYWxDb250ZXh0Pn1cbiAgICovXG4gIGFkZENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApIHtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IFNwaW5hbENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApO1xuICAgIHRoaXMubm9kZXNbY29udGV4dC5pbmZvLmlkLmdldCgpXSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGguYWRkQ29udGV4dCggY29udGV4dCApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtTcGluYWxDb250ZXh0fHVuZGVmaW5lZH1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBrZXkgKSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgbm9kZSByZWZlcmVuY2VkIGJ5IGlkIGZyb20gdGggZ3JhcGguXG4gICAqIEBwYXJhbSBpZFxuICAgKi9cbiAgcmVtb3ZlRnJvbUdyYXBoKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0ucmVtb3ZlRnJvbUdyYXBoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm5vZGVzW2NvbnRleHRJZF07XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGRJbkNvbnRleHQoIGNoaWxkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgY29udGV4dCApO1xuICAgIH1cbiAgICAvL1RPRE8gb3B0aW9uIHBhcnNlclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoICdOb2RlIGlkJyArIHBhcmVudElkICsgJyBub3QgZm91bmQnICkgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBjaGlsZElkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2hpbGRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IHJldHVybiB0cnVlIGlmIHRoZSBjaGlsZCBjb3VsZCBiZSBhZGRlZCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhZGRDaGlsZCggcGFyZW50SWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBub2RlIGFuZCBhZGQgaXQgYXMgY2hpbGQgdG8gdGhlIHBhcmVudElkLlxuICAgKiBAcGFyYW0gcGFyZW50SWQge3N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBub2RlIHtPYmplY3R9IG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2luZm8nIGFuZCBjYW4gaGF2ZSBhbiBhdHRyaWJ1dGUgJ2VsZW1lbnQnXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge3N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgd2FzIGNyZWF0ZWQgYWRkZWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBhZGRDaGlsZEFuZENyZWF0ZU5vZGUoIHBhcmVudElkLCBub2RlLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoICdpbmZvJyApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUlkID0gdGhpcy5jcmVhdGVOb2RlKCBub2RlLmluZm8sIG5vZGUuZWxlbWVudCApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoIHBhcmVudElkLCBub2RlSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVycy52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggbm9kZS5pbmZvLmlkLmdldCgpICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFsbCBjaGlsZHJlbiBmcm9tIGEgbm9kZSBhcmUgbG9hZGVkXG4gICAqIEBwYXJhbSBub2RlSWQgaWQgb2YgdGhlIGRlc2lyZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgYWxsIGNoaWxkcmVuIG9mIHRoZSBub2RlIGlzIGxvYWRlZCBmYWxzZSBvdGhlcndpc2VcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hcmVBbGxDaGlsZHJlbkxvYWRlZCggbm9kZUlkICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkcmVuSWRzID0gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgbGV0IGhhc0FsbENoaWxkID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW5JZHMubGVuZ3RoICYmIGhhc0FsbENoaWxkOyBpKyspIHtcbiAgICAgIGhhc0FsbENoaWxkID0gdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRyZW5JZHNbaV0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzQWxsQ2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogQmluZCB0aGUgbm9kZSBpZiBuZWVkZWQgYW5kIHNhdmUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kTm9kZSggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlcnMuaGFzKCBub2RlSWQgKSB8fCAhdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5iaW5kZXJzLnNldCggbm9kZUlkLCB0aGlzLm5vZGVzW25vZGVJZF0uYmluZCggdGhpcy5fYmluZEZ1bmMuYmluZCggdGhpcywgbm9kZUlkICkgKSApO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbGwgdGhlIGNhbGxiYWNrIG1ldGhvZCBvZiBhbGwgdGhlIGJpbmRlciBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYmluZEZ1bmMoIG5vZGVJZCApIHtcbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcblxuICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkudmFsdWVzKCkpIHtcbiAgICAgICAgY2FsbGJhY2soIHRoaXMubm9kZXNbbm9kZUlkXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB1bmJpbmQgYSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGJpbmRlciB7T2JqZWN0fVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91bkJpbmQoIG5vZGVJZCwgYmluZGVyICkge1xuXG4gICAgaWYgKCF0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLmRlbGV0ZSggYmluZGVyICk7XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2l6ZSA9PT0gMCkge1xuICAgICAgdGhpcy5ub2Rlc1tub2RlSWRdLnVuYmluZCggdGhpcy5iaW5kZXJzLmdldCggbm9kZUlkICkgKTtcbiAgICAgIHRoaXMuYmluZGVycy5kZWxldGUoIG5vZGVJZCApO1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmFwaE1hbmFnZXJTZXJ2aWNlO1xuIl19