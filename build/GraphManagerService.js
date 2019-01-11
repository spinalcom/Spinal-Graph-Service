"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spinalModelGraph = require("spinal-model-graph");

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


  setGraphFromForgeFile(forgeFile) {
    if (!forgeFile.hasOwnProperty('graph')) {
      forgeFile.add_attr({
        graph: new _spinalModelGraph.SpinalGraph()
      });
    }

    return this.setGraph(forgeFile.graph);
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
    return this.getChildren(this.graph.getId().get(), []).then(() => {
      return this.graph.getId().get();
    });
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


  getRelationNames(id) {
    const relationNames = [];

    if (this.nodes.hasOwnProperty(id)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.nodes[id].children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let relationMap = _step.value;
          relationNames.push(...relationMap.keys());
        }
      } catch (err) {
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


  getChildren(id, relationNames = []) {
    if (!this.nodes.hasOwnProperty(id)) {
      return Promise.reject(Error("Node id: " + id + " not found"));
    }

    if (relationNames.length === 0) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.nodes[id].children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let relationMap = _step2.value;
          relationNames.push(...relationMap.keys());
        }
      } catch (err) {
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


  getChildrenInContext(parentId, contextId) {
    if (this.nodes.hasOwnProperty(parentId) && this.nodes.hasOwnProperty(contextId)) {
      return this.nodes[parentId].getChildrenInContext(this.nodes[contextId]).then(children => {
        const res = [];

        for (let i = 0; i < children.length; i++) {
          this._addNode(children[i]);

          res.push(this.getInfo(children[i].getId().get()));
        }

        return res;
      });
    }
  }
  /**
   * Return the node info aggregated with its childrenIds, contextIds and element
   * @param nodeId
   * @returns {*}
   */


  getInfo(nodeId) {
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

  getChildrenIds(nodeId) {
    if (this.nodes.hasOwnProperty(nodeId)) {
      return this.nodes[nodeId].getChildrenIds();
    }
  }

  listenOnNodeAdded(caller, callback) {
    this.listenersOnNodeAdded.set(caller, callback);
    return this.stopListeningOnNodeAdded.bind(this, caller);
  }

  listenOnNodeRemove(caller, callback) {
    this.listenerOnNodeRemove.set(caller, callback);
    return this.stopListeningOnNodeRemove.bind(this, caller);
  }

  stopListeningOnNodeAdded(caller) {
    return this.listenersOnNodeAdded.delete(caller);
  }

  stopListeningOnNodeRemove(caller) {
    return this.listenerOnNodeRemove.delete(caller);
  }
  /**
   * @param nodeId id of the desired node
   * @param info new info for the node
   * @returns {boolean} return true if the node corresponding to nodeId is Loaded false otherwise
   */


  modifyNode(nodeId, info) {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return false;
    }

    for (let key in info) {
      if (!this.nodes[nodeId].info.hasOwnProperty(key) && info.hasOwnProperty(key)) {
        const tmp = {};
        tmp[key] = info[key];
        this.nodes[nodeId].info.add_attr(tmp);
      } else if (info.hasOwnProperty(key)) {
        this.nodes[nodeId].info.mod_attr(key, info[key]);
      }
    } //this.nodes[nodeId].mod_attr( 'info', info );


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
   *
   * @param fromId {string} node id of the node where the child is first located
   * @param toId {string} node id of the node where the child is going to be
   * located
   * @param childId {string} node id of the node which is moving
   * @param relationName {string} name of the relation between the node
   * @param relationType {string} type of relation
   * @return {*}
   */


  moveChild(fromId, toId, childId, relationName, relationType) {
    if (!this.nodes.hasOwnProperty(fromId)) {
      return Promise.reject('fromId: ' + fromId + ' not found');
    }

    if (!this.nodes.hasOwnProperty(toId)) {
      return Promise.reject('toId: ' + toId + ' not found');
    }

    if (!this.nodes.hasOwnProperty(childId)) {
      return Promise.reject('childId: ' + childId + ' not found');
    }

    return this.nodes[fromId].removeChild(this.nodes[childId], relationName, relationType).then(() => {
      return this.nodes[toId].addChild(this.nodes[childId], relationName, relationType).then(() => {
        return true;
      });
    });
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

    if (!this.nodes.hasOwnProperty(childId) && !stop) {
      return this.getChildren(nodeId, []).then(() => this.removeChild(nodeId, childId, relationName, relationType, true)).catch(e => console.error(e));
    } else if (this.nodes.hasOwnProperty(childId)) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.listenerOnNodeRemove.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let callback = _step3.value;
          callback(nodeId);
        }
      } catch (err) {
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

      return this.nodes[nodeId].removeChild(this.nodes[childId], relationName, relationType);
    } else {
      return Promise.reject(Error("childId unknown. It might already been removed from the parent node"));
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
    const context = new _spinalModelGraph.SpinalContext(name, type, elt);
    this.nodes[context.info.id.get()] = context;
    return this.graph.addContext(context);
  }
  /**
   * @param name
   * @returns {SpinalContext|undefined}
   */


  getContext(name) {
    for (let key in this.nodes) {
      if (this.nodes.hasOwnProperty(key)) {
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


  removeFromGraph(id) {
    if (this.nodes.hasOwnProperty(id)) {
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
    const node = new _spinalModelGraph.SpinalNode(undefined, undefined, element);

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
    //TODO OPTION PARSER
    if (!this.nodes.hasOwnProperty(parentId)) {
      return Promise.reject(Error('Node parent id ' + parentId + ' not' + ' found'));
    }

    if (!this.nodes.hasOwnProperty(childId)) {
      return Promise.reject(Error('Node child id ' + childId + ' not found'));
    }

    if (!this.nodes.hasOwnProperty(contextId)) {
      return Promise.reject(Error('Node context id ' + contextId + ' not' + ' found'));
    }

    const child = this.nodes[childId];
    const context = this.nodes[contextId];
    return this.nodes[parentId].addChildInContext(child, relationName, relationType, context);
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
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.listenersOnNodeAdded.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let callback = _step4.value;
          callback(node.info.id.get());
        }
      } catch (err) {
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
        for (var _iterator5 = this.bindedNode.get(nodeId).values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          let callback = _step5.value;
          callback(this.nodes[nodeId]);
        }
      } catch (err) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzT25Ob2RlQWRkZWQiLCJsaXN0ZW5lck9uTm9kZVJlbW92ZSIsIm5vZGVzIiwiZ3JhcGgiLCJzcGluYWwiLCJzcGluYWxTeXN0ZW0iLCJnZXRNb2RlbCIsInRoZW4iLCJmb3JnZUZpbGUiLCJzZXRHcmFwaEZyb21Gb3JnZUZpbGUiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZF9hdHRyIiwiU3BpbmFsR3JhcGgiLCJzZXRHcmFwaCIsImdldElkIiwiZ2V0IiwiZ2V0Q2hpbGRyZW4iLCJnZXROb2RlcyIsImdldE5vZGUiLCJpZCIsImdldEluZm8iLCJ1bmRlZmluZWQiLCJnZXRHcmFwaCIsImdldFJlYWxOb2RlIiwiZ2V0UmVsYXRpb25OYW1lcyIsInJlbGF0aW9uTmFtZXMiLCJjaGlsZHJlbiIsInJlbGF0aW9uTWFwIiwicHVzaCIsImtleXMiLCJQcm9taXNlIiwicmVqZWN0IiwiRXJyb3IiLCJsZW5ndGgiLCJyZXMiLCJpIiwiX2FkZE5vZGUiLCJnZXRDaGlsZHJlbkluQ29udGV4dCIsInBhcmVudElkIiwiY29udGV4dElkIiwibm9kZUlkIiwibm9kZSIsImluZm8iLCJkZWVwX2NvcHkiLCJnZXRDaGlsZHJlbklkcyIsImNvbnRleHRJZHMiLCJlbGVtZW50Iiwic2l6ZSIsImxpc3Rlbk9uTm9kZUFkZGVkIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJzZXQiLCJzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQiLCJiaW5kIiwibGlzdGVuT25Ob2RlUmVtb3ZlIiwic3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZSIsImRlbGV0ZSIsIm1vZGlmeU5vZGUiLCJrZXkiLCJ0bXAiLCJtb2RfYXR0ciIsImJpbmROb2RlIiwiaGFzIiwiX2JpbmROb2RlIiwiX3VuQmluZCIsIm1vdmVDaGlsZCIsImZyb21JZCIsInRvSWQiLCJjaGlsZElkIiwicmVsYXRpb25OYW1lIiwicmVsYXRpb25UeXBlIiwicmVtb3ZlQ2hpbGQiLCJhZGRDaGlsZCIsInN0b3AiLCJ2YWx1ZXMiLCJhZGRDb250ZXh0IiwibmFtZSIsInR5cGUiLCJlbHQiLCJjb250ZXh0IiwiU3BpbmFsQ29udGV4dCIsImdldENvbnRleHQiLCJnZXROYW1lIiwicmVtb3ZlRnJvbUdyYXBoIiwiY3JlYXRlTm9kZSIsIlNwaW5hbE5vZGUiLCJnZXRUeXBlIiwiYWRkQ2hpbGRJbkNvbnRleHQiLCJjaGlsZCIsInJlc29sdmUiLCJhZGRDaGlsZEFuZENyZWF0ZU5vZGUiLCJfYXJlQWxsQ2hpbGRyZW5Mb2FkZWQiLCJjaGlsZHJlbklkcyIsImhhc0FsbENoaWxkIiwiX2JpbmRGdW5jIiwiYmluZGVyIiwidW5iaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBd0JBOztBQXhCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsTUFBTUEsTUFBTSxHQUFHLE9BQU9DLE1BQVAsSUFBaUIsV0FBakIsR0FBK0JDLE1BQS9CLEdBQXdDRCxNQUF2RDtBQUVBOzs7Ozs7OztBQU9BLE1BQU1FLG1CQUFOLENBQTBCO0FBRXhCOzs7QUFHQUMsRUFBQUEsV0FBVyxDQUFFQyxTQUFGLEVBQWM7QUFDdkIsU0FBS0MsVUFBTCxHQUFrQixJQUFJQyxHQUFKLEVBQWxCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQUlELEdBQUosRUFBZjtBQUNBLFNBQUtFLG9CQUFMLEdBQTRCLElBQUlGLEdBQUosRUFBNUI7QUFDQSxTQUFLRyxvQkFBTCxHQUE0QixJQUFJSCxHQUFKLEVBQTVCO0FBQ0EsU0FBS0ksS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsRUFBYjs7QUFDQSxRQUFJLE9BQU9QLFNBQVAsS0FBcUIsV0FBekIs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LENBQXdCaEIsTUFBeEI7QUFDRDs7QUFFRCxXQUFPTixHQUFQO0FBQ0Q7O0FBcGdCdUI7O2VBdWdCWDVDLG1CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE5IFNwaW5hbENvbSAtIHd3dy5zcGluYWxjb20uY29tXG4gKlxuICogIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFNwaW5hbENvcmUuXG4gKlxuICogIFBsZWFzZSByZWFkIGFsbCBvZiB0aGUgZm9sbG93aW5nIHRlcm1zIGFuZCBjb25kaXRpb25zXG4gKiAgb2YgdGhlIEZyZWUgU29mdHdhcmUgbGljZW5zZSBBZ3JlZW1lbnQgKFwiQWdyZWVtZW50XCIpXG4gKiAgY2FyZWZ1bGx5LlxuICpcbiAqICBUaGlzIEFncmVlbWVudCBpcyBhIGxlZ2FsbHkgYmluZGluZyBjb250cmFjdCBiZXR3ZWVuXG4gKiAgdGhlIExpY2Vuc2VlIChhcyBkZWZpbmVkIGJlbG93KSBhbmQgU3BpbmFsQ29tIHRoYXRcbiAqICBzZXRzIGZvcnRoIHRoZSB0ZXJtcyBhbmQgY29uZGl0aW9ucyB0aGF0IGdvdmVybiB5b3VyXG4gKiAgdXNlIG9mIHRoZSBQcm9ncmFtLiBCeSBpbnN0YWxsaW5nIGFuZC9vciB1c2luZyB0aGVcbiAqICBQcm9ncmFtLCB5b3UgYWdyZWUgdG8gYWJpZGUgYnkgYWxsIHRoZSB0ZXJtcyBhbmRcbiAqICBjb25kaXRpb25zIHN0YXRlZCBvciByZWZlcmVuY2VkIGhlcmVpbi5cbiAqXG4gKiAgSWYgeW91IGRvIG5vdCBhZ3JlZSB0byBhYmlkZSBieSB0aGVzZSB0ZXJtcyBhbmRcbiAqICBjb25kaXRpb25zLCBkbyBub3QgZGVtb25zdHJhdGUgeW91ciBhY2NlcHRhbmNlIGFuZCBkb1xuICogIG5vdCBpbnN0YWxsIG9yIHVzZSB0aGUgUHJvZ3JhbS5cbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBsaWNlbnNlIGFsb25nXG4gKiAgd2l0aCB0aGlzIGZpbGUuIElmIG5vdCwgc2VlXG4gKiAgPGh0dHA6Ly9yZXNvdXJjZXMuc3BpbmFsY29tLmNvbS9saWNlbnNlcy5wZGY+LlxuICovXG5cbmltcG9ydCB7XG4gIFNwaW5hbENvbnRleHQsXG4gIFNwaW5hbEdyYXBoLFxuICBTcGluYWxOb2RlXG59IGZyb20gXCJzcGluYWwtbW9kZWwtZ3JhcGhcIjtcblxuY29uc3QgR19yb290ID0gdHlwZW9mIHdpbmRvdyA9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogd2luZG93O1xuXG4vKipcbiAqICBAcHJvcGVydHkge01hcDxTdHJpbmcsIE1hcDxPYmplY3QsIGZ1bmN0aW9uPj59IGJpbmRlZE5vZGUgTm9kZUlkID0+IENhbGxlciA9PiBDYWxsYmFjay4gQWxsIG5vZGVzIHRoYXQgYXJlIGJpbmRcbiAqICBAcHJvcGVydHkge01hcDxTdHJpbmcsIGZ1bmN0aW9uPn0gYmluZGVycyBOb2RlSWQgPT4gQ2FsbEJhY2sgZnJvbSBiaW5kIG1ldGhvZC5cbiAqICBAcHJvcGVydHkge01hcDxPYmplY3QsIGZ1bmN0aW9uPn0gbGlzdGVuZXJzIGNhbGxlciA9PiBjYWxsYmFjay4gTGlzdCBvZiBhbGwgbGlzdGVuZXJzIG9uIG5vZGUgYWRkZWRcbiAqICBAcHJvcGVydHkge09iamVjdH0gbm9kZXMgY29udGFpbmluZyBhbGwgU3BpbmFsTm9kZSBjdXJyZW50bHkgbG9hZGVkXG4gKiAgQHByb3BlcnR5IHtTcGluYWxHcmFwaH0gZ3JhcGhcbiAqL1xuY2xhc3MgR3JhcGhNYW5hZ2VyU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB2aWV3ZXJFbnYge2Jvb2xlYW59IGlmIGRlZmluZWQgbG9hZCBncmFwaCBmcm9tIGdldE1vZGVsXG4gICAqL1xuICBjb25zdHJ1Y3Rvciggdmlld2VyRW52ICkge1xuICAgIHRoaXMuYmluZGVkTm9kZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJpbmRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubm9kZXMgPSB7fTtcbiAgICB0aGlzLmdyYXBoID0ge307XG4gICAgaWYgKHR5cGVvZiB2aWV3ZXJFbnYgIT09IFwidW5kZWZpbmVkXCIpIHtcblxuICAgICAgR19yb290LnNwaW5hbC5zcGluYWxTeXN0ZW0uZ2V0TW9kZWwoKVxuICAgICAgICAudGhlbihcbiAgICAgICAgICBmb3JnZUZpbGUgPT4gdGhpcy5zZXRHcmFwaEZyb21Gb3JnZUZpbGUoIGZvcmdlRmlsZSApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGN1cnJlbnQgZ3JhcGggd2l0aCB0aGUgb25lIG9mIHRoZSBmb3JnZUZpbGUgaWYgdGhlcmUgaXMgb25lIGNyZWF0ZSBvbmUgaWYgbm90ZVxuICAgKiBAcGFyYW0gZm9yZ2VGaWxlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IHRoZSBpZCBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIHNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlICkge1xuXG4gICAgaWYgKCFmb3JnZUZpbGUuaGFzT3duUHJvcGVydHkoICdncmFwaCcgKSkge1xuICAgICAgZm9yZ2VGaWxlLmFkZF9hdHRyKCB7XG4gICAgICAgIGdyYXBoOiBuZXcgU3BpbmFsR3JhcGgoKVxuICAgICAgfSApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRHcmFwaCggZm9yZ2VGaWxlLmdyYXBoICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhcGgge1NwaW5hbEdyYXBofVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fSB0aGUgaWQgb2YgdGhlIGdyYXBoXG4gICAqL1xuICBzZXRHcmFwaCggZ3JhcGggKSB7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuZ3JhcGguZ2V0SWQgPT09IFwiZnVuY3Rpb25cIiAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCkgKSkge1xuICAgICAgZGVsZXRlIHRoaXMubm9kZXNbdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpXTtcbiAgICB9XG4gICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xuICAgIHRoaXMubm9kZXNbdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpXSA9IHRoaXMuZ3JhcGg7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSwgW10gKVxuICAgICAgLnRoZW4oICgpID0+IHtyZXR1cm4gdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpO30gKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgbG9hZGVkIE5vZGVzXG4gICAqL1xuICBnZXROb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge09iamVjdCB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldE5vZGUoIGlkICkge1xuXG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluZm8oIGlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgZ3JhcGhcbiAgICogQHJldHVybnMge3t9fFNwaW5hbEdyYXBofVxuICAgKi9cbiAgZ2V0R3JhcGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge1NwaW5hbE5vZGUgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXRSZWFsTm9kZSggaWQgKSB7XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgdGhlIHJlbGF0aW9uIG5hbWVzIG9mIHRoZSBub2RlIGNvcmVzcG9uZGluZyB0byBpZFxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge0FycmF5PFN0cmluZz59XG4gICAqL1xuICBnZXRSZWxhdGlvbk5hbWVzKCBpZCApIHtcbiAgICBjb25zdCByZWxhdGlvbk5hbWVzID0gW107XG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIGZvciAobGV0IHJlbGF0aW9uTWFwIG9mIHRoaXMubm9kZXNbaWRdLmNoaWxkcmVuKSB7XG4gICAgICAgIHJlbGF0aW9uTmFtZXMucHVzaCggLi4ucmVsYXRpb25NYXAua2V5cygpICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZWxhdGlvbk5hbWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgY2hpbGRyZW4gb2YgYSBub2RlXG4gICAqIEBwYXJhbSBpZFxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lcyB7QXJyYXl9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5PFNwaW5hbE5vZGVSZWY+Pn1cbiAgICovXG4gIGdldENoaWxkcmVuKCBpZCwgcmVsYXRpb25OYW1lcyA9IFtdICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJOb2RlIGlkOiBcIiArIGlkICsgXCIgbm90IGZvdW5kXCIgKSApO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGlvbk5hbWVzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICBmb3IgKGxldCByZWxhdGlvbk1hcCBvZiB0aGlzLm5vZGVzW2lkXS5jaGlsZHJlbikge1xuICAgICAgICByZWxhdGlvbk5hbWVzLnB1c2goIC4uLnJlbGF0aW9uTWFwLmtleXMoKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXS5nZXRDaGlsZHJlbiggcmVsYXRpb25OYW1lcyApXG4gICAgICAudGhlbiggKCBjaGlsZHJlbiApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNoaWxkcmVuIG9mIHRoZSBub2RlIHRoYXQgYXJlIHJlZ2lzdGVyZWQgaW4gdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHBhcmVudElkIHtTdHJpbmd9IGlkIG9mIHRoZSBwYXJlbnQgbm9kZVxuICAgKiBAcGFyYW0gY29udGV4dElkIHtTdHJpbmd9IGlkIG9mIHRoZSBjb250ZXh0IG5vZGVcbiAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXk8T2JqZWN0Pj59IFRoZSBpbmZvIG9mIHRoZSBjaGlsZHJlbiB0aGF0IHdlcmUgZm91bmRcbiAgICovXG4gIGdldENoaWxkcmVuSW5Db250ZXh0KCBwYXJlbnRJZCwgY29udGV4dElkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNvbnRleHRJZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uZ2V0Q2hpbGRyZW5JbkNvbnRleHQoIHRoaXMubm9kZXNbY29udGV4dElkXSApLnRoZW4oIGNoaWxkcmVuID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX2FkZE5vZGUoIGNoaWxkcmVuW2ldICk7XG4gICAgICAgICAgcmVzLnB1c2goIHRoaXMuZ2V0SW5mbyggY2hpbGRyZW5baV0uZ2V0SWQoKS5nZXQoKSApICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgaW5mbyBhZ2dyZWdhdGVkIHdpdGggaXRzIGNoaWxkcmVuSWRzLCBjb250ZXh0SWRzIGFuZCBlbGVtZW50XG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRJbmZvKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW25vZGVJZF07XG4gICAgY29uc3QgcmVzID0gbm9kZS5pbmZvLmRlZXBfY29weSgpO1xuICAgIHJlc1snY2hpbGRyZW5JZHMnXSA9IG5vZGUuZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICByZXNbJ2NvbnRleHRJZHMnXSA9IG5vZGUuY29udGV4dElkcztcbiAgICByZXNbJ2VsZW1lbnQnXSA9IG5vZGUuZWxlbWVudDtcbiAgICByZXNbJ2hhc0NoaWxkcmVuJ10gPSBub2RlLmNoaWxkcmVuLnNpemUgPiAwO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZXRDaGlsZHJlbklkcyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbbm9kZUlkXS5nZXRDaGlsZHJlbklkcygpO1xuICAgIH1cbiAgfVxuXG4gIGxpc3Rlbk9uTm9kZUFkZGVkKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJzT25Ob2RlQWRkZWQuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZ09uTm9kZUFkZGVkLmJpbmQoIHRoaXMsIGNhbGxlciApO1xuICB9XG5cbiAgbGlzdGVuT25Ob2RlUmVtb3ZlKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZS5iaW5kKCB0aGlzLCBjYWxsZXIgKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmdPbk5vZGVBZGRlZCggY2FsbGVyICkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLmRlbGV0ZSggY2FsbGVyICk7XG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlKCBjYWxsZXIgKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuZGVsZXRlKCBjYWxsZXIgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbm9kZUlkIGlkIG9mIHRoZSBkZXNpcmVkIG5vZGVcbiAgICogQHBhcmFtIGluZm8gbmV3IGluZm8gZm9yIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBpcyBMb2FkZWQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBtb2RpZnlOb2RlKCBub2RlSWQsIGluZm8gKSB7XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIFxuICAgIGZvciAobGV0IGtleSBpbiBpbmZvKSB7XG4gICAgICBpZiAoIXRoaXMubm9kZXNbbm9kZUlkXS5pbmZvLmhhc093blByb3BlcnR5KCBrZXkgKSAmJiBpbmZvLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29uc3QgdG1wID0ge307XG4gICAgICAgIHRtcFtrZXldID0gaW5mb1trZXldO1xuICAgICAgICB0aGlzLm5vZGVzW25vZGVJZF0uaW5mby5hZGRfYXR0cih0bXApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaW5mby5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgdGhpcy5ub2Rlc1tub2RlSWRdLmluZm8ubW9kX2F0dHIoa2V5LCBpbmZvW2tleV0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvL3RoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGEgbm9kZSBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5iaW5kIHRoZSBzYW1lIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2FsbGVyIHtPYmplY3R9IHVzdWFsbHkgJ3RoaXMnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259IHRvIGJlIGNhbGwgZXZlcnkgY2hhbmdlIG9mIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWQgfCBmdW5jdGlvbn0gcmV0dXJuIGEgZnVuY3Rpb24gdG8gYWxsb3cgdG8gbm9kZSB1bmJpbmRpbmcgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgZXhpc3QgdW5kZWZpbmVkIGFuZCBjYWxsZXIgaXMgYW4gb2JqZWN0IGFuZCBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIG90aGVyd2lzZVxuICAgKi9cbiAgYmluZE5vZGUoIG5vZGVJZCwgY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApIHx8IHR5cGVvZiBjYWxsZXIgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuc2V0KCBub2RlSWQsIG5ldyBNYXAoIFtcbiAgICAgICAgW2NhbGxlciwgY2FsbGJhY2tdXG4gICAgICBdICkgKTtcbiAgICAgIHRoaXMuX2JpbmROb2RlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdW5CaW5kLmJpbmQoIHRoaXMsIG5vZGVJZCwgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGZyb21JZCB7c3RyaW5nfSBub2RlIGlkIG9mIHRoZSBub2RlIHdoZXJlIHRoZSBjaGlsZCBpcyBmaXJzdCBsb2NhdGVkXG4gICAqIEBwYXJhbSB0b0lkIHtzdHJpbmd9IG5vZGUgaWQgb2YgdGhlIG5vZGUgd2hlcmUgdGhlIGNoaWxkIGlzIGdvaW5nIHRvIGJlXG4gICAqIGxvY2F0ZWRcbiAgICogQHBhcmFtIGNoaWxkSWQge3N0cmluZ30gbm9kZSBpZCBvZiB0aGUgbm9kZSB3aGljaCBpcyBtb3ZpbmdcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7c3RyaW5nfSBuYW1lIG9mIHRoZSByZWxhdGlvbiBiZXR3ZWVuIHRoZSBub2RlXG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge3N0cmluZ30gdHlwZSBvZiByZWxhdGlvblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgbW92ZUNoaWxkKCBmcm9tSWQsIHRvSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggZnJvbUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggJ2Zyb21JZDogJyArIGZyb21JZCArICcgbm90IGZvdW5kJyApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRvSWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCAndG9JZDogJyArIHRvSWQgKyAnIG5vdCBmb3VuZCcgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggJ2NoaWxkSWQ6ICcgKyBjaGlsZElkICsgJyBub3QgZm91bmQnICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbZnJvbUlkXS5yZW1vdmVDaGlsZCggdGhpcy5ub2Rlc1tjaGlsZElkXSwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKS50aGVuKCAoKSA9PiB7XG5cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3RvSWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9ICk7XG5cbiAgICB9ICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHN0b3AgPSBmYWxzZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwibm9kZUlkIHVua25vd24uXCIgKSApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCB0cnVlICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUudmFsdWVzKCkpIHtcbiAgICAgICAgY2FsbGJhY2soIG5vZGVJZCApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbbm9kZUlkXS5yZW1vdmVDaGlsZCggdGhpcy5ub2Rlc1tjaGlsZElkXSwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJjaGlsZElkIHVua25vd24uIEl0IG1pZ2h0IGFscmVhZHkgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudCBub2RlXCIgKSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250ZXh0IHRvIHRoZSBncmFwaFxuICAgKiBAcGFyYW0gbmFtZSB7U3RyaW5nfSBvZiB0aGUgY29udGV4dFxuICAgKiBAcGFyYW0gdHlwZSB7U3RyaW5nfSBvZiB0aGUgY29udGV4dFxuICAgKiBAcGFyYW0gZWx0IHtNb2RlbH0gZWxlbWVudCBvZiB0aGUgY29udGV4dCBpZiBuZWVkZWRcbiAgICogQHJldHVybnMge1Byb21pc2U8U3BpbmFsQ29udGV4dD59XG4gICAqL1xuICBhZGRDb250ZXh0KCBuYW1lLCB0eXBlLCBlbHQgKSB7XG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBTcGluYWxDb250ZXh0KCBuYW1lLCB0eXBlLCBlbHQgKTtcbiAgICB0aGlzLm5vZGVzW2NvbnRleHQuaW5mby5pZC5nZXQoKV0gPSBjb250ZXh0O1xuXG4gICAgcmV0dXJuIHRoaXMuZ3JhcGguYWRkQ29udGV4dCggY29udGV4dCApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtTcGluYWxDb250ZXh0fHVuZGVmaW5lZH1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBrZXkgKSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgbm9kZSByZWZlcmVuY2VkIGJ5IGlkIGZyb20gdGggZ3JhcGguXG4gICAqIEBwYXJhbSBpZFxuICAgKi9cbiAgcmVtb3ZlRnJvbUdyYXBoKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tpZF0ucmVtb3ZlRnJvbUdyYXBoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICAvL1RPRE8gT1BUSU9OIFBBUlNFUlxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShwYXJlbnRJZCkpe1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KEVycm9yKCAnTm9kZSBwYXJlbnQgaWQgJyArIHBhcmVudElkICsgJyBub3QnICtcbiAgICAgICAgJyBmb3VuZCcgKSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShjaGlsZElkKSl7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoRXJyb3IoICdOb2RlIGNoaWxkIGlkICcgKyBjaGlsZElkICsgJyBub3QgZm91bmQnICkpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoY29udGV4dElkKSl7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoRXJyb3IoICdOb2RlIGNvbnRleHQgaWQgJyArIGNvbnRleHRJZCArICcgbm90JyArXG4gICAgICAgICcgZm91bmQnICkpO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5ub2Rlc1tjb250ZXh0SWRdO1xuICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5hZGRDaGlsZEluQ29udGV4dCggY2hpbGQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBjb250ZXh0ICk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBhcyBjaGlsZCB0byB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJlbnRJZFxuICAgKiBAcGFyYW0gcGFyZW50SWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fSByZXR1cm4gdHJ1ZSBpZiB0aGUgY2hpbGQgY291bGQgYmUgYWRkZWQgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgYWRkQ2hpbGQoIHBhcmVudElkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSB8fCAhdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCBmYWxzZSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5hZGRDaGlsZCggdGhpcy5ub2Rlc1tjaGlsZElkXSwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKS50aGVuKCAoKSA9PiB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ICk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbm9kZSBhbmQgYWRkIGl0IGFzIGNoaWxkIHRvIHRoZSBwYXJlbnRJZC5cbiAgICogQHBhcmFtIHBhcmVudElkIHtzdHJpbmd9IGlkIG9mIHRoZSBwYXJlbnQgbm9kZVxuICAgKiBAcGFyYW0gbm9kZSB7T2JqZWN0fSBtdXN0IGhhdmUgYW4gYXR0cmlidXRlICdpbmZvJyBhbmQgY2FuIGhhdmUgYW4gYXR0cmlidXRlICdlbGVtZW50J1xuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtzdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybiB0cnVlIGlmIHRoZSBub2RlIHdhcyBjcmVhdGVkIGFkZGVkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkIHN1Y2Nlc3NmdWxseVxuICAgKi9cbiAgYWRkQ2hpbGRBbmRDcmVhdGVOb2RlKCBwYXJlbnRJZCwgbm9kZSwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKSB7XG4gICAgaWYgKCFub2RlLmhhc093blByb3BlcnR5KCAnaW5mbycgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5vZGVJZCA9IHRoaXMuY3JlYXRlTm9kZSggbm9kZS5pbmZvLCBub2RlLmVsZW1lbnQgKTtcblxuICAgIHJldHVybiB0aGlzLmFkZENoaWxkKCBwYXJlbnRJZCwgbm9kZUlkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApO1xuICB9XG5cbiAgLyoqKlxuICAgKiBhZGQgYSBub2RlIHRvIHRoZSBzZXQgb2Ygbm9kZVxuICAgKiBAcGFyYW0gbm9kZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FkZE5vZGUoIG5vZGUgKSB7XG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlLmdldElkKCkuZ2V0KCkgKSkge1xuICAgICAgdGhpcy5ub2Rlc1tub2RlLmluZm8uaWQuZ2V0KCldID0gbm9kZTtcblxuICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggbm9kZS5pbmZvLmlkLmdldCgpICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFsbCBjaGlsZHJlbiBmcm9tIGEgbm9kZSBhcmUgbG9hZGVkXG4gICAqIEBwYXJhbSBub2RlSWQgaWQgb2YgdGhlIGRlc2lyZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgYWxsIGNoaWxkcmVuIG9mIHRoZSBub2RlIGlzIGxvYWRlZCBmYWxzZSBvdGhlcndpc2VcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hcmVBbGxDaGlsZHJlbkxvYWRlZCggbm9kZUlkICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkcmVuSWRzID0gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgbGV0IGhhc0FsbENoaWxkID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW5JZHMubGVuZ3RoICYmIGhhc0FsbENoaWxkOyBpKyspIHtcbiAgICAgIGhhc0FsbENoaWxkID0gdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRyZW5JZHNbaV0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzQWxsQ2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogQmluZCB0aGUgbm9kZSBpZiBuZWVkZWQgYW5kIHNhdmUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kTm9kZSggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlcnMuaGFzKCBub2RlSWQgKSB8fCAhdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5iaW5kZXJzLnNldCggbm9kZUlkLCB0aGlzLm5vZGVzW25vZGVJZF0uYmluZCggdGhpcy5fYmluZEZ1bmMuYmluZCggdGhpcywgbm9kZUlkICkgKSApO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbGwgdGhlIGNhbGxiYWNrIG1ldGhvZCBvZiBhbGwgdGhlIGJpbmRlciBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYmluZEZ1bmMoIG5vZGVJZCApIHtcbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcblxuICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkudmFsdWVzKCkpIHtcbiAgICAgICAgY2FsbGJhY2soIHRoaXMubm9kZXNbbm9kZUlkXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB1bmJpbmQgYSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGJpbmRlciB7T2JqZWN0fVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91bkJpbmQoIG5vZGVJZCwgYmluZGVyICkge1xuXG4gICAgaWYgKCF0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLmRlbGV0ZSggYmluZGVyICk7XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2l6ZSA9PT0gMCkge1xuICAgICAgdGhpcy5ub2Rlc1tub2RlSWRdLnVuYmluZCggdGhpcy5iaW5kZXJzLmdldCggbm9kZUlkICkgKTtcbiAgICAgIHRoaXMuYmluZGVycy5kZWxldGUoIG5vZGVJZCApO1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmFwaE1hbmFnZXJTZXJ2aWNlO1xuIl19