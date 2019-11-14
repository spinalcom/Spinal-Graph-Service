[spinal-env-viewer-graph-service](../README.md) › [Globals](../globals.md) › ["GraphManagerService"](_graphmanagerservice_.md)

# External module: "GraphManagerService"

## Index

### Classes

* [GraphManagerService](../classes/_graphmanagerservice_.graphmanagerservice.md)

### Interfaces

* [InfoModel](../interfaces/_graphmanagerservice_.infomodel.md)
* [SpinalNodeObject](../interfaces/_graphmanagerservice_.spinalnodeobject.md)
* [SpinalNodeRef](../interfaces/_graphmanagerservice_.spinalnoderef.md)

### Type aliases

* [callback](_graphmanagerservice_.md#callback)

### Variables

* [G_ROOT](_graphmanagerservice_.md#const-g_root)

## Type aliases

###  callback

Ƭ **callback**: *function*

*Defined in [GraphManagerService.ts:57](https://github.com/spinalcom/Spinal-Graph-Service/blob/e4d46ae/src/GraphManagerService.ts#L57)*

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

*Defined in [GraphManagerService.ts:52](https://github.com/spinalcom/Spinal-Graph-Service/blob/e4d46ae/src/GraphManagerService.ts#L52)*
