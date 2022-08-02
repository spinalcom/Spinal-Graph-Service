import { Str } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalNode } from "spinal-model-graph";
import { GraphManagerService } from "../../src/GraphManagerService";

const graph = new GraphManagerService();
graph.setGraph(new SpinalGraph("Raph"));
graph.addContext("Context", "context", undefined);

describe("Graph manager create Node", () => {
    let nodeid: string;
    const elem = new Str("Element is here");
    test('Create a node', () => {
        nodeid = graph.createNode({["exists"]: true}, elem);
        expect(nodeid).toBeDefined();
        expect(typeof nodeid).toBe('string');
    });
    test('Create a node and the node has the exists tag', () => {
        jest.spyOn(console, 'warn').mockImplementation();
        nodeid = graph.createNode({"exists": true}, elem);
        expect(nodeid).toBeDefined();
        expect(typeof nodeid).toBe('string');
        const nodeInfo = graph.getNode(nodeid);
        expect(console.warn).toHaveBeenCalled();
        expect(nodeInfo).toBeDefined();
        expect(nodeInfo["exists"]).toBeDefined();
    });
});

describe("Get the node from the graph", () => {
    test("Gets the created node.", () => {
        const nodeid = graph.createNode({['type']: 'Node'}, new Str("Node"));
        const nodeInfo = graph.getNode(nodeid);
        expect(nodeInfo).toBeDefined();
        expect(nodeInfo.element).toBeDefined();
        let elem;
        nodeInfo.element.ptr.load().then((n)=>{
            elem = n.get()
            expect(elem).toBe("Node");
        });
    });
    test("Returns undefined on inexistant id.", () => {
        const nodeInfo = graph.getNode("nodeid");
        expect(nodeInfo).toBeUndefined();
    });
});

describe("Get node asynchronously from the graph", () => {
    test("Gets the created node", async () => {
        const nodeid = graph.createNode({['type']: 'Node'}, new Str("Node1"));
        const nodeInfo = await graph.getNodeAsync(nodeid);
        expect(nodeInfo).toBeDefined();
        expect(nodeInfo.element).toBeDefined();
        let elem;
        nodeInfo.element.ptr.load().then((n)=>{
            elem = n.get()
            expect(elem).toBe("Node1");
        });
    });
    test.skip("Returns undefined on inexistant id.", async () => {
        const nodeInfo = await graph.getNodeAsync("nodeid");
        expect(nodeInfo).toBeUndefined();
    });
});

describe("Get real node from the graph", () => {
    test("Gets the created node", async () => {
        const nodeid = graph.createNode({['type']: 'Node'}, new Str("Node2"));
        const node = graph.getRealNode(nodeid);
        expect(node).toBeDefined();
        expect(node).toBeInstanceOf(SpinalNode);
        expect(node.element).toBeDefined();
        let elem;
        node.element?.ptr.load().then((n)=>{
            elem = n.get()
            expect(elem).toBe("Node2");
        });
    });
    test("Returns undefined on inexistant id.", async () => {
        const node = graph.getRealNode("nodeid");
        expect(node).toBeUndefined();
    });
});

describe("Get all nodes from the graph", () => {
    test("Getting all previous nodes", () => {
        const nodes = graph.getNodes();
        expect(nodes).toBeDefined();
        let size = 0;
        for (let id in nodes)
        {
            expect(nodes[id]).toBeDefined();
            expect(nodes[id]).toBeInstanceOf(SpinalNode);
            size += 1;
        }
        expect(size).toBe(7);
    });
});

describe("Get Nodes By Type.", () => {
    test("Get all nodes with 'Node' type", () => {
        const nodes : SpinalNode[] = graph.getNodeByType('Node');
        expect(nodes).toBeDefined();
        for (let node of nodes)
        {
            expect(node).toBeDefined();
            expect(node.getType().get()).toBe("Node");
        }
    });
});

describe("Find the node in the graph with the given id", () => {
    test.skip("Returns undefined on inexistant id.", async () => {
        const nodeInfo = await graph.findNode("nodeid");
        expect(nodeInfo).toBeUndefined();
    });
    test("Find the created Node.", async () => {
        const nodeid = graph.createNode({['type']: 'Node'}, new Str("Node3"));
        const node = await graph.findNode(nodeid);
        expect(node).toBeDefined();
        let elem;
        node.element?.ptr.load().then((n)=>{
            elem = n.get()
            expect(elem).toBe("Node3");
        });
    });
});

