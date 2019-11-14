[spinal-env-viewer-graph-service](../globals.md) › ["GraphManagerService"](../modules/_graphmanagerservice_.md) › [GraphManagerService](_graphmanagerservice_.graphmanagerservice.md)

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
* [createNode](_graphmanagerservice_.graphmanagerservice.md#createnode)
* [findNode](_graphmanagerservice_.graphmanagerservice.md#findnode)
* [findNodes](_graphmanagerservice_.graphmanagerservice.md#findnodes)
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

*Defined in [GraphManagerService.ts:77](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L77)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`viewerEnv?` | number | if defined load graph from getModel  |

**Returns:** *[GraphManagerService](_graphmanagerservice_.graphmanagerservice.md)*

## Properties

###  bindedNode

• **bindedNode**: *Map‹string, Map‹any, [callback](../modules/_graphmanagerservice_.md#callback)››*

*Defined in [GraphManagerService.ts:69](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L69)*

___

###  binders

• **binders**: *Map‹String, BindProcess›*

*Defined in [GraphManagerService.ts:70](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L70)*

___

###  graph

• **graph**: *SpinalGraph‹any›*

*Defined in [GraphManagerService.ts:76](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L76)*

___

###  initProm

• **initProm**: *q.Deferred‹SpinalGraph‹any››*

*Defined in [GraphManagerService.ts:77](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L77)*

___

###  initialized

• **initialized**: *Promise‹boolean›*

*Defined in [GraphManagerService.ts:73](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L73)*

___

###  listenerOnNodeRemove

• **listenerOnNodeRemove**: *Map‹any, [callback](../modules/_graphmanagerservice_.md#callback)›*

*Defined in [GraphManagerService.ts:72](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L72)*

___

###  listenersOnNodeAdded

• **listenersOnNodeAdded**: *Map‹any, [callback](../modules/_graphmanagerservice_.md#callback)›*

*Defined in [GraphManagerService.ts:71](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L71)*

___

###  nodes

• **nodes**: *object*

*Defined in [GraphManagerService.ts:74](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L74)*

#### Type declaration:

* \[ **nodeId**: *string*\]: SpinalNode‹any›

___

###  nodesInfo

• **nodesInfo**: *object*

*Defined in [GraphManagerService.ts:75](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L75)*

#### Type declaration:

* \[ **nodeId**: *string*\]: [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)

## Methods

### `Private` _addNode

▸ **_addNode**(`node`: SpinalNode‹any›): *void*

*Defined in [GraphManagerService.ts:786](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L786)*

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

*Defined in [GraphManagerService.ts:805](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L805)*

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

*Defined in [GraphManagerService.ts:842](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L842)*

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

*Defined in [GraphManagerService.ts:828](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L828)*

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

*Defined in [GraphManagerService.ts:859](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L859)*

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

*Defined in [GraphManagerService.ts:730](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L730)*

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

*Defined in [GraphManagerService.ts:753](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L753)*

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

*Defined in [GraphManagerService.ts:701](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L701)*

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

*Defined in [GraphManagerService.ts:599](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L599)*

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

▸ **bindNode**(`nodeId`: string, `caller`: any, `callback`: [callback](undefined)): *Function*

*Defined in [GraphManagerService.ts:473](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L473)*

Bind a node and return a function to unbind the same node

**`memberof`** GraphManagerService

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodeId` | string | - |
`caller` | any | usually 'this' |
`callback` | [callback](undefined) | to be call every change of the node |

**Returns:** *Function*

return a function to allow to node unbinding
if the node corresponding to nodeId exist
undefined and caller is an object and callback is a function otherwise

___

###  createNode

▸ **createNode**(`info`: object, `element`: Model): *string*

*Defined in [GraphManagerService.ts:680](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L680)*

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

###  findNode

▸ **findNode**(`id`: string, `stop`: boolean): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

*Defined in [GraphManagerService.ts:155](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L155)*

Find a node with it id

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`id` | string | - | - |
`stop` | boolean | false |   |

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

___

###  findNodes

▸ **findNodes**(`startId`: string, `relationNames`: string[], `predicate`: function): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

*Defined in [GraphManagerService.ts:187](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L187)*

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

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

all node that validate the predicate

___

###  generateQRcode

▸ **generateQRcode**(`nodeId`: string): *string*

*Defined in [GraphManagerService.ts:201](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L201)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *string*

___

###  getChildren

▸ **getChildren**(`id`: string, `relationNames`: string[]): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

*Defined in [GraphManagerService.ts:302](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L302)*

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

*Defined in [GraphManagerService.ts:394](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L394)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |

**Returns:** *string[]*

___

###  getChildrenInContext

▸ **getChildrenInContext**(`parentId`: string, `contextId`: string): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)[]›*

*Defined in [GraphManagerService.ts:330](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L330)*

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

*Defined in [GraphManagerService.ts:611](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L611)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *SpinalContext‹any›*

___

###  getContextWithType

▸ **getContextWithType**(`type`: string): *any[]*

*Defined in [GraphManagerService.ts:626](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L626)*

Return all context with type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string |   |

**Returns:** *any[]*

___

###  getGraph

▸ **getGraph**(): *SpinalGraph‹any›*

*Defined in [GraphManagerService.ts:262](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L262)*

return the current graph

**Returns:** *SpinalGraph‹any›*

___

###  getInfo

▸ **getInfo**(`nodeId`: string): *[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)*

*Defined in [GraphManagerService.ts:353](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L353)*

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

*Defined in [GraphManagerService.ts:234](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L234)*

Return the information about the node with the given id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | of the wanted node |

**Returns:** *[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)*

___

###  getNodeAsync

▸ **getNodeAsync**(`id`: string): *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

*Defined in [GraphManagerService.ts:247](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L247)*

Return the information about the node with the given id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | of the wanted node |

**Returns:** *Promise‹[SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)›*

___

###  getNodeByType

▸ **getNodeByType**(`type`: string): *any[]*

*Defined in [GraphManagerService.ts:643](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L643)*

Retr

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string |   |

**Returns:** *any[]*

___

###  getNodes

▸ **getNodes**(): *object*

*Defined in [GraphManagerService.ts:215](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L215)*

Return all loaded Nodes

**`memberof`** GraphManagerService

**Returns:** *object*

* \[ **nodeId**: *string*\]: SpinalNode‹any›

___

###  getNodesInfo

▸ **getNodesInfo**(): *object*

*Defined in [GraphManagerService.ts:225](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L225)*

Return all loaded Nodes

**`memberof`** GraphManagerService

**Returns:** *object*

* \[ **nodeId**: *string*\]: [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)

___

###  getRealNode

▸ **getRealNode**(`id`: string): *SpinalNode‹any›*

*Defined in [GraphManagerService.ts:272](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L272)*

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

*Defined in [GraphManagerService.ts:285](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L285)*

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

*Defined in [GraphManagerService.ts:876](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L876)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | string |
`contextId` | string |

**Returns:** *boolean*

___

###  isChild

▸ **isChild**(`parentId`: string, `childId`: string, `linkRelationName`: string[]): *any*

*Defined in [GraphManagerService.ts:763](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L763)*

**Parameters:**

Name | Type |
------ | ------ |
`parentId` | string |
`childId` | string |
`linkRelationName` | string[] |

**Returns:** *any*

___

###  listenOnNodeAdded

▸ **listenOnNodeAdded**(`caller`: any, `callback`: [callback](undefined)): *boolean*

*Defined in [GraphManagerService.ts:406](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L406)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |
`callback` | [callback](undefined) |

**Returns:** *boolean*

___

###  listenOnNodeRemove

▸ **listenOnNodeRemove**(`caller`: any, `callback`: [callback](undefined)): *boolean*

*Defined in [GraphManagerService.ts:417](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L417)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |
`callback` | [callback](undefined) |

**Returns:** *boolean*

___

###  modifyNode

▸ **modifyNode**(`nodeId`: string, `info`: [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)): *boolean*

*Defined in [GraphManagerService.ts:446](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L446)*

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

*Defined in [GraphManagerService.ts:501](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L501)*

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

*Defined in [GraphManagerService.ts:528](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L528)*

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

*Defined in [GraphManagerService.ts:560](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L560)*

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

*Defined in [GraphManagerService.ts:662](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L662)*

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

*Defined in [GraphManagerService.ts:127](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L127)*

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

*Defined in [GraphManagerService.ts:112](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L112)*

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

*Defined in [GraphManagerService.ts:378](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L378)*

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

*Defined in [GraphManagerService.ts:427](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L427)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |

**Returns:** *boolean*

___

###  stopListeningOnNodeRemove

▸ **stopListeningOnNodeRemove**(`caller`: any): *boolean*

*Defined in [GraphManagerService.ts:436](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L436)*

**`memberof`** GraphManagerService

**Parameters:**

Name | Type |
------ | ------ |
`caller` | any |

**Returns:** *boolean*

___

###  waitForInitialization

▸ **waitForInitialization**(): *q.Promise‹SpinalGraph‹any››*

*Defined in [GraphManagerService.ts:146](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L146)*

**`memberof`** GraphManagerService

**Returns:** *q.Promise‹SpinalGraph‹any››*
