import { Model, Str } from "spinal-core-connectorjs_type";
import { SpinalNode } from "spinal-model-graph";
import SpinalNodeRef, { GraphManagerService } from "../src/GraphManagerService"

describe("Graph manager create Node", () => {
    const graph = new GraphManagerService();
    let nodeid: string;
    const elem = new Str("Element is here");
    test('Create a node', () => {
        nodeid = graph.createNode({["exists"]: true}, elem);
        // nodeid = graph.createNode({["exists"]: true}, elem, name); // add name as param of createNode
        expect(nodeid).toBeDefined();
        expect(typeof nodeid).toBe('string');
    });
    test('Node has own id', () => {
        const node = graph.getRealNode(nodeid);
        expect(node).toBeDefined();
        expect(node).toBeInstanceOf(SpinalNode);
        expect(node.info).toBeDefined();
        // expect(node).toBeInstanceOf(SpinalNodeInfoModel); // Missing Node Info Model
        expect(node.info.id).toBeDefined();
        expect(node.info.id).toBeInstanceOf(Str);
        expect(node.info.id.get()).toBe(nodeid);
        expect(node.getId().get()).toBe(nodeid);
        expect(node.info.id).toBe(node.getId());
    });
    test('Node has own element', async () => {
        const node = graph.getRealNode(nodeid);
        expect(node).toBeDefined();
        expect(node).toBeInstanceOf(SpinalNode);
        const element = await node.getElement();
        expect(element).toBeDefined();
        expect(element).toBeInstanceOf(Str);
        expect(element).toBe(elem);
        expect(element.get()).toBe("Element is here");
    });
    test('Node has own name', () => {
        const node = graph.getRealNode(nodeid);
        expect(node).toBeDefined();
        expect(node).toBeInstanceOf(SpinalNode);
        expect(node.info).toBeDefined();
        // expect(node).toBeInstanceOf(SpinalNodeInfoModel); // Missing Node Info Model
        expect(node.info.name).toBeDefined();
        expect(node.info.name).toBeInstanceOf(Str);
        expect(node.info.name.get()).toBe('Named');
        expect(node.getName().get()).toBe('Named');
        expect(node.info.name).toBe(node.getName());
    })
});

describe('Graph manager get node info', () =>
{
    const graph = new GraphManagerService();
    let nodeid: string;
    const elem = new Str("Element is here");
    nodeid = graph.createNode({["exists"]: true}, elem);
    test('Node infos has own ID', () =>
    {
        const info = graph.getInfo(nodeid);
        expect(info).toBeDefined();
        // expect(node).toBeInstanceOf(SpinalNodeInfoModel); // Missing Node Info Model
        expect(info.id).toBeDefined();
        expect(info.id).toBeInstanceOf(Str);
        expect(info.id.get()).toBe(nodeid);
    });
});

describe('Graph manager get node async', () => {
    const graph = new GraphManagerService();
    let nodeid: string;
    const elem = new Str("Element is here");
    nodeid = graph.createNode({["exists"]: true}, elem);
    test('Node has own id', async () => {
        const info = await graph.getNodeAsync(nodeid);
        expect(info).toBeDefined();
        expect(info).toBeInstanceOf(Model); // Missing Model SpinalNodeRef
        expect(info).toBeInstanceOf(SpinalNodeRef); // Missing Model SpinalNodeRef
        expect(info.id).toBeDefined();
        expect(info.id).toBeInstanceOf(Str);
        expect(info.id.get()).toBe(nodeid);
    });
});