[spinal-env-viewer-graph-service - v1.0.13](../README.md) › [Globals](../globals.md) › ["GraphManagerService"](../modules/_graphmanagerservice_.md) › [GraphManagerService](_graphmanagerservice_.graphmanagerservice.md)

# Class: GraphManagerService

@property {Map<string, Map<any, Callback>>} bindedNode
   NodeId => Caller => Callback. All nodes that are bind
 @property {Map<String, callback>} binders NodeId => CallBack from bind method.
 @property {Map<any, callback>} listeners
   caller => callback. List of all listeners on node added
 @property {{[nodeId: string]: SpinalNode<any>}} nodes containing all SpinalNode currently loaded
 @property {SpinalGraph<any>} graph

## Hierarchy

* **GraphManagerService**

## Index

### Constructors

* [constructor](_graphmanagerservice_.graphmanagerservice.md#constructor)

### Properties

* [bindedNode](_graphmanagerservice_.graphmanagerservice.md#bindednode)
* [binders](_graphmanagerservice_.graphmanagerservice.md#binders)
* [graph](_graphmanagerservice_.graphmanagerservice.md#graph)
* [initProm](_graphmanagerservice_.graphmanagerservice.md#initprom)
* [initialized](_graphmanagerservice_.graphmanagerservice.md#initialized)
* [listenerOnNodeRemove](_graphmanagerservice_.graphmanagerservice.md#listeneronnoderemove)
* [listenersOnNodeAdded](_graphmanagerservice_.graphmanagerservice.md#listenersonnodeadded)
* [nodes](_graphmanagerservice_.graphmanagerservice.md#nodes)
* [nodesInfo](_graphmanagerservice_.graphmanagerservice.md#nodesinfo)

### Methods

* [_addNode](_graphmanagerservice_.graphmanagerservice.md#private-_addnode)
* [_areAllChildrenLoaded](_graphmanagerservice_.graphmanagerservice.md#private-_areallchildrenloaded)
* [_bindFunc](_graphmanagerservice_.graphmanagerservice.md#private-_bindfunc)
* [_bindNode](_graphmanagerservice_.graphmanagerservice.md#private-_bindnode)
* [_unBind](_graphmanagerservice_.graphmanagerservice.md#private-_unbind)
* [addChild](_graphmanagerservice_.graphmanagerservice.md#addchild)
* [addChildAndCreateNode](_graphmanagerservice_.graphmanagerservice.md#addchildandcreatenode)
* [addChildInContext](_graphmanagerservice_.graphmanagerservice.md#addchildincontext)
* [addContext](_graphmanagerservice_.graphmanagerservice.md#addcontext)
* [bindNode](_graphmanagerservice_.graphmanagerservice.md#bindnode)
* [browseAnClassifyByType](_graphmanagerservice_.graphmanagerservice.md#browseanclassifybytype)
* [browseAndClassifyByTypeInContext](_graphmanagerservice_.graphmanagerservice.md#browseandclassifybytypeincontext)
* [createNode](_graphmanagerservice_.graphmanagerservice.md#createnode)
* [findInContext](_graphmanagerservice_.graphmanagerservice.md#findincontext)
* [findInContextByType](_graphmanagerservice_.graphmanagerservice.md#findincontextbytype)
* [findNode](_graphmanagerservice_.graphmanagerservice.md#findnode)
* [findNodes](_graphmanagerservice_.graphmanagerservice.md#findnodes)
* [findNodesByType](_graphmanagerservice_.graphmanagerservice.md#findnodesbytype)
* [generateQRcode](_graphmanagerservice_.graphmanagerservice.md#generateqrcode)
* [getChildren](_graphmanagerservice_.graphmanagerservice.md#getchildren)
* [getChildrenIds](_graphmanagerservice_.graphmanagerservice.md#getchildrenids)
* [getChildrenInContext](_graphmanagerservice_.graphmanagerservice.md#getchildrenincontext)
* [getContext](_graphmanagerservice_.graphmanagerservice.md#getcontext)
* [getContextWithType](_graphmanagerservice_.graphmanagerservice.md#getcontextwithtype)
* [getGraph](_graphmanagerservice_.graphmanagerservice.md#getgraph)
* [getInfo](_graphmanagerservice_.graphmanagerservice.md#getinfo)
* [getNode](_graphmanagerservice_.graphmanagerservice.md#getnode)
* [getNodeAsync](_graphmanagerservice_.graphmanagerservice.md#getnodeasync)
* [getNodeByType](_graphmanagerservice_.graphmanagerservice.md#getnodebytype)
* [getNodes](_graphmanagerservice_.graphmanagerservice.md#getnodes)
* [getNodesInfo](_graphmanagerservice_.graphmanagerservice.md#getnodesinfo)
* [getParents](_graphmanagerservice_.graphmanagerservice.md#getparents)
* [getRealNode](_graphmanagerservice_.graphmanagerservice.md#getrealnode)
* [getRelationNames](_graphmanagerservice_.graphmanagerservice.md#getrelationnames)
* [hasChildInContext](_graphmanagerservice_.graphmanagerservice.md#haschildincontext)
* [isChild](_graphmanagerservice_.graphmanagerservice.md#ischild)
* [listenOnNodeAdded](_graphmanagerservice_.graphmanagerservice.md#listenonnodeadded)
* [listenOnNodeRemove](_graphmanagerservice_.graphmanagerservice.md#listenonnoderemove)
* [modifyNode](_graphmanagerservice_.graphmanagerservice.md#modifynode)
* [moveChild](_graphmanagerservice_.graphmanagerservice.md#movechild)
* [moveChildInContext](_graphmanagerservice_.graphmanagerservice.md#movechildincontext)
* [removeChild](_graphmanagerservice_.graphmanagerservice.md#removechild)
* [removeFromGraph](_graphmanagerservice_.graphmanagerservice.md#removefromgraph)
* [setGraph](_graphmanagerservice_.graphmanagerservice.md#setgraph)
* [setGraphFromForgeFile](_graphmanagerservice_.graphmanagerservice.md#setgraphfromforgefile)
* [setInfo](_graphmanagerservice_.graphmanagerservice.md#setinfo)
* [stopListeningOnNodeAdded](_graphmanagerservice_.graphmanagerservice.md#stoplisteningonnodeadded)
* [stopListeningOnNodeRemove](_graphmanagerservice_.graphmanagerservice.md#stoplisteningonnoderemove)
* [waitForInitialization](_graphmanagerservice_.graphmanagerservice.md#waitforinitialization)

## Constructors

###  constructor

\+ **new GraphManagerService**(`viewerEnv?`: number): *[GraphManagerService](_graphmanagerservice_.graphmanagerservice.md)*

*Defined in [src/GraphManagerService.ts:84](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L84)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`viewerEnv?` | number | if defined load graph from getModel  |

**Returns:** *[GraphManagerService](_graphmanagerservice_.graphmanagerservice.md)*

## Properties

###  bindedNode

• **bindedNode**: *Map‹string, Map‹any, [callback](../modules/_graphmanagerservice_.md#callback)››*

*Defined in [src/GraphManagerService.ts:76](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L76)*

___

###  binders

• **binders**: *Map‹String, BindProcess›*

*Defined in [src/GraphManagerService.ts:77](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L77)*

___

###  graph

• **graph**: *SpinalGraph‹any›*

*Defined in [src/GraphManagerService.ts:83](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L83)*

___

###  initProm

• **initProm**: *q.Deferred‹SpinalGraph‹any››*

*Defined in [src/GraphManagerService.ts:84](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L84)*

___

###  initialized

• **initialized**: *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:80](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L80)*

___

###  listenerOnNodeRemove

• **listenerOnNodeRemove**: *Map‹any, [callback](../modules/_graphmanagerservice_.md#callback)›*

*Defined in [src/GraphManagerService.ts:79](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L79)*

___

###  listenersOnNodeAdded

• **listenersOnNodeAdded**: *Map‹any, [callback](../modules/_graphmanagerservice_.md#callback)›*

*Defined in [src/GraphManagerService.ts:78](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L78)*

___

###  nodes

• **nodes**: *object*

*Defined in [src/GraphManagerService.ts:81](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L81)*

#### Type declaration:

* \[ **nodeId**: *string*\]: SpinalNode‹any›

___

###  nodesInfo

• **nodesInfo**: *object*

*Defined in [src/GraphManagerService.ts:82](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L82)*

#### Type declaration:

* \[ **nodeId**: *string*\]: [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)

## Methods

### `Private` _addNode

▸ **_addNode**(`node`: SpinalNode‹any›): *void*

*Defined in [src/GraphManagerService.ts:931](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L931)*

add a node to the set of node

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`node` | SpinalNode‹any› |

**Returns:** *void*

___

### `Private` _areAllChildrenLoaded

▸ **_areAllChildrenLoaded**(`nodeId`: string): *boolean*

*Defined in [src/GraphManagerService.ts:950](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L950)*

Check if all children from a node are loaded

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodeId` | string | id of the desired node |

**Returns:** *boolean*

return true if all children of the node is loaded false otherwise

___

### `Private` _bindFunc

▸ **_bindFunc**(`nodeId`: string): *void*

*Defined in [src/GraphManagerService.ts:987](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L987)*

call the callback method of all the binder of the node

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *void*

___

### `Private` _bindNode

▸ **_bindNode**(`nodeId`: string): *void*

*Defined in [src/GraphManagerService.ts:973](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L973)*

Bind the node if needed and save the callback function

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *void*

___

### `Private` _unBind

▸ **_unBind**(`nodeId`: string, `binder`: any): *boolean*

*Defined in [src/GraphManagerService.ts:1004](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L1004)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |
`binder` | any |

**Returns:** *boolean*

___

###  addChild

▸ **addChild**(`parentId`: string, `childId`: string, `relationName`: string, `relationType`: string): *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:875](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L875)*

Add the node corresponding to childId as child to the node corresponding to the parentId

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`parentId` | string |
`childId` | string |
`relationName` | string |
`relationType` | string |

**Returns:** *Promise‹boolean›*

return true if the child could be added false otherwise.

___

###  addChildAndCreateNode

▸ **addChildAndCreateNode**(`parentId`: string, `node`: [SpinalNodeObject](../interfaces/_graphmanagerservice_.spinalnodeobject.md), `relationName`: string, `relationType`: string): *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:898](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L898)*

Create a node and add it as child to the parentId.

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentId` | string | id of the parent node |
`node` | [SpinalNodeObject](../interfaces/_graphmanagerservice_.spinalnodeobject.md) | must have an attr. 'info' and can have an attr. 'element' |
`relationName` | string | - |
`relationType` | string | - |

**Returns:** *Promise‹boolean›*

return true if the node was created added as child
to the node corresponding to the parentId successfully

___

###  addChildInContext

▸ **addChildInContext**(`parentId`: string, `childId`: string, `contextId`: string, `relationName`: string, `relationType`: string): *Promise‹SpinalNode‹any››*

*Defined in [src/GraphManagerService.ts:846](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L846)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`parentId` | string |
`childId` | string |
`contextId` | string |
`relationName` | string |
`relationType` | string |

**Returns:** *Promise‹SpinalNode‹any››*

___

###  addContext

▸ **addContext**(`name`: string, `type?`: string, `elt?`: Model): *Promise‹SpinalContext‹any››*

*Defined in [src/GraphManagerService.ts:744](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L744)*

Add a context to the graph

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | of the context |
`type?` | string | of the context |
`elt?` | Model | element of the context if needed |

**Returns:** *Promise‹SpinalContext‹any››*

___

###  bindNode

▸ **bindNode**(`nodeId`: string, `caller`: any, `callback`: callback): *Function*

*Defined in [src/GraphManagerService.ts:618](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L618)*

Bind a node and return a function to unbind the same node

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodeId` | string | - |
`caller` | any | usually 'this' |
`callback` | callback | to be call every change of the node |

**Returns:** *Function*

return a function to allow to node unbinding
if the node corresponding to nodeId exist
undefined and caller is an object and callback is a function otherwise

___

###  browseAnClassifyByType

▸ **browseAnClassifyByType**(`startId`: string, `relationNames`: string[]): *Promise‹any›*

*Defined in [src/GraphManagerService.ts:235](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L235)*

Recursively finds all the children nodes and classify them by type.

**`throws`** {TypeError} If the relationNames are neither an array, a string or omitted

**`throws`** {TypeError} If an element of relationNames is not a string

**`throws`** {TypeError} If the predicate is not a function

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startId` | string | starting point of the search if note found the search will start at the beginning of the graph |
`relationNames` | string[] | Array containing the relation names to follow |

**Returns:** *Promise‹any›*

>}

___

###  browseAndClassifyByTypeInContext

▸ **browseAndClassifyByTypeInContext**(`startId`: string, `contextId`: string): *Promise‹any›*

*Defined in [src/GraphManagerService.ts:318](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L318)*

Recursively finds all the children nodes in the context and classify them by type.

**`throws`** {TypeError} If the relationNames are neither an array, a string or omitted

**`throws`** {TypeError} If an element of relationNames is not a string

**`throws`** {TypeError} If the predicate is not a function

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startId` | string | starting point of the search if note found the search will start at the beginning of the graph |
`contextId` | string | Context to use for the search |

**Returns:** *Promise‹any›*

>}

___

###  createNode

▸ **createNode**(`info`: object, `element`: Model): *string*

*Defined in [src/GraphManagerService.ts:825](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L825)*

Create a new node.
The node newly created is volatile
i.e it won't be store in the filesystem as long it's not added as child to another node

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`info` | object | information of the node |
`element` | Model | element pointed by the node |

**Returns:** *string*

return the child identifier

___

###  findInContext

▸ **findInContext**(`startId`: string, `contextId`: string, `predicate`: [SpinalNodeFindPredicateFunc](../modules/_graphmanagerservice_.md#spinalnodefindpredicatefunc)): *Promise‹any›*

*Defined in [src/GraphManagerService.ts:271](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L271)*

Recursively finds all the children nodes in the context for which the predicate is true..

**`throws`** {TypeError} If context is not a SpinalContext

**`throws`** {TypeError} If the predicate is not a function

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`startId` | string | - | starting point of the search if note found the search will start at the beginning of the graph |
`contextId` | string | - | Context to use for the search |
`predicate` | [SpinalNodeFindPredicateFunc](../modules/_graphmanagerservice_.md#spinalnodefindpredicatefunc) |  DEFAULT_PREDICATE | Function returning true if the node needs to be returned |

**Returns:** *Promise‹any›*

The nodes that were found

___

###  findInContextByType

▸ **findInContextByType**(`startId`: string, `contextId`: string, `nodeType`: string): *Promise‹any›*

*Defined in [src/GraphManagerService.ts:301](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L301)*

Recursively finds all the children nodes in the context for which the predicate is true..

**`throws`** {TypeError} If context is not a SpinalContext

**`throws`** {TypeError} If the predicate is not a function

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startId` | string | starting point of the search if note found the search will start at the beginning of the graph |
`contextId` | string | Context to use for the search |
`nodeType` | string | type of node to search |

**Returns:** *Promise‹any›*

The nodes that were found

___

###  findNode

▸ **findNode**(`id`: string, `stop`: boolean): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

*Defined in [src/GraphManagerService.ts:163](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L163)*

Find a node with it id

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`id` | string | - | - |
`stop` | boolean | false |   |

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

___

###  findNodes

▸ **findNodes**(`startId`: string, `relationNames`: string[], `predicate`: function): *Promise‹SpinalNode‹any›[]›*

*Defined in [src/GraphManagerService.ts:195](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L195)*

Find all the nodes that validate the predicate

**Parameters:**

▪ **startId**: *string*

starting point of the search if note found the
search will start at the beginning of the graph

▪ **relationNames**: *string[]*

the relations that will be follow
during the search if empty follow all relations

▪ **predicate**: *function*

function that return true if the
node if valid

▸ (`node`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *Promise‹SpinalNode‹any›[]›*

all node that validate the predicate

___

###  findNodesByType

▸ **findNodesByType**(`startId`: string, `relationNames`: string[], `nodeType`: string): *Promise‹any›*

*Defined in [src/GraphManagerService.ts:218](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L218)*

Find all nodes with the type "nodeType"
 @param startId {String} starting point of the search if note found the
search will start at the beginning of the graph

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startId` | string | - |
`relationNames` | string[] | the relations that will be follow during the search if empty follow all relations |
`nodeType` | string | type of node to search |

**Returns:** *Promise‹any›*

all nodes with the type "nodeType"

___

###  generateQRcode

▸ **generateQRcode**(`nodeId`: string): *string*

*Defined in [src/GraphManagerService.ts:346](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L346)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *string*

___

###  getChildren

▸ **getChildren**(`id`: string, `relationNames`: string[]): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

*Defined in [src/GraphManagerService.ts:447](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L447)*

Return all children of a node

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`relationNames` | string[] |  [] |

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

___

###  getChildrenIds

▸ **getChildrenIds**(`nodeId`: string): *string[]*

*Defined in [src/GraphManagerService.ts:539](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L539)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *string[]*

___

###  getChildrenInContext

▸ **getChildrenInContext**(`parentId`: string, `contextId`: string): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

*Defined in [src/GraphManagerService.ts:475](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L475)*

Return the children of the node that are registered in the context

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentId` | string | id of the parent node |
`contextId` | string | id of the context node |

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

The info of the children that were found

___

###  getContext

▸ **getContext**(`name`: string): *SpinalContext‹any›*

*Defined in [src/GraphManagerService.ts:756](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L756)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *SpinalContext‹any›*

___

###  getContextWithType

▸ **getContextWithType**(`type`: string): *any[]*

*Defined in [src/GraphManagerService.ts:771](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L771)*

Return all context with type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string |   |

**Returns:** *any[]*

___

###  getGraph

▸ **getGraph**(): *SpinalGraph‹any›*

*Defined in [src/GraphManagerService.ts:407](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L407)*

return the current graph

**Returns:** *SpinalGraph‹any›*

___

###  getInfo

▸ **getInfo**(`nodeId`: string): *[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)*

*Defined in [src/GraphManagerService.ts:498](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L498)*

Return the node info aggregated with its childrenIds, contextIds and element

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)*

___

###  getNode

▸ **getNode**(`id`: string): *[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)*

*Defined in [src/GraphManagerService.ts:379](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L379)*

Return the information about the node with the given id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | of the wanted node |

**Returns:** *[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)*

___

###  getNodeAsync

▸ **getNodeAsync**(`id`: string): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

*Defined in [src/GraphManagerService.ts:392](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L392)*

Return the information about the node with the given id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | of the wanted node |

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

___

###  getNodeByType

▸ **getNodeByType**(`type`: string): *any[]*

*Defined in [src/GraphManagerService.ts:788](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L788)*

Retr

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string |   |

**Returns:** *any[]*

___

###  getNodes

▸ **getNodes**(): *object*

*Defined in [src/GraphManagerService.ts:360](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L360)*

Return all loaded Nodes

**`memberof`** GraphManagerService

**Returns:** *object*

* \[ **nodeId**: *string*\]: SpinalNode‹any›

___

###  getNodesInfo

▸ **getNodesInfo**(): *object*

*Defined in [src/GraphManagerService.ts:370](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L370)*

Return all loaded Nodes

**`memberof`** GraphManagerService

**Returns:** *object*

* \[ **nodeId**: *string*\]: [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)

___

###  getParents

▸ **getParents**(`nodeId`: string, `relationNames`: string | string[]): *Promise‹any›*

*Defined in [src/GraphManagerService.ts:1044](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L1044)*

getParents

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |
`relationNames` | string &#124; string[] |

**Returns:** *Promise‹any›*

___

###  getRealNode

▸ **getRealNode**(`id`: string): *SpinalNode‹any›*

*Defined in [src/GraphManagerService.ts:417](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L417)*

Return the node with the given id

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | of the wanted node |

**Returns:** *SpinalNode‹any›*

___

###  getRelationNames

▸ **getRelationNames**(`id`: string): *string[]*

*Defined in [src/GraphManagerService.ts:430](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L430)*

Return all the relation names of the node coresponding to id

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | of the node |

**Returns:** *string[]*

___

###  hasChildInContext

▸ **hasChildInContext**(`nodeId`: string, `contextId`: string): *boolean*

*Defined in [src/GraphManagerService.ts:1021](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L1021)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |
`contextId` | string |

**Returns:** *boolean*

___

###  isChild

▸ **isChild**(`parentId`: string, `childId`: string, `linkRelationName`: string[]): *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:908](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L908)*

**Parameters:**

Name | Type |
------ | ------ |
`parentId` | string |
`childId` | string |
`linkRelationName` | string[] |

**Returns:** *Promise‹boolean›*

___

###  listenOnNodeAdded

▸ **listenOnNodeAdded**(`caller`: any, `callback`: callback): *boolean*

*Defined in [src/GraphManagerService.ts:551](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L551)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |
`callback` | callback |

**Returns:** *boolean*

___

###  listenOnNodeRemove

▸ **listenOnNodeRemove**(`caller`: any, `callback`: callback): *boolean*

*Defined in [src/GraphManagerService.ts:562](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L562)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |
`callback` | callback |

**Returns:** *boolean*

___

###  modifyNode

▸ **modifyNode**(`nodeId`: string, `info`: [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)): *boolean*

*Defined in [src/GraphManagerService.ts:591](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L591)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodeId` | string | id of the desired node |
`info` | [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md) | new info for the node |

**Returns:** *boolean*

return true if the node corresponding to nodeId is Loaded false otherwise

___

###  moveChild

▸ **moveChild**(`fromId`: string, `toId`: string, `childId`: string, `relationName`: string, `relationType`: string): *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:646](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L646)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`fromId` | string |
`toId` | string |
`childId` | string |
`relationName` | string |
`relationType` | string |

**Returns:** *Promise‹boolean›*

___

###  moveChildInContext

▸ **moveChildInContext**(`fromId`: string, `toId`: string, `childId`: string, `contextId`: string, `relationName`: string, `relationType`: string): *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:673](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L673)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`fromId` | string |
`toId` | string |
`childId` | string |
`contextId` | string |
`relationName` | string |
`relationType` | string |

**Returns:** *Promise‹boolean›*

___

###  removeChild

▸ **removeChild**(`nodeId`: string, `childId`: string, `relationName`: string, `relationType`: string, `stop`: boolean): *Promise‹boolean›*

*Defined in [src/GraphManagerService.ts:705](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L705)*

Remove the child corresponding to childId from the node corresponding to parentId.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`nodeId` | string | - |
`childId` | string | - |
`relationName` | string | - |
`relationType` | string | - |
`stop` | boolean | false |

**Returns:** *Promise‹boolean›*

___

###  removeFromGraph

▸ **removeFromGraph**(`id`: string): *Promise‹void›*

*Defined in [src/GraphManagerService.ts:807](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L807)*

Remove the node referenced by id from th graph.

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹void›*

___

###  setGraph

▸ **setGraph**(`graph`: SpinalGraph‹any›): *Promise‹String›*

*Defined in [src/GraphManagerService.ts:135](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L135)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`graph` | SpinalGraph‹any› |

**Returns:** *Promise‹String›*

the id of the graph

___

###  setGraphFromForgeFile

▸ **setGraphFromForgeFile**(`forgeFile`: Model): *Promise‹String›*

*Defined in [src/GraphManagerService.ts:119](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L119)*

Change the current graph with the one of the forgeFile if there is one create one if note

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`forgeFile` | Model |

**Returns:** *Promise‹String›*

___

###  setInfo

▸ **setInfo**(`nodeId`: string): *void*

*Defined in [src/GraphManagerService.ts:523](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L523)*

Return the node info aggregated with its childrenIds, contextIds and element

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *void*

___

###  stopListeningOnNodeAdded

▸ **stopListeningOnNodeAdded**(`caller`: any): *boolean*

*Defined in [src/GraphManagerService.ts:572](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L572)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |

**Returns:** *boolean*

___

###  stopListeningOnNodeRemove

▸ **stopListeningOnNodeRemove**(`caller`: any): *boolean*

*Defined in [src/GraphManagerService.ts:581](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L581)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |

**Returns:** *boolean*

___

###  waitForInitialization

▸ **waitForInitialization**(): *q.Promise‹SpinalGraph‹any››*

*Defined in [src/GraphManagerService.ts:154](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L154)*

**`memberof`** GraphManagerService

**Returns:** *q.Promise‹SpinalGraph‹any››*
