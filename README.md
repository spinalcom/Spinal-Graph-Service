<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# spinal-env-viewer-graph-service

Service warper of the spinal-model-graph.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [API](#api)
  - [Classes](#classes)
  - [SpinalNodeRef ⇐ <code>Model</code>](#spinalnoderef-%E2%87%90-codemodelcode)
    - [SpinalNodeRef.SpinalNodeRef](#spinalnoderefspinalnoderef)
      - [new SpinalNodeRef(model, childrenIds, contextIds, element, hasChildren)](#new-spinalnoderefmodel-childrenids-contextids-element-haschildren)
  - [GraphManagerService](#graphmanagerservice)
    - [new GraphManagerService([viewerEnv])](#new-graphmanagerserviceviewerenv)
    - [graphManagerService.setGraphFromForgeFile()](#graphmanagerservicesetgraphfromforgefile)
    - [graphManagerService.setGraph(graph) ⇒ <code>Promise.&lt;String&gt;</code>](#graphmanagerservicesetgraphgraph-%E2%87%92-codepromiseltstringgtcode)
    - [graphManagerService.getNodes() ⇒ <code>ObjectKeyNode.&lt;any&gt;</code>](#graphmanagerservicegetnodes-%E2%87%92-codeobjectkeynodeltanygtcode)
    - [graphManagerService.getNode(id) ⇒ <code>SpinalNodeRef.&lt;T&gt;</code>](#graphmanagerservicegetnodeid-%E2%87%92-codespinalnodereflttgtcode)
    - [graphManagerService.getGraph() ⇒ <code>SpinalGraph.&lt;any&gt;</code> \| <code>Object</code>](#graphmanagerservicegetgraph-%E2%87%92-codespinalgraphltanygtcode-%5C-codeobjectcode)
    - [graphManagerService.getRealNode(id) ⇒ <code>SpinalNode.&lt;T&gt;</code>](#graphmanagerservicegetrealnodeid-%E2%87%92-codespinalnodelttgtcode)
    - [graphManagerService.getRelationNames(id) ⇒ <code>Array.&lt;string&gt;</code>](#graphmanagerservicegetrelationnamesid-%E2%87%92-codearrayltstringgtcode)
    - [graphManagerService.getChildren(id, [relationNames]) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code>](#graphmanagerservicegetchildrenid-relationnames-%E2%87%92-codepromiseltarrayltspinalnoderefltanygtgtgtcode)
    - [graphManagerService.getChildrenInContext(parentId, contextId) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code>](#graphmanagerservicegetchildrenincontextparentid-contextid-%E2%87%92-codepromiseltarrayltspinalnoderefltanygtgtgtcode)
    - [graphManagerService.getInfo(nodeId) ⇒ <code>SpinalNodeRef.&lt;T&gt;</code>](#graphmanagerservicegetinfonodeid-%E2%87%92-codespinalnodereflttgtcode)
    - [graphManagerService.getChildrenIds(nodeId) ⇒ <code>Array.&lt;string&gt;</code>](#graphmanagerservicegetchildrenidsnodeid-%E2%87%92-codearrayltstringgtcode)
    - [graphManagerService.listenOnNodeAdded(caller, callback) ⇒ <code>boolean</code>](#graphmanagerservicelistenonnodeaddedcaller-callback-%E2%87%92-codebooleancode)
    - [graphManagerService.listenOnNodeRemove(caller, callback) ⇒ <code>boolean</code>](#graphmanagerservicelistenonnoderemovecaller-callback-%E2%87%92-codebooleancode)
    - [graphManagerService.stopListeningOnNodeAdded(caller) ⇒ <code>boolean</code>](#graphmanagerservicestoplisteningonnodeaddedcaller-%E2%87%92-codebooleancode)
    - [graphManagerService.stopListeningOnNodeRemove(caller) ⇒ <code>boolean</code>](#graphmanagerservicestoplisteningonnoderemovecaller-%E2%87%92-codebooleancode)
    - [graphManagerService.modifyNode(nodeId, info) ⇒ <code>boolean</code>](#graphmanagerservicemodifynodenodeid-info-%E2%87%92-codebooleancode)
    - [graphManagerService.bindNode(nodeId, caller, callback) ⇒ <code>function</code>](#graphmanagerservicebindnodenodeid-caller-callback-%E2%87%92-codefunctioncode)
    - [graphManagerService.moveChild(fromId, toId, childId, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>](#graphmanagerservicemovechildfromid-toid-childid-relationname-relationtype-%E2%87%92-codepromiseltbooleangtcode)
    - [graphManagerService.removeChild(nodeId, childId, relationName, relationType, [stop]) ⇒ <code>Promise.&lt;boolean&gt;</code>](#graphmanagerserviceremovechildnodeid-childid-relationname-relationtype-stop-%E2%87%92-codepromiseltbooleangtcode)
    - [graphManagerService.addContext(name, type, elt) ⇒ <code>Promise.&lt;SpinalContext.&lt;any&gt;&gt;</code>](#graphmanagerserviceaddcontextname-type-elt-%E2%87%92-codepromiseltspinalcontextltanygtgtcode)
    - [graphManagerService.getContext(name) ⇒ <code>SpinalContext.&lt;T&gt;</code>](#graphmanagerservicegetcontextname-%E2%87%92-codespinalcontextlttgtcode)
    - [graphManagerService.removeFromGraph(id) ⇒ <code>Promise.&lt;void&gt;</code>](#graphmanagerserviceremovefromgraphid-%E2%87%92-codepromiseltvoidgtcode)
    - [graphManagerService.createNode(info, element) ⇒ <code>string</code>](#graphmanagerservicecreatenodeinfo-element-%E2%87%92-codestringcode)
    - [graphManagerService.addChildInContext(parentId, childId, contextId, relationName, relationType) ⇒ <code>Promise.&lt;SpinalNode.&lt;any&gt;&gt;</code>](#graphmanagerserviceaddchildincontextparentid-childid-contextid-relationname-relationtype-%E2%87%92-codepromiseltspinalnodeltanygtgtcode)
    - [graphManagerService.addChild(parentId, childId, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>](#graphmanagerserviceaddchildparentid-childid-relationname-relationtype-%E2%87%92-codepromiseltbooleangtcode)
    - [graphManagerService.addChildAndCreateNode(parentId, node, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>](#graphmanagerserviceaddchildandcreatenodeparentid-node-relationname-relationtype-%E2%87%92-codepromiseltbooleangtcode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# API
## Classes

<dl>
<dt><a href="#SpinalNodeRef">SpinalNodeRef</a> ⇐ <code>Model</code></dt>
<dd></dd>
<dt><a href="#GraphManagerService">GraphManagerService</a></dt>
<dd></dd>
</dl>

<a name="SpinalNodeRef"></a>

## SpinalNodeRef ⇐ <code>Model</code>
**Kind**: global class  
**Extends**: <code>Model</code>  
**Template**: T  

* [SpinalNodeRef](#SpinalNodeRef) ⇐ <code>Model</code>
    * [.SpinalNodeRef](#SpinalNodeRef.SpinalNodeRef)
        * [new SpinalNodeRef(model, childrenIds, contextIds, element, hasChildren)](#new_SpinalNodeRef.SpinalNodeRef_new)

<a name="SpinalNodeRef.SpinalNodeRef"></a>

### SpinalNodeRef.SpinalNodeRef
**Kind**: static class of [<code>SpinalNodeRef</code>](#SpinalNodeRef)  
<a name="new_SpinalNodeRef.SpinalNodeRef_new"></a>

#### new SpinalNodeRef(model, childrenIds, contextIds, element, hasChildren)
<p>Creates an instance of SpinalNodeRef.</p>


| Param | Type | Description |
| --- | --- | --- |
| model | <code>spinal.Model</code> | <p>object to deepcopy</p> |
| childrenIds | <code>Array.&lt;string&gt;</code> |  |
| contextIds | <code>SpinalSet</code> |  |
| element | <code>SpinalNodePointer.&lt;T&gt;</code> |  |
| hasChildren | <code>boolean</code> |  |

<a name="GraphManagerService"></a>

## GraphManagerService
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bindedNode | <code>Map.&lt;string, Map.&lt;any, callback&gt;&gt;</code> | <p>NodeId =&gt; Caller =&gt; Callback. All nodes that are bind</p> |
| binders | <code>Map.&lt;String, spinal.Process&gt;</code> | <p>NodeId =&gt; CallBack from bind method.</p> |
| listenersOnNodeAdded | <code>Map.&lt;any, callback&gt;</code> |  |
| listenerOnNodeRemove | <code>Map.&lt;any, callback&gt;</code> |  |
| nodes | <code>ObjectKeyNode.&lt;any&gt;</code> | <p>containing all SpinalNode currently loaded</p> |
| graph | <code>SpinalGraph.&lt;any&gt;</code> |  |


* [GraphManagerService](#GraphManagerService)
    * [new GraphManagerService([viewerEnv])](#new_GraphManagerService_new)
    * [.setGraphFromForgeFile()](#GraphManagerService+setGraphFromForgeFile)
    * [.setGraph(graph)](#GraphManagerService+setGraph) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.getNodes()](#GraphManagerService+getNodes) ⇒ <code>ObjectKeyNode.&lt;any&gt;</code>
    * [.getNode(id)](#GraphManagerService+getNode) ⇒ <code>SpinalNodeRef.&lt;T&gt;</code>
    * [.getGraph()](#GraphManagerService+getGraph) ⇒ <code>SpinalGraph.&lt;any&gt;</code> \| <code>Object</code>
    * [.getRealNode(id)](#GraphManagerService+getRealNode) ⇒ <code>SpinalNode.&lt;T&gt;</code>
    * [.getRelationNames(id)](#GraphManagerService+getRelationNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getChildren(id, [relationNames])](#GraphManagerService+getChildren) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code>
    * [.getChildrenInContext(parentId, contextId)](#GraphManagerService+getChildrenInContext) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code>
    * [.getInfo(nodeId)](#GraphManagerService+getInfo) ⇒ <code>SpinalNodeRef.&lt;T&gt;</code>
    * [.getChildrenIds(nodeId)](#GraphManagerService+getChildrenIds) ⇒ <code>Array.&lt;string&gt;</code>
    * [.listenOnNodeAdded(caller, callback)](#GraphManagerService+listenOnNodeAdded) ⇒ <code>boolean</code>
    * [.listenOnNodeRemove(caller, callback)](#GraphManagerService+listenOnNodeRemove) ⇒ <code>boolean</code>
    * [.stopListeningOnNodeAdded(caller)](#GraphManagerService+stopListeningOnNodeAdded) ⇒ <code>boolean</code>
    * [.stopListeningOnNodeRemove(caller)](#GraphManagerService+stopListeningOnNodeRemove) ⇒ <code>boolean</code>
    * [.modifyNode(nodeId, info)](#GraphManagerService+modifyNode) ⇒ <code>boolean</code>
    * [.bindNode(nodeId, caller, callback)](#GraphManagerService+bindNode) ⇒ <code>function</code>
    * [.moveChild(fromId, toId, childId, relationName, relationType)](#GraphManagerService+moveChild) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.removeChild(nodeId, childId, relationName, relationType, [stop])](#GraphManagerService+removeChild) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.addContext(name, type, elt)](#GraphManagerService+addContext) ⇒ <code>Promise.&lt;SpinalContext.&lt;any&gt;&gt;</code>
    * [.getContext(name)](#GraphManagerService+getContext) ⇒ <code>SpinalContext.&lt;T&gt;</code>
    * [.removeFromGraph(id)](#GraphManagerService+removeFromGraph) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.createNode(info, element)](#GraphManagerService+createNode) ⇒ <code>string</code>
    * [.addChildInContext(parentId, childId, contextId, relationName, relationType)](#GraphManagerService+addChildInContext) ⇒ <code>Promise.&lt;SpinalNode.&lt;any&gt;&gt;</code>
    * [.addChild(parentId, childId, relationName, relationType)](#GraphManagerService+addChild) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.addChildAndCreateNode(parentId, node, relationName, relationType)](#GraphManagerService+addChildAndCreateNode) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="new_GraphManagerService_new"></a>

### new GraphManagerService([viewerEnv])
<p>Creates an instance of GraphManagerService.</p>


| Param | Type | Description |
| --- | --- | --- |
| [viewerEnv] | <code>number</code> | <p>if defined load graph from getModel</p> |

<a name="GraphManagerService+setGraphFromForgeFile"></a>

### graphManagerService.setGraphFromForgeFile()
<p>Change the current graph with the one of the forgeFile
if there is one create one if note</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
<a name="GraphManagerService+setGraph"></a>

### graphManagerService.setGraph(graph) ⇒ <code>Promise.&lt;String&gt;</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>Promise.&lt;String&gt;</code> - <p>the id of the graph</p>  

| Param | Type |
| --- | --- |
| graph | <code>SpinalGraph.&lt;any&gt;</code> | 

<a name="GraphManagerService+getNodes"></a>

### graphManagerService.getNodes() ⇒ <code>ObjectKeyNode.&lt;any&gt;</code>
<p>Return all loaded Nodes</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
<a name="GraphManagerService+getNode"></a>

### graphManagerService.getNode(id) ⇒ <code>SpinalNodeRef.&lt;T&gt;</code>
<p>Return the information about the node with the given id</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Template**: T extends spinal.Model = Eleemnt  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>of the wanted node</p> |

<a name="GraphManagerService+getGraph"></a>

### graphManagerService.getGraph() ⇒ <code>SpinalGraph.&lt;any&gt;</code> \| <code>Object</code>
<p>return the current graph</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
<a name="GraphManagerService+getRealNode"></a>

### graphManagerService.getRealNode(id) ⇒ <code>SpinalNode.&lt;T&gt;</code>
<p>Return the node with the given id</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Template**: T extends spinal.Model = Eleemnt  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>of the wanted node</p> |

<a name="GraphManagerService+getRelationNames"></a>

### graphManagerService.getRelationNames(id) ⇒ <code>Array.&lt;string&gt;</code>
<p>Return all the relation names of the node coresponding to id</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>of the node</p> |

<a name="GraphManagerService+getChildren"></a>

### graphManagerService.getChildren(id, [relationNames]) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code>
<p>Return all children of a node</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>string</code> |  | 
| [relationNames] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 

<a name="GraphManagerService+getChildrenInContext"></a>

### graphManagerService.getChildrenInContext(parentId, contextId) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code>
<p>Return the children of the node that are registered in the context</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>Promise.&lt;Array.&lt;SpinalNodeRef.&lt;any&gt;&gt;&gt;</code> - <p>The info of the children that were found</p>  

| Param | Type | Description |
| --- | --- | --- |
| parentId | <code>string</code> | <p>id of the parent node</p> |
| contextId | <code>string</code> | <p>id of the context node</p> |

<a name="GraphManagerService+getInfo"></a>

### graphManagerService.getInfo(nodeId) ⇒ <code>SpinalNodeRef.&lt;T&gt;</code>
<p>Return the node info aggregated with its childrenIds, contextIds and element</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Template**: T  

| Param | Type |
| --- | --- |
| nodeId | <code>string</code> | 

<a name="GraphManagerService+getChildrenIds"></a>

### graphManagerService.getChildrenIds(nodeId) ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| nodeId | <code>string</code> | 

<a name="GraphManagerService+listenOnNodeAdded"></a>

### graphManagerService.listenOnNodeAdded(caller, callback) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| caller | <code>any</code> | 
| callback | <code>callback</code> | 

<a name="GraphManagerService+listenOnNodeRemove"></a>

### graphManagerService.listenOnNodeRemove(caller, callback) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| caller | <code>\*</code> | 
| callback | <code>callback</code> | 

<a name="GraphManagerService+stopListeningOnNodeAdded"></a>

### graphManagerService.stopListeningOnNodeAdded(caller) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| caller | <code>\*</code> | 

<a name="GraphManagerService+stopListeningOnNodeRemove"></a>

### graphManagerService.stopListeningOnNodeRemove(caller) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| caller | <code>\*</code> | 

<a name="GraphManagerService+modifyNode"></a>

### graphManagerService.modifyNode(nodeId, info) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| nodeId | <code>string</code> | <p>id of the desired node</p> |
| info | <code>SpinalNodeRef.&lt;T&gt;</code> | <p>new info for the node</p> |

<a name="GraphManagerService+bindNode"></a>

### graphManagerService.bindNode(nodeId, caller, callback) ⇒ <code>function</code>
<p>Bind a node and return a function to unbind the same node</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>function</code> - <p>return a function to allow to node unbinding
if the node corresponding to nodeId exist
undefined and caller is an object and callback is a function otherwise</p>  

| Param | Type | Description |
| --- | --- | --- |
| nodeId | <code>string</code> |  |
| caller | <code>\*</code> | <p>usually 'this'</p> |
| callback | <code>callback</code> | <p>to be call every change of the node</p> |

<a name="GraphManagerService+moveChild"></a>

### graphManagerService.moveChild(fromId, toId, childId, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| fromId | <code>string</code> | 
| toId | <code>string</code> | 
| childId | <code>string</code> | 
| relationName | <code>string</code> | 
| relationType | <code>string</code> | 

<a name="GraphManagerService+removeChild"></a>

### graphManagerService.removeChild(nodeId, childId, relationName, relationType, [stop]) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type | Default |
| --- | --- | --- |
| nodeId | <code>string</code> |  | 
| childId | <code>string</code> |  | 
| relationName | <code>string</code> |  | 
| relationType | <code>string</code> |  | 
| [stop] | <code>boolean</code> | <code>false</code> | 

<a name="GraphManagerService+addContext"></a>

### graphManagerService.addContext(name, type, elt) ⇒ <code>Promise.&lt;SpinalContext.&lt;any&gt;&gt;</code>
<p>Add a context to the graph</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>of the context</p> |
| type | <code>string</code> | <p>of the context</p> |
| elt | <code>spinal.Model</code> | <p>element of the context if needed</p> |

<a name="GraphManagerService+getContext"></a>

### graphManagerService.getContext(name) ⇒ <code>SpinalContext.&lt;T&gt;</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Template**: T  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="GraphManagerService+removeFromGraph"></a>

### graphManagerService.removeFromGraph(id) ⇒ <code>Promise.&lt;void&gt;</code>
<p>Remove the node referenced by id from th graph.</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="GraphManagerService+createNode"></a>

### graphManagerService.createNode(info, element) ⇒ <code>string</code>
<p>Create a new node.
The node newly created is volatile
i.e it won't be store in the filesystem as long it's not added as child to another node</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>string</code> - <p>return the child identifier</p>  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| info | <code>ICreateNodeInfo</code> | <p>information of the node</p> |
| element | <code>T</code> | <p>element pointed by the node</p> |

<a name="GraphManagerService+addChildInContext"></a>

### graphManagerService.addChildInContext(parentId, childId, contextId, relationName, relationType) ⇒ <code>Promise.&lt;SpinalNode.&lt;any&gt;&gt;</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| parentId | <code>string</code> | 
| childId | <code>string</code> | 
| contextId | <code>string</code> | 
| relationName | <code>string</code> | 
| relationType | <code>string</code> | 

<a name="GraphManagerService+addChild"></a>

### graphManagerService.addChild(parentId, childId, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>
<p>Add the node corresponding to childId as child to the node corresponding to the parentId</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - <p>return true if the child could be added false otherwise.</p>  

| Param | Type |
| --- | --- |
| parentId | <code>string</code> | 
| childId | <code>string</code> | 
| relationName | <code>string</code> | 
| relationType | <code>string</code> | 

<a name="GraphManagerService+addChildAndCreateNode"></a>

### graphManagerService.addChildAndCreateNode(parentId, node, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>
<p>Create a node and add it as child to the parentId.</p>

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - <p>return true if the node was created added as child
to the node corresponding to the parentId successfully</p>  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| parentId | <code>string</code> | <p>id of the parent node</p> |
| node | <code>SpinalNodeObject.&lt;T&gt;</code> | <p>must have an attr. 'info' and can have an attr. 'element'</p> |
| relationName | <code>string</code> |  |
| relationType | <code>string</code> |  |

