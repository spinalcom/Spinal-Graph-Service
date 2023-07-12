### 1.0.14

- export everything + interface
- update docs
- getInfo
  -  change deep_copy to a container "host" that have the same attributes of info
     ex: spinalNodeRef.type === realNode.info.type
    also call spinalNodeRef.type.set will change what's inside realNode.info.type
- _addNode
  -   change to public
  -   remove warning
  -   remove setInfo (update) when already known
- findNode / getNodeAsync change search spec :
  1. search in node register (from _addNode)
  2. search if id found children of node already transformed in nodeRef (from getInfo )
     remove getChildren of everything
  3. not found
- setInfo change spec
  -   if nodeid not registered no throw but console.error trigger
  -   if nodeRef didn't exist just do getInfo
  -   else update nodeRef
- createNode
  -   param "element" changed to optionnal
  -   change mod_attr to set/add_attr of node info.
