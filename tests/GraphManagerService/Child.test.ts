import { Str } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalNode } from "spinal-model-graph";
import { GraphManagerService } from "../../src/GraphManagerService";

const graph = new GraphManagerService();
graph.setGraph(new SpinalGraph("Raph"));
graph.addContext("Context", "context", undefined);

describe("Adds the given node to the parent as child.", () => {
    test("returns false if the parent isn't found.", async () => {
        const childId = graph.createNode({['type']: 'Node'}, new Str('Node1'));
        const result = await graph.addChild("parentId", childId, "Link", "Ref");
        expect(result).toBeFalsy();
    });
    test("returns false if the child is invalid.", async () => {
        const parentId = graph.createNode({['type']: 'Node'}, new Str('Node2'));
        const result = await graph.addChild(parentId, "childId", "Link", "Ref");
        expect(result).toBeFalsy();
    });
    test("returns true and adds the child node to the parent node.", async () => {
        const parentId = graph.createNode({['type']: 'Node'}, new Str('Node3'));
        const childId = graph.createNode({['type']: 'Node'}, new Str('Node4'));
        const result = await graph.addChild(parentId, childId, "Link", "Ref");
        expect(result).toBeTruthy();
        expect(await graph.isChild(parentId, childId, ['Link'])).toBe(true);
    });
});

describe.skip("Create the given node in the graph and add it to the parent as child.", () => {
    test("returns false if the parent isn't found.", async () => {
        const child = new SpinalNode("Node", "Node", new Str("Node5"));
        const result = await graph.addChildAndCreateNode("parentId", child, "Link", "Ref");
        expect(result).toBeFalsy();
    });
    test("returns true and adds the child node to the parent node.", async () => {
        const parentId = graph.createNode({['type']: 'Node'}, new Str('Node6'));
        const child = new SpinalNode("Node", "Node", new Str("Node7"));
        expect(child.getId()).toBeDefined();
        expect(child.getId().get()).toBeDefined();
        const result = await graph.addChildAndCreateNode("parentId", child, "Link", "Ref");
        expect(result).toBeTruthy();
        expect(child.getId()).toBeDefined();
        expect(child.getId().get()).toBeDefined();
        expect(await graph.isChild(parentId, child.getId().get(), ['Link'])).toBe(true);
    });
});

describe("Adds the given node to the parent as child in the given context.", () => {
    graph.addContext("Context", 'context', new Str("Context1"));
    test("Throws an error if the parent isn't found.", async () => {
        const childId = graph.createNode({['type']: 'Node'}, new Str('Node8'));
        expect(() => graph.addChildInContext("parentId", childId, graph.getContext("Context").getId().get(), "Link", "Ref")).toThrowError("Error: Node parent id parentId not found");
        // ((reason) => {
        //     expect(reason).toBeDefined();
        //     expect(reason.toString()).toMatch("");
        // });
    });
    test("Throws an error if the child is invalid.", async () => {
        const parentId = graph.createNode({['type']: 'Node'}, new Str('Node9'));
        graph.addChildInContext(parentId, "childId", graph.getContext("Context").getId().get(), "Link", "Ref").catch((reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("Error: Node child id childId not found");
        });
    });
    test("Throws an error if the context is invalid.", async () => {
        const parentId = graph.createNode({['type']: 'Node'}, new Str('Node10'));
        const childId = graph.createNode({['type']: 'Node'}, new Str('Node11'));
        graph.addChildInContext(parentId, childId, "ContextId", "Link", "Ref").catch((reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("Error: Node context id ContextId not found");
        });
    });
    test("returns true and adds the child node to the parent node in the given context.", async () => {
        const parentId = graph.createNode({['type']: 'Node'}, new Str('Node12'));
        const childId = graph.createNode({['type']: 'Node'}, new Str('Node13'));
        const result = await graph.addChildInContext(parentId, childId, graph.getContext("Context").getId().get(), "Link", "Ref");
        expect(result).toBeDefined();
        expect(await graph.isChild(parentId, childId, ['Link'])).toBe(true);
    });
});

