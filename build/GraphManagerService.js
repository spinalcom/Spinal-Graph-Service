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
  
    return this.nodes[id].getChildren( relationNames ).then( children => {
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


  removeChild( nodeId, childId, relationName, relationType, stop = false ) {
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
    const context = new _spinalModelGraph.SpinalContext( name, type, elt );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZF9hdHRyIiwiU3BpbmFsR3JhcGgiLCJzZXRHcmFwaCIsImdldElkIiwiZ2V0IiwiZ2V0Q2hpbGRyZW4iLCJnZXROb2RlcyIsImdldE5vZGUiLCJpZCIsImdldEluZm8iLCJ1bmRlZmluZWQiLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwiZ2V0UmVsYXRpb25OYW1lcyIsInJlbGF0aW9uTmFtZXMiLCJjaGlsZHJlbiIsInJlbGF0aW9uTWFwIiwicHVzaCIsImtleXMiLCJQcm9taXNlIiwicmVqZWN0IiwiRXJyb3IiLCJsZW5ndGgiLCJyZXMiLCJpIiwiX2FkZE5vZGUiLCJnZXRDaGlsZHJlbkluQ29udGV4dCIsInBhcmVudElkIiwiY29udGV4dElkIiwibm9kZUlkIiwibm9kZSIsImluZm8iLCJkZWVwX2NvcHkiLCJnZXRDaGlsZHJlbklkcyIsImNvbnRleHRJZHMiLCJlbGVtZW50Iiwic2l6ZSIsImxpc3Rlbk9uTm9kZUFkZGVkIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJzZXQiLCJzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQiLCJiaW5kIiwibGlzdGVuT25Ob2RlUmVtb3ZlIiwic3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZSIsImRlbGV0ZSIsIm1vZGlmeU5vZGUiLCJtb2RfYXR0ciIsImJpbmROb2RlIiwiaGFzIiwiX2JpbmROb2RlIiwiX3VuQmluZCIsInJlbW92ZUNoaWxkIiwiY2hpbGRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsInN0b3AiLCJsaXN0ZW5lcnMiLCJ2YWx1ZXMiLCJhZGRDb250ZXh0IiwibmFtZSIsInR5cGUiLCJlbHQiLCJjb250ZXh0IiwiU3BpbmFsQ29udGV4dCIsImdldENvbnRleHQiLCJrZXkiLCJnZXROYW1lIiwicmVtb3ZlRnJvbUdyYXBoIiwiY3JlYXRlTm9kZSIsIlNwaW5hbE5vZGUiLCJnZXRUeXBlIiwiYWRkQ2hpbGRJbkNvbnRleHQiLCJjaGlsZCIsImFkZENoaWxkIiwicmVzb2x2ZSIsImFkZENoaWxkQW5kQ3JlYXRlTm9kZSIsIl9hcmVBbGxDaGlsZHJlbkxvYWRlZCIsImNoaWxkcmVuSWRzIiwiaGFzQWxsQ2hpbGQiLCJfYmluZEZ1bmMiLCJiaW5kZXIiLCJ1bmJpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUF3QkE7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNQSxNQUFNLEdBQUcsT0FBT0MsTUFBUCxJQUFpQixXQUFqQixHQUErQkMsTUFBL0IsR0FBd0NELE1BQXZEO0FBQ0E7Ozs7Ozs7O0FBT0EsTUFBTUUsbUJBQU4sQ0FBMEI7QUFFeEI7OztBQUdBQyxFQUFBQSxXQUFXLENBQUVDLFNBQUYsRUFBYztBQUN2QixTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsR0FBSixFQUFmO0FBQ0EsU0FBS0Usb0JBQUwsR0FBNEIsSUFBSUYsR0FBSixFQUE1QjtBQUNBLFNBQUtHLG9CQUFMLEdBQTRCLElBQUlILEdBQUosRUFBNUI7QUFDQSxTQUFLSSxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUNBLFFBQUksT0FBT1AsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUVwQ0wsTUFBQUEsTUFB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QXJCLEVBQThCZ0IsTUFBOUIsQ0FBc0NvQyxNQUF0QyxDQUFaOztBQUVBLFFBQUksS0FBS25HLFVBQUwsQ0FBZ0JzQixHQUFoQixDQUFxQnlCLE1BQXJCLEVBQThCTyxJQUE5QixLQUF1QyxDQUEzQyxFQUE4QztBQUM1QyxXQUFLakQsS0FBTCxDQUFXMEMsTUFBWCxFQUFtQnFELE1BQW5CLENBQTJCLEtBQUtsRyxPQUFMLENBQWFvQixHQUFiLENBQWtCeUIsTUFBbEIsQ0FBM0I7QUFDQSxXQUFLN0MsT0FBTCxDQUFhNkQsTUFBYixDQUFxQmhCLE1BQXJCO0FBQ0EsV0FBSy9DLFVBQUwsQ0FBZ0IrRCxNQUFoQixDQUF3QmhCLE1BQXhCO0FBQ0Q7O0FBRUQsV0FBT04sR0FBUDtBQUNEOztBQXBkdUI7O2VBdWRYNUMsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTkgU3BpbmFsQ29tIC0gd3d3LnNwaW5hbGNvbS5jb21cbiAqXG4gKiAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgU3BpbmFsQ29yZS5cbiAqXG4gKiAgUGxlYXNlIHJlYWQgYWxsIG9mIHRoZSBmb2xsb3dpbmcgdGVybXMgYW5kIGNvbmRpdGlvbnNcbiAqICBvZiB0aGUgRnJlZSBTb2Z0d2FyZSBsaWNlbnNlIEFncmVlbWVudCAoXCJBZ3JlZW1lbnRcIilcbiAqICBjYXJlZnVsbHkuXG4gKlxuICogIFRoaXMgQWdyZWVtZW50IGlzIGEgbGVnYWxseSBiaW5kaW5nIGNvbnRyYWN0IGJldHdlZW5cbiAqICB0aGUgTGljZW5zZWUgKGFzIGRlZmluZWQgYmVsb3cpIGFuZCBTcGluYWxDb20gdGhhdFxuICogIHNldHMgZm9ydGggdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zIHRoYXQgZ292ZXJuIHlvdXJcbiAqICB1c2Ugb2YgdGhlIFByb2dyYW0uIEJ5IGluc3RhbGxpbmcgYW5kL29yIHVzaW5nIHRoZVxuICogIFByb2dyYW0sIHlvdSBhZ3JlZSB0byBhYmlkZSBieSBhbGwgdGhlIHRlcm1zIGFuZFxuICogIGNvbmRpdGlvbnMgc3RhdGVkIG9yIHJlZmVyZW5jZWQgaGVyZWluLlxuICpcbiAqICBJZiB5b3UgZG8gbm90IGFncmVlIHRvIGFiaWRlIGJ5IHRoZXNlIHRlcm1zIGFuZFxuICogIGNvbmRpdGlvbnMsIGRvIG5vdCBkZW1vbnN0cmF0ZSB5b3VyIGFjY2VwdGFuY2UgYW5kIGRvXG4gKiAgbm90IGluc3RhbGwgb3IgdXNlIHRoZSBQcm9ncmFtLlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIGxpY2Vuc2UgYWxvbmdcbiAqICB3aXRoIHRoaXMgZmlsZS4gSWYgbm90LCBzZWVcbiAqICA8aHR0cDovL3Jlc291cmNlcy5zcGluYWxjb20uY29tL2xpY2Vuc2VzLnBkZj4uXG4gKi9cblxuaW1wb3J0IHtcbiAgU3BpbmFsQ29udGV4dCxcbiAgU3BpbmFsR3JhcGgsXG4gIFNwaW5hbE5vZGVcbn0gZnJvbSBcInNwaW5hbC1tb2RlbC1ncmFwaFwiO1xuXG5jb25zdCBHX3Jvb3QgPSB0eXBlb2Ygd2luZG93ID09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG4vKipcbiAqICBAcHJvcGVydHkge01hcDxTdHJpbmcsIE1hcDxPYmplY3QsIGZ1bmN0aW9uPj59IGJpbmRlZE5vZGUgTm9kZUlkID0+IENhbGxlciA9PiBDYWxsYmFjay4gQWxsIG5vZGVzIHRoYXQgYXJlIGJpbmRcbiAqICBAcHJvcGVydHkge01hcDxTdHJpbmcsIGZ1bmN0aW9uPn0gYmluZGVycyBOb2RlSWQgPT4gQ2FsbEJhY2sgZnJvbSBiaW5kIG1ldGhvZC5cbiAqICBAcHJvcGVydHkge01hcDxPYmplY3QsIGZ1bmN0aW9uPn0gbGlzdGVuZXJzIGNhbGxlciA9PiBjYWxsYmFjay4gTGlzdCBvZiBhbGwgbGlzdGVuZXJzIG9uIG5vZGUgYWRkZWRcbiAqICBAcHJvcGVydHkge09iamVjdH0gbm9kZXMgY29udGFpbmluZyBhbGwgU3BpbmFsTm9kZSBjdXJyZW50bHkgbG9hZGVkXG4gKiAgQHByb3BlcnR5IHtTcGluYWxHcmFwaH0gZ3JhcGhcbiAqL1xuY2xhc3MgR3JhcGhNYW5hZ2VyU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB2aWV3ZXJFbnYge2Jvb2xlYW59IGlmIGRlZmluZWQgbG9hZCBncmFwaCBmcm9tIGdldE1vZGVsXG4gICAqL1xuICBjb25zdHJ1Y3Rvciggdmlld2VyRW52ICkge1xuICAgIHRoaXMuYmluZGVkTm9kZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJpbmRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubm9kZXMgPSB7fTtcbiAgICB0aGlzLmdyYXBoID0ge307XG4gICAgaWYgKHR5cGVvZiB2aWV3ZXJFbnYgIT09IFwidW5kZWZpbmVkXCIpIHtcblxuICAgICAgR19yb290LnNwaW5hbC5zcGluYWxTeXN0ZW0uZ2V0TW9kZWwoKVxuICAgICAgICAudGhlbihcbiAgICAgICAgICBmb3JnZUZpbGUgPT4gdGhpcy5zZXRHcmFwaEZyb21Gb3JnZUZpbGUoIGZvcmdlRmlsZSApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGN1cnJlbnQgZ3JhcGggd2l0aCB0aGUgb25lIG9mIHRoZSBmb3JnZUZpbGUgaWYgdGhlcmUgaXMgb25lIGNyZWF0ZSBvbmUgaWYgbm90ZVxuICAgKiBAcGFyYW0gZm9yZ2VGaWxlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlICkge1xuXG4gICAgaWYgKCFmb3JnZUZpbGUuaGFzT3duUHJvcGVydHkoICdncmFwaCcgKSkge1xuICAgICAgZm9yZ2VGaWxlLmFkZF9hdHRyKCB7XG4gICAgICAgIGdyYXBoOiBuZXcgU3BpbmFsR3JhcGgoKVxuICAgICAgfSApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRHcmFwaCggZm9yZ2VGaWxlLmdyYXBoICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhcGgge1NwaW5hbEdyYXBofVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fSB0aGUgaWQgb2YgdGhlIGdyYXBoXG4gICAqL1xuICBzZXRHcmFwaCggZ3JhcGggKSB7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuZ3JhcGguZ2V0SWQgPT09IFwiZnVuY3Rpb25cIiAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCkgKSkge1xuICAgICAgZGVsZXRlIHRoaXMubm9kZXNbdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpXTtcbiAgICB9XG4gICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xuICAgIHRoaXMubm9kZXNbdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpXSA9IHRoaXMuZ3JhcGg7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSwgW10gKVxuICAgICAgLnRoZW4oICgpID0+IHtyZXR1cm4gdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpO30gKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgbG9hZGVkIE5vZGVzXG4gICAqL1xuICBnZXROb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge09iamVjdCB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldE5vZGUoIGlkICkge1xuXG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluZm8oIGlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgZ3JhcGhcbiAgICogQHJldHVybnMge3t9fFNwaW5hbEdyYXBofVxuICAgKi9cbiAgZ2V0R3JhcGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge1NwaW5hbE5vZGUgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXRSZWFsTm9kZSggaWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgdGhlIHJlbGF0aW9uIG5hbWVzIG9mIHRoZSBub2RlIGNvcmVzcG9uZGluZyB0byBpZFxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge0FycmF5PFN0cmluZz59XG4gICAqL1xuICBnZXRSZWxhdGlvbk5hbWVzKCBpZCApIHtcbiAgICBjb25zdCByZWxhdGlvbk5hbWVzID0gW107XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIGZvciAobGV0IHJlbGF0aW9uTWFwIG9mIHRoaXMubm9kZXNbaWRdLmNoaWxkcmVuKSB7XG4gICAgICAgIHJlbGF0aW9uTmFtZXMucHVzaCggLi4ucmVsYXRpb25NYXAua2V5cygpICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZWxhdGlvbk5hbWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgY2hpbGRyZW4gb2YgYSBub2RlXG4gICAqIEBwYXJhbSBpZFxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lcyB7QXJyYXl9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5PFNwaW5hbE5vZGVSZWY+Pn1cbiAgICovXG4gIGdldENoaWxkcmVuKCBpZCwgcmVsYXRpb25OYW1lcyA9IFtdICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJOb2RlIGlkOiBcIiArIGlkICsgXCIgbm90IGZvdW5kXCIgKSApO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGlvbk5hbWVzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICBmb3IgKGxldCByZWxhdGlvbk1hcCBvZiB0aGlzLm5vZGVzW2lkXS5jaGlsZHJlbikge1xuICAgICAgICByZWxhdGlvbk5hbWVzLnB1c2goIC4uLnJlbGF0aW9uTWFwLmtleXMoKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXS5nZXRDaGlsZHJlbiggcmVsYXRpb25OYW1lcyApXG4gICAgICAudGhlbiggKCBjaGlsZHJlbiApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNoaWxkcmVuIG9mIHRoZSBub2RlIHRoYXQgYXJlIHJlZ2lzdGVyZWQgaW4gdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHBhcmVudElkIHtTdHJpbmd9IGlkIG9mIHRoZSBwYXJlbnQgbm9kZVxuICAgKiBAcGFyYW0gY29udGV4dElkIHtTdHJpbmd9IGlkIG9mIHRoZSBjb250ZXh0IG5vZGVcbiAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXk8T2JqZWN0Pj59IFRoZSBpbmZvIG9mIHRoZSBjaGlsZHJlbiB0aGF0IHdlcmUgZm91bmRcbiAgICovXG4gIGdldENoaWxkcmVuSW5Db250ZXh0KCBwYXJlbnRJZCwgY29udGV4dElkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNvbnRleHRJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHRoaXMubm9kZXNbY29udGV4dElkXSApLnRoZW4oIGNoaWxkcmVuID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX2FkZE5vZGUoIGNoaWxkcmVuW2ldICk7XG4gICAgICAgICAgcmVzLnB1c2goIHRoaXMuZ2V0SW5mbyggY2hpbGRyZW5baV0uZ2V0SWQoKS5nZXQoKSApICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgaW5mbyBhZ2dyZWdhdGVkIHdpdGggaXRzIGNoaWxkcmVuSWRzLCBjb250ZXh0SWRzIGFuZCBlbGVtZW50XG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRJbmZvKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW25vZGVJZF07XG4gICAgY29uc3QgcmVzID0gbm9kZS5pbmZvLmRlZXBfY29weSgpO1xuICAgIHJlc1snY2hpbGRyZW5JZHMnXSA9IG5vZGUuZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICByZXNbJ2NvbnRleHRJZHMnXSA9IG5vZGUuY29udGV4dElkcztcbiAgICByZXNbJ2VsZW1lbnQnXSA9IG5vZGUuZWxlbWVudDtcbiAgICByZXNbJ2hhc0NoaWxkcmVuJ10gPSBub2RlLmNoaWxkcmVuLnNpemUgPiAwO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZXRDaGlsZHJlbklkcyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbbm9kZUlkXS5nZXRDaGlsZHJlbklkcygpO1xuICAgIH1cbiAgfVxuXG4gIGxpc3Rlbk9uTm9kZUFkZGVkKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJzT25Ob2RlQWRkZWQuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZ09uTm9kZUFkZGVkLmJpbmQoIHRoaXMsIGNhbGxlciApO1xuICB9XG5cbiAgbGlzdGVuT25Ob2RlUmVtb3ZlKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZS5iaW5kKCB0aGlzLCBjYWxsZXIgKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCggY2FsbGVyICkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLmRlbGV0ZSggY2FsbGVyICk7XG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlKCBjYWxsZXIgKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuZGVsZXRlKCBjYWxsZXIgKTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEBwYXJhbSBpbmZvIG5ldyBpbmZvIGZvciB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgaXMgTG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgbW9kaWZ5Tm9kZSggbm9kZUlkLCBpbmZvICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRPIERPIDogY2hhbmdlIHRoZSBmb2xsb3dpbmcgXCJtb2RfYXR0clxuICAgIC8vIHRvIGEgZGlyZWN0IFwidXBkYXRlXCIgb2YgdGhlIGV4aXN0aW5nIG1vZGVsLlxuICAgIC8vIFRoaXMgd2lsbCByZWR1Y2UgdGhlIGNyZWF0aW9uIG9mIG1vZGVsIGJ1dFxuICAgIHRoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGEgbm9kZSBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5iaW5kIHRoZSBzYW1lIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2FsbGVyIHtPYmplY3R9IHVzdWFsbHkgJ3RoaXMnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259IHRvIGJlIGNhbGwgZXZlcnkgY2hhbmdlIG9mIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWQgfCBmdW5jdGlvbn0gcmV0dXJuIGEgZnVuY3Rpb24gdG8gYWxsb3cgdG8gbm9kZSB1bmJpbmRpbmcgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgZXhpc3QgdW5kZWZpbmVkIGFuZCBjYWxsZXIgaXMgYW4gb2JqZWN0IGFuZCBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIG90aGVyd2lzZVxuICAgKi9cbiAgYmluZE5vZGUoIG5vZGVJZCwgY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApIHx8IHR5cGVvZiBjYWxsZXIgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuc2V0KCBub2RlSWQsIG5ldyBNYXAoIFtcbiAgICAgICAgW2NhbGxlciwgY2FsbGJhY2tdXG4gICAgICBdICkgKTtcbiAgICAgIHRoaXMuX2JpbmROb2RlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdW5CaW5kLmJpbmQoIHRoaXMsIG5vZGVJZCwgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb2NlIHRoZSBjaGlsZCBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgZnJvbSB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHBhcmVudElkLlxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcGFyYW0gc3RvcFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cbiAgICovXG4gIHJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBzdG9wID0gZmFsc2UgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIm5vZGVJZCB1bmtub3duLlwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiAhc3RvcCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oIG5vZGVJZCwgW10gKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5yZW1vdmVDaGlsZCggbm9kZUlkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgdHJ1ZSApIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApKSB7XG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVycy52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggbm9kZUlkICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlSWRdLnJlbW92ZUNoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcImNoaWxkSWQgdW5rbm93bi4gSXQgbWlnaHQgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IG5vZGVcIiApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRleHQgdG8gdGhlIGdyYXBoXG4gICAqIEBwYXJhbSBuYW1lIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IG9mIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSBlbHQge01vZGVsfSBlbGVtZW50IG9mIHRoZSBjb250ZXh0IGlmIG5lZWRlZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTcGluYWxDb250ZXh0Pn1cbiAgICovXG4gIGFkZENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApIHtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IFNwaW5hbENvbnRleHQoIG5hbWUsIHR5cGUsIGVsdCApO1xuICAgIHRoaXMubm9kZXNbY29udGV4dC5pbmZvLmlkLmdldCgpXSA9IGNvbnRleHQ7XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuZ3JhcGguYWRkQ29udGV4dCggY29udGV4dCApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtTcGluYWxDb250ZXh0fHVuZGVmaW5lZH1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBrZXkgKSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgbm9kZSByZWZlcmVuY2VkIGJ5IGlkIGZyb20gdGggZ3JhcGguXG4gICAqIEBwYXJhbSBpZFxuICAgKi9cbiAgcmVtb3ZlRnJvbUdyYXBoKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0ucmVtb3ZlRnJvbUdyYXBoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm5vZGVzW2NvbnRleHRJZF07XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGRJbkNvbnRleHQoIGNoaWxkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgY29udGV4dCApO1xuICAgIH1cbiAgICAvL1RPRE8gb3B0aW9uIHBhcnNlclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoICdOb2RlIGlkJyArIHBhcmVudElkICsgJyBub3QgZm91bmQnICkgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBjaGlsZElkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2hpbGRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IHJldHVybiB0cnVlIGlmIHRoZSBjaGlsZCBjb3VsZCBiZSBhZGRlZCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhZGRDaGlsZCggcGFyZW50SWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBub2RlIGFuZCBhZGQgaXQgYXMgY2hpbGQgdG8gdGhlIHBhcmVudElkLlxuICAgKiBAcGFyYW0gcGFyZW50SWQge3N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBub2RlIHtPYmplY3R9IG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2luZm8nIGFuZCBjYW4gaGF2ZSBhbiBhdHRyaWJ1dGUgJ2VsZW1lbnQnXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge3N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgd2FzIGNyZWF0ZWQgYWRkZWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBhZGRDaGlsZEFuZENyZWF0ZU5vZGUoIHBhcmVudElkLCBub2RlLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoICdpbmZvJyApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUlkID0gdGhpcy5jcmVhdGVOb2RlKCBub2RlLmluZm8sIG5vZGUuZWxlbWVudCApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoIHBhcmVudElkLCBub2RlSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=