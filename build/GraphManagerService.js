"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spinalModelGraph = require("spinal-model-graph");

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
  constructor(viewerEnv) {
    this.bindedNode = new Map();
    this.binders = new Map();
    this.listeners = new Map();
    this.nodes = {};
    this.graph = {};

    if (typeof viewerEnv !== "undefined") {
      G_root.spinal.spinalSystem.getModel().then(forgeFile => this.setGraphFromForgeFile(forgeFile)).catch(e => console.error(e));
    }
  }
  /**
   * Change the current graph with the one of the forgeFile if there is one create one if note
   * @param forgeFile
   * @returns {*}
   */


  setGraphFromForgeFile(forgeFile) {
    if (!forgeFile.hasOwnProperty('graph')) {
      forgeFile.add_attr({
        graph: new _spinalModelGraph.SpinalGraph()
      });
    }

    this.setGraph(forgeFile.graph);
  }
  /**
   *
   * @param graph {SpinalGraph}
   */


  setGraph(graph) {
    if (typeof this.graph.getId === "function" && this.nodes.hasOwnProperty(this.graph.getId().get())) {
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


  getNode(id) {
    if (this.nodes.hasOwnProperty(id)) {
      return this.getInfo(id);
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
   * @returns Promise<Array<SpinalNode>>
   */


  getChildren(id, relationNames) {
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
   * Return the node info aggregated with its childrenIds, contextIds and element
   * @param nodeId
   * @returns {*}
   */


  getInfo(nodeId) {
    if (!this.nodes.hasOwnProperty(nodeId)) {
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

  listenOnNodeAdded(caller, callback) {
    this.listeners.set(caller, callback);
    return this.stopListening.bind(this, caller);
  }

  stopListening(caller) {
    return this.listeners.delete(caller);
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
   * @returns Promise<boolean>
   */


  removeChild(nodeId, childId, relationName, relationType, stop = false) {
    if (!this.nodes.hasOwnProperty(nodeId)) {
      return Promise.reject(Error("nodeId unknown."));
    }

    if (this.nodes.hasOwnProperty(nodeId)) {
      if (!this.nodes.hasOwnProperty(childId) && !stop) {
        return this.getChildren(nodeId, []).then(() => this.removeChild(nodeId, childId, relationName, relationType, true)).catch(e => console.error(e));
      } else if (this.nodes.hasOwnProperty(childId)) {
        this.nodes[nodeId].removeChild(this.nodes[childId], relationName, relationType);
        return Promise.resolve(true);
      } else {
        return Promise.reject(Error("childId unknown. It might already been removed from the parent node"));
      }
    }
  }
  /**
   * Add a context to the graph
   * @param context
   * @returns {Promise<SpinalContext>}
   */


  addContext(name, type, elt) {
    const context = new _spinalModelGraph.SpinalContext(name, type, elt);
    this.nodes[context.info.id.get()] = context;
    return this.graph.addContext(context);
  }
  /**
   * @param name
   * @returns {*}
   */


  getContext(name) {
    for (let key in this.nodes) {
      const node = this.nodes[key];

      if (node instanceof _spinalModelGraph.SpinalContext && node.getName().get() === name) {
        return node;
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.listeners.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let callback = _step2.value;
          callback(node.info.id.get());
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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.bindedNode.get(nodeId).values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let callback = _step3.value;
          callback(this.nodes[nodeId]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzIiwibm9kZXMiLCJncmFwaCIsInNwaW5hbCIsInNwaW5hbFN5c3RlbSIsImdldE1vZGVsIiwidGhlbiIsImZvcmdlRmlsZSIsInNldEdyYXBoRnJvbUZvcmdlRmlsZSIsImNhdGNoIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsImhhc093blByb3BlcnR5IiwiYWRkX2F0dHIiLCJTcGluYWxHcmFwaCIsInNldEdyYXBoIiwiZ2V0SWQiLCJnZXQiLCJnZXROb2RlIiwiaWQiLCJnZXRJbmZvIiwidW5kZWZpbmVkIiwiZ2V0R3JhcGgiLCJnZXRSZWFsTm9kZSIsImdldENoaWxkcmVuIiwicmVsYXRpb25OYW1lcyIsIlByb21pc2UiLCJyZWplY3QiLCJFcnJvciIsImxlbmd0aCIsImNoaWxkcmVuIiwicmVsYXRpb25NYXAiLCJwdXNoIiwia2V5cyIsInJlcyIsImkiLCJfYWRkTm9kZSIsIm5vZGVJZCIsIm5vZGUiLCJpbmZvIiwiZ2V0Q2hpbGRyZW5JZHMiLCJjb250ZXh0SWRzIiwiZWxlbWVudCIsImxpc3Rlbk9uTm9kZUFkZGVkIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJzZXQiLCJzdG9wTGlzdGVuaW5nIiwiYmluZCIsImRlbGV0ZSIsIm1vZGlmeU5vZGUiLCJtb2RfYXR0ciIsImJpbmROb2RlIiwiaGFzIiwiX2JpbmROb2RlIiwiX3VuQmluZCIsInJlbW92ZUNoaWxkIiwiY2hpbGRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsInN0b3AiLCJyZXNvbHZlIiwiYWRkQ29udGV4dCIsIm5hbWUiLCJ0eXBlIiwiZWx0IiwiY29udGV4dCIsIlNwaW5hbENvbnRleHQiLCJnZXRDb250ZXh0Iiwia2V5IiwiZ2V0TmFtZSIsImNyZWF0ZU5vZGUiLCJTcGluYWxOb2RlIiwiZ2V0VHlwZSIsImFkZENoaWxkSW5Db250ZXh0IiwicGFyZW50SWQiLCJjb250ZXh0SWQiLCJjaGlsZCIsImFkZENoaWxkIiwiYWRkQ2hpbGRBbmRDcmVhdGVOb2RlIiwidmFsdWVzIiwiX2FyZUFsbENoaWxkcmVuTG9hZGVkIiwiY2hpbGRyZW5JZHMiLCJoYXNBbGxDaGlsZCIsIl9iaW5kRnVuYyIsImJpbmRlciIsInNpemUiLCJ1bmJpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFNQSxNQUFNQSxNQUFNLEdBQUcsT0FBT0MsTUFBUCxJQUFpQixXQUFqQixHQUErQkMsTUFBL0IsR0FBd0NELE1BQXZEO0FBRUE7Ozs7Ozs7O0FBT0EsTUFBTUUsbUJBQU4sQ0FBMEI7QUFFeEI7OztBQUdBQyxFQUFBQSxXQUFXLENBQUVDLFNBQUYsRUFBYztBQUN2QixTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsR0FBSixFQUFmO0FBQ0EsU0FBS0UsU0FBTCxHQUFpQixJQUFJRixHQUFKLEVBQWpCO0FBQ0EsU0FBS0csS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsRUFBYjs7QUFFQSxRQUFJLE9BQU9OLFNBQVAsS0FBcUIsV0FBekIsRUFBdUM7QUFFckNMLE1BQUFBLE1BQU0sQ0FBQ1ksTUFBUCxDQUFjQyxZQUFkLENBQTJCQyxRQUEzQixHQUNHQyxJQURILENBRUlDLFNBQVMsSUFBSSxLQUFLQyxxQkFBTCxDQUE0QkQsU0FBNUIsQ0FGakIsRUFJR0UsS0FKSCxDQUlVQyxDQUFDLElBQUlDLE9BQU8sQ0FBQ0MsS0FBUixDQUFlRixDQUFmLENBSmY7QUFLRDtBQUNGO0FBRUQ7Ozs7Ozs7QUFLQUYsRUFBQUEscUJBQXFCLENBQUVELFNBQUYsRUFBYztBQUVqQyxRQUFJLENBQUNBLFNBQVMsQ0FBQ00sY0FBVixDQUEwQixPQUExQixDQUFM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QThCMkMsTUFBOUIsRUFBckIsbUlBQTZEO0FBQUEsY0FBcERuQyxRQUFvRDtBQUMzREEsVUFBQUEsUUFBUSxDQUFFLEtBQUs3QyxLQUFMLENBQVdxQyxNQUFYLENBQUYsQ0FBUjtBQUNEO0FBSmdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLbEM7QUFDRjtBQUVEOzs7Ozs7Ozs7QUFPQWtCLEVBQUFBLE9BQU8sQ0FBRWxCLE1BQUYsRUFBVWdELE1BQVYsRUFBbUI7QUFFeEIsUUFBSSxDQUFDLEtBQUt6RixVQUFMLENBQWdCeUQsR0FBaEIsQ0FBcUJoQixNQUFyQixDQUFMLEVBQW9DO0FBQ2xDLGFBQU8sS0FBUDtBQUNEOztBQUVELFVBQU1ILEdBQUcsR0FBRyxLQUFLdEMsVUFBTCxDQUFnQnFCLEdBQWhCLENBQXFCb0IsTUFBckIsRUFBOEJZLE1BQTlCLENBQXNDb0MsTUFBdEMsQ0FBWjs7QUFFQSxRQUFJLEtBQUt6RixVQUFMLENBQWdCcUIsR0FBaEIsQ0FBcUJvQixNQUFyQixFQUE4QmlELElBQTlCLEtBQXVDLENBQTNDLEVBQThDO0FBQzVDLFdBQUt0RixLQUFMLENBQVdxQyxNQUFYLEVBQW1Ca0QsTUFBbkIsQ0FBMkIsS0FBS3pGLE9BQUwsQ0FBYW1CLEdBQWIsQ0FBa0JvQixNQUFsQixDQUEzQjtBQUNBLFdBQUt2QyxPQUFMLENBQWFtRCxNQUFiLENBQXFCWixNQUFyQjtBQUNBLFdBQUt6QyxVQUFMLENBQWdCcUQsTUFBaEIsQ0FBd0JaLE1BQXhCO0FBQ0Q7O0FBRUQsV0FBT0gsR0FBUDtBQUNEOztBQXJZdUI7O2VBd1lYekMsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBTcGluYWxDb250ZXh0LFxuICBTcGluYWxHcmFwaCxcbiAgU3BpbmFsTm9kZVxufSBmcm9tIFwic3BpbmFsLW1vZGVsLWdyYXBoXCI7XG5cbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcblxuLyoqXG4gKiAgQHBhcmFtIGJpbmRlZE5vZGUge01hcDxTdHJpbmcsIE1hcDxPYmplY3QsIGZ1bmN0aW9uPj59IE5vZGVJZCA9PiBDYWxsZXIgPT4gQ2FsbGJhY2suIEFsbCBub2RlcyB0aGF0IGFyZSBiaW5kXG4gKiAgQHBhcmFtIGJpbmRlcnMge01hcDxTdHJpbmcsIGZ1bmN0aW9uPn0gTm9kZUlkID0+IENhbGxCYWNrIGZyb20gYmluZCBtZXRob2QuXG4gKiAgQHBhcmFtIGxpc3RlbmVycyB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBjYWxsZXIgPT4gY2FsbGJhY2suIExpc3Qgb2YgYWxsIGxpc3RlbmVycyBvbiBub2RlIGFkZGVkXG4gKiAgQHBhcmFtIG5vZGVzIHtPYmplY3R9IGNvbnRhaW5pbmcgYWxsIFNwaW5hbE5vZGUgY3VycmVudGx5IGxvYWRlZFxuICogIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gKi9cbmNsYXNzIEdyYXBoTWFuYWdlclNlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gdmlld2VyRW52IGlmIGRlZmluZWQgbG9hZCBncmFwaCBmcm9tIGdldE1vZGVsXG4gICAqL1xuICBjb25zdHJ1Y3Rvciggdmlld2VyRW52ICkge1xuICAgIHRoaXMuYmluZGVkTm9kZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJpbmRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMuZ3JhcGggPSB7fTtcblxuICAgIGlmICh0eXBlb2Ygdmlld2VyRW52ICE9PSBcInVuZGVmaW5lZFwiICkge1xuXG4gICAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbFN5c3RlbS5nZXRNb2RlbCgpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgIGZvcmdlRmlsZSA9PiB0aGlzLnNldEdyYXBoRnJvbUZvcmdlRmlsZSggZm9yZ2VGaWxlIClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgY3VycmVudCBncmFwaCB3aXRoIHRoZSBvbmUgb2YgdGhlIGZvcmdlRmlsZSBpZiB0aGVyZSBpcyBvbmUgY3JlYXRlIG9uZSBpZiBub3RlXG4gICAqIEBwYXJhbSBmb3JnZUZpbGVcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzZXRHcmFwaEZyb21Gb3JnZUZpbGUoIGZvcmdlRmlsZSApIHtcblxuICAgIGlmICghZm9yZ2VGaWxlLmhhc093blByb3BlcnR5KCAnZ3JhcGgnICkpIHtcbiAgICAgIGZvcmdlRmlsZS5hZGRfYXR0cigge1xuICAgICAgICBncmFwaDogbmV3IFNwaW5hbEdyYXBoKClcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgdGhpcy5zZXRHcmFwaCggZm9yZ2VGaWxlLmdyYXBoICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhcGgge1NwaW5hbEdyYXBofVxuICAgKi9cbiAgc2V0R3JhcGgoIGdyYXBoICkge1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmdyYXBoLmdldElkID09PSBcImZ1bmN0aW9uXCIgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpICkpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLm5vZGVzW3RoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKV07XG4gICAgfVxuICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICB0aGlzLm5vZGVzW3RoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKV0gPSB0aGlzLmdyYXBoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0IHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Tm9kZSggaWQgKSB7XG5cbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5mbyggaWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgY3VycmVudCBncmFwaFxuICAgKiBAcmV0dXJucyB7e318Kn1cbiAgICovXG4gIGdldEdyYXBoKCkge1xuICAgIHJldHVybiB0aGlzLmdyYXBoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBpZFxuICAgKiBAcGFyYW0gaWQgb2YgdGhlIHdhbnRlZCBub2RlXG4gICAqIEByZXR1cm5zIHtTcGluYWxOb2RlIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0UmVhbE5vZGUoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYWxsIGNoaWxkcmVuIG9mIGEgbm9kZVxuICAgKiBAcGFyYW0gaWRcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZXMge0FycmF5fVxuICAgKiBAcmV0dXJucyBQcm9taXNlPEFycmF5PFNwaW5hbE5vZGU+PlxuICAgKi9cbiAgZ2V0Q2hpbGRyZW4oIGlkLCByZWxhdGlvbk5hbWVzICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJOb2RlIGlkOiBcIiArIGlkICsgXCIgbm90IGZvdW5kXCIgKSApO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGlvbk5hbWVzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICBmb3IgKGxldCByZWxhdGlvbk1hcCBvZiB0aGlzLm5vZGVzW2lkXS5jaGlsZHJlbikge1xuICAgICAgICByZWxhdGlvbk5hbWVzLnB1c2goIC4uLnJlbGF0aW9uTWFwLmtleXMoKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXS5nZXRDaGlsZHJlbiggcmVsYXRpb25OYW1lcyApXG4gICAgICAudGhlbiggKCBjaGlsZHJlbiApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9ICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgaW5mbyBhZ2dyZWdhdGVkIHdpdGggaXRzIGNoaWxkcmVuSWRzLCBjb250ZXh0SWRzIGFuZCBlbGVtZW50XG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRJbmZvKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW25vZGVJZF07XG4gICAgcmVzWydpbmZvJ10gPSBub2RlLmluZm87XG4gICAgcmVzWydpbmZvJ11bXCJjaGlsZHJlbklkc1wiXSA9IG5vZGUuZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICByZXNbJ2luZm8nXVsnY29udGV4dElkcyddID0gbm9kZS5jb250ZXh0SWRzO1xuICAgIHJlc1snaW5mbyddWydlbGVtZW50J10gPSBub2RlLmVsZW1lbnQ7XG4gICAgcmV0dXJuIHJlc1snaW5mbyddO1xuICB9XG5cbiAgbGlzdGVuT25Ob2RlQWRkZWQoIGNhbGxlciwgY2FsbGJhY2sgKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZy5iaW5kKCB0aGlzLCBjYWxsZXIgKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmcoIGNhbGxlciApIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnMuZGVsZXRlKCBjYWxsZXIgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbm9kZUlkIGlkIG9mIHRoZSBkZXNpcmVkIG5vZGVcbiAgICogQHBhcmFtIGluZm8gbmV3IGluZm8gZm9yIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBpcyBMb2FkZWQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBtb2RpZnlOb2RlKCBub2RlSWQsIGluZm8gKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5ub2Rlc1tub2RlSWRdLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgYSBub2RlIGFuZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bmJpbmQgdGhlIHNhbWUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjYWxsZXIge09iamVjdH0gdXN1YWxseSAndGhpcydcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtmdW5jdGlvbn0gdG8gYmUgY2FsbCBldmVyeSBjaGFuZ2Ugb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge3VuZGVmaW5lZCB8IGZ1bmN0aW9ufSByZXR1cm4gYSBmdW5jdGlvbiB0byBhbGxvdyB0byBub2RlIHVuYmluZGluZyBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBleGlzdCB1bmRlZmluZWQgYW5kIGNhbGxlciBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24gb3RoZXJ3aXNlXG4gICAqL1xuICBiaW5kTm9kZSggbm9kZUlkLCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkgfHwgdHlwZW9mIGNhbGxlciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5zZXQoIG5vZGVJZCwgbmV3IE1hcCggW1xuICAgICAgICBbY2FsbGVyLCBjYWxsYmFja11cbiAgICAgIF0gKSApO1xuICAgICAgdGhpcy5fYmluZE5vZGUoIG5vZGVJZCApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91bkJpbmQuYmluZCggdGhpcywgbm9kZUlkLCBjYWxsZXIgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIFByb21pc2U8Ym9vbGVhbj5cbiAgICovXG4gIHJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBzdG9wID0gZmFsc2UgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcIm5vZGVJZCB1bmtub3duLlwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENoaWxkcmVuKCBub2RlSWQsIFtdIClcbiAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5yZW1vdmVDaGlsZCggbm9kZUlkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgdHJ1ZSApIClcbiAgICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSkge1xuICAgICAgICB0aGlzLm5vZGVzW25vZGVJZF0ucmVtb3ZlQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRydWUgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiY2hpbGRJZCB1bmtub3duLiBJdCBtaWdodCBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgbm9kZVwiICkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udGV4dCB0byB0aGUgZ3JhcGhcbiAgICogQHBhcmFtIGNvbnRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8U3BpbmFsQ29udGV4dD59XG4gICAqL1xuICBhZGRDb250ZXh0KCBuYW1lLCB0eXBlLCBlbHQgKSB7XG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBTcGluYWxDb250ZXh0KCBuYW1lLCB0eXBlLCBlbHQgKTtcbiAgICB0aGlzLm5vZGVzW2NvbnRleHQuaW5mby5pZC5nZXQoKV0gPSBjb250ZXh0O1xuICAgIHJldHVybiB0aGlzLmdyYXBoLmFkZENvbnRleHQoIGNvbnRleHQgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldENvbnRleHQoIG5hbWUgKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW2tleV07XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNwaW5hbENvbnRleHQgJiYgbm9kZS5nZXROYW1lKCkuZ2V0KCkgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IG5vZGUuXG4gICAqIFRoZSBub2RlIG5ld2x5IGNyZWF0ZWQgaXMgdm9sYXRpbGUgaS5lIGl0IHdvbid0IGJlIHN0b3JlIGluIHRoZSBmaWxlc3lzdGVtIGFzIGxvbmcgaXQncyBub3QgYWRkZWQgYXMgY2hpbGQgdG8gYW5vdGhlciBub2RlXG4gICAqIEBwYXJhbSBpbmZvIHtPYmplY3R9IGluZm9ybWF0aW9uIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBlbGVtZW50IHtNb2RlbH0gZWxlbWVudCBwb2ludGVkIGJ5IHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHJldHVybiB0aGUgY2hpbGQgaWRlbnRpZmllclxuICAgKi9cbiAgY3JlYXRlTm9kZSggaW5mbywgZWxlbWVudCApIHtcbiAgICBjb25zdCBub2RlID0gbmV3IFNwaW5hbE5vZGUoIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBlbGVtZW50ICk7XG4gICAgaWYgKCFpbmZvLmhhc093blByb3BlcnR5KCAndHlwZScgKSkge1xuICAgICAgaW5mb1sndHlwZSddID0gbm9kZS5nZXRUeXBlKCkuZ2V0KCk7XG4gICAgfVxuICAgIGNvbnN0IG5vZGVJZCA9IG5vZGUuaW5mby5pZC5nZXQoKTtcbiAgICBpbmZvWydpZCddID0gbm9kZUlkO1xuICAgIG5vZGUubW9kX2F0dHIoICdpbmZvJywgaW5mbyApO1xuICAgIHRoaXMuX2FkZE5vZGUoIG5vZGUgKTtcbiAgICByZXR1cm4gbm9kZUlkO1xuICB9XG5cbiAgYWRkQ2hpbGRJbkNvbnRleHQoIHBhcmVudElkLCBjaGlsZElkLCBjb250ZXh0SWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjb250ZXh0SWQgKSkge1xuICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLm5vZGVzW2NoaWxkSWRdO1xuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMubm9kZXNbY29udGV4dElkXTtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5hZGRDaGlsZEluQ29udGV4dCggY2hpbGQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBjb250ZXh0ICk7XG4gICAgfVxuICAgIC8vVE9ETyBvcHRpb24gcGFyc2VyXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggJ05vZGUgaWQnICsgcGFyZW50SWQgKyAnIG5vdCBmb3VuZCcgKSApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWRcbiAgICogQHBhcmFtIHBhcmVudElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn0gcmV0dXJuIHRydWUgaWYgdGhlIGNoaWxkIGNvdWxkIGJlIGFkZGVkIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGFkZENoaWxkKCBwYXJlbnRJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgfHwgIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggZmFsc2UgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkudGhlbiggKCkgPT4ge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSApO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5vZGUgYW5kIGFkZCBpdCBhcyBjaGlsZCB0byB0aGUgcGFyZW50SWQuXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7c3RyaW5nfSBpZCBvZiB0aGUgcGFyZW50IG5vZGVcbiAgICogQHBhcmFtIG5vZGUge09iamVjdH0gbXVzdCBoYXZlIGFuIGF0dHJpYnV0ZSAnaW5mbycgYW5kIGNhbiBoYXZlIGFuIGF0dHJpYnV0ZSAnZWxlbWVudCdcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSB3YXMgY3JlYXRlZCBhZGRlZCBhcyBjaGlsZCB0byB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJlbnRJZCBzdWNjZXNzZnVsbHlcbiAgICovXG4gIGFkZENoaWxkQW5kQ3JlYXRlTm9kZSggcGFyZW50SWQsIG5vZGUsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eSggJ2luZm8nICkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlSWQgPSB0aGlzLmNyZWF0ZU5vZGUoIG5vZGUuaW5mbywgbm9kZS5lbGVtZW50ICk7XG5cbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZCggcGFyZW50SWQsIG5vZGVJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKTtcbiAgfVxuXG4gIC8qKipcbiAgICogYWRkIGEgbm9kZSB0byB0aGUgc2V0IG9mIG5vZGVcbiAgICogQHBhcmFtIG5vZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hZGROb2RlKCBub2RlICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZS5nZXRJZCgpLmdldCgpICkpIHtcbiAgICAgIHRoaXMubm9kZXNbbm9kZS5pbmZvLmlkLmdldCgpXSA9IG5vZGU7XG5cbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=