[spinal-env-viewer-graph-service](../README.md) / [Exports](../modules.md) / SpinalGraph

# Class: SpinalGraph<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Model` = `any` |

## Hierarchy

- [`SpinalNode`](SpinalNode.md)<`T`\>

  ↳ **`SpinalGraph`**

## Table of contents

### Constructors

- [constructor](SpinalGraph.md#constructor)

### Properties

- [\_attribute\_names](SpinalGraph.md#_attribute_names)
- [\_date\_last\_modification](SpinalGraph.md#_date_last_modification)
- [\_parents](SpinalGraph.md#_parents)
- [\_processes](SpinalGraph.md#_processes)
- [\_server\_id](SpinalGraph.md#_server_id)
- [children](SpinalGraph.md#children)
- [contextIds](SpinalGraph.md#contextids)
- [element](SpinalGraph.md#element)
- [info](SpinalGraph.md#info)
- [model\_id](SpinalGraph.md#model_id)
- [parents](SpinalGraph.md#parents)
- [\_constructorName](SpinalGraph.md#_constructorname)

### Methods

- [\_addParent](SpinalGraph.md#_addparent)
- [\_createRelation](SpinalGraph.md#_createrelation)
- [\_getChildrenType](SpinalGraph.md#_getchildrentype)
- [\_getRelation](SpinalGraph.md#_getrelation)
- [\_get\_flat\_model\_map](SpinalGraph.md#_get_flat_model_map)
- [\_get\_fs\_data](SpinalGraph.md#_get_fs_data)
- [\_get\_state](SpinalGraph.md#_get_state)
- [\_removeFromChildren](SpinalGraph.md#_removefromchildren)
- [\_removeFromParents](SpinalGraph.md#_removefromparents)
- [\_removeParent](SpinalGraph.md#_removeparent)
- [\_set](SpinalGraph.md#_set)
- [\_set\_state](SpinalGraph.md#_set_state)
- [\_set\_state\_if\_same\_type](SpinalGraph.md#_set_state_if_same_type)
- [\_signal\_change](SpinalGraph.md#_signal_change)
- [addChild](SpinalGraph.md#addchild)
- [addChildInContext](SpinalGraph.md#addchildincontext)
- [addContext](SpinalGraph.md#addcontext)
- [addContextId](SpinalGraph.md#addcontextid)
- [add\_attr](SpinalGraph.md#add_attr)
- [belongsToContext](SpinalGraph.md#belongstocontext)
- [bind](SpinalGraph.md#bind)
- [browseAnClassifyByType](SpinalGraph.md#browseanclassifybytype)
- [browseAndClassifyByTypeInContext](SpinalGraph.md#browseandclassifybytypeincontext)
- [cosmetic\_attribute](SpinalGraph.md#cosmetic_attribute)
- [deep\_copy](SpinalGraph.md#deep_copy)
- [destructor](SpinalGraph.md#destructor)
- [dim](SpinalGraph.md#dim)
- [equals](SpinalGraph.md#equals)
- [find](SpinalGraph.md#find)
- [findAsyncPredicate](SpinalGraph.md#findasyncpredicate)
- [findByType](SpinalGraph.md#findbytype)
- [findInContext](SpinalGraph.md#findincontext)
- [findInContextAsyncPredicate](SpinalGraph.md#findincontextasyncpredicate)
- [findInContextByType](SpinalGraph.md#findincontextbytype)
- [findOneParent](SpinalGraph.md#findoneparent)
- [findParents](SpinalGraph.md#findparents)
- [findParentsInContext](SpinalGraph.md#findparentsincontext)
- [forEach](SpinalGraph.md#foreach)
- [forEachInContext](SpinalGraph.md#foreachincontext)
- [get](SpinalGraph.md#get)
- [getChild](SpinalGraph.md#getchild)
- [getChildren](SpinalGraph.md#getchildren)
- [getChildrenIds](SpinalGraph.md#getchildrenids)
- [getChildrenInContext](SpinalGraph.md#getchildrenincontext)
- [getContext](SpinalGraph.md#getcontext)
- [getContextIds](SpinalGraph.md#getcontextids)
- [getDirectModificationDate](SpinalGraph.md#getdirectmodificationdate)
- [getElement](SpinalGraph.md#getelement)
- [getId](SpinalGraph.md#getid)
- [getIndirectModificationDate](SpinalGraph.md#getindirectmodificationdate)
- [getName](SpinalGraph.md#getname)
- [getNbChildren](SpinalGraph.md#getnbchildren)
- [getParents](SpinalGraph.md#getparents)
- [getParentsInContext](SpinalGraph.md#getparentsincontext)
- [getRelationNames](SpinalGraph.md#getrelationnames)
- [getType](SpinalGraph.md#gettype)
- [get\_parents\_that\_check](SpinalGraph.md#get_parents_that_check)
- [get\_state](SpinalGraph.md#get_state)
- [hasRelation](SpinalGraph.md#hasrelation)
- [hasRelations](SpinalGraph.md#hasrelations)
- [has\_been\_directly\_modified](SpinalGraph.md#has_been_directly_modified)
- [has\_been\_modified](SpinalGraph.md#has_been_modified)
- [map](SpinalGraph.md#map)
- [mapInContext](SpinalGraph.md#mapincontext)
- [mod\_attr](SpinalGraph.md#mod_attr)
- [real\_change](SpinalGraph.md#real_change)
- [rem\_attr](SpinalGraph.md#rem_attr)
- [removeChild](SpinalGraph.md#removechild)
- [removeChildren](SpinalGraph.md#removechildren)
- [removeContextId](SpinalGraph.md#removecontextid)
- [removeFromGraph](SpinalGraph.md#removefromgraph)
- [removeRelation](SpinalGraph.md#removerelation)
- [set](SpinalGraph.md#set)
- [setDirectModificationDate](SpinalGraph.md#setdirectmodificationdate)
- [setIndirectModificationDate](SpinalGraph.md#setindirectmodificationdate)
- [set\_attr](SpinalGraph.md#set_attr)
- [set\_state](SpinalGraph.md#set_state)
- [size](SpinalGraph.md#size)
- [unbind](SpinalGraph.md#unbind)
- [visitChildren](SpinalGraph.md#visitchildren)
- [visitChildrenInContext](SpinalGraph.md#visitchildrenincontext)
- [visitParents](SpinalGraph.md#visitparents)
- [visitParentsInContext](SpinalGraph.md#visitparentsincontext)

## Constructors

### constructor

• **new SpinalGraph**<`T`\>(`name?`, `type?`, `element?`)

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

[SpinalNode](SpinalNode.md).[constructor](SpinalNode.md#constructor)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalGraph.d.ts:16

## Properties

### \_attribute\_names

• **\_attribute\_names**: `string`[]

#### Inherited from

[SpinalNode](SpinalNode.md).[_attribute_names](SpinalNode.md#_attribute_names)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:19

___

### \_date\_last\_modification

• **\_date\_last\_modification**: `number`

#### Inherited from

[SpinalNode](SpinalNode.md).[_date_last_modification](SpinalNode.md#_date_last_modification)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:44

___

### \_parents

• **\_parents**: `Model`[]

#### Inherited from

[SpinalNode](SpinalNode.md).[_parents](SpinalNode.md#_parents)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:37

___

### \_processes

• **\_processes**: `Process`[]

#### Inherited from

[SpinalNode](SpinalNode.md).[_processes](SpinalNode.md#_processes)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:31

___

### \_server\_id

• `Optional` **\_server\_id**: `number`

#### Inherited from

[SpinalNode](SpinalNode.md).[_server_id](SpinalNode.md#_server_id)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:51

___

### children

• **children**: [`SpinalMap`](SpinalMap.md)<[`SpinalMap`](SpinalMap.md)<`AnySpinalRelation`\>\>

#### Inherited from

[SpinalNode](SpinalNode.md).[children](SpinalNode.md#children)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:22

___

### contextIds

• **contextIds**: [`SpinalSet`](SpinalSet.md)

#### Inherited from

[SpinalNode](SpinalNode.md).[contextIds](SpinalNode.md#contextids)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:24

___

### element

• `Optional` **element**: [`SpinalNodePointer`](SpinalNodePointer.md)<`T`\>

#### Inherited from

[SpinalNode](SpinalNode.md).[element](SpinalNode.md#element)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:23

___

### info

• **info**: `SpinalNodeInfoModel`

#### Inherited from

[SpinalNode](SpinalNode.md).[info](SpinalNode.md#info)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:20

___

### model\_id

• **model\_id**: `number`

#### Inherited from

[SpinalNode](SpinalNode.md).[model_id](SpinalNode.md#model_id)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:25

___

### parents

• **parents**: [`SpinalMap`](SpinalMap.md)<`Lst`<[`SpinalNodePointer`](SpinalNodePointer.md)<`AnySpinalRelation`\>\>\>

#### Inherited from

[SpinalNode](SpinalNode.md).[parents](SpinalNode.md#parents)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:21

___

### \_constructorName

▪ `Static` **\_constructorName**: `string`

#### Inherited from

[SpinalNode](SpinalNode.md).[_constructorName](SpinalNode.md#_constructorname)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[_addParent](SpinalNode.md#_addparent)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[_createRelation](SpinalNode.md#_createrelation)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[_getChildrenType](SpinalNode.md#_getchildrentype)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[_getRelation](SpinalNode.md#_getrelation)

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

[SpinalNode](SpinalNode.md).[_get_flat_model_map](SpinalNode.md#_get_flat_model_map)

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

[SpinalNode](SpinalNode.md).[_get_fs_data](SpinalNode.md#_get_fs_data)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:235

___

### \_get\_state

▸ `Protected` **_get_state**(): `string`

#### Returns

`string`

#### Inherited from

[SpinalNode](SpinalNode.md).[_get_state](SpinalNode.md#_get_state)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:228

___

### \_removeFromChildren

▸ `Protected` **_removeFromChildren**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[SpinalNode](SpinalNode.md).[_removeFromChildren](SpinalNode.md#_removefromchildren)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:454

___

### \_removeFromParents

▸ `Protected` **_removeFromParents**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[SpinalNode](SpinalNode.md).[_removeFromParents](SpinalNode.md#_removefromparents)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[_removeParent](SpinalNode.md#_removeparent)

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

[SpinalNode](SpinalNode.md).[_set](SpinalNode.md#_set)

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

[SpinalNode](SpinalNode.md).[_set_state](SpinalNode.md#_set_state)

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

[SpinalNode](SpinalNode.md).[_set_state_if_same_type](SpinalNode.md#_set_state_if_same_type)

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

[SpinalNode](SpinalNode.md).[_signal_change](SpinalNode.md#_signal_change)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[addChild](SpinalNode.md#addchild)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[addChildInContext](SpinalNode.md#addchildincontext)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:163

___

### addContext

▸ **addContext**<`K`\>(`context`): `Promise`<[`SpinalContext`](SpinalContext.md)<`K`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `Model`<`K`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`SpinalContext`](SpinalContext.md)<`K`\> |  |

#### Returns

`Promise`<[`SpinalContext`](SpinalContext.md)<`K`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalGraph.d.ts:23

___

### addContextId

▸ **addContextId**(`id`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`void`

#### Inherited from

[SpinalNode](SpinalNode.md).[addContextId](SpinalNode.md#addcontextid)

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

[SpinalNode](SpinalNode.md).[add_attr](SpinalNode.md#add_attr)

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

[SpinalNode](SpinalNode.md).[add_attr](SpinalNode.md#add_attr)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[belongsToContext](SpinalNode.md#belongstocontext)

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

[SpinalNode](SpinalNode.md).[bind](SpinalNode.md#bind)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[browseAnClassifyByType](SpinalNode.md#browseanclassifybytype)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[browseAndClassifyByTypeInContext](SpinalNode.md#browseandclassifybytypeincontext)

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

[SpinalNode](SpinalNode.md).[cosmetic_attribute](SpinalNode.md#cosmetic_attribute)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:222

___

### deep\_copy

▸ **deep_copy**(): `Model`

#### Returns

`Model`

#### Inherited from

[SpinalNode](SpinalNode.md).[deep_copy](SpinalNode.md#deep_copy)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:209

___

### destructor

▸ **destructor**(): `void`

#### Returns

`void`

#### Inherited from

[SpinalNode](SpinalNode.md).[destructor](SpinalNode.md#destructor)

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

[SpinalNode](SpinalNode.md).[dim](SpinalNode.md#dim)

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

[SpinalNode](SpinalNode.md).[equals](SpinalNode.md#equals)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[find](SpinalNode.md#find)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findAsyncPredicate](SpinalNode.md#findasyncpredicate)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findByType](SpinalNode.md#findbytype)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findInContext](SpinalNode.md#findincontext)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findInContextAsyncPredicate](SpinalNode.md#findincontextasyncpredicate)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findInContextByType](SpinalNode.md#findincontextbytype)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findOneParent](SpinalNode.md#findoneparent)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findParents](SpinalNode.md#findparents)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[findParentsInContext](SpinalNode.md#findparentsincontext)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[forEach](SpinalNode.md#foreach)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[forEachInContext](SpinalNode.md#foreachincontext)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:361

___

### get

▸ **get**(): `any`

#### Returns

`any`

#### Inherited from

[SpinalNode](SpinalNode.md).[get](SpinalNode.md#get)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[getChild](SpinalNode.md#getchild)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[getChildren](SpinalNode.md#getchildren)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:230

___

### getChildrenIds

▸ **getChildrenIds**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[SpinalNode](SpinalNode.md).[getChildrenIds](SpinalNode.md#getchildrenids)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[getChildrenInContext](SpinalNode.md#getchildrenincontext)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:237

___

### getContext

▸ **getContext**(`name`): `Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `any` |  |

#### Returns

`Promise`<[`SpinalNode`](SpinalNode.md)<`any`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalGraph.d.ts:30

___

### getContextIds

▸ **getContextIds**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[SpinalNode](SpinalNode.md).[getContextIds](SpinalNode.md#getcontextids)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:107

___

### getDirectModificationDate

▸ **getDirectModificationDate**(): `Val`

#### Returns

`Val`

#### Inherited from

[SpinalNode](SpinalNode.md).[getDirectModificationDate](SpinalNode.md#getdirectmodificationdate)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[getElement](SpinalNode.md#getelement)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:80

___

### getId

▸ **getId**(): `Str`

#### Returns

`Str`

#### Inherited from

[SpinalNode](SpinalNode.md).[getId](SpinalNode.md#getid)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:39

___

### getIndirectModificationDate

▸ **getIndirectModificationDate**(): `Val`

#### Returns

`Val`

#### Inherited from

[SpinalNode](SpinalNode.md).[getIndirectModificationDate](SpinalNode.md#getindirectmodificationdate)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:59

___

### getName

▸ **getName**(): `Str`

#### Returns

`Str`

#### Inherited from

[SpinalNode](SpinalNode.md).[getName](SpinalNode.md#getname)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:44

___

### getNbChildren

▸ **getNbChildren**(): `number`

#### Returns

`number`

#### Inherited from

[SpinalNode](SpinalNode.md).[getNbChildren](SpinalNode.md#getnbchildren)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[getParents](SpinalNode.md#getparents)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[getParentsInContext](SpinalNode.md#getparentsincontext)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:247

___

### getRelationNames

▸ **getRelationNames**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[SpinalNode](SpinalNode.md).[getRelationNames](SpinalNode.md#getrelationnames)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:139

___

### getType

▸ **getType**(): `Str`

#### Returns

`Str`

#### Inherited from

[SpinalNode](SpinalNode.md).[getType](SpinalNode.md#gettype)

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

[SpinalNode](SpinalNode.md).[get_parents_that_check](SpinalNode.md#get_parents_that_check)

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

[SpinalNode](SpinalNode.md).[get_state](SpinalNode.md#get_state)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[hasRelation](SpinalNode.md#hasrelation)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[hasRelations](SpinalNode.md#hasrelations)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:134

___

### has\_been\_directly\_modified

▸ **has_been_directly_modified**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[SpinalNode](SpinalNode.md).[has_been_directly_modified](SpinalNode.md#has_been_directly_modified)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:77

___

### has\_been\_modified

▸ **has_been_modified**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[SpinalNode](SpinalNode.md).[has_been_modified](SpinalNode.md#has_been_modified)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[map](SpinalNode.md#map)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[mapInContext](SpinalNode.md#mapincontext)

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

[SpinalNode](SpinalNode.md).[mod_attr](SpinalNode.md#mod_attr)

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:167

___

### real\_change

▸ **real_change**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[SpinalNode](SpinalNode.md).[real_change](SpinalNode.md#real_change)

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

[SpinalNode](SpinalNode.md).[rem_attr](SpinalNode.md#rem_attr)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[removeChild](SpinalNode.md#removechild)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[removeChildren](SpinalNode.md#removechildren)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[removeContextId](SpinalNode.md#removecontextid)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:102

___

### removeFromGraph

▸ **removeFromGraph**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[SpinalNode](SpinalNode.md).[removeFromGraph](SpinalNode.md#removefromgraph)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalGraph.d.ts:36

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

#### Inherited from

[SpinalNode](SpinalNode.md).[removeRelation](SpinalNode.md#removerelation)

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

[SpinalNode](SpinalNode.md).[set](SpinalNode.md#set)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[setDirectModificationDate](SpinalNode.md#setdirectmodificationdate)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[setIndirectModificationDate](SpinalNode.md#setindirectmodificationdate)

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

[SpinalNode](SpinalNode.md).[set_attr](SpinalNode.md#set_attr)

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

[SpinalNode](SpinalNode.md).[set_state](SpinalNode.md#set_state)

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

[SpinalNode](SpinalNode.md).[size](SpinalNode.md#size)

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

[SpinalNode](SpinalNode.md).[unbind](SpinalNode.md#unbind)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[visitChildren](SpinalNode.md#visitchildren)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[visitChildrenInContext](SpinalNode.md#visitchildrenincontext)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[visitParents](SpinalNode.md#visitparents)

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

#### Inherited from

[SpinalNode](SpinalNode.md).[visitParentsInContext](SpinalNode.md#visitparentsincontext)

#### Defined in

node_modules/spinal-model-graph/declarations/Nodes/SpinalNode.d.ts:397
