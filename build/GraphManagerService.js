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

"use strict";

Object.defineProperty( exports, "__esModule", {
  value: true
} );
exports.default = void 0;

var _spinalModelGraph = require( "spinal-model-graph" );

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
   * Return all the relation names of the node coresponding to id
   * @param id {String} of the node
   * @returns {Array<String>}
   */


  getRelationNames( id ) {
    const relationNames = [];

    if (this.nodes.hasOwnProperty( id )) {
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

    return this.nodes[id].getChildren(relationNames).then( children => {
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
   * @returns {Promise<boolean>}
   */


  removeChild( nodeId, childId, relationName, relationType, stop = false) {
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
   * Add a context to the graph
   * @param name {String} of the context
   * @param type {String} of the context
   * @param elt {Model} element of the context if needed
   * @returns {Promise<SpinalContext>}
   */


  addContext( name, type, elt ) {
    console.log( "qsdqsd", this );
    const context = new _spinalModelGraph.SpinalContext( name, type, elt );
    this.nodes[context.info.id.get()] = context;

    if (typeof this.graph.addContext === 'function') {
      console.log( 'hqhqhqhhq' );
    }

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


  _addNode(node) {
    if (!this.nodes.hasOwnProperty(node.getId().get())) {
      this.nodes[node.info.id.get()] = node;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.listenersOnNodeAdded.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let callback = _step4.value;
          callback( node.info.id.get() );
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
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.bindedNode.get( nodeId ).values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          let callback = _step5.value;
          callback( this.nodes[nodeId] );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZF9hdHRyIiwiU3BpbmFsR3JhcGgiLCJzZXRHcmFwaCIsImdldElkIiwiZ2V0IiwiZ2V0Q2hpbGRyZW4iLCJnZXROb2RlcyIsImdldE5vZGUiLCJpZCIsImdldEluZm8iLCJ1bmRlZmluZWQiLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwiZ2V0UmVsYXRpb25OYW1lcyIsInJlbGF0aW9uTmFtZXMiLCJjaGlsZHJlbiIsInJlbGF0aW9uTWFwIiwicHVzaCIsImtleXMiLCJQcm9taXNlIiwicmVqZWN0IiwiRXJyb3IiLCJsZW5ndGgiLCJyZXMiLCJpIiwiX2FkZE5vZGUiLCJnZXRDaGlsZHJlbkluQ29udGV4dCIsInBhcmVudElkIiwiY29udGV4dElkIiwibm9kZUlkIiwibm9kZSIsImluZm8iLCJkZWVwX2NvcHkiLCJnZXRDaGlsZHJlbklkcyIsImNvbnRleHRJZHMiLCJlbGVtZW50Iiwic2l6ZSIsImxpc3Rlbk9uTm9kZUFkZGVkIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJzZXQiLCJzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQiLCJiaW5kIiwibGlzdGVuT25Ob2RlUmVtb3ZlIiwic3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZSIsImRlbGV0ZSIsIm1vZGlmeU5vZGUiLCJtb2RfYXR0ciIsImJpbmROb2RlIiwiaGFzIiwiX2JpbmROb2RlIiwiX3VuQmluZCIsInJlbW92ZUNoaWxkIiwiY2hpbGRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsInN0b3AiLCJsaXN0ZW5lcnMiLCJ2YWx1ZXMiLCJhZGRDb250ZXh0IiwibmFtZSIsInR5cGUiLCJlbHQiLCJsb2ciLCJjb250ZXh0IiwiU3BpbmFsQ29udGV4dCIsImdldENvbnRleHQiLCJrZXkiLCJnZXROYW1lIiwicmVtb3ZlRnJvbUdyYXBoIiwiY3JlYXRlTm9kZSIsIlNwaW5hbE5vZGUiLCJnZXRUeXBlIiwiYWRkQ2hpbGRJbkNvbnRleHQiLCJjaGlsZCIsImFkZENoaWxkIiwicmVzb2x2ZSIsImFkZENoaWxkQW5kQ3JlYXRlTm9kZSIsIl9hcmVBbGxDaGlsZHJlbkxvYWRlZCIsImNoaWxkcmVuSWRzIiwiaGFzQWxsQ2hpbGQiLCJfYmluZEZ1bmMiLCJiaW5kZXIiLCJ1bmJpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUF3QkE7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNQSxNQUFNLEdBQUcsT0FBT0MsTUFBUCxJQUFpQixXQUFqQixHQUErQkMsTUFBL0IsR0FBd0NELE1BQXZEO0FBQ0E7Ozs7Ozs7O0FBT0EsTUFBTUUsbUJBQU4sQ0FBMEI7QUFFeEI7OztBQUdBQyxFQUFBQSxXQUFXLENBQUVDLFNBQUYsRUFBYztBQUN2QixTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsR0FBSixFQUFmO0FBQ0EsU0FBS0Usb0JBQUwsR0FBNEIsSUFBSUYsR0FBSixFQUE1QjtBQUNBLFNBQUtHLG9CQUFMLEdBQTRCLElBQUlILEdBQUosRUFBNUI7QUFDQSxTQUFLSSxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUNBLFFBQUksT0FBT1AsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUVwQ0wsTUFB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RUFBVXFELE1BQVYsRUFBbUI7QUFFeEIsUUFBSSxDQUFDLEtBQUtwRyxVQUFMLENBQWdCbUUsR0FBaEIsQ0FBcUJwQixNQUFyQixDQUFMLEVBQW9DO0FBQ2xDLGFBQU8sS0FBUDtBQUNEOztBQUVELFVBQU1OLEdBQUcsR0FBRyxLQUFLekMsVUFBTCxDQUFnQnNCLEdBQWhCLENBQXFCeUIsTUFBckIsRUFBOEJnQixNQUE5QixDQUFzQ3FDLE1BQXRDLENBQVo7O0FBRUEsUUFBSSxLQUFLcEcsVUFBTCxDQUFnQnNCLEdBQWhCLENBQXFCeUIsTUFBckIsRUFBOEJPLElBQTlCLEtBQXVDLENBQTNDLEVBQThDO0FBQzVDLFdBQUtqRCxLQUFMLENBQVcwQyxNQUFYLEVBQW1Cc0QsTUFBbkIsQ0FBMkIsS0FBS25HLE9BQUwsQ0FBYW9CLEdBQWIsQ0FBa0J5QixNQUFsQixDQUEzQjtBQUNBLFdBQUs3QyxPQUFMLENBQWE2RCxNQUFiLENBQXFCaEIsTUFBckI7QUFDQSxXQUFLL0MsVUFBTCxDQUFnQitELE1BQWhCLENBQXdCaEIsTUFBeEI7QUFDRDs7QUFFRCxXQUFPTixHQUFQO0FBQ0Q7O0FBdmR1Qjs7ZUEwZFg1QyxtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxOSBTcGluYWxDb20gLSB3d3cuc3BpbmFsY29tLmNvbVxuICpcbiAqICBUaGlzIGZpbGUgaXMgcGFydCBvZiBTcGluYWxDb3JlLlxuICpcbiAqICBQbGVhc2UgcmVhZCBhbGwgb2YgdGhlIGZvbGxvd2luZyB0ZXJtcyBhbmQgY29uZGl0aW9uc1xuICogIG9mIHRoZSBGcmVlIFNvZnR3YXJlIGxpY2Vuc2UgQWdyZWVtZW50IChcIkFncmVlbWVudFwiKVxuICogIGNhcmVmdWxseS5cbiAqXG4gKiAgVGhpcyBBZ3JlZW1lbnQgaXMgYSBsZWdhbGx5IGJpbmRpbmcgY29udHJhY3QgYmV0d2VlblxuICogIHRoZSBMaWNlbnNlZSAoYXMgZGVmaW5lZCBiZWxvdykgYW5kIFNwaW5hbENvbSB0aGF0XG4gKiAgc2V0cyBmb3J0aCB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgdGhhdCBnb3Zlcm4geW91clxuICogIHVzZSBvZiB0aGUgUHJvZ3JhbS4gQnkgaW5zdGFsbGluZyBhbmQvb3IgdXNpbmcgdGhlXG4gKiAgUHJvZ3JhbSwgeW91IGFncmVlIHRvIGFiaWRlIGJ5IGFsbCB0aGUgdGVybXMgYW5kXG4gKiAgY29uZGl0aW9ucyBzdGF0ZWQgb3IgcmVmZXJlbmNlZCBoZXJlaW4uXG4gKlxuICogIElmIHlvdSBkbyBub3QgYWdyZWUgdG8gYWJpZGUgYnkgdGhlc2UgdGVybXMgYW5kXG4gKiAgY29uZGl0aW9ucywgZG8gbm90IGRlbW9uc3RyYXRlIHlvdXIgYWNjZXB0YW5jZSBhbmQgZG9cbiAqICBub3QgaW5zdGFsbCBvciB1c2UgdGhlIFByb2dyYW0uXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgbGljZW5zZSBhbG9uZ1xuICogIHdpdGggdGhpcyBmaWxlLiBJZiBub3QsIHNlZVxuICogIDxodHRwOi8vcmVzb3VyY2VzLnNwaW5hbGNvbS5jb20vbGljZW5zZXMucGRmPi5cbiAqL1xuXG5pbXBvcnQge1xuICBTcGluYWxDb250ZXh0LFxuICBTcGluYWxHcmFwaCxcbiAgU3BpbmFsTm9kZVxufSBmcm9tIFwic3BpbmFsLW1vZGVsLWdyYXBoXCI7XG5cbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbi8qKlxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgTWFwPE9iamVjdCwgZnVuY3Rpb24+Pn0gYmluZGVkTm9kZSBOb2RlSWQgPT4gQ2FsbGVyID0+IENhbGxiYWNrLiBBbGwgbm9kZXMgdGhhdCBhcmUgYmluZFxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgZnVuY3Rpb24+fSBiaW5kZXJzIE5vZGVJZCA9PiBDYWxsQmFjayBmcm9tIGJpbmQgbWV0aG9kLlxuICogIEBwcm9wZXJ0eSB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBsaXN0ZW5lcnMgY2FsbGVyID0+IGNhbGxiYWNrLiBMaXN0IG9mIGFsbCBsaXN0ZW5lcnMgb24gbm9kZSBhZGRlZFxuICogIEBwcm9wZXJ0eSB7T2JqZWN0fSBub2RlcyBjb250YWluaW5nIGFsbCBTcGluYWxOb2RlIGN1cnJlbnRseSBsb2FkZWRcbiAqICBAcHJvcGVydHkge1NwaW5hbEdyYXBofSBncmFwaFxuICovXG5jbGFzcyBHcmFwaE1hbmFnZXJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQHBhcmFtIHZpZXdlckVudiB7Ym9vbGVhbn0gaWYgZGVmaW5lZCBsb2FkIGdyYXBoIGZyb20gZ2V0TW9kZWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKCB2aWV3ZXJFbnYgKSB7XG4gICAgdGhpcy5iaW5kZWROb2RlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmluZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMuZ3JhcGggPSB7fTtcbiAgICBpZiAodHlwZW9mIHZpZXdlckVudiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXG4gICAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbFN5c3RlbS5nZXRNb2RlbCgpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgIGZvcmdlRmlsZSA9PiB0aGlzLnNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlIClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgY3VycmVudCBncmFwaCB3aXRoIHRoZSBvbmUgb2YgdGhlIGZvcmdlRmlsZSBpZiB0aGVyZSBpcyBvbmUgY3JlYXRlIG9uZSBpZiBub3RlXG4gICAqIEBwYXJhbSBmb3JnZUZpbGVcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RyaW5nPn0gdGhlIGlkIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKSB7XG5cbiAgICBpZiAoIWZvcmdlRmlsZS5oYXNPd25Qcm9wZXJ0eSggJ2dyYXBoJyApKSB7XG4gICAgICBmb3JnZUZpbGUuYWRkX2F0dHIoIHtcbiAgICAgICAgZ3JhcGg6IG5ldyBTcGluYWxHcmFwaCgpXG4gICAgICB9ICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldEdyYXBoKCBmb3JnZUZpbGUuZ3JhcGggKTtcblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoKCBncmFwaCApIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5nZXRJZCA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICBkZWxldGUgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldO1xuICAgIH1cbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldID0gdGhpcy5ncmFwaDtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpLCBbXSApXG4gICAgICAudGhlbiggKCkgPT4ge3JldHVybiB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCk7fSApO1xuXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBsb2FkZWQgTm9kZXNcbiAgICovXG4gIGdldE5vZGVzKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0IHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Tm9kZSggaWQgKSB7XG5cbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5mbyggaWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgY3VycmVudCBncmFwaFxuICAgKiBAcmV0dXJucyB7e318U3BpbmFsR3JhcGh9XG4gICAqL1xuICBnZXRHcmFwaCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFwaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7U3BpbmFsTm9kZSB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldFJlYWxOb2RlKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCB0aGUgcmVsYXRpb24gbmFtZXMgb2YgdGhlIG5vZGUgY29yZXNwb25kaW5nIHRvIGlkXG4gICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBvZiB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn1cbiAgICovXG4gIGdldFJlbGF0aW9uTmFtZXMoIGlkICkge1xuICAgIGNvbnN0IHJlbGF0aW9uTmFtZXMgPSBbXTtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgZm9yIChsZXQgcmVsYXRpb25NYXAgb2YgdGhpcy5ub2Rlc1tpZF0uY2hpbGRyZW4pIHtcbiAgICAgICAgcmVsYXRpb25OYW1lcy5wdXNoKCAuLi5yZWxhdGlvbk1hcC5rZXlzKCkgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0aW9uTmFtZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBjaGlsZHJlbiBvZiBhIG5vZGVcbiAgICogQHBhcmFtIGlkXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWVzIHtBcnJheX1cbiAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXk8U3BpbmFsTm9kZVJlZj4+fVxuICAgKi9cbiAgZ2V0Q2hpbGRyZW4oIGlkLCByZWxhdGlvbk5hbWVzID0gW10gKSB7XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIk5vZGUgaWQ6IFwiICsgaWQgKyBcIiBub3QgZm91bmRcIiApICk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aW9uTmFtZXMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIGZvciAobGV0IHJlbGF0aW9uTWFwIG9mIHRoaXMubm9kZXNbaWRdLmNoaWxkcmVuKSB7XG4gICAgICAgIHJlbGF0aW9uTmFtZXMucHVzaCggLi4ucmVsYXRpb25NYXAua2V5cygpICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdLmdldENoaWxkcmVuKCByZWxhdGlvbk5hbWVzIClcbiAgICAgIC50aGVuKCAoIGNoaWxkcmVuICkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX2FkZE5vZGUoIGNoaWxkcmVuW2ldICk7XG4gICAgICAgICAgcmVzLnB1c2goIHRoaXMuZ2V0SW5mbyggY2hpbGRyZW5baV0uZ2V0SWQoKS5nZXQoKSApICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgdGhhdCBhcmUgcmVnaXN0ZXJlZCBpbiB0aGUgY29udGV4dFxuICAgKiBAcGFyYW0gcGFyZW50SWQge1N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBjb250ZXh0SWQge1N0cmluZ30gaWQgb2YgdGhlIGNvbnRleHQgbm9kZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxPYmplY3Q+Pn0gVGhlIGluZm8gb2YgdGhlIGNoaWxkcmVuIHRoYXQgd2VyZSBmb3VuZFxuICAgKi9cbiAgZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHBhcmVudElkLCBjb250ZXh0SWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5nZXRDaGlsZHJlbkluQ29udGV4dCggdGhpcy5ub2Rlc1tjb250ZXh0SWRdICkudGhlbiggY2hpbGRyZW4gPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSBpbmZvIGFnZ3JlZ2F0ZWQgd2l0aCBpdHMgY2hpbGRyZW5JZHMsIGNvbnRleHRJZHMgYW5kIGVsZW1lbnRcbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEluZm8oIG5vZGVJZCApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXNbbm9kZUlkXTtcbiAgICBjb25zdCByZXMgPSBub2RlLmluZm8uZGVlcF9jb3B5KCk7XG4gICAgcmVzWydjaGlsZHJlbklkcyddID0gbm9kZS5nZXRDaGlsZHJlbklkcygpO1xuICAgIHJlc1snY29udGV4dElkcyddID0gbm9kZS5jb250ZXh0SWRzO1xuICAgIHJlc1snZWxlbWVudCddID0gbm9kZS5lbGVtZW50O1xuICAgIHJlc1snaGFzQ2hpbGRyZW4nXSA9IG5vZGUuY2hpbGRyZW4uc2l6ZSA+IDA7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdldENoaWxkcmVuSWRzKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgfVxuICB9XG5cbiAgbGlzdGVuT25Ob2RlQWRkZWQoIGNhbGxlciwgY2FsbGJhY2sgKSB7XG4gICAgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5zZXQoIGNhbGxlciwgY2FsbGJhY2sgKTtcbiAgICByZXR1cm4gdGhpcy5zdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQuYmluZCggdGhpcywgY2FsbGVyICk7XG4gIH1cblxuICBsaXN0ZW5Pbk5vZGVSZW1vdmUoIGNhbGxlciwgY2FsbGJhY2sgKSB7XG4gICAgdGhpcy5saXN0ZW5lck9uTm9kZVJlbW92ZS5zZXQoIGNhbGxlciwgY2FsbGJhY2sgKTtcbiAgICByZXR1cm4gdGhpcy5zdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlLmJpbmQoIHRoaXMsIGNhbGxlciApO1xuICB9XG5cbiAgc3RvcExpc3RlbmluZ09uTm9kZUFkZGVkKCBjYWxsZXIgKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzT25Ob2RlQWRkZWQuZGVsZXRlKCBjYWxsZXIgKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUoIGNhbGxlciApIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lck9uTm9kZVJlbW92ZS5kZWxldGUoIGNhbGxlciApO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0gbm9kZUlkIGlkIG9mIHRoZSBkZXNpcmVkIG5vZGVcbiAgICogQHBhcmFtIGluZm8gbmV3IGluZm8gZm9yIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBpcyBMb2FkZWQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBtb2RpZnlOb2RlKCBub2RlSWQsIGluZm8gKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gVE8gRE8gOiBjaGFuZ2UgdGhlIGZvbGxvd2luZyBcIm1vZF9hdHRyXG4gICAgLy8gdG8gYSBkaXJlY3QgXCJ1cGRhdGVcIiBvZiB0aGUgZXhpc3RpbmcgbW9kZWwuXG4gICAgLy8gVGhpcyB3aWxsIHJlZHVjZSB0aGUgY3JlYXRpb24gb2YgbW9kZWwgYnV0XG4gICAgdGhpcy5ub2Rlc1tub2RlSWRdLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgYSBub2RlIGFuZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bmJpbmQgdGhlIHNhbWUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjYWxsZXIge09iamVjdH0gdXN1YWxseSAndGhpcydcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtmdW5jdGlvbn0gdG8gYmUgY2FsbCBldmVyeSBjaGFuZ2Ugb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge3VuZGVmaW5lZCB8IGZ1bmN0aW9ufSByZXR1cm4gYSBmdW5jdGlvbiB0byBhbGxvdyB0byBub2RlIHVuYmluZGluZyBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBleGlzdCB1bmRlZmluZWQgYW5kIGNhbGxlciBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24gb3RoZXJ3aXNlXG4gICAqL1xuICBiaW5kTm9kZSggbm9kZUlkLCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkgfHwgdHlwZW9mIGNhbGxlciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5zZXQoIG5vZGVJZCwgbmV3IE1hcCggW1xuICAgICAgICBbY2FsbGVyLCBjYWxsYmFja11cbiAgICAgIF0gKSApO1xuICAgICAgdGhpcy5fYmluZE5vZGUoIG5vZGVJZCApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91bkJpbmQuYmluZCggdGhpcywgbm9kZUlkLCBjYWxsZXIgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHN0b3AgPSBmYWxzZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwibm9kZUlkIHVua25vd24uXCIgKSApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCB0cnVlICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlSWQgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0ucmVtb3ZlQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiY2hpbGRJZCB1bmtub3duLiBJdCBtaWdodCBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgbm9kZVwiICkgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udGV4dCB0byB0aGUgZ3JhcGhcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIGVsdCB7TW9kZWx9IGVsZW1lbnQgb2YgdGhlIGNvbnRleHQgaWYgbmVlZGVkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNwaW5hbENvbnRleHQ+fVxuICAgKi9cbiAgYWRkQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICkge1xuICAgIGNvbnNvbGUubG9nKCBcInFzZHFzZFwiLCB0aGlzICk7XG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBTcGluYWxDb250ZXh0KCBuYW1lLCB0eXBlLCBlbHQgKTtcbiAgICB0aGlzLm5vZGVzW2NvbnRleHQuaW5mby5pZC5nZXQoKV0gPSBjb250ZXh0O1xuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5hZGRDb250ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmxvZyggJ2hxaHFocWhocScgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGguYWRkQ29udGV4dCggY29udGV4dCApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtTcGluYWxDb250ZXh0fHVuZGVmaW5lZH1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBrZXkgKSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgbm9kZSByZWZlcmVuY2VkIGJ5IGlkIGZyb20gdGggZ3JhcGguXG4gICAqIEBwYXJhbSBpZFxuICAgKi9cbiAgcmVtb3ZlRnJvbUdyYXBoKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0ucmVtb3ZlRnJvbUdyYXBoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm5vZGVzW2NvbnRleHRJZF07XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGRJbkNvbnRleHQoIGNoaWxkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgY29udGV4dCApO1xuICAgIH1cbiAgICAvL1RPRE8gb3B0aW9uIHBhcnNlclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoICdOb2RlIGlkJyArIHBhcmVudElkICsgJyBub3QgZm91bmQnICkgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBjaGlsZElkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2hpbGRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IHJldHVybiB0cnVlIGlmIHRoZSBjaGlsZCBjb3VsZCBiZSBhZGRlZCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhZGRDaGlsZCggcGFyZW50SWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBub2RlIGFuZCBhZGQgaXQgYXMgY2hpbGQgdG8gdGhlIHBhcmVudElkLlxuICAgKiBAcGFyYW0gcGFyZW50SWQge3N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBub2RlIHtPYmplY3R9IG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2luZm8nIGFuZCBjYW4gaGF2ZSBhbiBhdHRyaWJ1dGUgJ2VsZW1lbnQnXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge3N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgd2FzIGNyZWF0ZWQgYWRkZWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBhZGRDaGlsZEFuZENyZWF0ZU5vZGUoIHBhcmVudElkLCBub2RlLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoICdpbmZvJyApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUlkID0gdGhpcy5jcmVhdGVOb2RlKCBub2RlLmluZm8sIG5vZGUuZWxlbWVudCApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoIHBhcmVudElkLCBub2RlSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=