describe("Find every node validating a predicate in the children of the starting node id", () => {
    test("Returns undefined on invalid start id.", async () => {
        const node = await graph.findNodes("nodeid", [], () => { return true });
        expect(node).toBeUndefined();
    });
    test("Finds the created node.", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const child = new SpinalNode("Child", "Node", new Str("Node5"));
        graph.addChild(startid, child.getId().get(), "NodeToNode", "NodeLink");
        expect(await (await child.getElement()).get()).toBe("Node5");
        const nodes = await graph.findNodes(startid, ["NodeToNode"], (node) => { return node.getElement().then((elem) => elem.get() === "Node5") });
        expect(nodes).toBeDefined();
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeDefined();
        expect(nodes[0].getType()).toBeDefined();
        expect(nodes[0].getType().get()).toBeDefined();
        expect(nodes[0].getType().get()).toBe(child.getType().get());
    });
    test("Empty array if no node is found", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const nodes = await graph.findNodes(startid, ["NodeToNode"], (node) => { return false });
        expect(nodes).toBeDefined();
        expect(nodes).toStrictEqual([]);
    });
});

describe("Find every node of a certain type in the children of the starting node id", () => {
    test("Returns empty array on invalid start id.", async () => {
        const node = await graph.findNodesByType("nodeid", [], "Node");
        expect(node).toStrictEqual([]);
    });
    test("Finds the created node.", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const child = new SpinalNode("Child", "Node", new Str("Node5"));
        graph.addChild(startid, child.getId().get(), "NodeToNode", "NodeLink");
        expect(await (await child.getElement()).get()).toBe("Node5");
        const nodes = await graph.findNodesByType(startid, ["NodeToNode"], "Node");
        expect(nodes).toBeDefined();
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeDefined();
        expect(nodes[0].getType()).toBeDefined();
        expect(nodes[0].getType().get()).toBeDefined();
        expect(nodes[0].getType().get()).toBe(child.getType().get());
    });
    test("Empty array if no node is found", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const nodes = await graph.findNodesByType(startid, ["NodeToNode"], "None");
        expect(nodes).toBeDefined();
        expect(nodes).toStrictEqual([]);
    });
});

describe("Find every node in the children of the starting node id with the given context", () => {
    test("Returns empty array on invalid start id.", async () => {
        const nodes = await graph.findNodesByType("nodeid", [], "Node");
        expect(nodes).toStrictEqual([]);
    });
    test("Finds the created node.", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const child = new SpinalNode("Child", "Node", new Str("Node5"));
        graph.addChildInContext(startid, child.getId().get(), graph.getContext("Context").getId().get(), "NodeToNode", "NodeLink");
        expect(await (await child.getElement()).get()).toBe("Node5");
        const nodes = await graph.findInContext(startid, graph.getContext("Context").getId().get());
        expect(nodes).toBeDefined();
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeDefined();
        expect(nodes[0].getType()).toBeDefined();
        expect(nodes[0].getType().get()).toBeDefined();
        expect(nodes[0].getType().get()).toBe(child.getType().get());
    });
    test("Finds the created node with predicate.", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const child = new SpinalNode("Child", "Node", new Str("Node5"));
        graph.addChildInContext(startid, child.getId().get(), graph.getContext("Context").getId().get(), "NodeToNode", "NodeLink");
        expect(await (await child.getElement()).get()).toBe("Node5");
        const nodes = await graph.findInContext(startid, graph.getContext("Context").getId().get(), (node) => { return node.getId().get() === child.getId().get() });
        expect(nodes).toBeDefined();
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeDefined();
        expect(nodes[0].getType()).toBeDefined();
        expect(nodes[0].getType().get()).toBeDefined();
        expect(nodes[0].getType().get()).toBe(child.getType().get());
    });
    test("Empty array if no node is found", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const nodes = await graph.findInContext(startid, graph.getContext("Context").getId().get());
        expect(nodes).toBeDefined();
        expect(nodes).toStrictEqual([]);
    });
});

