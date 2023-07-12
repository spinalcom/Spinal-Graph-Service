[spinal-env-viewer-graph-service](../README.md) / [Exports](../modules.md) / SpinalNode

# Class: SpinalNode<T\>

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `Model` = `any` |  |

## Hierarchy

- `Model`

  ↳ **`SpinalNode`**

  ↳↳ [`SpinalContext`](SpinalContext.md)

  ↳↳ [`SpinalGraph`](SpinalGraph.md)

## Table of contents

### Constructors

- [constructor](SpinalNode.md#constructor)

### Properties

- [\_attribute\_names](SpinalNode.md#_attribute_names)
- [\_date\_last\_modification](SpinalNode.md#_date_last_modification)
- [\_getValidRelations](SpinalNode.md#_getvalidrelations)
- [\_parents](SpinalNode.md#_parents)
- [\_processes](SpinalNode.md#_processes)
- [\_server\_id](SpinalNode.md#_server_id)
- [children](SpinalNode.md#children)
- [contextIds](SpinalNode.md#contextids)
- [element](SpinalNode.md#element)
- [info](SpinalNode.md#info)
- [model\_id](SpinalNode.md#model_id)
- [parents](SpinalNode.md#parents)
- [sendEventFunc](SpinalNode.md#sendeventfunc)
- [\_constructorName](SpinalNode.md#_constructorname)

### Methods

- [\_addParent](SpinalNode.md#_addparent)
- [\_createRelation](SpinalNode.md#_createrelation)
- [\_getChildrenType](SpinalNode.md#_getchildrentype)
- [\_getRelation](SpinalNode.md#_getrelation)
- [\_get\_flat\_model\_map](SpinalNode.md#_get_flat_model_map)
- [\_get\_fs\_data](SpinalNode.md#_get_fs_data)
- [\_get\_state](SpinalNode.md#_get_state)
- [\_removeFromChildren](SpinalNode.md#_removefromchildren)
- [\_removeFromParents](SpinalNode.md#_removefromparents)
- [\_removeParent](SpinalNode.md#_removeparent)
- [\_set](SpinalNode.md#_set)
- [\_set\_state](SpinalNode.md#_set_state)
- [\_set\_state\_if\_same\_type](SpinalNode.md#_set_state_if_same_type)
- [\_signal\_change](SpinalNode.md#_signal_change)
- [addChild](SpinalNode.md#addchild)
- [addChildInContext](SpinalNode.md#addchildincontext)
- [addContextId](SpinalNode.md#addcontextid)
- [add\_attr](SpinalNode.md#add_attr)
- [belongsToContext](SpinalNode.md#belongstocontext)
- [bind](SpinalNode.md#bind)
- [browseAnClassifyByType](SpinalNode.md#browseanclassifybytype)
- [browseAndClassifyByTypeInContext](SpinalNode.md#browseandclassifybytypeincontext)
- [cosmetic\_attribute](SpinalNode.md#cosmetic_attribute)
- [deep\_copy](SpinalNode.md#deep_copy)
- [destructor](SpinalNode.md#destructor)
- [dim](SpinalNode.md#dim)
- [equals](SpinalNode.md#equals)
- [find](SpinalNode.md#find)
- [findAsyncPredicate](SpinalNode.md#findasyncpredicate)
- [findByType](SpinalNode.md#findbytype)
- [findInContext](SpinalNode.md#findincontext)
- [findInContextAsyncPredicate](SpinalNode.md#findincontextasyncpredicate)
- [findInContextByType](SpinalNode.md#findincontextbytype)
- [findOneParent](SpinalNode.md#findoneparent)
- [findParents](SpinalNode.md#findparents)
- [findParentsInContext](SpinalNode.md#findparentsincontext)
- [forEach](SpinalNode.md#foreach)
- [forEachInContext](SpinalNode.md#foreachincontext)
- [get](SpinalNode.md#get)
- [getChild](SpinalNode.md#getchild)
- [getChildren](SpinalNode.md#getchildren)
- [getChildrenIds](SpinalNode.md#getchildrenids)
- [getChildrenInContext](SpinalNode.md#getchildrenincontext)
- [getContextIds](SpinalNode.md#getcontextids)
- [getDirectModificationDate](SpinalNode.md#getdirectmodificationdate)
- [getElement](SpinalNode.md#getelement)
- [getId](SpinalNode.md#getid)
- [getIndirectModificationDate](SpinalNode.md#getindirectmodificationdate)
- [getName](SpinalNode.md#getname)
- [getNbChildren](SpinalNode.md#getnbchildren)
- [getParents](SpinalNode.md#getparents)
- [getParentsInContext](SpinalNode.md#getparentsincontext)
- [getRelationNames](SpinalNode.md#getrelationnames)
- [getType](SpinalNode.md#gettype)
- [get\_parents\_that\_check](SpinalNode.md#get_parents_that_check)
- [get\_state](SpinalNode.md#get_state)
- [hasRelation](SpinalNode.md#hasrelation)
- [hasRelations](SpinalNode.md#hasrelations)
- [has\_been\_directly\_modified](SpinalNode.md#has_been_directly_modified)
- [has\_been\_modified](SpinalNode.md#has_been_modified)
- [map](SpinalNode.md#map)
- [mapInContext](SpinalNode.md#mapincontext)
- [mod\_attr](SpinalNode.md#mod_attr)
- [real\_change](SpinalNode.md#real_change)
- [rem\_attr](SpinalNode.md#rem_attr)
- [removeChild](SpinalNode.md#removechild)
- [removeChildren](SpinalNode.md#removechildren)
- [removeContextId](SpinalNode.md#removecontextid)
- [removeFromGraph](SpinalNode.md#removefromgraph)
- [removeRelation](SpinalNode.md#removerelation)
- [set](SpinalNode.md#set)
- [setDirectModificationDate](SpinalNode.md#setdirectmodificationdate)
- [setIndirectModificationDate](SpinalNode.md#setindirectmodificationdate)
- [set\_attr](SpinalNode.md#set_attr)
- [set\_state](SpinalNode.md#set_state)
- [size](SpinalNode.md#size)
- [unbind](SpinalNode.md#unbind)
- [visitChildren](SpinalNode.md#visitchildren)
- [visitChildrenInContext](SpinalNode.md#visitchildrenincontext)
- [visitParents](SpinalNode.md#visitparents)
- [visitParentsInContext](SpinalNode.md#visitparentsincontext)

## Constructors

### constructor

• **new SpinalNode**<`T`\>(`name?`, `type?`, `element?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Model`<`T`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |
| `type?` | `string` |
| `element?` | `T` |

#### Overrides

Model.constructor

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:34

## Properties

### \_attribute\_names

• **\_attribute\_names**: `string`[]

#### Inherited from

Model.\_attribute\_names

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:19

___

### \_date\_last\_modification

• **\_date\_last\_modification**: `number`

#### Inherited from

Model.\_date\_last\_modification

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:44

___

### \_getValidRelations

• `Private` **\_getValidRelations**: `any`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:462

___

### \_parents

• **\_parents**: `Model`[]

#### Inherited from

Model.\_parents

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:37

___

### \_processes

• **\_processes**: `Process`[]

#### Inherited from

Model.\_processes

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:31

___

### \_server\_id

• `Optional` **\_server\_id**: `number`

#### Inherited from

Model.\_server\_id

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:51

___

### children

• **children**: [`SpinalMap`](SpinalMap.md)<[`SpinalMap`](SpinalMap.md)<`AnySpinalRelation`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:22

___

### contextIds

• **contextIds**: [`SpinalSet`](SpinalSet.md)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:24

___

### element

• `Optional` **element**: [`SpinalNodePointer`](SpinalNodePointer.md)<`T`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:23

___

### info

• **info**: `SpinalNodeInfoModel`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:20

___

### model\_id

• **model\_id**: `number`

#### Inherited from

Model.model\_id

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:25

___

### parents

• **parents**: [`SpinalMap`](SpinalMap.md)<`Lst`<[`SpinalNodePointer`](SpinalNodePointer.md)<`AnySpinalRelation`\>\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:21

___

### sendEventFunc

• `Private` **sendEventFunc**: `any`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:463

___

### \_constructorName

▪ `Static` **\_constructorName**: `string`

#### Inherited from

Model.\_constructorName

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:13

## Methods

### \_addParent

▸ `Protected` **_addParent**(`relation`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relation` | `AnySpinalRelation` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:441

___

### \_createRelation

▸ `Protected` **_createRelation**(`relationName`, `relationType`): `AnySpinalRelation`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`AnySpinalRelation`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:448

___

### \_getChildrenType

▸ `Private` **_getChildrenType**(`relationType`): [`SpinalMap`](SpinalMap.md)<`AnySpinalRelation`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationType` | `string` |  |

#### Returns

[`SpinalMap`](SpinalMap.md)<`AnySpinalRelation`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:416

___

### \_getRelation

▸ `Protected` **_getRelation**(`relationName`, `relationType`): `AnySpinalRelation`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`AnySpinalRelation`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:424

___

### \_get\_flat\_model\_map

▸ `Protected` **_get_flat_model_map**(`map`, `date`): `IFlatModelMap`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `IFlatModelMap` |
| `date` | `number` |

#### Returns

`IFlatModelMap`

#### Inherited from

Model.\_get\_flat\_model\_map

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:289

___

### \_get\_fs\_data

▸ **_get_fs_data**(`out`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `out` | `IFsData` |

#### Returns

`void`

#### Inherited from

Model.\_get\_fs\_data

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:235

___

### \_get\_state

▸ `Protected` **_get_state**(): `string`

#### Returns

`string`

#### Inherited from

Model.\_get\_state

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:228

___

### \_removeFromChildren

▸ `Protected` **_removeFromChildren**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:454

___

### \_removeFromParents

▸ `Protected` **_removeFromParents**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:435

___

### \_removeParent

▸ `Protected` **_removeParent**(`relation`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relation` | `AnySpinalRelation` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:430

___

### \_set

▸ `Protected` **_set**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Inherited from

Model.\_set

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:245

___

### \_set\_state

▸ **_set_state**(`str`, `map`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `map` | `IStateMap`<`Model`\> |

#### Returns

`void`

#### Inherited from

Model.\_set\_state

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:261

___

### \_set\_state\_if\_same\_type

▸ `Protected` **_set_state_if_same_type**(`mid`, `map`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mid` | `string` |
| `map` | `IStateMap`<`Model`\> |

#### Returns

`boolean`

#### Inherited from

Model.\_set\_state\_if\_same\_type

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:280

___

### \_signal\_change

▸ `Protected` **_signal_change**(`change_level?`): `Timeout`

#### Parameters

| Name | Type |
| :------ | :------ |
| `change_level?` | `number` |

#### Returns

`Timeout`

#### Inherited from

Model.\_signal\_change

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:254

___

### addChild

▸ **addChild**<`K`\>(`child`, `relationName`, `relationType`): `Promise`<[`SpinalNode`](SpinalNode.md)<`K`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `Model`<`K`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `K` \| [`SpinalNode`](SpinalNode.md)<`K`\> |  |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`K`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:150

___

### addChildInContext

▸ **addChildInContext**<`K`\>(`child`, `relationName`, `relationType`, `context`): `Promise`<[`SpinalNode`](SpinalNode.md)<`K`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `Model`<`K`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `K` \| [`SpinalNode`](SpinalNode.md)<`K`\> |  |
| `relationName` | `string` |  |
| `relationType` | `string` |  |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`K`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:163

___

### addContextId

▸ **addContextId**(`id`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:96

___

### add\_attr

▸ **add_attr**(`object`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `Object` |

#### Returns

`void`

#### Inherited from

Model.add\_attr

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:135

▸ **add_attr**(`name`, `instanceOfModel?`, `signal_change?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `instanceOfModel?` | `any` |
| `signal_change?` | `boolean` |

#### Returns

`void`

#### Inherited from

Model.add\_attr

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:151

___

### belongsToContext

▸ **belongsToContext**(`context`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |

#### Returns

`boolean`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:114

___

### bind

▸ **bind**(`f`, `onchange_construction?`): `Process`

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | `Process` \| `BindProcess` \| `SpinalOnChangeBindModel` |
| `onchange_construction?` | `boolean` |

#### Returns

`Process`

#### Inherited from

Model.bind

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:90

___

### browseAnClassifyByType

▸ **browseAnClassifyByType**(`relationNames`): `Promise`<{ `data`: { `[type: string]`: [`SpinalNode`](SpinalNode.md)<`any`\>[];  } ; `types`: `string`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames` | `string` \| `string`[] |  |

#### Returns

`Promise`<{ `data`: { `[type: string]`: [`SpinalNode`](SpinalNode.md)<`any`\>[];  } ; `types`: `string`[]  }\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:307

___

### browseAndClassifyByTypeInContext

▸ **browseAndClassifyByTypeInContext**(`context`): `Promise`<{ `data`: { `[type: string]`: [`SpinalNode`](SpinalNode.md)<`any`\>[];  } ; `types`: `string`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |

#### Returns

`Promise`<{ `data`: { `[type: string]`: [`SpinalNode`](SpinalNode.md)<`any`\>[];  } ; `types`: `string`[]  }\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:339

___

### cosmetic\_attribute

▸ **cosmetic_attribute**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Inherited from

Model.cosmetic\_attribute

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:222

___

### deep\_copy

▸ **deep_copy**(): `Model`

#### Returns

`Model`

#### Inherited from

Model.deep\_copy

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:209

___

### destructor

▸ **destructor**(): `void`

#### Returns

`void`

#### Inherited from

Model.destructor

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:64

___

### dim

▸ **dim**(`_for_display?`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_for_display?` | `number` |

#### Returns

`number`

#### Inherited from

Model.dim

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:191

___

### equals

▸ **equals**(`m`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `m` | `Model` |

#### Returns

`boolean`

#### Inherited from

Model.equals

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:197

___

### find

▸ **find**(`relationNames`, `predicate?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames` | `RelationSearch` |  |
| `predicate?` | `SpinalNodeFindPredicateFunc` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:273

___

### findAsyncPredicate

▸ **findAsyncPredicate**(`relations`, `predicate`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relations` | `RelationSearch` |
| `predicate` | (`node`: [`SpinalNode`](SpinalNode.md)<`any`\>, `stopFct?`: () => `void`) => `Promise`<`boolean`\> |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:280

___

### findByType

▸ **findByType**(`relationNames`, `nodeType`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames` | `string` \| `string`[] |  |
| `nodeType` | `string` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:297

___

### findInContext

▸ **findInContext**(`context`, `predicate?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |
| `predicate?` | `SpinalNodeFindPredicateFunc` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:321

___

### findInContextAsyncPredicate

▸ **findInContextAsyncPredicate**(`context`, `predicate`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |
| `predicate` | (`node`: [`SpinalNode`](SpinalNode.md)<`any`\>, `stopFct?`: () => `void`) => `Promise`<`boolean`\> |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:287

___

### findInContextByType

▸ **findInContextByType**(`context`, `nodeType`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |
| `nodeType` | `string` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:330

___

### findOneParent

▸ **findOneParent**(`relationNames?`, `predicate?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames?` | `string` \| `RegExp` \| (`string` \| `RegExp`)[] |  |
| `predicate?` | `SpinalNodeFindOnePredicateFunc` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:253

___

### findParents

▸ **findParents**(`relationNames?`, `predicate?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationNames?` | `string` \| `RegExp` \| (`string` \| `RegExp`)[] |
| `predicate?` | `SpinalNodeFindPredicateFunc` |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:261

___

### findParentsInContext

▸ **findParentsInContext**(`context`, `predicate?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |
| `predicate?` | `SpinalNodeFindPredicateFunc` |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:262

___

### forEach

▸ **forEach**(`relationNames`, `callback`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames` | `string` \| `string`[] |  |
| `callback` | `SpinalNodeForEachFunc` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:353

___

### forEachInContext

▸ **forEachInContext**(`context`, `callback`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |
| `callback` | `SpinalNodeForEachFunc` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:361

___

### get

▸ **get**(): `any`

#### Returns

`any`

#### Inherited from

Model.get

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:106

___

### getChild

▸ **getChild**(`predicate`, `relationName`, `relationType`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | `SpinalNodeFindPredicateFunc` |  |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:221

___

### getChildren

▸ **getChildren**(`relationNames?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationNames?` | `string` \| `RegExp` \| (`string` \| `RegExp`)[] |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:230

___

### getChildrenIds

▸ **getChildrenIds**(): `string`[]

#### Returns

`string`[]

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:85

___

### getChildrenInContext

▸ **getChildrenInContext**(`context`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:237

___

### getContextIds

▸ **getContextIds**(): `string`[]

#### Returns

`string`[]

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:107

___

### getDirectModificationDate

▸ **getDirectModificationDate**(): `Val`

#### Returns

`Val`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:54

___

### getElement

▸ **getElement**(`noCreate?`): `Promise`<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `noCreate?` | `boolean` |

#### Returns

`Promise`<`T`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:80

___

### getId

▸ **getId**(): `Str`

#### Returns

`Str`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:39

___

### getIndirectModificationDate

▸ **getIndirectModificationDate**(): `Val`

#### Returns

`Val`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:59

___

### getName

▸ **getName**(): `Str`

#### Returns

`Str`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:44

___

### getNbChildren

▸ **getNbChildren**(): `number`

#### Returns

`number`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:90

___

### getParents

▸ **getParents**(`relationNames?`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationNames?` | `string` \| `RegExp` \| (`string` \| `RegExp`)[] |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:246

___

### getParentsInContext

▸ **getParentsInContext**(`context`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:247

___

### getRelationNames

▸ **getRelationNames**(): `string`[]

#### Returns

`string`[]

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:139

___

### getType

▸ **getType**(): `Str`

#### Returns

`Str`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:49

___

### get\_parents\_that\_check

▸ **get_parents_that_check**(`func_to_check`): `Model`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `func_to_check` | (`model`: `Model`) => `boolean` |

#### Returns

`Model`[]

#### Inherited from

Model.get\_parents\_that\_check

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:204

___

### get\_state

▸ **get_state**(`date?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date?` | `number` |

#### Returns

`string`

#### Inherited from

Model.get\_state

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:129

___

### hasRelation

▸ **hasRelation**(`relationName`, `relationType?`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationName` | `string` |  |
| `relationType?` | `string` | - |

#### Returns

`boolean`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:123

___

### hasRelations

▸ **hasRelations**(`relationNames`, `relationType?`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames` | `string`[] |  |
| `relationType?` | `string` |  |

#### Returns

`boolean`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:134

___

### has\_been\_directly\_modified

▸ **has_been_directly_modified**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Model.has\_been\_directly\_modified

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:77

___

### has\_been\_modified

▸ **has_been_modified**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Model.has\_been\_modified

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:70

___

### map

▸ **map**<`T`\>(`relationNames`, `callback`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationNames` | `string` \| `string`[] |  |
| `callback` | `SpinalNodeMapFunc`<`T`\> |  |

#### Returns

`Promise`<`T`[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:373

___

### mapInContext

▸ **mapInContext**<`T`\>(`context`, `callback`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |  |
| `callback` | `SpinalNodeMapFunc`<`T`\> |  |

#### Returns

`Promise`<`T`[]\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:385

___

### mod\_attr

▸ **mod_attr**(`name`, `instanceOfModel`, `signal_change?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `instanceOfModel` | `any` |
| `signal_change?` | `boolean` |

#### Returns

`void`

#### Inherited from

Model.mod\_attr

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:167

___

### real\_change

▸ **real_change**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Model.real\_change

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:215

___

### rem\_attr

▸ **rem_attr**(`name`, `signal_change?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `signal_change?` | `boolean` |

#### Returns

`void`

#### Inherited from

Model.rem\_attr

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:158

___

### removeChild

▸ **removeChild**(`node`, `relationName`, `relationType`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`SpinalNode`](SpinalNode.md)<`any`\> |  |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:175

___

### removeChildren

▸ **removeChildren**(`nodes`, `relationName`, `relationType`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | [`SpinalNode`](SpinalNode.md)<`any`\>[] |  |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:189

___

### removeContextId

▸ **removeContextId**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:102

___

### removeFromGraph

▸ **removeFromGraph**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:207

___

### removeRelation

▸ **removeRelation**(`relationName`, `relationType`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relationName` | `string` |  |
| `relationType` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:199

___

### set

▸ **set**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Inherited from

Model.set

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:116

___

### setDirectModificationDate

▸ **setDirectModificationDate**(`date?`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date?` | `number` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:73

___

### setIndirectModificationDate

▸ **setIndirectModificationDate**(`date?`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date?` | `number` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:66

___

### set\_attr

▸ **set_attr**(`instanceOfModel`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceOfModel` | `Object` |

#### Returns

`void`

#### Inherited from

Model.set\_attr

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:174

___

### set\_state

▸ **set_state**(`str`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`void`

#### Inherited from

Model.set\_state

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:122

___

### size

▸ **size**(`_for_display?`): `number` \| `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `_for_display?` | `number` |

#### Returns

`number` \| `number`[]

#### Inherited from

Model.size

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:184

___

### unbind

▸ **unbind**(`f`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | `Function` \| `Process` \| `BindProcess` |  |

#### Returns

`void`

#### Inherited from

Model.unbind

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:95

___

### visitChildren

▸ **visitChildren**(`relationNames`): `AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationNames` | `RelationSearch` |

#### Returns

`AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:403

___

### visitChildrenInContext

▸ **visitChildrenInContext**(`context`): `AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |

#### Returns

`AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:409

___

### visitParents

▸ **visitParents**(`relationNames`): `AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationNames` | `RelationSearch` |

#### Returns

`AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:391

___

### visitParentsInContext

▸ **visitParentsInContext**(`context`): `AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`any`\> |

#### Returns

`AsyncGenerator`<[`SpinalNode`](SpinalNode.md)<`any`\>, `void`, `void`\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:397
