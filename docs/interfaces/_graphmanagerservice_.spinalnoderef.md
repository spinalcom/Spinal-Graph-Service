[spinal-env-viewer-graph-service](../globals.md) › ["GraphManagerService"](../modules/_graphmanagerservice_.md) › [SpinalNodeRef](_graphmanagerservice_.spinalnoderef.md)

# Interface: SpinalNodeRef

## Hierarchy

* Model

  ↳ **SpinalNodeRef**

## Indexable

* \[ **nameAttr**: *string*\]: any

## Index

### Constructors

* [constructor](_graphmanagerservice_.spinalnoderef.md#constructor)

### Properties

* [childrenIds](_graphmanagerservice_.spinalnoderef.md#childrenids)
* [contextIds](_graphmanagerservice_.spinalnoderef.md#contextids)
* [element](_graphmanagerservice_.spinalnoderef.md#element)
* [hasChildren](_graphmanagerservice_.spinalnoderef.md#haschildren)

### Methods

* [add_attr](_graphmanagerservice_.spinalnoderef.md#add_attr)
* [bind](_graphmanagerservice_.spinalnoderef.md#bind)
* [deep_copy](_graphmanagerservice_.spinalnoderef.md#deep_copy)
* [get](_graphmanagerservice_.spinalnoderef.md#get)
* [has_been_directly_modified](_graphmanagerservice_.spinalnoderef.md#has_been_directly_modified)
* [has_been_modified](_graphmanagerservice_.spinalnoderef.md#has_been_modified)
* [mod_attr](_graphmanagerservice_.spinalnoderef.md#mod_attr)
* [rem_attr](_graphmanagerservice_.spinalnoderef.md#rem_attr)
* [set](_graphmanagerservice_.spinalnoderef.md#set)
* [set_attr](_graphmanagerservice_.spinalnoderef.md#set_attr)
* [unbind](_graphmanagerservice_.spinalnoderef.md#unbind)

## Constructors

###  constructor

\+ **new SpinalNodeRef**(`object?`: object): *[SpinalNodeRef](_graphmanagerservice_.spinalnoderef.md)*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:118

Creates an instance of Model.

**`memberof`** Model

**Parameters:**

Name | Type |
------ | ------ |
`object?` | object |

**Returns:** *[SpinalNodeRef](_graphmanagerservice_.spinalnoderef.md)*

## Properties

###  childrenIds

• **childrenIds**: *string[]*

*Defined in [GraphManagerService.ts:31](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L31)*

___

###  contextIds

• **contextIds**: *string[]*

*Defined in [GraphManagerService.ts:32](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L32)*

___

###  element

• **element**: *SpinalNodePointer‹Model›*

*Defined in [GraphManagerService.ts:33](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L33)*

___

###  hasChildren

• **hasChildren**: *boolean*

*Defined in [GraphManagerService.ts:34](https://github.com/spinalcom/Spinal-Graph-Service/blob/14b94f7/src/GraphManagerService.ts#L34)*

## Methods

###  add_attr

▸ **add_attr**(`object`: object): *void*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:157

add attribute

**`memberof`** Model

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | object |  must be in a form `{ [nameAttr: string]: typeof Model, ... }` |

**Returns:** *void*

▸ **add_attr**(`name`: string, `instanceOfModel?`: any, `signal_change?`: boolean): *void*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:167

add attribute

**`memberof`** Model

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`instanceOfModel?` | any |
`signal_change?` | boolean |

**Returns:** *void*

___

###  bind

▸ **bind**(`f`: Process | BindProcess | SpinalOnChangeBindModel, `onchange_construction?`: boolean): *BindProcess*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:202

 if this has been modified during the preceding round, f will be called

**`memberof`** Model

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`f` | Process &#124; BindProcess &#124; SpinalOnChangeBindModel | If f is a process: - process.onchange will be called each time this (or a child of this) will be modified. - process.destructor will be called if this is destroyed. |
`onchange_construction?` | boolean | - |

**Returns:** *BindProcess*

___

###  deep_copy

▸ **deep_copy**(): *Model*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:223

create and returns a deep copy

**`memberof`** Model

**Returns:** *Model*

___

###  get

▸ **get**(): *any*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:141

### return a copy of data in a "standard JS" representation
(e.g. string, number, objects, ...).

Users are encouraged to use Models as much as possible
(meaning that get should not be called for every manipulation),
adding methods for manipulation of data if necessary
(e.g. toggle, find, ... in Lst, Str, ...).

_May be redefined for specific types (e.g. Str, Lst, ...)_

**`memberof`** Model

**Returns:** *any*

___

###  has_been_directly_modified

▸ **has_been_directly_modified**(): *boolean*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:217

return true if this has changed since previous synchronisation due to
a direct modification (not from a child one)

**`memberof`** Model

**Returns:** *boolean*

___

###  has_been_modified

▸ **has_been_modified**(): *boolean*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:210

return true if this (or a child of this) has changed since the previous
synchronisation

**`memberof`** Model

**Returns:** *boolean*

___

###  mod_attr

▸ **mod_attr**(`name`: string, `opt`: any): *void*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:174

change attribute named `name` to `opt` (use references for comparison)

**`memberof`** Model

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`opt` | any |

**Returns:** *void*

___

###  rem_attr

▸ **rem_attr**(`name`: string, `signal_change?`: boolean): *void*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:181

remove attribute named name

**`memberof`** Model

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`signal_change?` | boolean |

**Returns:** *void*

___

###  set

▸ **set**(`opt`: any): *boolean*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:150

modify data, using another values, or Model instances.
Should not be redefined (but _set should be)

**`memberof`** Model

**Parameters:**

Name | Type |
------ | ------ |
`opt` | any |

**Returns:** *boolean*

returns true if the object is modified

___

###  set_attr

▸ **set_attr**(`opt`: object): *void*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:188

`add / mod / rem attr` to get the same data than `opt`
 (assumed to be something like `{ key: val, ... }`)

**`memberof`** Model

**Parameters:**

Name | Type |
------ | ------ |
`opt` | object |

**Returns:** *void*

___

###  unbind

▸ **unbind**(`f`: Process | BindProcess | SpinalOnChangeBindModel): *void*

*Inherited from void*

Defined in /home/laurent/Desktop/spinalcom/modules/Spinal-Graph-Service/node_modules/spinal-core-connectorjs_type/declarations/connectorTS.d.ts:203

**Parameters:**

Name | Type |
------ | ------ |
`f` | Process &#124; BindProcess &#124; SpinalOnChangeBindModel |

**Returns:** *void*
