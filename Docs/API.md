<a name="GraphManagerService"></a>

## GraphManagerService
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bindedNode | <code>Map.&lt;String, Map.&lt;Object, function()&gt;&gt;</code> | NodeId => Caller => Callback. All nodes that are bind |
| binders | <code>Map.&lt;String, function()&gt;</code> | NodeId => CallBack from bind method. |
| listeners | <code>Map.&lt;Object, function()&gt;</code> | caller => callback. List of all listeners on node added |
| nodes | <code>Object</code> | containing all SpinalNode currently loaded |
| graph | <code>SpinalGraph</code> |  |


* [GraphManagerService](#GraphManagerService)
    * [new GraphManagerService(viewerEnv)](#new_GraphManagerService_new)
    * [.setGraphFromForgeFile(forgeFile)](#GraphManagerService+setGraphFromForgeFile) ⇒ <code>\*</code>
    * [.setGraph(graph)](#GraphManagerService+setGraph) ⇒ <code>void</code>
    * [.getNode(id)](#GraphManagerService+getNode) ⇒ <code>Object</code> \| <code>undefined</code>
    * [.getGraph()](#GraphManagerService+getGraph) ⇒ <code>Object</code> \| <code>SpinalGraph</code>
    * [.getRealNode(id)](#GraphManagerService+getRealNode) ⇒ <code>SpinalNode</code> \| <code>undefined</code>
    * [.getChildren(id, relationNames)](#GraphManagerService+getChildren) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef&gt;&gt;</code>
    * [.getInfo(nodeId)](#GraphManagerService+getInfo) ⇒ <code>\*</code>
    * [.modifyNode(nodeId, info)](#GraphManagerService+modifyNode) ⇒ <code>boolean</code>
    * [.bindNode(nodeId, caller, callback)](#GraphManagerService+bindNode) ⇒ <code>undefined</code> \| <code>function</code>
    * [.removeChild(nodeId, childId, relationName, relationType, stop)](#GraphManagerService+removeChild) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.addContext(context)](#GraphManagerService+addContext) ⇒ <code>Promise.&lt;SpinalContext&gt;</code>
    * [.getContext(name)](#GraphManagerService+getContext) ⇒ <code>SpinalContext</code> \| <code>undefined</code>
    * [.createNode(info, element)](#GraphManagerService+createNode) ⇒ <code>String</code>
    * [.addChild(parentId, childId, relationName, relationType)](#GraphManagerService+addChild) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.addChildAndCreateNode(parentId, node, relationName, relationType)](#GraphManagerService+addChildAndCreateNode) ⇒ <code>boolean</code>

<a name="new_GraphManagerService_new"></a>

### new GraphManagerService(viewerEnv)

| Param | Type | Description |
| --- | --- | --- |
| viewerEnv | <code>boolean</code> | if defined load graph from getModel |

<a name="GraphManagerService+setGraphFromForgeFile"></a>

### graphManagerService.setGraphFromForgeFile(forgeFile) ⇒ <code>\*</code>
Change the current graph with the one of the forgeFile if there is one create one if note

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param |
| --- |
| forgeFile | 

<a name="GraphManagerService+setGraph"></a>

### graphManagerService.setGraph(graph) ⇒ <code>void</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| graph | <code>SpinalGraph</code> | 

<a name="GraphManagerService+getNode"></a>

### graphManagerService.getNode(id) ⇒ <code>Object</code> \| <code>undefined</code>
Return the information about the node with the given id

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Description |
| --- | --- |
| id | of the wanted node |

<a name="GraphManagerService+getGraph"></a>

### graphManagerService.getGraph() ⇒ <code>Object</code> \| <code>SpinalGraph</code>
return the current graph

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
<a name="GraphManagerService+getRealNode"></a>

### graphManagerService.getRealNode(id) ⇒ <code>SpinalNode</code> \| <code>undefined</code>
Return the node with the given id

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Description |
| --- | --- |
| id | of the wanted node |

<a name="GraphManagerService+getChildren"></a>

### graphManagerService.getChildren(id, relationNames) ⇒ <code>Promise.&lt;Array.&lt;SpinalNodeRef&gt;&gt;</code>
Return all children of a node

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type |
| --- | --- |
| id |  | 
| relationNames | <code>Array</code> | 

<a name="GraphManagerService+getInfo"></a>

### graphManagerService.getInfo(nodeId) ⇒ <code>\*</code>
Return the node info aggregated with its childrenIds, contextIds and element

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param |
| --- |
| nodeId | 

<a name="GraphManagerService+modifyNode"></a>

### graphManagerService.modifyNode(nodeId, info) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>boolean</code> - return true if the node corresponding to nodeId is Loaded false otherwise  

| Param | Description |
| --- | --- |
| nodeId | id of the desired node |
| info | new info for the node |

<a name="GraphManagerService+bindNode"></a>

### graphManagerService.bindNode(nodeId, caller, callback) ⇒ <code>undefined</code> \| <code>function</code>
Bind a node and return a function to unbind the same node

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>undefined</code> \| <code>function</code> - return a function to allow to node unbinding if the node corresponding to nodeId exist undefined and caller is an object and callback is a function otherwise  

| Param | Type | Description |
| --- | --- | --- |
| nodeId | <code>String</code> |  |
| caller | <code>Object</code> | usually 'this' |
| callback | <code>function</code> | to be call every change of the node |

<a name="GraphManagerService+removeChild"></a>

### graphManagerService.removeChild(nodeId, childId, relationName, relationType, stop) ⇒ <code>Promise.&lt;boolean&gt;</code>
Remoce the child corresponding to childId from the node corresponding to parentId.

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param | Type | Default |
| --- | --- | --- |
| nodeId | <code>String</code> |  | 
| childId | <code>String</code> |  | 
| relationName | <code>String</code> |  | 
| relationType | <code>Number</code> |  | 
| stop |  | <code>false</code> | 

<a name="GraphManagerService+addContext"></a>

### graphManagerService.addContext(context) ⇒ <code>Promise.&lt;SpinalContext&gt;</code>
Add a context to the graph

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param |
| --- |
| context | 

<a name="GraphManagerService+getContext"></a>

### graphManagerService.getContext(name) ⇒ <code>SpinalContext</code> \| <code>undefined</code>
**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  

| Param |
| --- |
| name | 

<a name="GraphManagerService+createNode"></a>

### graphManagerService.createNode(info, element) ⇒ <code>String</code>
Create a new node.
The node newly created is volatile i.e it won't be store in the filesystem as long it's not added as child to another node

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>String</code> - return the child identifier  

| Param | Type | Description |
| --- | --- | --- |
| info | <code>Object</code> | information of the node |
| element | <code>Model</code> | element pointed by the node |

<a name="GraphManagerService+addChild"></a>

### graphManagerService.addChild(parentId, childId, relationName, relationType) ⇒ <code>Promise.&lt;boolean&gt;</code>
Add the node corresponding to childId as child to the node corresponding to the parentId

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - return true if the child could be added false otherwise.  

| Param | Type |
| --- | --- |
| parentId | <code>String</code> | 
| childId | <code>String</code> | 
| relationName | <code>String</code> | 
| relationType | <code>Number</code> | 

<a name="GraphManagerService+addChildAndCreateNode"></a>

### graphManagerService.addChildAndCreateNode(parentId, node, relationName, relationType) ⇒ <code>boolean</code>
Create a node and add it as child to the parentId.

**Kind**: instance method of [<code>GraphManagerService</code>](#GraphManagerService)  
**Returns**: <code>boolean</code> - return true if the node was created added as child to the node corresponding to the parentId successfully  

| Param | Type | Description |
| --- | --- | --- |
| parentId | <code>string</code> | id of the parent node |
| node | <code>Object</code> | must have an attribute 'info' and can have an attribute 'element' |
| relationName | <code>string</code> |  |
| relationType | <code>Number</code> |  |

