[spinal-env-viewer-graph-service](../README.md) / [Exports](../modules.md) / GraphManagerService

# Class: GraphManagerService

## Table of contents

### Constructors

- [constructor](GraphManagerService.md#constructor)

### Properties

- [bindedNode](GraphManagerService.md#bindednode)
- [binders](GraphManagerService.md#binders)
- [graph](GraphManagerService.md#graph)
- [initProm](GraphManagerService.md#initprom)
- [initialized](GraphManagerService.md#initialized)
- [listenerOnNodeRemove](GraphManagerService.md#listeneronnoderemove)
- [listenersOnNodeAdded](GraphManagerService.md#listenersonnodeadded)
- [nodes](GraphManagerService.md#nodes)
- [nodesInfo](GraphManagerService.md#nodesinfo)

### Methods

- [\_addNode](GraphManagerService.md#_addnode)
- [\_areAllChildrenLoaded](GraphManagerService.md#_areallchildrenloaded)
- [\_bindFunc](GraphManagerService.md#_bindfunc)
- [\_bindNode](GraphManagerService.md#_bindnode)
- [\_unBind](GraphManagerService.md#_unbind)
- [addChild](GraphManagerService.md#addchild)
- [addChildAndCreateNode](GraphManagerService.md#addchildandcreatenode)
- [addChildInContext](GraphManagerService.md#addchildincontext)
- [addContext](GraphManagerService.md#addcontext)
- [bindNode](GraphManagerService.md#bindnode)
- [browseAnClassifyByType](GraphManagerService.md#browseanclassifybytype)
- [browseAndClassifyByTypeInContext](GraphManagerService.md#browseandclassifybytypeincontext)
- [createNode](GraphManagerService.md#createnode)
- [findInContext](GraphManagerService.md#findincontext)
- [findInContextByType](GraphManagerService.md#findincontextbytype)
- [findNode](GraphManagerService.md#findnode)
- [findNodes](GraphManagerService.md#findnodes)
- [findNodesByType](GraphManagerService.md#findnodesbytype)
- [generateQRcode](GraphManagerService.md#generateqrcode)
- [getChildren](GraphManagerService.md#getchildren)
- [getChildrenIds](GraphManagerService.md#getchildrenids)
- [getChildrenInContext](GraphManagerService.md#getchildrenincontext)
- [getContext](GraphManagerService.md#getcontext)
- [getContextWithType](GraphManagerService.md#getcontextwithtype)
- [getGraph](GraphManagerService.md#getgraph)
- [getInfo](GraphManagerService.md#getinfo)
- [getNode](GraphManagerService.md#getnode)
- [getNodeAsync](GraphManagerService.md#getnodeasync)
- [getNodeByType](GraphManagerService.md#getnodebytype)
- [getNodes](GraphManagerService.md#getnodes)
- [getNodesInfo](GraphManagerService.md#getnodesinfo)
- [getParents](GraphManagerService.md#getparents)
- [getRealNode](GraphManagerService.md#getrealnode)
- [getRelationNames](GraphManagerService.md#getrelationnames)
- [hasChildInContext](GraphManagerService.md#haschildincontext)
- [haveChildId](GraphManagerService.md#havechildid)
- [isChild](GraphManagerService.md#ischild)
- [listenOnNodeAdded](GraphManagerService.md#listenonnodeadded)
- [listenOnNodeRemove](GraphManagerService.md#listenonnoderemove)
- [modifyNode](GraphManagerService.md#modifynode)
- [moveChild](GraphManagerService.md#movechild)
- [moveChildInContext](GraphManagerService.md#movechildincontext)
- [removeChild](GraphManagerService.md#removechild)
- [removeFromGraph](GraphManagerService.md#removefromgraph)
- [setGraph](GraphManagerService.md#setgraph)
- [setGraphFromForgeFile](GraphManagerService.md#setgraphfromforgefile)
- [setInfo](GraphManagerService.md#setinfo)
- [stopListeningOnNodeAdded](GraphManagerService.md#stoplisteningonnodeadded)
- [stopListeningOnNodeRemove](GraphManagerService.md#stoplisteningonnoderemove)
- [waitForInitialization](GraphManagerService.md#waitforinitialization)

## Constructors

### constructor

• **new GraphManagerService**(`viewerEnv?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `viewerEnv?` | `number` |  |

#### Defined in

[src/GraphManagerService.ts:67](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L67)

## Properties

### bindedNode

• **bindedNode**: `Map`<`string`, `Map`<`any`, `callback`\>\>

#### Defined in

[src/GraphManagerService.ts:55](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L55)

___

### binders

• **binders**: `Map`<`String`, `Process`\>

#### Defined in

[src/GraphManagerService.ts:56](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L56)

___

### graph

• **graph**: [`SpinalGraph`](SpinalGraph.md)<`any`\>

#### Defined in

[src/GraphManagerService.ts:62](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L62)

___

### initProm

• **initProm**: `Deferred`<[`SpinalGraph`](SpinalGraph.md)<`any`\>\>

#### Defined in

[src/GraphManagerService.ts:63](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L63)

___

### initialized

• **initialized**: `Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:59](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L59)

___

### listenerOnNodeRemove

• **listenerOnNodeRemove**: `Map`<`any`, `callback`\>

#### Defined in

[src/GraphManagerService.ts:58](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L58)

___

### listenersOnNodeAdded

• **listenersOnNodeAdded**: `Map`<`any`, `callback`\>

#### Defined in

[src/GraphManagerService.ts:57](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L57)

___

### nodes

• **nodes**: `Object`

#### Index signature

▪ [nodeId: `string`]: [`SpinalNode`](SpinalNode.md)<`any`\>

#### Defined in

[src/GraphManagerService.ts:60](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L60)

___

### nodesInfo

• **nodesInfo**: `Object`

#### Index signature

▪ [nodeId: `string`]: [`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)

#### Defined in

[src/GraphManagerService.ts:61](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L61)

## Methods

### \_addNode

▸ **_addNode**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SpinalNode`](SpinalNode.md)<`any`\> |

#### Returns

`void`

#### Defined in

[src/GraphManagerService.ts:1011](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1011)

___

### \_areAllChildrenLoaded

▸ `Private` **_areAllChildrenLoaded**(`nodeId`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeId` | `string` |  |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:1028](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1028)

___

### \_bindFunc

▸ `Private` **_bindFunc**(`nodeId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |

#### Returns

`void`

#### Defined in

[src/GraphManagerService.ts:1066](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1066)

___

### \_bindNode

▸ `Private` **_bindNode**(`nodeId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |

#### Returns

`void`

#### Defined in

[src/GraphManagerService.ts:1050](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1050)

___

### \_unBind

▸ `Private` **_unBind**(`nodeId`, `binder`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |
| `binder` | `any` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:1082](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1082)

___

### addChild

▸ **addChild**(`parentId`, `childId`, `relationName`, `relationType`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentId` | `string` |
| `childId` | `string` |
| `relationName` | `string` |
| `relationType` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:946](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L946)

___

### addChildAndCreateNode

▸ **addChildAndCreateNode**(`parentId`, `node`, `relationName`, `relationType`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentId` | `string` |  |
| `node` | [`SpinalNodeObject`](../interfaces/SpinalNodeObject.md) |  |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:977](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L977)

___

### addChildInContext

▸ **addChildInContext**(`parentId`, `childId`, `contextId`, `relationName`, `relationType`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentId` | `string` |
| `childId` | `string` |
| `contextId` | `string` |
| `relationName` | `string` |
| `relationType` | `string` |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Defined in

[src/GraphManagerService.ts:909](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L909)

___

### addContext

▸ **addContext**(`name`, `type?`, `elt?`): `Promise`<[`SpinalContext`](SpinalContext.md)<`any`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` |  |
| `type?` | `string` |  |
| `elt?` | `Model` |  |

#### Returns

`Promise`<[`SpinalContext`](SpinalContext.md)<`any`\>\>

#### Defined in

[src/GraphManagerService.ts:796](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L796)

___

### bindNode

▸ **bindNode**(`nodeId`, `caller`, `callback`): `Function`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeId` | `string` |  |
| `caller` | `any` |  |
| `callback` | `callback` |  |

#### Returns

`Function`

#### Defined in

[src/GraphManagerService.ts:636](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L636)

___

### browseAnClassifyByType

▸ **browseAnClassifyByType**(`startId`, `relationNames`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` |  |
| `relationNames` | `string`[] |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/GraphManagerService.ts:218](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L218)

___

### browseAndClassifyByTypeInContext

▸ **browseAndClassifyByTypeInContext**(`startId`, `contextId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` |  |
| `contextId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/GraphManagerService.ts:308](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L308)

___

### createNode

▸ **createNode**(`info`, `element?`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `info` | `Object` |  |
| `element?` | `Model` | - |

#### Returns

`string`

#### Defined in

[src/GraphManagerService.ts:881](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L881)

___

### findInContext

▸ **findInContext**(`startId`, `contextId`, `predicate?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `startId` | `string` | `undefined` |  |
| `contextId` | `string` | `undefined` |  |
| `predicate` | [`SpinalNodeFindPredicateFunc`](../modules.md#spinalnodefindpredicatefunc) | `DEFAULT_PREDICATE` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/GraphManagerService.ts:256](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L256)

___

### findInContextByType

▸ **findInContextByType**(`startId`, `contextId`, `nodeType`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` |  |
| `contextId` | `string` |  |
| `nodeType` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/GraphManagerService.ts:283](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L283)

___

### findNode

▸ **findNode**(`id`, `stop?`): `Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `string` | `undefined` |  |
| `stop` | `boolean` | `false` |  |

#### Returns

`Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)\>

#### Defined in

[src/GraphManagerService.ts:140](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L140)

___

### findNodes

▸ **findNodes**(`startId`, `relationNames`, `predicate`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` |  |
| `relationNames` | `string`[] |  |
| `predicate` | (`node`: `any`) => `boolean` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

[src/GraphManagerService.ts:173](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L173)

___

### findNodesByType

▸ **findNodesByType**(`startId`, `relationNames`, `nodeType`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` |  |
| `relationNames` | `string`[] |  |
| `nodeType` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/GraphManagerService.ts:198](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L198)

___

### generateQRcode

▸ **generateQRcode**(`nodeId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |

#### Returns

`string`

#### Defined in

[src/GraphManagerService.ts:336](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L336)

___

### getChildren

▸ **getChildren**(`id`, `relationNames?`): `Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `relationNames` | `string`[] | `[]` |

#### Returns

`Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)[]\>

#### Defined in

[src/GraphManagerService.ts:434](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L434)

___

### getChildrenIds

▸ **getChildrenIds**(`nodeId`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |

#### Returns

`string`[]

#### Defined in

[src/GraphManagerService.ts:554](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L554)

___

### getChildrenInContext

▸ **getChildrenInContext**(`parentId`, `contextId`): `Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentId` | `string` |  |
| `contextId` | `string` |  |

#### Returns

`Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)[]\>

#### Defined in

[src/GraphManagerService.ts:464](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L464)

___

### getContext

▸ **getContext**(`name`): [`SpinalContext`](SpinalContext.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`SpinalContext`](SpinalContext.md)<`any`\>

#### Defined in

[src/GraphManagerService.ts:812](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L812)

___

### getContextWithType

▸ **getContextWithType**(`type`): `any`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |

#### Returns

`any`[]

#### Defined in

[src/GraphManagerService.ts:827](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L827)

___

### getGraph

▸ **getGraph**(): [`SpinalGraph`](SpinalGraph.md)<`any`\>

#### Returns

[`SpinalGraph`](SpinalGraph.md)<`any`\>

#### Defined in

[src/GraphManagerService.ts:392](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L392)

___

### getInfo

▸ **getInfo**(`nodeId`): [`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |

#### Returns

[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)

#### Defined in

[src/GraphManagerService.ts:490](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L490)

___

### getNode

▸ **getNode**(`id`): [`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)

#### Defined in

[src/GraphManagerService.ts:368](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L368)

___

### getNodeAsync

▸ **getNodeAsync**(`id`): `Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`Promise`<[`SpinalNodeRef`](../interfaces/SpinalNodeRef.md)\>

#### Defined in

[src/GraphManagerService.ts:379](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L379)

___

### getNodeByType

▸ **getNodeByType**(`type`): `any`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` |  |

#### Returns

`any`[]

#### Defined in

[src/GraphManagerService.ts:844](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L844)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Defined in

[src/GraphManagerService.ts:350](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L350)

___

### getNodesInfo

▸ **getNodesInfo**(): `Object`

#### Returns

`Object`

#### Defined in

[src/GraphManagerService.ts:359](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L359)

___

### getParents

▸ **getParents**(`nodeId`, `relationNames`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeId` | `string` |  |
| `relationNames` | `string` \| `string`[] | - |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/GraphManagerService.ts:1124](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1124)

___

### getRealNode

▸ **getRealNode**(`id`): [`SpinalNode`](SpinalNode.md)<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

[`SpinalNode`](SpinalNode.md)<`any`\>

#### Defined in

[src/GraphManagerService.ts:402](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L402)

___

### getRelationNames

▸ **getRelationNames**(`id`): `string`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`string`[]

#### Defined in

[src/GraphManagerService.ts:415](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L415)

___

### hasChildInContext

▸ **hasChildInContext**(`nodeId`, `contextId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |
| `contextId` | `string` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:1098](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L1098)

___

### haveChildId

▸ **haveChildId**(`nodeId`, `searchId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |
| `searchId` | `string` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:156](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L156)

___

### isChild

▸ **isChild**(`parentId`, `childId`, `linkRelationName`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentId` | `string` |
| `childId` | `string` |
| `linkRelationName` | `string`[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:991](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L991)

___

### listenOnNodeAdded

▸ **listenOnNodeAdded**(`caller`, `callback`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `caller` | `any` |
| `callback` | `callback` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:566](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L566)

___

### listenOnNodeRemove

▸ **listenOnNodeRemove**(`caller`, `callback`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `caller` | `any` |
| `callback` | `callback` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:577](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L577)

___

### modifyNode

▸ **modifyNode**(`nodeId`, `info`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeId` | `string` |  |
| `info` | [`SpinalNodeRef`](../interfaces/SpinalNodeRef.md) |  |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:606](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L606)

___

### moveChild

▸ **moveChild**(`fromId`, `toId`, `childId`, `relationName`, `relationType`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromId` | `string` |
| `toId` | `string` |
| `childId` | `string` |
| `relationName` | `string` |
| `relationType` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:664](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L664)

___

### moveChildInContext

▸ **moveChildInContext**(`fromId`, `toId`, `childId`, `contextId`, `relationName`, `relationType`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromId` | `string` |
| `toId` | `string` |
| `childId` | `string` |
| `contextId` | `string` |
| `relationName` | `string` |
| `relationType` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:703](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L703)

___

### removeChild

▸ **removeChild**(`nodeId`, `childId`, `relationName`, `relationType`, `stop?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `nodeId` | `string` | `undefined` |
| `childId` | `string` | `undefined` |
| `relationName` | `string` | `undefined` |
| `relationType` | `string` | `undefined` |
| `stop` | `boolean` | `false` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/GraphManagerService.ts:744](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L744)

___

### removeFromGraph

▸ **removeFromGraph**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/GraphManagerService.ts:863](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L863)

___

### setGraph

▸ **setGraph**(`graph`): `Promise`<`String`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `graph` | [`SpinalGraph`](SpinalGraph.md)<`any`\> |

#### Returns

`Promise`<`String`\>

#### Defined in

[src/GraphManagerService.ts:112](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L112)

___

### setGraphFromForgeFile

▸ **setGraphFromForgeFile**(`forgeFile`): `Promise`<`String`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `forgeFile` | `Model` |

#### Returns

`Promise`<`String`\>

#### Defined in

[src/GraphManagerService.ts:96](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L96)

___

### setInfo

▸ **setInfo**(`nodeId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `string` |

#### Returns

`void`

#### Defined in

[src/GraphManagerService.ts:522](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L522)

___

### stopListeningOnNodeAdded

▸ **stopListeningOnNodeAdded**(`caller`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `caller` | `any` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:587](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L587)

___

### stopListeningOnNodeRemove

▸ **stopListeningOnNodeRemove**(`caller`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `caller` | `any` |

#### Returns

`boolean`

#### Defined in

[src/GraphManagerService.ts:596](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L596)

___

### waitForInitialization

▸ **waitForInitialization**(): `Promise`<[`SpinalGraph`](SpinalGraph.md)<`any`\>\>

#### Returns

`Promise`<[`SpinalGraph`](SpinalGraph.md)<`any`\>\>

#### Defined in

[src/GraphManagerService.ts:131](https://github.com/spinalcom/Spinal-Graph-Service/blob/858cd3c/src/GraphManagerService.ts#L131)
