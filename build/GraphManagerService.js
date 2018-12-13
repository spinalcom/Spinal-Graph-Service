import {
  SpinalContext,
  SpinalGraph,
  SpinalNode
} from "spinal-model-graph";

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
        graph: new SpinalGraph()
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
      for (let relationMap of this.nodes[id].children) {
        relationNames.push( ...relationMap.keys() );
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


  getInfo( nodeId) {
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
      for (let callback of this.listeners.values()) {
        callback( nodeId );
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
    const context = new SpinalContext( name, type, elt );
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

        if (node instanceof SpinalContext && node.getName().get() === name) {
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
    const node = new SpinalNode( undefined, undefined, element );

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

      for (let callback of this.listeners.values()) {
        callback( node.info.id.get() );
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
      for (let callback of this.bindedNode.get( nodeId ).values()) {
        callback( this.nodes[nodeId] );
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

export default GraphManagerService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFwaE1hbmFnZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlNwaW5hbENvbnRleHQiLCJTcGluYWxHcmFwaCIsIlNwaW5hbE5vZGUiLCJHX3Jvb3QiLCJ3aW5kb3ciLCJnbG9iYWwiLCJHcmFwaE1hbmFnZXJTZXJ2aWNlIiwiY29uc3RydWN0b3IiLCJ2aWV3ZXJFbnYiLCJiaW5kZWROb2RlIiwiTWFwIiwiYmluZGVycyIsImxpc3RlbmVyc09uTm9kZUFkZGVkIiwibGlzdGVuZXJPbk5vZGVSZW1vdmUiLCJub2RlcyIsImdyYXBoIiwic3BpbmFsIiwic3BpbmFsU3lzdGVtIiwiZ2V0TW9kZWwiLCJ0aGVuIiwiZm9yZ2VGaWxlIiwic2V0R3JhcGhGcm9tRm9yZ2VGaWxlIiwiY2F0Y2giLCJlIiwiY29uc29sZSIsImVycm9yIiwiaGFzT3duUHJvcGVydHkiLCJhZGRfYXR0ciIsInNldEdyYXBoIiwiZ2V0SWQiLCJnZXQiLCJnZXRDaGlsZHJlbiIsImdldE5vZGVzIiwiZ2V0Tm9kZSIsImlkIiwiZ2V0SW5mbyIsInVuZGVmaW5lZCIsImdldEdyYXBoIiwiZ2V0UmVhbE5vZGUiLCJyZWxhdGlvbk5hbWVzIiwiUHJvbWlzZSIsInJlamVjdCIsIkVycm9yIiwibGVuZ3RoIiwicmVsYXRpb25NYXAiLCJjaGlsZHJlbiIsInB1c2giLCJrZXlzIiwicmVzIiwiaSIsIl9hZGROb2RlIiwiZ2V0Q2hpbGRyZW5JbkNvbnRleHQiLCJwYXJlbnRJZCIsImNvbnRleHRJZCIsIm5vZGVJZCIsIm5vZGUiLCJpbmZvIiwiZGVlcF9jb3B5IiwiZ2V0Q2hpbGRyZW5JZHMiLCJjb250ZXh0SWRzIiwiZWxlbWVudCIsInNpemUiLCJsaXN0ZW5Pbk5vZGVBZGRlZCIsImNhbGxlciIsImNhbGxiYWNrIiwic2V0Iiwic3RvcExpc3RlbmluZyIsImJpbmQiLCJsaXN0ZW5Pbk5vZGVSZW1vdmUiLCJzdG9wTGlzdGVuaW5nT25Ob2RlUmVtb3ZlIiwic3RvcExpc3RlbmluZ09uTm9kZUFkZGVkIiwiZGVsZXRlIiwibW9kaWZ5Tm9kZSIsIm1vZF9hdHRyIiwiYmluZE5vZGUiLCJoYXMiLCJfYmluZE5vZGUiLCJfdW5CaW5kIiwicmVtb3ZlQ2hpbGQiLCJjaGlsZElkIiwicmVsYXRpb25OYW1lIiwicmVsYXRpb25UeXBlIiwic3RvcCIsImxpc3RlbmVycyIsInZhbHVlcyIsImFkZENvbnRleHQiLCJuYW1lIiwidHlwZSIsImVsdCIsImNvbnRleHQiLCJnZXRDb250ZXh0Iiwia2V5IiwiZ2V0TmFtZSIsInJlbW92ZUZyb21HcmFwaCIsImNyZWF0ZU5vZGUiLCJnZXRUeXBlIiwiYWRkQ2hpbGRJbkNvbnRleHQiLCJjaGlsZCIsImFkZENoaWxkIiwicmVzb2x2ZSIsImFkZENoaWxkQW5kQ3JlYXRlTm9kZSIsIl9hcmVBbGxDaGlsZHJlbkxvYWRlZCIsImNoaWxkcmVuSWRzIiwiaGFzQWxsQ2hpbGQiLCJfYmluZEZ1bmMiLCJiaW5kZXIiLCJ1bmJpbmQiXSwibWFwcGluZ3MiOiJBQUFBLFNBQ0VBLGFBREYsRUFFRUMsV0FGRixFQUdFQyxVQUhGLFFBSU8sb0JBSlA7QUFNQSxNQUFNQyxNQUFNLEdBQUcsT0FBT0MsTUFBUCxJQUFpQixXQUFqQixHQUErQkMsTUFBL0IsR0FBd0NELE1BQXZEO0FBRUE7Ozs7Ozs7O0FBT0EsTUFBTUUsbUJBQU4sQ0FBMEI7QUFFeEI7OztBQUdBQyxFQUFBQSxXQUFXLENBQUVDLFNBQUYsRUFBYztBQUN2QixTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsR0FBSixFQUFmO0FBQ0EsU0FBS0Usb0JBQUwsR0FBNEIsSUFBSUYsR0FBSixFQUE1QjtBQUNBLFNBQUtHLG9CQUFMLEdBQTRCLElBQUlILEdBQUosRUFBNUI7QUFDQSxTQUFLSSxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUNBLFFBQUksT0FBT1AsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUVwQ0wsTUFBQUEs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RSxHQUFoQixDQUFxQnJCLE1BQXJCLENBQUwsRUFBb0M7QUFDbEMsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsVUFBTU4sR0FBRyxHQUFHLEtBQUt2QyxVQUFMLENBQWdCcUIsR0FBaEIsQ0FBcUJ3QixNQUFyQixFQUE4QmlCLE1BQTlCLENBQXNDa0MsTUFBdEMsQ0FBWjs7QUFFQSxRQUFJLEtBQUtoRyxVQUFMLENBQWdCcUIsR0FBaEIsQ0FBcUJ3QixNQUFyQixFQUE4Qk8sSUFBOUIsS0FBdUMsQ0FBM0MsRUFBOEM7QUFDNUMsV0FBSy9DLEtBQUwsQ0FBV3dDLE1BQVgsRUFBbUJvRCxNQUFuQixDQUEyQixLQUFLL0YsT0FBTCxDQUFhbUIsR0FBYixDQUFrQndCLE1BQWxCLENBQTNCO0FBQ0EsV0FBSzNDLE9BQUwsQ0FBYTRELE1BQWIsQ0FBcUJqQixNQUFyQjtBQUNBLFdBQUs3QyxVQUFMLENBQWdCOEQsTUFBaEIsQ0FBd0JqQixNQUF4QjtBQUNEOztBQUVELFdBQU9OLEdBQVA7QUFDRDs7QUFwY3VCOztBQXVjMUIsZUFBZTFDLG1CQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgU3BpbmFsQ29udGV4dCxcbiAgU3BpbmFsR3JhcGgsXG4gIFNwaW5hbE5vZGVcbn0gZnJvbSBcInNwaW5hbC1tb2RlbC1ncmFwaFwiO1xuXG5jb25zdCBHX3Jvb3QgPSB0eXBlb2Ygd2luZG93ID09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG5cbi8qKlxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgTWFwPE9iamVjdCwgZnVuY3Rpb24+Pn0gYmluZGVkTm9kZSBOb2RlSWQgPT4gQ2FsbGVyID0+IENhbGxiYWNrLiBBbGwgbm9kZXMgdGhhdCBhcmUgYmluZFxuICogIEBwcm9wZXJ0eSB7TWFwPFN0cmluZywgZnVuY3Rpb24+fSBiaW5kZXJzIE5vZGVJZCA9PiBDYWxsQmFjayBmcm9tIGJpbmQgbWV0aG9kLlxuICogIEBwcm9wZXJ0eSB7TWFwPE9iamVjdCwgZnVuY3Rpb24+fSBsaXN0ZW5lcnMgY2FsbGVyID0+IGNhbGxiYWNrLiBMaXN0IG9mIGFsbCBsaXN0ZW5lcnMgb24gbm9kZSBhZGRlZFxuICogIEBwcm9wZXJ0eSB7T2JqZWN0fSBub2RlcyBjb250YWluaW5nIGFsbCBTcGluYWxOb2RlIGN1cnJlbnRseSBsb2FkZWRcbiAqICBAcHJvcGVydHkge1NwaW5hbEdyYXBofSBncmFwaFxuICovXG5jbGFzcyBHcmFwaE1hbmFnZXJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQHBhcmFtIHZpZXdlckVudiB7Ym9vbGVhbn0gaWYgZGVmaW5lZCBsb2FkIGdyYXBoIGZyb20gZ2V0TW9kZWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKCB2aWV3ZXJFbnYgKSB7XG4gICAgdGhpcy5iaW5kZWROb2RlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmluZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUgPSBuZXcgTWFwKClcbiAgICB0aGlzLm5vZGVzID0ge307XG4gICAgdGhpcy5ncmFwaCA9IHt9O1xuICAgIGlmICh0eXBlb2Ygdmlld2VyRW52ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cbiAgICAgIEdfcm9vdC5zcGluYWwuc3BpbmFsU3lzdGVtLmdldE1vZGVsKClcbiAgICAgICAgLnRoZW4oXG4gICAgICAgICAgZm9yZ2VGaWxlID0+IHRoaXMuc2V0R3JhcGhGcm9tRm9yZ2VGaWxlKCBmb3JnZUZpbGUgKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCggZSA9PiBjb25zb2xlLmVycm9yKCBlICkgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBjdXJyZW50IGdyYXBoIHdpdGggdGhlIG9uZSBvZiB0aGUgZm9yZ2VGaWxlIGlmIHRoZXJlIGlzIG9uZSBjcmVhdGUgb25lIGlmIG5vdGVcbiAgICogQHBhcmFtIGZvcmdlRmlsZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fSB0aGUgaWQgb2YgdGhlIGdyYXBoXG4gICAqL1xuICBzZXRHcmFwaEZyb21Gb3JnZUZpbGUoIGZvcmdlRmlsZSApIHtcblxuICAgIGlmICghZm9yZ2VGaWxlLmhhc093blByb3BlcnR5KCAnZ3JhcGgnICkpIHtcbiAgICAgIGZvcmdlRmlsZS5hZGRfYXR0cigge1xuICAgICAgICBncmFwaDogbmV3IFNwaW5hbEdyYXBoKClcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0R3JhcGgoIGZvcmdlRmlsZS5ncmFwaCApO1xuXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGdyYXBoIHtTcGluYWxHcmFwaH1cbiAgICogQHJldHVybnMge1Byb21pc2U8U3RyaW5nPn0gdGhlIGlkIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgc2V0R3JhcGgoIGdyYXBoICkge1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmdyYXBoLmdldElkID09PSBcImZ1bmN0aW9uXCIgJiYgdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggdGhpcy5ncmFwaC5nZXRJZCgpLmdldCgpICkpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLm5vZGVzW3RoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKV07XG4gICAgfVxuICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICB0aGlzLm5vZGVzW3RoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKV0gPSB0aGlzLmdyYXBoO1xuICAgIHJldHVybiB0aGlzLmdldENoaWxkcmVuKCB0aGlzLmdyYXBoLmdldElkKCkuZ2V0KCksIFtdIClcbiAgICAgIC50aGVuKCAoKSA9PiB7cmV0dXJuIHRoaXMuZ3JhcGguZ2V0SWQoKS5nZXQoKTt9ICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYWxsIGxvYWRlZCBOb2Rlc1xuICAgKi9cbiAgZ2V0Tm9kZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBpZFxuICAgKiBAcGFyYW0gaWQgb2YgdGhlIHdhbnRlZCBub2RlXG4gICAqIEByZXR1cm5zIHtPYmplY3QgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXROb2RlKCBpZCApIHtcblxuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJbmZvKCBpZCApO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBjdXJyZW50IGdyYXBoXG4gICAqIEByZXR1cm5zIHt7fXxTcGluYWxHcmFwaH1cbiAgICovXG4gIGdldEdyYXBoKCkge1xuICAgIHJldHVybiB0aGlzLmdyYXBoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBpZFxuICAgKiBAcGFyYW0gaWQgb2YgdGhlIHdhbnRlZCBub2RlXG4gICAqIEByZXR1cm5zIHtTcGluYWxOb2RlIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0UmVhbE5vZGUoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYWxsIGNoaWxkcmVuIG9mIGEgbm9kZVxuICAgKiBAcGFyYW0gaWRcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZXMge0FycmF5fVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxTcGluYWxOb2RlUmVmPj59XG4gICAqL1xuICBnZXRDaGlsZHJlbiggaWQsIHJlbGF0aW9uTmFtZXMgPSBbXSApIHtcbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiTm9kZSBpZDogXCIgKyBpZCArIFwiIG5vdCBmb3VuZFwiICkgKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpb25OYW1lcy5sZW5ndGggPT09IDApIHtcblxuICAgICAgZm9yIChsZXQgcmVsYXRpb25NYXAgb2YgdGhpcy5ub2Rlc1tpZF0uY2hpbGRyZW4pIHtcbiAgICAgICAgcmVsYXRpb25OYW1lcy5wdXNoKCAuLi5yZWxhdGlvbk1hcC5rZXlzKCkgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF0uZ2V0Q2hpbGRyZW4oIHJlbGF0aW9uTmFtZXMgKVxuICAgICAgLnRoZW4oICggY2hpbGRyZW4gKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fYWRkTm9kZSggY2hpbGRyZW5baV0gKTtcbiAgICAgICAgICByZXMucHVzaCggdGhpcy5nZXRJbmZvKCBjaGlsZHJlbltpXS5nZXRJZCgpLmdldCgpICkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSApO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjaGlsZHJlbiBvZiB0aGUgbm9kZSB0aGF0IGFyZSByZWdpc3RlcmVkIGluIHRoZSBjb250ZXh0XG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7U3RyaW5nfSBpZCBvZiB0aGUgcGFyZW50IG5vZGVcbiAgICogQHBhcmFtIGNvbnRleHRJZCB7U3RyaW5nfSBpZCBvZiB0aGUgY29udGV4dCBub2RlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5PE9iamVjdD4+fSBUaGUgaW5mbyBvZiB0aGUgY2hpbGRyZW4gdGhhdCB3ZXJlIGZvdW5kXG4gICAqL1xuICBnZXRDaGlsZHJlbkluQ29udGV4dCggcGFyZW50SWQsIGNvbnRleHRJZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggcGFyZW50SWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjb250ZXh0SWQgKSkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNbcGFyZW50SWRdLmdldENoaWxkcmVuSW5Db250ZXh0KCB0aGlzLm5vZGVzW2NvbnRleHRJZF0gKS50aGVuKCBjaGlsZHJlbiA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9hZGROb2RlKCBjaGlsZHJlbltpXSApO1xuICAgICAgICAgIHJlcy5wdXNoKCB0aGlzLmdldEluZm8oIGNoaWxkcmVuW2ldLmdldElkKCkuZ2V0KCkgKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBub2RlIGluZm8gYWdncmVnYXRlZCB3aXRoIGl0cyBjaGlsZHJlbklkcywgY29udGV4dElkcyBhbmQgZWxlbWVudFxuICAgKiBAcGFyYW0gbm9kZUlkXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0SW5mbyggbm9kZUlkICkge1xuXG4gICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1tub2RlSWRdO1xuICAgIGNvbnN0IHJlcyA9IG5vZGUuaW5mby5kZWVwX2NvcHkoKTtcbiAgICByZXNbJ2NoaWxkcmVuSWRzJ10gPSBub2RlLmdldENoaWxkcmVuSWRzKCk7XG4gICAgcmVzWydjb250ZXh0SWRzJ10gPSBub2RlLmNvbnRleHRJZHM7XG4gICAgcmVzWydlbGVtZW50J10gPSBub2RlLmVsZW1lbnQ7XG4gICAgcmVzWydoYXNDaGlsZHJlbiddID0gbm9kZS5jaGlsZHJlbi5zaXplID4gMDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW5JZHMoIG5vZGVJZCApIHtcbiAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICB9XG4gIH1cblxuICBsaXN0ZW5Pbk5vZGVBZGRlZCggY2FsbGVyLCBjYWxsYmFjayApIHtcbiAgICB0aGlzLmxpc3RlbmVyc09uTm9kZUFkZGVkLnNldCggY2FsbGVyLCBjYWxsYmFjayApO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmcuYmluZCggdGhpcywgY2FsbGVyICk7XG4gIH1cblxuICBsaXN0ZW5Pbk5vZGVSZW1vdmUoY2FsbGVyLCBjYWxsYmFjaykge1xuICAgIHRoaXMubGlzdGVuZXJPbk5vZGVSZW1vdmUuc2V0KGNhbGxlciwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzLnN0b3BMaXN0ZW5pbmdPbk5vZGVSZW1vdmUuYmluZCh0aGlzLGNhbGxlcik7XG4gIH1cblxuICBzdG9wTGlzdGVuaW5nT25Ob2RlQWRkZWQoIGNhbGxlciApIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnNPbk5vZGVBZGRlZC5kZWxldGUoIGNhbGxlciApO1xuICB9XG5cbiAgc3RvcExpc3RlbmluZ09uTm9kZVJlbW92ZShjYWxsZXIpe1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyT25Ob2RlUmVtb3ZlLmRlbGV0ZShjYWxsZXIpO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0gbm9kZUlkIGlkIG9mIHRoZSBkZXNpcmVkIG5vZGVcbiAgICogQHBhcmFtIGluZm8gbmV3IGluZm8gZm9yIHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBpcyBMb2FkZWQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBtb2RpZnlOb2RlKCBub2RlSWQsIGluZm8gKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gVE8gRE8gOiBjaGFuZ2UgdGhlIGZvbGxvd2luZyBcIm1vZF9hdHRyXG4gICAgLy8gdG8gYSBkaXJlY3QgXCJ1cGRhdGVcIiBvZiB0aGUgZXhpc3RpbmcgbW9kZWwuXG4gICAgLy8gVGhpcyB3aWxsIHJlZHVjZSB0aGUgY3JlYXRpb24gb2YgbW9kZWwgYnV0XG4gICAgdGhpcy5ub2Rlc1tub2RlSWRdLm1vZF9hdHRyKCAnaW5mbycsIGluZm8gKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgYSBub2RlIGFuZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bmJpbmQgdGhlIHNhbWUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjYWxsZXIge09iamVjdH0gdXN1YWxseSAndGhpcydcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtmdW5jdGlvbn0gdG8gYmUgY2FsbCBldmVyeSBjaGFuZ2Ugb2YgdGhlIG5vZGVcbiAgICogQHJldHVybnMge3VuZGVmaW5lZCB8IGZ1bmN0aW9ufSByZXR1cm4gYSBmdW5jdGlvbiB0byBhbGxvdyB0byBub2RlIHVuYmluZGluZyBpZiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIG5vZGVJZCBleGlzdCB1bmRlZmluZWQgYW5kIGNhbGxlciBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24gb3RoZXJ3aXNlXG4gICAqL1xuICBiaW5kTm9kZSggbm9kZUlkLCBjYWxsZXIsIGNhbGxiYWNrICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkgfHwgdHlwZW9mIGNhbGxlciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuICAgICAgdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuc2V0KCBjYWxsZXIsIGNhbGxiYWNrICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmluZGVkTm9kZS5zZXQoIG5vZGVJZCwgbmV3IE1hcCggW1xuICAgICAgICBbY2FsbGVyLCBjYWxsYmFja11cbiAgICAgIF0gKSApO1xuICAgICAgdGhpcy5fYmluZE5vZGUoIG5vZGVJZCApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl91bkJpbmQuYmluZCggdGhpcywgbm9kZUlkLCBjYWxsZXIgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vY2UgdGhlIGNoaWxkIGNvcnJlc3BvbmRpbmcgdG8gY2hpbGRJZCBmcm9tIHRoZSBub2RlIGNvcnJlc3BvbmRpbmcgdG8gcGFyZW50SWQuXG4gICAqIEBwYXJhbSBub2RlSWQge1N0cmluZ31cbiAgICogQHBhcmFtIGNoaWxkSWQge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7U3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEBwYXJhbSBzdG9wXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoIG5vZGVJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUsIHN0b3AgPSBmYWxzZSApIHtcblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZUlkICkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwibm9kZUlkIHVua25vd24uXCIgKSApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggY2hpbGRJZCApICYmICFzdG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbiggbm9kZUlkLCBbXSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKCBub2RlSWQsIGNoaWxkSWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCB0cnVlICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5lcnJvciggZSApICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZElkICkpIHtcbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlSWQgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVJZF0ucmVtb3ZlQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggRXJyb3IoIFwiY2hpbGRJZCB1bmtub3duLiBJdCBtaWdodCBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgbm9kZVwiICkgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udGV4dCB0byB0aGUgZ3JhcGhcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gb2YgdGhlIGNvbnRleHRcbiAgICogQHBhcmFtIGVsdCB7TW9kZWx9IGVsZW1lbnQgb2YgdGhlIGNvbnRleHQgaWYgbmVlZGVkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNwaW5hbENvbnRleHQ+fVxuICAgKi9cbiAgYWRkQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICkge1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgU3BpbmFsQ29udGV4dCggbmFtZSwgdHlwZSwgZWx0ICk7XG4gICAgdGhpcy5ub2Rlc1tjb250ZXh0LmluZm8uaWQuZ2V0KCldID0gY29udGV4dDtcbiAgICByZXR1cm4gdGhpcy5ncmFwaC5hZGRDb250ZXh0KCBjb250ZXh0ICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge1NwaW5hbENvbnRleHR8dW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0Q29udGV4dCggbmFtZSApIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGtleSApKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW2tleV07XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgU3BpbmFsQ29udGV4dCAmJiBub2RlLmdldE5hbWUoKS5nZXQoKSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBub2RlIHJlZmVyZW5jZWQgYnkgaWQgZnJvbSB0aCBncmFwaC5cbiAgICogQHBhcmFtIGlkXG4gICAqL1xuICByZW1vdmVGcm9tR3JhcGgoIGlkICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBpZCApKSB7XG4gICAgICB0aGlzLm5vZGVzW2lkXS5yZW1vdmVGcm9tR3JhcGgoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IG5vZGUuXG4gICAqIFRoZSBub2RlIG5ld2x5IGNyZWF0ZWQgaXMgdm9sYXRpbGUgaS5lIGl0IHdvbid0IGJlIHN0b3JlIGluIHRoZSBmaWxlc3lzdGVtIGFzIGxvbmcgaXQncyBub3QgYWRkZWQgYXMgY2hpbGQgdG8gYW5vdGhlciBub2RlXG4gICAqIEBwYXJhbSBpbmZvIHtPYmplY3R9IGluZm9ybWF0aW9uIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBlbGVtZW50IHtNb2RlbH0gZWxlbWVudCBwb2ludGVkIGJ5IHRoZSBub2RlXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHJldHVybiB0aGUgY2hpbGQgaWRlbnRpZmllclxuICAgKi9cbiAgY3JlYXRlTm9kZSggaW5mbywgZWxlbWVudCApIHtcbiAgICBjb25zdCBub2RlID0gbmV3IFNwaW5hbE5vZGUoIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBlbGVtZW50ICk7XG4gICAgaWYgKCFpbmZvLmhhc093blByb3BlcnR5KCAndHlwZScgKSkge1xuICAgICAgaW5mb1sndHlwZSddID0gbm9kZS5nZXRUeXBlKCkuZ2V0KCk7XG4gICAgfVxuICAgIGNvbnN0IG5vZGVJZCA9IG5vZGUuaW5mby5pZC5nZXQoKTtcbiAgICBpbmZvWydpZCddID0gbm9kZUlkO1xuICAgIG5vZGUubW9kX2F0dHIoICdpbmZvJywgaW5mbyApO1xuICAgIHRoaXMuX2FkZE5vZGUoIG5vZGUgKTtcbiAgICByZXR1cm4gbm9kZUlkO1xuICB9XG5cbiAgYWRkQ2hpbGRJbkNvbnRleHQoIHBhcmVudElkLCBjaGlsZElkLCBjb250ZXh0SWQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBwYXJlbnRJZCApICYmIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSAmJiB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjb250ZXh0SWQgKSkge1xuICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLm5vZGVzW2NoaWxkSWRdO1xuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMubm9kZXNbY29udGV4dElkXTtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzW3BhcmVudElkXS5hZGRDaGlsZEluQ29udGV4dCggY2hpbGQsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlLCBjb250ZXh0ICk7XG4gICAgfVxuICAgIC8vVE9ETyBvcHRpb24gcGFyc2VyXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCBFcnJvciggJ05vZGUgaWQnICsgcGFyZW50SWQgKyAnIG5vdCBmb3VuZCcgKSApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIGNoaWxkSWQgYXMgY2hpbGQgdG8gdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcGFyZW50SWRcbiAgICogQHBhcmFtIHBhcmVudElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSBjaGlsZElkIHtTdHJpbmd9XG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUge1N0cmluZ31cbiAgICogQHBhcmFtIHJlbGF0aW9uVHlwZSB7TnVtYmVyfVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn0gcmV0dXJuIHRydWUgaWYgdGhlIGNoaWxkIGNvdWxkIGJlIGFkZGVkIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGFkZENoaWxkKCBwYXJlbnRJZCwgY2hpbGRJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIHBhcmVudElkICkgfHwgIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIGNoaWxkSWQgKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggZmFsc2UgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ub2Rlc1twYXJlbnRJZF0uYWRkQ2hpbGQoIHRoaXMubm9kZXNbY2hpbGRJZF0sIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkudGhlbiggKCkgPT4ge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSApO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5vZGUgYW5kIGFkZCBpdCBhcyBjaGlsZCB0byB0aGUgcGFyZW50SWQuXG4gICAqIEBwYXJhbSBwYXJlbnRJZCB7c3RyaW5nfSBpZCBvZiB0aGUgcGFyZW50IG5vZGVcbiAgICogQHBhcmFtIG5vZGUge09iamVjdH0gbXVzdCBoYXZlIGFuIGF0dHJpYnV0ZSAnaW5mbycgYW5kIGNhbiBoYXZlIGFuIGF0dHJpYnV0ZSAnZWxlbWVudCdcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIHtOdW1iZXJ9XG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiB0aGUgbm9kZSB3YXMgY3JlYXRlZCBhZGRlZCBhcyBjaGlsZCB0byB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJlbnRJZCBzdWNjZXNzZnVsbHlcbiAgICovXG4gIGFkZENoaWxkQW5kQ3JlYXRlTm9kZSggcGFyZW50SWQsIG5vZGUsIHJlbGF0aW9uTmFtZSwgcmVsYXRpb25UeXBlICkge1xuICAgIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eSggJ2luZm8nICkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlSWQgPSB0aGlzLmNyZWF0ZU5vZGUoIG5vZGUuaW5mbywgbm9kZS5lbGVtZW50ICk7XG5cbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZCggcGFyZW50SWQsIG5vZGVJZCwgcmVsYXRpb25OYW1lLCByZWxhdGlvblR5cGUgKTtcbiAgfVxuXG4gIC8qKipcbiAgICogYWRkIGEgbm9kZSB0byB0aGUgc2V0IG9mIG5vZGVcbiAgICogQHBhcmFtIG5vZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hZGROb2RlKCBub2RlICkge1xuICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eSggbm9kZS5nZXRJZCgpLmdldCgpICkpIHtcbiAgICAgIHRoaXMubm9kZXNbbm9kZS5pbmZvLmlkLmdldCgpXSA9IG5vZGU7XG5cbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMubGlzdGVuZXJzLnZhbHVlcygpKSB7XG4gICAgICAgIGNhbGxiYWNrKCBub2RlLmluZm8uaWQuZ2V0KCkgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIGNoaWxkcmVuIGZyb20gYSBub2RlIGFyZSBsb2FkZWRcbiAgICogQHBhcmFtIG5vZGVJZCBpZCBvZiB0aGUgZGVzaXJlZCBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSBpZiBhbGwgY2hpbGRyZW4gb2YgdGhlIG5vZGUgaXMgbG9hZGVkIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FyZUFsbENoaWxkcmVuTG9hZGVkKCBub2RlSWQgKSB7XG5cbiAgICBpZiAoIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLm5vZGVzW25vZGVJZF0uZ2V0Q2hpbGRyZW5JZHMoKTtcbiAgICBsZXQgaGFzQWxsQ2hpbGQgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbklkcy5sZW5ndGggJiYgaGFzQWxsQ2hpbGQ7IGkrKykge1xuICAgICAgaGFzQWxsQ2hpbGQgPSB0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBjaGlsZHJlbklkc1tpXSApO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNBbGxDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRoZSBub2RlIGlmIG5lZWRlZCBhbmQgc2F2ZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHBhcmFtIG5vZGVJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2JpbmROb2RlKCBub2RlSWQgKSB7XG4gICAgaWYgKHRoaXMuYmluZGVycy5oYXMoIG5vZGVJZCApIHx8ICF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KCBub2RlSWQgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJpbmRlcnMuc2V0KCBub2RlSWQsIHRoaXMubm9kZXNbbm9kZUlkXS5iaW5kKCB0aGlzLl9iaW5kRnVuYy5iaW5kKCB0aGlzLCBub2RlSWQgKSApICk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB0aGUgY2FsbGJhY2sgbWV0aG9kIG9mIGFsbCB0aGUgYmluZGVyIG9mIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9iaW5kRnVuYyggbm9kZUlkICkge1xuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuaGFzKCBub2RlSWQgKSkge1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS52YWx1ZXMoKSkge1xuICAgICAgICBjYWxsYmFjayggdGhpcy5ub2Rlc1tub2RlSWRdICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVuYmluZCBhIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCB7U3RyaW5nfVxuICAgKiBAcGFyYW0gYmluZGVyIHtPYmplY3R9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VuQmluZCggbm9kZUlkLCBiaW5kZXIgKSB7XG5cbiAgICBpZiAoIXRoaXMuYmluZGVkTm9kZS5oYXMoIG5vZGVJZCApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5iaW5kZWROb2RlLmdldCggbm9kZUlkICkuZGVsZXRlKCBiaW5kZXIgKTtcblxuICAgIGlmICh0aGlzLmJpbmRlZE5vZGUuZ2V0KCBub2RlSWQgKS5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm5vZGVzW25vZGVJZF0udW5iaW5kKCB0aGlzLmJpbmRlcnMuZ2V0KCBub2RlSWQgKSApO1xuICAgICAgdGhpcy5iaW5kZXJzLmRlbGV0ZSggbm9kZUlkICk7XG4gICAgICB0aGlzLmJpbmRlZE5vZGUuZGVsZXRlKCBub2RlSWQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoTWFuYWdlclNlcnZpY2U7XG4iXX0=