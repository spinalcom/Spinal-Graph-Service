[spinal-env-viewer-graph-service](../README.md) / [Exports](../modules.md) / SpinalMap

# Class: SpinalMap<T\>

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `Model` = `any` |  |

## Hierarchy

- `Model`

  ↳ **`SpinalMap`**

## Table of contents

### Constructors

- [constructor](SpinalMap.md#constructor)

### Properties

- [\_attribute\_names](SpinalMap.md#_attribute_names)
- [\_date\_last\_modification](SpinalMap.md#_date_last_modification)
- [\_parents](SpinalMap.md#_parents)
- [\_processes](SpinalMap.md#_processes)
- [\_server\_id](SpinalMap.md#_server_id)
- [model\_id](SpinalMap.md#model_id)
- [\_constructorName](SpinalMap.md#_constructorname)

### Methods

- [[iterator]](SpinalMap.md#[iterator])
- [\_get\_flat\_model\_map](SpinalMap.md#_get_flat_model_map)
- [\_get\_fs\_data](SpinalMap.md#_get_fs_data)
- [\_get\_state](SpinalMap.md#_get_state)
- [\_set](SpinalMap.md#_set)
- [\_set\_state](SpinalMap.md#_set_state)
- [\_set\_state\_if\_same\_type](SpinalMap.md#_set_state_if_same_type)
- [\_signal\_change](SpinalMap.md#_signal_change)
- [add\_attr](SpinalMap.md#add_attr)
- [bind](SpinalMap.md#bind)
- [clear](SpinalMap.md#clear)
- [cosmetic\_attribute](SpinalMap.md#cosmetic_attribute)
- [deep\_copy](SpinalMap.md#deep_copy)
- [delete](SpinalMap.md#delete)
- [destructor](SpinalMap.md#destructor)
- [dim](SpinalMap.md#dim)
- [entries](SpinalMap.md#entries)
- [equals](SpinalMap.md#equals)
- [forEach](SpinalMap.md#foreach)
- [get](SpinalMap.md#get)
- [getElement](SpinalMap.md#getelement)
- [get\_parents\_that\_check](SpinalMap.md#get_parents_that_check)
- [get\_state](SpinalMap.md#get_state)
- [has](SpinalMap.md#has)
- [hasKey](SpinalMap.md#haskey)
- [has\_been\_directly\_modified](SpinalMap.md#has_been_directly_modified)
- [has\_been\_modified](SpinalMap.md#has_been_modified)
- [keys](SpinalMap.md#keys)
- [mod\_attr](SpinalMap.md#mod_attr)
- [real\_change](SpinalMap.md#real_change)
- [rem\_attr](SpinalMap.md#rem_attr)
- [set](SpinalMap.md#set)
- [setElement](SpinalMap.md#setelement)
- [set\_attr](SpinalMap.md#set_attr)
- [set\_state](SpinalMap.md#set_state)
- [size](SpinalMap.md#size)
- [unbind](SpinalMap.md#unbind)

## Constructors

### constructor

• **new SpinalMap**<`T`\>(`init?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Model`<`T`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `init?` | `ArrayPairStringAny`[] |

#### Overrides

Model.constructor

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:20

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

### model\_id

• **model\_id**: `number`

#### Inherited from

Model.model\_id

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:25

___

### \_constructorName

▪ `Static` **\_constructorName**: `string`

#### Inherited from

Model.\_constructorName

#### Defined in

node_modules/spinal-core-connectorjs/dist/Models/Model.d.ts:13

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`<`SpinalMapItem`<`T`\>\>

#### Returns

`IterableIterator`<`SpinalMapItem`<`T`\>\>

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:87

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

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:75

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

### delete

▸ **delete**(`key`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:70

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

### entries

▸ **entries**(): `SpinalMapItem`<`T`\>[]

#### Returns

`SpinalMapItem`<`T`\>[]

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:62

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

### forEach

▸ **forEach**(`fun`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fun` | `SpinalMapForEachFunc`<`T`\> |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:81

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

### getElement

▸ **getElement**(`key`): `T`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |

#### Returns

`T`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:35

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

### has

▸ **has**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:43

___

### hasKey

▸ **hasKey**(): `boolean`

#### Returns

`boolean`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:49

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

### keys

▸ **keys**(): `string`[]

#### Returns

`string`[]

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:55

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

### setElement

▸ **setElement**(`key`, `value`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |
| `value` | `any` |  |

#### Returns

`void`

#### Defined in

node_modules/spinal-model-graph/declarations/SpinalMap.d.ts:28

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
