[spinal-env-viewer-graph-service - v1.0.13](../README.md) › [Globals](../globals.md) › ["GraphManagerService"](_graphmanagerservice_.md)

# External module: "GraphManagerService"

## Index

### Classes

* [GraphManagerService](../classes/_graphmanagerservice_.graphmanagerservice.md)

### Interfaces

* [InfoModel](../interfaces/_graphmanagerservice_.infomodel.md)
* [SpinalNodeObject](../interfaces/_graphmanagerservice_.spinalnodeobject.md)
* [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)

### Type aliases

* [SpinalNodeFindPredicateFunc](_graphmanagerservice_.md#spinalnodefindpredicatefunc)
* [callback](_graphmanagerservice_.md#callback)

### Variables

* [G_ROOT](_graphmanagerservice_.md#const-g_root)

### Functions

* [DEFAULT_PREDICATE](_graphmanagerservice_.md#const-default_predicate)

## Type aliases

###  SpinalNodeFindPredicateFunc

Ƭ **SpinalNodeFindPredicateFunc**: *function*

*Defined in [src/GraphManagerService.ts:55](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L55)*

#### Type declaration:

▸ (`node`: SpinalNode‹any›): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`node` | SpinalNode‹any› |

___

###  callback

Ƭ **callback**: *function*

*Defined in [src/GraphManagerService.ts:64](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L64)*

**`type`** (node: string | SpinalNodeRef) => any

#### Type declaration:

▸ (`node`: string | [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`node` | string &#124; [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md) |

## Variables

### `Const` G_ROOT

• **G_ROOT**: *Window & globalThis | Global* =  typeof window === 'undefined' ? global : window

*Defined in [src/GraphManagerService.ts:58](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L58)*

## Functions

### `Const` DEFAULT_PREDICATE

▸ **DEFAULT_PREDICATE**(): *true*

*Defined in [src/GraphManagerService.ts:56](https://github.com/spinalcom/Spinal-Graph-Service/blob/2aed2ff/src/GraphManagerService.ts#L56)*

**Returns:** *true*
