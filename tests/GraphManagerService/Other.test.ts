import { Model, Str } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalNode } from "spinal-model-graph";
import { GraphManagerService } from "../../src/GraphManagerService";

const graph = new GraphManagerService();
graph.setGraph(new SpinalGraph("Raph"));
graph.addContext("Context", "context", undefined);

const ctx = graph.getContext("Context").getId().get();
const startId = graph.createNode({['type']: 'NodeRoot'}, new Str('Node1'));
const child1 = graph.createNode({['type']: 'Node1'}, new Str('Node2'));
graph.addChild(startId, child1, "Link", "Ref");
const child2 = graph.createNode({['type']: 'Node1'}, new Str('Node3'));
graph.addChildInContext(startId, child2, ctx, "Link", "Ref");
const child3 = graph.createNode({['type']: 'Node2'}, new Str('Node4'));
graph.addChildInContext(startId, child3, ctx, "Link", "Ref");
const child1_1 = graph.createNode({['type']: 'Node2'}, new Str('Node5'));
graph.addChild(child1, child1_1, "Link", "Ref");
const child2_1 = graph.createNode({['type']: 'Node3'}, new Str('Node6'));
graph.addChildInContext(child2, child2_1, ctx, "Nope", "Ref");
const child4 = graph.createNode({['type']: 'Node4'}, new Str('Node7'));
graph.addChild(startId, child4, "Nope", "Ref");

describe.only("Creates a map of node arrays from the children of the given node classified by types.", () => {
    test("Throws an error if the given node is invalid.", () => {
        expect(() => graph.browseAnClassifyByType("startId", ["Link"])).toThrow();
    });
    test("Returns a map of node arrays.", async () => {
        let result = await graph.browseAnClassifyByType(startId, ["Link"]);
        expect(result).toBeDefined();
        expect(result.types).toBeDefined();
        expect(result.types).toHaveLength(3);
        expect(result.data).toBeDefined();
        expect(result.data["NodeRoot"]).toBeDefined();
        expect(result.data["NodeRoot"]).toHaveLength(1);
        expect(result.data["NodeRoot"][0]).toBeInstanceOf(Model);
        expect(result.data["Node1"]).toBeDefined();
        expect(result.data["Node1"]).toHaveLength(2);
        expect(result.data["Node1"][0]).toBeInstanceOf(Model);
        expect(result.data["Node2"]).toBeDefined();
        expect(result.data["Node2"]).toHaveLength(2);
        expect(result.data["Node2"][0]).toBeInstanceOf(Model);
        expect(result.data["Node3"]).toBeUndefined();
    });
});

describe.only("Creates a map of node arrays from the children of the given node in the given context classified by types.", () => {
    test("Throws an error if the given node is invalid.", () => {
        expect(() => graph.browseAndClassifyByTypeInContext("startId", ctx)).toThrow();
    });
    test("Throws an error if the given context is invalid.", () => {
        expect(() => graph.browseAndClassifyByTypeInContext(startId, "ctx")).toThrow();
    });
    test("Returns a map of node arrays.", async () => {
        let result = await graph.browseAndClassifyByTypeInContext(startId, ctx);
        expect(result).toBeDefined();
        expect(result.types).toBeDefined();
        expect(result.types).toHaveLength(4);
        expect(result.data).toBeDefined();
        expect(result.data["NodeRoot"]).toBeDefined();
        expect(result.data["NodeRoot"]).toHaveLength(1);
        expect(result.data["NodeRoot"][0]).toBeInstanceOf(Model);
        expect(result.data["Node1"]).toBeDefined();
        expect(result.data["Node1"]).toHaveLength(1);
        expect(result.data["Node1"][0]).toBeInstanceOf(Model);
        expect(result.data["Node2"]).toBeDefined();
        expect(result.data["Node2"]).toHaveLength(1);
        expect(result.data["Node2"][0]).toBeInstanceOf(Model);
        expect(result.data["Node3"]).toBeDefined();
        expect(result.data["Node3"]).toHaveLength(1);
        expect(result.data["Node3"][0]).toBeInstanceOf(Model);
    });
});

describe.only("Get the relation names of the given nodes.", () => {
    test("Returns an empty array if the node is invalid", () => {
        expect(graph.getRelationNames("startId")).toStrictEqual([]);
    });
    test("Returns an empty array if the node has no relation", () => {
        expect(graph.getRelationNames(child4)).toStrictEqual([]);
    });
    test("Returns an array of the node's relations", () => {
        let result = graph.getRelationNames(startId);
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
    });
});

describe.only("Create an url for a qr code based on a node.", () => {
    test("Throws an error if the given node is invalid.", () => {
        expect(() => graph.generateQRcode("startId")).toThrow();
    });
    test("Returns an url.", () => {
        expect(graph.generateQRcode(startId)).toMatch(/^data:image\/.*/);
    });
});

// Template
// describe.only("", () => {
//     test("", () => {
//         expect().toBeDefined();
//     });
// });