[spinal-env-viewer-graph-service](README.md) / Exports

# spinal-env-viewer-graph-service

## Table of contents

### Classes

- [GraphManagerService](classes/GraphManagerService.md)
- [SpinalContext](classes/SpinalContext.md)
- [SpinalGraph](classes/SpinalGraph.md)
- [SpinalMap](classes/SpinalMap.md)
- [SpinalNode](classes/SpinalNode.md)
- [SpinalNodePointer](classes/SpinalNodePointer.md)
- [SpinalSet](classes/SpinalSet.md)

### Interfaces

- [InfoModel](interfaces/InfoModel.md)
- [SpinalNodeObject](interfaces/SpinalNodeObject.md)
- [SpinalNodeRef](interfaces/SpinalNodeRef.md)

### Type Aliases

- [SpinalNodeFindPredicateFunc](modules.md#spinalnodefindpredicatefunc)

### Variables

- [SPINAL\_RELATION\_LST\_PTR\_TYPE](modules.md#spinal_relation_lst_ptr_type)
- [SPINAL\_RELATION\_PTR\_LST\_TYPE](modules.md#spinal_relation_ptr_lst_type)
- [SPINAL\_RELATION\_TYPE](modules.md#spinal_relation_type)
- [SpinalGraphService](modules.md#spinalgraphservice)

### Functions

- [DEFAULT\_PREDICATE](modules.md#default_predicate)

## Type Aliases

### SpinalNodeFindPredicateFunc

Ƭ **SpinalNodeFindPredicateFunc**: (`node`: [`SpinalNode`](classes/SpinalNode.md)) => `boolean`

#### Type declaration

▸ (`node`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SpinalNode`](classes/SpinalNode.md) |

##### Returns

`boolean`

#### Defined in

[src/interfaces/SpinalNodeFindPredicateFunc.ts:27](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/interfaces/SpinalNodeFindPredicateFunc.ts#L27)

## Variables

### SPINAL\_RELATION\_LST\_PTR\_TYPE

• `Const` **SPINAL\_RELATION\_LST\_PTR\_TYPE**: ``"LstPtr"``

#### Defined in

node_modules/spinal-model-graph/declarations/constants.d.ts:2

___

### SPINAL\_RELATION\_PTR\_LST\_TYPE

• `Const` **SPINAL\_RELATION\_PTR\_LST\_TYPE**: ``"PtrLst"``

#### Defined in

node_modules/spinal-model-graph/declarations/constants.d.ts:3

___

### SPINAL\_RELATION\_TYPE

• `Const` **SPINAL\_RELATION\_TYPE**: ``"Ref"``

#### Defined in

node_modules/spinal-model-graph/declarations/constants.d.ts:1

___

### SpinalGraphService

• `Const` **SpinalGraphService**: [`GraphManagerService`](classes/GraphManagerService.md) = `G_ROOT.spinal.spinalGraphService`

#### Defined in

[src/index.ts:63](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/index.ts#L63)

## Functions

### DEFAULT\_PREDICATE

▸ **DEFAULT_PREDICATE**(`node`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SpinalNode`](classes/SpinalNode.md)<`any`\> |

#### Returns

`boolean`

#### Defined in

[src/interfaces/SpinalNodeFindPredicateFunc.ts:28](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/interfaces/SpinalNodeFindPredicateFunc.ts#L28)
