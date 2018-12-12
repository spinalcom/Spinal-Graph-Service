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

    if (typeof viewerEnv !== "undefined" && typeof G_root.spinal.spinalSystem !== "undefined") {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkdfcm9vdCIsIndpbmRvdyIsImdsb2JhbCIsIkdyYXBoTWFuYWdlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInZpZXdlckVudiIsImJpbmRlZE5vZGUiLCJNYXAiLCJiaW5kZXJzIiwibGlzdGVuZXJzIiwibm9kZXMiLCJncmFwaCIsInNwaW5hbCIsInNwaW5hbFN5c3RlbSIsImdldE1vZGVsIiwidGhlbiIsImZvcmdlRmlsZSIsInNldEdyYXBoRnJvbUZvcmdlRmlsZSIsImNhdGNoIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsImhhc093blByb3BlcnR5IiwiYWRkX2F0dHIiLCJTcGluYWxHcmFwaCIsInNldEdyYXBoIiwiZ2V0SWQiLCJnZXQiLCJnZXROb2RlIiwiaWQiLCJnZXRJbmZvIiwidW5kZWZpbmVkIiwiZ2V0R3JhcGgiLCJnZXRSZWFsTm9kZSIsImdldENoaWxkcmVuIiwicmVsYXRpb25OYW1lcyIsIlByb21pc2UiLCJyZWplY3QiLCJFcnJvciIsImxlbmd0aCIsImNoaWxkcmVuIiwicmVsYXRpb25NYXAiLCJwdXNoIiwia2V5cyIsInJlcyIsImkiLCJfYWRkTm9kZSIsIm5vZGVJZCIsIm5vZGUiLCJpbmZvIiwiZ2V0Q2hpbGRyZW5JZHMiLCJjb250ZXh0SWRzIiwiZWxlbWVudCIsImxpc3Rlbk9uTm9kZUFkZGVkIiwiY2FsbGVyIiwiY2FsbGJhY2siLCJzZXQiLCJzdG9wTGlzdGVuaW5nIiwiYmluZCIsImRlbGV0ZSIsIm1vZGlmeU5vZGUiLCJtb2RfYXR0ciIsImJpbmROb2RlIiwiaGFzIiwiX2JpbmROb2RlIiwiX3VuQmluZCIsInJlbW92ZUNoaWxkIiwiY2hpbGRJZCIsInJlbGF0aW9uTmFtZSIsInJlbGF0aW9uVHlwZSIsInN0b3AiLCJyZXNvbHZlIiwiYWRkQ29udGV4dCIsIm5hbWUiLCJ0eXBlIiwiZWx0IiwiY29udGV4dCIsIlNwaW5hbENvbnRleHQiLCJnZXRDb250ZXh0Iiwia2V5IiwiZ2V0TmFtZSIsImNyZWF0ZU5vZGUiLCJTcGluYWxOb2RlIiwiZ2V0VHlwZSIsImFkZENoaWxkSW5Db250ZXh0IiwicGFyZW50SWQiLCJjb250ZXh0SWQiLCJjaGlsZCIsImFkZENoaWxkIiwiYWRkQ2hpbGRBbmRDcmVhdGVOb2RlIiwidmFsdWVzIiwiX2FyZUFsbENoaWxkcmVuTG9hZGVkIiwiY2hpbGRyZW5JZHMiLCJoYXNBbGxDaGlsZCIsIl9iaW5kRnVuYyIsImJpbmRlciIsInNpemUiLCJ1bmJpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFNQSxNQUFNQSxNQUFNLEdBQUcsT0FBT0MsTUFBUCxJQUFpQixXQUFqQixHQUErQkMsTUFBL0IsR0FBd0NELE1BQXZEO0FBRUE7Ozs7Ozs7O0FBT0EsTUFBTUUsbUJBQU4sQ0FBMEI7QUFFeEI7OztBQUdBQyxFQUFBQSxXQUFXLENBQUVDLFNBQUYsRUFBYztBQUN2QixTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsR0FBSixFQUFmO0FBQ0EsU0FBS0UsU0FBTCxHQUFpQixJQUFJRixHQUFKLEVBQWpCO0FBQ0EsU0FBS0csS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsRUFBYjs7QUFFQSxRQUFJLE9BQU9OLFNBQVAsS0FBcUIsV0FBckIsSUFDRixPQUFPTCxNQUFNLENBQUNZLE1BQVAsQ0FBY0MsWUFBckIsS0FBc0MsV0FEeEMsRUFDcUQ7QUFFbkRiLE1BQUFBLE1BQU0sQ0FBQ1ksTUFBUCxDQUFjQyxZQUFkLENBQTJCQyxRQUEzQixHQUNHQyxJQURILENBRUlDLFNBQVMsSUFBSSxLQUFLQyxxQkFBTCxDQUE0QkQsU0FBNUIsQ0FGakIsRUFJR0UsS0FKSCxDQUlVQyxDQUFDLElBQUlDLE9BQU8sQ0FBQ0MsS0FBUixDQUFlRixDQUFmLENBSmY7QUFLRDtBQUNGO0FBRUQ7Ozs7Ozs7QUFLQUYsRUFBQUEscUJBQXFCLENBQUVELFNBQUYsRUFB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Qyw4QkFBcUIsS0FBS3pDLFVBQUwsQ0FBZ0JxQixHQUFoQixDQUFxQm9CLE1BQXJCLEVBQThCMkMsTUFBOUIsRUFBckIsbUlBQTZEO0FBQUEsY0FBcERuQyxRQUFvRDtBQUMzREEsVUFBQUEsUUFBUSxDQUFFLEtBQUs3QyxLQUFMLENBQVdxQyxNQUFYLENBQUYsQ0FBUjtBQUNEO0FBSmdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLbEM7QUFDRjtBQUVEOzs7Ozs7Ozs7QUFPQWtCLEVBQUFBLE9BQU8sQ0FBRWxCLE1BQUYsRUFBVWdELE1BQVYsRUFBbUI7QUFFeEIsUUFBSSxDQUFDLEtBQUt6RixVQUFMLENBQWdCeUQsR0FBaEIsQ0FBcUJoQixNQUFyQixDQUFMLEVBQW9DO0FBQ2xDLGFBQU8sS0FBUDtBQUNEOztBQUVELFVBQU1ILEdBQUcsR0FBRyxLQUFLdEMsVUFBTCxDQUFnQnFCLEdBQWhCLENBQXFCb0IsTUFBckIsRUFBOEJZLE1BQTlCLENBQXNDb0MsTUFBdEMsQ0FBWjs7QUFFQSxRQUFJLEtBQUt6RixVQUFMLENBQWdCcUIsR0FBaEIsQ0FBcUJvQixNQUFyQixFQUE4QmlELElBQTlCLEtBQXVDLENBQTNDLEVBQThDO0FBQzVDLFdBQUt0RixLQUFMLENBQVdxQyxNQUFYLEVBQW1Ca0QsTUFBbkIsQ0FBMkIsS0FBS3pGLE9BQUwsQ0FBYW1CLEdBQWIsQ0FBa0JvQixNQUFsQixDQUEzQjtBQUNBLFdBQUt2QyxPQUFMLENBQWFtRCxNQUFiLENBQXFCWixNQUFyQjtBQUNBLFdBQUt6QyxVQUFMLENBQWdCcUQsTUFBaEIsQ0FBd0JaLE1BQXhCO0FBQ0Q7O0FBRUQsV0FBT0gsR0FBUDtBQUNEOztBQXRZdUI7O2VBeVlYekMsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBTcGluYWxDb250ZXh0LFxuICBTcGluYWxHcmFwaCxcbiAgU3BpbmFsTm9kZVxufSBmcm9tIFwic3BpbmFsLW1vZGVsLWdyYXBoXCI7XG5cbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcblxuLyoqXG4gKiAgQHBhcmFtIGJpbmRlZE5vZGUge01hcDxTdHJpbmcsIE1hcDxPYmplY3QsIGZ1bmN0aW9uPj59IE5vZGVJZCA9PiBDYWxsZXIgPT4gQ2FsbGJhY2suIEFsbCBub2RlcyB0aGF0IGFyZSBiaW5kXG4gKiAgQHBhcmFtIGJpbmRlcnMge01hcDxTdHJpbmcsIGZ1bmN0aW9uPn0gTm9kZUlkID0+IENhbGxCYWNrIGZyb20gYmluZCBtZXRob2QuXG4gKiAgQHBhcmFtIGxpc3RlbmVycyB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBjYWxsZXIgPT4gY2FsbGJhY2suIExpc3Qgb2YgYWxsIGxpc3RlbmVycyBvbiBub2RlIGFkZGVkXG4gKiAgQHBhcmFtIG5vZGVzIHtPYmplY3R9IGNvbnRhaW5pbmcgYWxsIFNwaW5hbE5vZGUgY3VycmVudGx5IGxvYWRlZFxuICogIEBwYXJhbSBncmFwaCB7U3BpbmFsR3JhcGh9XG4gKi9cbmNsYXNzIEdyYXBoTWFuYWdlclNlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gdmlld2VyRW52IGlmIGRlZmluZWQgbG9hZCBncmFwaCBmcm9tIGdldE1vZGVsXG4gICAqL1xuICBjb25zdHJ1Y3Rvciggdmlld2VyRW52ICkge1xuICAgIHRoaXMuYmluZGVkTm9kZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJpbmRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMuZ3JhcGggPSB7fTtcblxuICAgIGlmICh0eXBlb2Ygdmlld2VyRW52ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICB0eXBlb2YgR19yb290LnNwaW5hbC5zcGluYWxTeXN0ZW0gIT09IFwidW5kZWZpbmVkXCIpIHtcblxuICAgICAgR19yb290LnNwaW5hbC5zcGluYWxTeXN0ZW0uZ2V0TW9kZWwoKVxuICAgICAgICAudGhlbihcbiAgICAgICAgICBmb3JnZUZpbGUgPT4gdGhpcy5zZXRHcmFwaEZyb21Gb3JnZUZpbGUoIGZvcmdlRmlsZSApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGN1cnJlbnQgZ3JhcGggd2l0aCB0aGUgb25lIG9mIHRoZSBmb3JnZUZpbGUgaWYgdGhlcmUgaXMgb25lIGNyZWF0ZSBvbmUgaWYgbm90ZVxuICAgKiBAcGFyYW0gZm9yZ2VGaWxlXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKSB7XG5cbiAgICBpZiAoIWZvcmdlRmlsZS5oYXNPd25Qcm9wZXJ0eSggJ2dyYXBoJyApKSB7XG4gICAgICBmb3JnZUZpbGUuYWRkX2F0dHIoIHtcbiAgICAgICAgZ3JhcGg6IG5ldyBTcGluYWxHcmFwaCgpXG4gICAgICB9ICk7XG4gICAgfVxuICAgIHRoaXMuc2V0R3JhcGgoIGZvcmdlRmlsZS5ncmFwaCApO1xuXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGdyYXBoIHtTcGluYWxHcmFwaH1cbiAgICovXG4gIHNldEdyYXBoKCBncmFwaCApIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5ncmFwaC5nZXRJZCA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICBkZWxldGUgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldO1xuICAgIH1cbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5ub2Rlc1t0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCldID0gdGhpcy5ncmFwaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSBpZCBvZiB0aGUgd2FudGVkIG5vZGVcbiAgICogQHJldHVybnMge09iamVjdCB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldE5vZGUoIGlkICkge1xuXG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluZm8oIGlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgZ3JhcGhcbiAgICogQHJldHVybnMge3t9fCp9XG4gICAqL1xuICBnZXRHcmFwaCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFwaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICogQHBhcmFtIGlkIG9mIHRoZSB3YW50ZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7U3BpbmFsTm9kZSB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldFJlYWxOb2RlKCBpZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggaWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBjaGlsZHJlbiBvZiBhIG5vZGVcbiAgICogQHBhcmFtIGlkXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWVzIHtBcnJheX1cbiAgICogQHJldHVybnMgUHJvbWlzZTxBcnJheTxTcGluYWxOb2RlPj5cbiAgICovXG4gIGdldENoaWxkcmVuKCBpZCwgcmVsYXRpb25OYW1lcyApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiTm9kZSBpZDogXCIgKyBpZCArIFwiIG5vdCBmb3VuZFwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpb25OYW1lcy5sZW5ndGggPT09IDApIHtcblxuICAgICAgZm9yIChsZXQgcmVsYXRpb25NYXAgb2YgdGhpcy5ub2Rlc1tpZF0uY2hpbGRyZW4pIHtcbiAgICAgICAgcmVsYXRpb25OYW1lcy5wdXNoKCAuLi5yZWxhdGlvbk1hcC5rZXlzKCkgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF0uZ2V0Q2hpbGRyZW4oIHJlbGF0aW9uTmFtZXMgKVxuICAgICAgLnRoZW4oICggY2hpbGRyZW4gKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSApO1xuXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIGluZm8gYWdncmVnYXRlZCB3aXRoIGl0cyBjaGlsZHJlbklkcywgY29udGV4dElkcyBhbmQgZWxlbWVudFxuICAgKiBAcGFyYW0gbm9kZUlkXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0SW5mbyggbm9kZUlkICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZXMgPSB7fTtcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1tub2RlSWRdO1xuICAgIHJlc1snaW5mbyddID0gbm9kZS5pbmZvO1xuICAgIHJlc1snaW5mbyddW1wiY2hpbGRyZW5JZHNcIl0gPSBub2RlLmdldENoaWxkcmVuSWRzKCk7XG4gICAgcmVzWydpbmZvJ11bJ2NvbnRleHRJZHMnXSA9IG5vZGUuY29udGV4dElkcztcbiAgICByZXNbJ2luZm8nXVsnZWxlbWVudCddID0gbm9kZS5lbGVtZW50O1xuICAgIHJldHVybiByZXNbJ2luZm8nXTtcbiAgfVxuXG4gIGxpc3Rlbk9uTm9kZUFkZGVkKCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubGlzdGVuZXJzLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmcuYmluZCggdGhpcywgY2FsbGVyICk7XG4gIH1cblxuICBzdG9wTGlzdGVuaW5nKCBjYWxsZXIgKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLmRlbGV0ZSggY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEBwYXJhbSBpbmZvIG5ldyBpbmZvIGZvciB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgaXMgTG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgbW9kaWZ5Tm9kZSggbm9kZUlkLCBpbmZvICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMubm9kZXNbbm9kZUlkXS5tb2RfYXR0ciggJ2luZm8nLCBpbmZvICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGEgbm9kZSBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5iaW5kIHRoZSBzYW1lIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2FsbGVyIHtPYmplY3R9IHVzdWFsbHkgJ3RoaXMnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259IHRvIGJlIGNhbGwgZXZlcnkgY2hhbmdlIG9mIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWQgfCBmdW5jdGlvbn0gcmV0dXJuIGEgZnVuY3Rpb24gdG8gYWxsb3cgdG8gbm9kZSB1bmJpbmRpbmcgaWYgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBub2RlSWQgZXhpc3QgdW5kZWZpbmVkIGFuZCBjYWxsZXIgaXMgYW4gb2JqZWN0IGFuZCBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIG90aGVyd2lzZVxuICAgKi9cbiAgYmluZE5vZGUoIG5vZGVJZCwgY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApIHx8IHR5cGVvZiBjYWxsZXIgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuc2V0KCBub2RlSWQsIG5ldyBNYXAoIFtcbiAgICAgICAgW2NhbGxlciwgY2FsbGJhY2tdXG4gICAgICBdICkgKTtcbiAgICAgIHRoaXMuX2JpbmROb2RlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdW5CaW5kLmJpbmQoIHRoaXMsIG5vZGVJZCwgY2FsbGVyICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb2NlIHRoZSBjaGlsZCBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgZnJvbSB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHBhcmVudElkLlxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcGFyYW0gc3RvcFxuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICByZW1vdmVDaGlsZCggbm9kZUlkLCBjaGlsZElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgc3RvcCA9IGZhbHNlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggXCJub2RlSWQgdW5rbm93bi5cIiApICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiAhc3RvcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMucmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHRydWUgKSApXG4gICAgICAgICAgLmNhdGNoKCBlID0+IGNvbnNvbGUuZXJyb3IoIGUgKSApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgICAgdGhpcy5ub2Rlc1tub2RlSWRdLnJlbW92ZUNoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0cnVlICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoIEVycm9yKCBcImNoaWxkSWQgdW5rbm93bi4gSXQgbWlnaHQgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IG5vZGVcIiApICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRleHQgdG8gdGhlIGdyYXBoXG4gICAqIEBwYXJhbSBjb250ZXh0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNwaW5hbENvbnRleHQ+fVxuICAgKi9cbiAgYWRkQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICkge1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgU3BpbmFsQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICk7XG4gICAgdGhpcy5ub2Rlc1tjb250ZXh0LmluZm8uaWQuZ2V0KCldID0gY29udGV4dDtcbiAgICByZXR1cm4gdGhpcy5ncmFwaC5hZGRDb250ZXh0KCBjb250ZXh0ICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRDb250ZXh0KCBuYW1lICkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldO1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBTcGluYWxDb250ZXh0ICYmIG5vZGUuZ2V0TmFtZSgpLmdldCgpID09PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBub2RlLlxuICAgKiBUaGUgbm9kZSBuZXdseSBjcmVhdGVkIGlzIHZvbGF0aWxlIGkuZSBpdCB3b24ndCBiZSBzdG9yZSBpbiB0aGUgZmlsZXN5c3RlbSBhcyBsb25nIGl0J3Mgbm90IGFkZGVkIGFzIGNoaWxkIHRvIGFub3RoZXIgbm9kZVxuICAgKiBAcGFyYW0gaW5mbyB7T2JqZWN0fSBpbmZvcm1hdGlvbiBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gZWxlbWVudCB7TW9kZWx9IGVsZW1lbnQgcG9pbnRlZCBieSB0aGUgbm9kZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSByZXR1cm4gdGhlIGNoaWxkIGlkZW50aWZpZXJcbiAgICovXG4gIGNyZWF0ZU5vZGUoIGluZm8sIGVsZW1lbnQgKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBTcGluYWxOb2RlKCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCApO1xuICAgIGlmICghaW5mby5oYXNPd25Qcm9wZXJ0eSggJ3R5cGUnICkpIHtcbiAgICAgIGluZm9bJ3R5cGUnXSA9IG5vZGUuZ2V0VHlwZSgpLmdldCgpO1xuICAgIH1cbiAgICBjb25zdCBub2RlSWQgPSBub2RlLmluZm8uaWQuZ2V0KCk7XG4gICAgaW5mb1snaWQnXSA9IG5vZGVJZDtcbiAgICBub2RlLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcbiAgICB0aGlzLl9hZGROb2RlKCBub2RlICk7XG4gICAgcmV0dXJuIG5vZGVJZDtcbiAgfVxuXG4gIGFkZENoaWxkSW5Db250ZXh0KCBwYXJlbnRJZCwgY2hpbGRJZCwgY29udGV4dElkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY29udGV4dElkICkpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2Rlc1tjaGlsZElkXTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm5vZGVzW2NvbnRleHRJZF07XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGRJbkNvbnRleHQoIGNoaWxkLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSwgY29udGV4dCApO1xuICAgIH1cbiAgICAvL1RPRE8gb3B0aW9uIHBhcnNlclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoICdOb2RlIGlkJyArIHBhcmVudElkICsgJyBub3QgZm91bmQnICkgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byBjaGlsZElkIGFzIGNoaWxkIHRvIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcmVudElkXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gY2hpbGRJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvblR5cGUge051bWJlcn1cbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IHJldHVybiB0cnVlIGlmIHRoZSBjaGlsZCBjb3VsZCBiZSBhZGRlZCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhZGRDaGlsZCggcGFyZW50SWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmFkZENoaWxkKCB0aGlzLm5vZGVzW2NoaWxkSWRdLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApLnRoZW4oICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBub2RlIGFuZCBhZGQgaXQgYXMgY2hpbGQgdG8gdGhlIHBhcmVudElkLlxuICAgKiBAcGFyYW0gcGFyZW50SWQge3N0cmluZ30gaWQgb2YgdGhlIHBhcmVudCBub2RlXG4gICAqIEBwYXJhbSBub2RlIHtPYmplY3R9IG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2luZm8nIGFuZCBjYW4gaGF2ZSBhbiBhdHRyaWJ1dGUgJ2VsZW1lbnQnXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge3N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgdGhlIG5vZGUgd2FzIGNyZWF0ZWQgYWRkZWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBhZGRDaGlsZEFuZENyZWF0ZU5vZGUoIHBhcmVudElkLCBub2RlLCByZWxhdGlvbk5hbWUsIHJlbGF0aW9uVHlwZSApIHtcbiAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoICdpbmZvJyApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUlkID0gdGhpcy5jcmVhdGVOb2RlKCBub2RlLmluZm8sIG5vZGUuZWxlbWVudCApO1xuXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoIHBhcmVudElkLCBub2RlSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gIH1cblxuICAvKioqXG4gICAqIGFkZCBhIG5vZGUgdG8gdGhlIHNldCBvZiBub2RlXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm9kZSggbm9kZSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGUuZ2V0SWQoKS5nZXQoKSApKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGUuaW5mby5pZC5nZXQoKV0gPSBub2RlO1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmxpc3RlbmVycy52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggbm9kZS5pbmZvLmlkLmdldCgpICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFsbCBjaGlsZHJlbiBmcm9tIGEgbm9kZSBhcmUgbG9hZGVkXG4gICAqIEBwYXJhbSBub2RlSWQgaWQgb2YgdGhlIGRlc2lyZWQgbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgaWYgYWxsIGNoaWxkcmVuIG9mIHRoZSBub2RlIGlzIGxvYWRlZCBmYWxzZSBvdGhlcndpc2VcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hcmVBbGxDaGlsZHJlbkxvYWRlZCggbm9kZUlkICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkcmVuSWRzID0gdGhpcy5ub2Rlc1tub2RlSWRdLmdldENoaWxkcmVuSWRzKCk7XG4gICAgbGV0IGhhc0FsbENoaWxkID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW5JZHMubGVuZ3RoICYmIGhhc0FsbENoaWxkOyBpKyspIHtcbiAgICAgIGhhc0FsbENoaWxkID0gdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRyZW5JZHNbaV0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzQWxsQ2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogQmluZCB0aGUgbm9kZSBpZiBuZWVkZWQgYW5kIHNhdmUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kTm9kZSggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlcnMuaGFzKCBub2RlSWQgKSB8fCAhdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5iaW5kZXJzLnNldCggbm9kZUlkLCB0aGlzLm5vZGVzW25vZGVJZF0uYmluZCggdGhpcy5fYmluZEZ1bmMuYmluZCggdGhpcywgbm9kZUlkICkgKSApO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbGwgdGhlIGNhbGxiYWNrIG1ldGhvZCBvZiBhbGwgdGhlIGJpbmRlciBvZiB0aGUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYmluZEZ1bmMoIG5vZGVJZCApIHtcbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmhhcyggbm9kZUlkICkpIHtcblxuICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkudmFsdWVzKCkpIHtcbiAgICAgICAgY2FsbGJhY2soIHRoaXMubm9kZXNbbm9kZUlkXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB1bmJpbmQgYSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGJpbmRlciB7T2JqZWN0fVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91bkJpbmQoIG5vZGVJZCwgYmluZGVyICkge1xuXG4gICAgaWYgKCF0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuYmluZGVkTm9kZS5nZXQoIG5vZGVJZCApLmRlbGV0ZSggYmluZGVyICk7XG5cbiAgICBpZiAodGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2l6ZSA9PT0gMCkge1xuICAgICAgdGhpcy5ub2Rlc1tub2RlSWRdLnVuYmluZCggdGhpcy5iaW5kZXJzLmdldCggbm9kZUlkICkgKTtcbiAgICAgIHRoaXMuYmluZGVycy5kZWxldGUoIG5vZGVJZCApO1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmFwaE1hbmFnZXJTZXJ2aWNlO1xuIl19