describe("Find every node of a certain type in the children of the starting node id with the given context", () => {
    test("Returns undefined on invalid start id.", async () => {
        const nodes = await graph.findInContextByType("nodeid", "contextId", "Node");
        expect(nodes).toBeUndefined();
    });
    test("Finds the created node.", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const child = new SpinalNode("Child", "Node", new Str("Node5"));
        graph.addChildInContext(startid, child.getId().get(), graph.getContext("Context").getId().get() , "NodeToNode", "NodeLink");
        expect(await (await child.getElement()).get()).toBe("Node5");
        const nodes = await graph.findInContextByType(startid, graph.getContext("Context").getId().get(), "Node");
        expect(nodes).toBeDefined();
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeDefined();
        expect(nodes[0].getType()).toBeDefined();
        expect(nodes[0].getType().get()).toBeDefined();
        expect(nodes[0].getType().get()).toBe(child.getType().get());
    });
    test("Empty array if no node is found", async () => {
        const startid = graph.createNode({['type']: 'Node'}, new Str("Node4"));
        const nodes = await graph.findInContextByType(startid, graph.getContext("Context").getId().get(), "Node");
        expect(nodes).toBeDefined();
        expect(nodes).toStrictEqual([]);
    });
});

describe("Modify the node's infos with the given set of infos.", () => {
    const nodeId = graph.createNode({['type']: 'Node'}, new Str("Node4"));
    jest.spyOn(console, 'warn').mockImplementation();
    test("Returns false if node isn't found.", () => {
        let nodeRef = graph.getNode(nodeId);
        expect(console.warn).toHaveBeenCalled();
        const nodeFound = graph.modifyNode("node", nodeRef);
        expect(nodeFound).toBe(false);
    });
    test("Add a non-existant info.", () => {
        let nodeRef = graph.getNode(nodeId);
        expect(console.warn).toHaveBeenCalled();
        nodeRef.add_attr({['testing']: true});
        const nodeFound = graph.modifyNode(nodeId, nodeRef);
        expect(nodeFound).toBe(true);
        const node = graph.getNode(nodeId);
        expect(console.warn).toHaveBeenCalled();
        expect(node['testing']).toBeDefined();
        expect(node['testing'].get()).toBeDefined();
        expect(node['testing'].get()).toBe(true);
    });
    test("Modify an existing info.", () => {
        let nodeRef = graph.getNode(nodeId);
        expect(console.warn).toHaveBeenCalled();
        nodeRef.mod_attr('testing', false);
        const nodeFound = graph.modifyNode(nodeId, nodeRef);
        expect(nodeFound).toBe(true);
        const node = graph.getNode(nodeId);
        expect(console.warn).toHaveBeenCalled();
        expect(node['testing']).toBeDefined();
        expect(node['testing'].get()).toBeDefined();
        expect(node['testing'].get()).toBe(false);
    });
});

describe("Remove a node from the graph.", () => {
    jest.spyOn(console, 'warn').mockImplementation();
    test("returns undefined on invalid nodeId", async () => {
        const result = await graph.removeFromGraph("node");
        expect(result).toBeUndefined();
    });
    test("removes the created node from the graph.", async () => {
        const nodeId = graph.createNode({['type']: 'Node'}, new Str('Node8'));
        await graph.removeFromGraph(nodeId);
        const node = graph.getRealNode(nodeId);
        expect(node).toBeUndefined();
    });
});

describe("Get the node info of all the loaded nodes", () => {
    test("Returns an array of node infos", () => {
        const nodeId = graph.createNode({['type']: 'Node'}, new Str('Node9'));
        const nodeInfos = graph.getNodesInfo();
        expect(nodeInfos).toBeDefined();
        expect(nodeInfos[nodeId]).toBeDefined();
        expect(nodeInfos[nodeId]["id"].get()).toBe(nodeId);
    });
});

describe("Gets the info of a node.", () => {
    test("Returns undefined if the node isn't found.", () => {
        const nodeRef = graph.getInfo("node");
        expect(nodeRef).toBe(undefined);
    });
    test("Gets the info of the created node.", () => {
        const nodeId = graph.createNode({['type']: 'Node'}, new Str('Node10'));
        const nodeRef = graph.getInfo(nodeId);
        expect(nodeRef).toBeDefined();
        expect(nodeRef['type'].get()).toBeDefined();
        expect(nodeRef['type'].get()).toBe('Node');
    });
});

describe("Sets the info of the given node in the graph service.", () => {
    test("Returns undefined on invalid node id", () => {
        const nodeRef = graph.setInfo("nodeid");
        expect(nodeRef).toBeUndefined();
    });
    test("Returns the info after setting it in the graph service.", () => {
        const nodeId = graph.createNode({['type']: 'Node'}, new Str('Node11'));
        const nodeRef = graph.setInfo(nodeId);
        expect(nodeRef).toBeDefined();
        expect(nodeRef['type'].get()).toBeDefined();
        expect(nodeRef['type'].get()).toBe('Node');
    });
});
