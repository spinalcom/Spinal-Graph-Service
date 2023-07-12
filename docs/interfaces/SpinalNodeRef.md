[spinal-env-viewer-graph-service](../README.md) / [Exports](../modules.md) / SpinalNodeRef

# Interface: SpinalNodeRef

## Hierarchy

- `Model`

  ↳ **`SpinalNodeRef`**

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Properties

- [\_attribute\_names](SpinalNodeRef.md#_attribute_names)
- [\_date\_last\_modification](SpinalNodeRef.md#_date_last_modification)
- [\_parents](SpinalNodeRef.md#_parents)
- [\_processes](SpinalNodeRef.md#_processes)
- [\_server\_id](SpinalNodeRef.md#_server_id)
- [childrenIds](SpinalNodeRef.md#childrenids)
- [contextIds](SpinalNodeRef.md#contextids)
- [element](SpinalNodeRef.md#element)
- [hasChildren](SpinalNodeRef.md#haschildren)
- [model\_id](SpinalNodeRef.md#model_id)

### Methods

- [\_get\_flat\_model\_map](SpinalNodeRef.md#_get_flat_model_map)
- [\_get\_fs\_data](SpinalNodeRef.md#_get_fs_data)
- [\_get\_state](SpinalNodeRef.md#_get_state)
- [\_set](SpinalNodeRef.md#_set)
- [\_set\_state](SpinalNodeRef.md#_set_state)
- [\_set\_state\_if\_same\_type](SpinalNodeRef.md#_set_state_if_same_type)
- [\_signal\_change](SpinalNodeRef.md#_signal_change)
- [add\_attr](SpinalNodeRef.md#add_attr)
- [bind](SpinalNodeRef.md#bind)
- [cosmetic\_attribute](SpinalNodeRef.md#cosmetic_attribute)
- [deep\_copy](SpinalNodeRef.md#deep_copy)
- [destructor](SpinalNodeRef.md#destructor)
- [dim](SpinalNodeRef.md#dim)
- [equals](SpinalNodeRef.md#equals)
- [get](SpinalNodeRef.md#get)
- [get\_parents\_that\_check](SpinalNodeRef.md#get_parents_that_check)
- [get\_state](SpinalNodeRef.md#get_state)
- [has\_been\_directly\_modified](SpinalNodeRef.md#has_been_directly_modified)
- [has\_been\_modified](SpinalNodeRef.md#has_been_modified)
- [mod\_attr](SpinalNodeRef.md#mod_attr)
- [real\_change](SpinalNodeRef.md#real_change)
- [rem\_attr](SpinalNodeRef.md#rem_attr)
- [set](SpinalNodeRef.md#set)
- [set\_attr](SpinalNodeRef.md#set_attr)
- [set\_state](SpinalNodeRef.md#set_state)
- [size](SpinalNodeRef.md#size)
- [unbind](SpinalNodeRef.md#unbind)

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

### childrenIds

• **childrenIds**: `string`[]

#### Defined in

[src/interfaces/SpinalNodeRef.ts:29](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/interfaces/SpinalNodeRef.ts#L29)

___

### contextIds

• **contextIds**: [`SpinalSet`](../classes/SpinalSet.md)

#### Defined in

[src/interfaces/SpinalNodeRef.ts:30](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/interfaces/SpinalNodeRef.ts#L30)

___

### element

• **element**: [`SpinalNodePointer`](../classes/SpinalNodePointer.md)<`Model`\>

#### Defined in

[src/interfaces/SpinalNodeRef.ts:31](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/interfaces/SpinalNodeRef.ts#L31)

___

### hasChildren

• **hasChildren**: `boolean`

#### Defined in

[src/interfaces/SpinalNodeRef.ts:32](https://github.com/spinalcom/Spinal-Graph-Service/blob/7905ada/src/interfaces/SpinalNodeRef.ts#L32)

___

### model\_id

• **model\_id**: `number`

#### Inherited from

Model.model\_id

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:25

## Methods

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

### get

▸ **get**(): `any`

#### Returns

`any`

#### Inherited from

Model.get

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:106

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