describe("Gets the children of the given node.", () => {
    const parentId = graph.createNode({['type']: 'Node'}, new Str('Node14'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node15'));
    const childIdbis = graph.createNode({['type']: 'Node'}, new Str('Node16'));
    graph.addChild(parentId, childId, "Link", "Ref");
    graph.addChild(parentId, childIdbis, "Link", "Ref");
    test("Throws an error if the given node is invalid", () => {
        graph.getChildren("parentId").catch((reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("Error: Node id: parentId not found");
        });
    });
    test("Gets the children of the given parent.", () => {
        graph.getChildren(parentId).then((children) => {
            expect(children).toBeDefined();
            expect(children).toHaveLength(2);
            children[0].element.load().then((value) => {
                expect(value.get()).toMatch("Node15");
            });
        });
    });
});

describe("Gets the children Ids of the given node.", () => {
    const parentId = graph.createNode({['type']: 'Node'}, new Str('Node17'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node18'));
    const childIdbis = graph.createNode({['type']: 'Node'}, new Str('Node19'));
    graph.addChild(parentId, childId, "Link", "Ref");
    graph.addChild(parentId, childIdbis, "Link", "Ref");
    test("Returns undefined if the given node is invalid", () => {
        const result = graph.getChildrenIds("parentId");
        expect(result).toBeUndefined();
    });
    test("Gets the ids of the children from the given parent.", () => {
        const children = graph.getChildrenIds(parentId)
        expect(children).toBeDefined();
        expect(children).toHaveLength(2);
        expect(children[0]).toBe(childId);
    });
});

describe("Gets the children of the given node in the given context.", () => {
    const parentId = graph.createNode({['type']: 'Node'}, new Str('Node20'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node21'));
    const childIdbis = graph.createNode({['type']: 'Node'}, new Str('Node22'));
    const ctx = graph.getContext("Context").getId().get();
    graph.addChildInContext(parentId, childId, ctx, "Link", "Ref");
    graph.addChild(parentId, childIdbis, "Link", "Ref");
    test("Throws an error if the given node is invalid", () => {
        try {
            graph.getChildrenInContext("parentId", ctx);
        } catch (reason) {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("parentId or contextId not found");
        }
    });
    test("Throws an error if the given context is invalid", () => {
        try {
            graph.getChildrenInContext(parentId, "contextId");
        } catch (reason) {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("parentId or contextId not found");
        }
    });
    test("Gets the children of the given parent.", () => {
        graph.getChildrenInContext(parentId, ctx).then((children) => {
            expect(children).toBeDefined();
            expect(children).toHaveLength(1);
            children[0].element.load().then((value) => {
                expect(value.get()).toMatch("Node21");
            });
        });
    });
});

describe("Move a child from a parent to another.", () => {
    const fromId = graph.createNode({['type']: 'Node'}, new Str('Node23'));
    const toId = graph.createNode({['type']: 'Node'}, new Str('Node24'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node25'));
    const ctx = graph.getContext("Context").getId().get();
    graph.addChild(fromId, childId, "Link", "Ref");
    test("Throws an error if the from parent is invalid", () => {
        graph.moveChild("fromId", toId, childId, "Link", "Ref").catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("fromId: fromId not found");
        });
    });
    test("Throws an error if the to parent is invalid", () => {
        graph.moveChild(fromId, "toId", childId, "Link", "Ref").catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("toId: toId not found");
        });
    });
    test("Throws an error if the child is invalid", () => {
        graph.moveChild(fromId, toId, "childId", "Link", "Ref").catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("childId: childId not found");
        });
    });
    test("Moves the child from the from parent to the to parent and returns true.", async () => {
        let result = await graph.isChild(toId, childId, ["Link"]);
        expect(result).toBeFalsy();
        result = await graph.isChild(fromId, childId, ["Link"]);
        expect(result).toBeTruthy();
        result = await graph.moveChild(fromId, toId, childId, "Link", "Ref");
        expect(result).toBeTruthy();
        result = await graph.isChild(toId, childId, ["Link"]);
        expect(result).toBeTruthy();
    });
});

describe("Move a child from a parent to another in the given context.", () => {
    const fromId = graph.createNode({['type']: 'Node'}, new Str('Node26'));
    const toId = graph.createNode({['type']: 'Node'}, new Str('Node27'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node28'));
    const ctx = graph.getContext("Context").getId().get();
    graph.addChild(fromId, childId, "Link", "Ref");
    test("Throws an error if the from parent is invalid", () => {
        graph.moveChildInContext("fromId", toId, childId, ctx, "Link", "Ref").catch( async (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("fromId: fromId not found");
            let result = await graph.isChild(toId, childId, ["Link"]);
            expect(result).toBeFalsy();
            result = await graph.isChild(fromId, childId, ["Link"]);
            expect(result).toBeTruthy();
        });
    });
    test("Throws an error if the to parent is invalid", () => {
        graph.moveChildInContext(fromId, "toId", childId, ctx, "Link", "Ref").catch( async (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("toId: toId not found");
            let result = await graph.isChild(toId, childId, ["Link"]);
            expect(result).toBeFalsy();
            result = await graph.isChild(fromId, childId, ["Link"]);
            expect(result).toBeTruthy();
        });
    });
    test("Throws an error if the child is invalid", () => {
        graph.moveChildInContext(fromId, toId, "childId", ctx, "Link", "Ref").catch( async (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("childId: childId not found");
            let result = await graph.isChild(toId, childId, ["Link"]);
            expect(result).toBeFalsy();
            result = await graph.isChild(fromId, childId, ["Link"]);
            expect(result).toBeTruthy();
        });
    });
    test("Throws an error if the context is invalid", () => {
        graph.moveChildInContext(fromId, toId, childId, "ctx", "Link", "Ref").catch( async (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("TypeError: context must be a SpinaContext");
            let result = await graph.isChild(toId, childId, ["Link"]);
            expect(result).toBeFalsy();
            result = await graph.isChild(fromId, childId, ["Link"]);
            expect(result).toBeTruthy();
        });
    });
    test("Moves the child from the from parent to the to parent and returns true.", async () => {
        let result = await graph.isChild(toId, childId, ["Link"]);
        expect(result).toBeFalsy();
        result = await graph.isChild(fromId, childId, ["Link"]);
        expect(result).toBeTruthy();
        result = await graph.moveChildInContext(fromId, toId, childId, ctx, "Link", "Ref");
        expect(result).toBeTruthy();
        result = await graph.isChild(toId, childId, ["Link"]);
        expect(result).toBeTruthy();
    });
});

describe("Removes the child from the node", () => {
    const parentId = graph.createNode({['type']: 'Node'}, new Str('Node29'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node30'));
    graph.addChild(parentId, childId, "Link", "Ref");
    test("Throws an error if the parent node is invalid", () => {
        graph.removeChild("parentId", childId, "Link", "Ref").catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("nodeId unknown.");
        });
    });
    test("Throws an error if the child node is invalid", () => {
        graph.removeChild(parentId, "childId", "Link", "Ref").catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("nodeId unknown.");
        });
    });
    test("Removes the child from the parent and returns true", async () => {
        let result = await graph.removeChild(parentId, childId, "Link", "Ref");
        expect(result).toBeTruthy();
        result = await graph.isChild(parentId, childId, ["Link"]);
        expect(result).toBeFalsy();
    });
});

describe("Gets the parent of the given child node.", () => {
    const parent1Id = graph.createNode({['type']: 'Node'}, new Str('Node31'));
    const parent2Id = graph.createNode({['type']: 'Node'}, new Str('Node32'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node33'));
    graph.addChild(parent1Id, childId, "Link", "Ref");
    graph.addChild(parent2Id, childId, "Link", "Ref");
    test("Throws an error if the child is invalid.", () => {
        graph.getParents("childId", ["Link"]).catch((reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("Error");
        });
    });
    test("Getting the parents of the node", async () => {
        let result = await graph.getParents(childId, ["Link"]);
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
    });
});

describe("Test wether the parent node has a child in the given context", () => {
    const parentId = graph.createNode({['type']: 'Node'}, new Str('Node34'));
    const nodeId = graph.createNode({['type']: 'Node'}, new Str('Node35'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node36'));
    const ctx = graph.getContext("Context").getId().get();
    graph.addChildInContext(parentId, childId, ctx, "Link", "Ref");
    test("Returns false if the parent node is invalid.", () => {
        let result = graph.hasChildInContext("parentId", ctx);
        expect(result).toBeFalsy();
    });
    test("Returns false if the context is invalid.", () => {
        let result = graph.hasChildInContext(parentId, "ctx");
        expect(result).toBeFalsy();
    });
    test("The parent node has a child in the given context.", () => {
        let result = graph.hasChildInContext(parentId, ctx);
        expect(result).toBeTruthy();
    });
    test("The parent node doesn't have a child in the given context.", () => {
        let result = graph.hasChildInContext(nodeId, ctx);
        expect(result).toBeFalsy();
    });
});

describe("Test if the given child node is a child to the given parent node.", () => {
    const parentId = graph.createNode({['type']: 'Node'}, new Str('Node37'));
    const nodeId = graph.createNode({['type']: 'Node'}, new Str('Node38'));
    const childId = graph.createNode({['type']: 'Node'}, new Str('Node39'));
    graph.addChild(parentId, childId, "Link", "Ref");
    test("Throws an error if the parent node is invalid.", () => {
        graph.isChild("parentId", childId, ["Link"]).catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("nodeId unknown.");
        });
    });
    test("Throws an error if the child node is invalid.", () => {
        graph.isChild(parentId, "childId", ["Link"]).catch( (reason) => {
            expect(reason).toBeDefined();
            expect(reason.toString()).toMatch("nodeId unknown.");
        });
    });
    test("Returns true if the parent has the right child.", async () => {
        let result = await graph.isChild(parentId, childId, ["Link"]);
        expect(result).toBeTruthy();
    });
    test("Returns false if the parent doesn't have the right child.", async () => {
        let result = await graph.isChild(nodeId, childId, ["Link"]);
        expect(result).toBeFalsy();
    });
    test("Returns false if the parent has the right child with the wrong relation name.", async () => {
        let result = await graph.isChild(nodeId, childId, ["LOL"]);
        expect(result).toBeFalsy();
    });
});