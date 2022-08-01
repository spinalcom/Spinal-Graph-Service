import { Obj, Str } from "spinal-core-connectorjs_type";
import { SpinalContext, SpinalGraph } from "spinal-model-graph";
import { GraphManagerService } from "../../src/GraphManagerService"

describe("Getting graph before set returns undefined.", () => {
    const graph = new GraphManagerService();
    test("Get graph function returns undefined if no graph set", () => {
        const origin = graph.getGraph();
        expect(origin).toBeUndefined();
    });
});

describe("Get the graph set first.", () => {
    const graph = new GraphManagerService();
    const raph = new SpinalGraph("raph", undefined, undefined);
    graph.setGraph(raph);
    test("Get graph function returns the 'raph' graph", () => {
        const origin = graph.getGraph();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
        expect(origin.getName()).toBeDefined();
        expect(origin.getName()).toBeInstanceOf(Str);
        expect(origin.getName().get()).toBe("raph");
    });
});

describe("Setting graph into the graph manager", () => {
    const graph = new GraphManagerService();
    let origin = new SpinalGraph("raph2", undefined, undefined);
    test("Set graph takes the new graph in", () => {
        graph.setGraph(origin);
        origin = graph.getGraph();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
        expect(origin.getName()).toBeDefined();
        expect(origin.getName()).toBeInstanceOf(Str);
        expect(origin.getName().get()).toBe("raph2");
    });
    test("Set graph returns the id of the given graph", async () => {
        const originId = await graph.setGraph(origin);
        expect(originId).toBeDefined();
        expect(originId).toBe(origin.getId().get());
    });
});

describe("Setting graph from forgeFile into the graph manager", () => {
    const graph = new GraphManagerService();
    let origin = new SpinalGraph("raph3", undefined, undefined);
    const forgeFile = new Obj("test");
    test("Set graph from forge file creates a new graph if none is on the forge model", () => {
        jest.spyOn(console, 'warn').mockImplementation();
        graph.setGraphFromForgeFile(forgeFile);
        expect(console.warn).toHaveBeenCalled();
        origin = graph.getGraph();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
        expect(origin.getName()).toBeDefined();
        expect(origin.getName()).toBeInstanceOf(Str);
    });
    forgeFile.set_attr({"graph": origin})
    test("Set graph from forge file sets the graph from the given model", () => {
        jest.spyOn(console, 'warn').mockImplementation();
        graph.setGraphFromForgeFile(forgeFile);
        expect(console.warn).toHaveBeenCalled();
        origin = graph.getGraph();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
        expect(origin.getName()).toBeDefined();
        expect(origin.getName()).toBeInstanceOf(Str);
        expect(origin.getName().get()).toBe("raph3");
    });
    test("Set graph returns the id of the given graph", async () => {
        jest.spyOn(console, 'warn').mockImplementation();
        const originId = await graph.setGraphFromForgeFile(forgeFile);
        expect(console.warn).toHaveBeenCalled();
        expect(originId).toBeDefined();
        expect(originId).toBe(origin.getId().get());
    });
    test("Set graph from forge file sets the graph using the received node", () => {
        jest.spyOn(console, 'warn').mockImplementation();
        graph.setGraphFromForgeFile(origin);
        expect(console.warn).toHaveBeenCalled();
        origin = graph.getGraph();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
        expect(origin.getName()).toBeDefined();
        expect(origin.getName()).toBeInstanceOf(Str);
        expect(origin.getName().get()).toBe("raph3");
    });
});

describe.skip("Wait for the graph to be initialized", () => {
    const graph = new GraphManagerService();
    test("Wait for initialization throws because there is no graph being set", async () => {
        const origin = await graph.waitForInitialization();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
    });
    test("Wait for initialization is awaitable and returns the graph", async () => {
        graph.setGraph(new SpinalGraph("raph"));
        const origin = await graph.waitForInitialization();
        expect(origin).toBeDefined();
        expect(origin).toBeInstanceOf(SpinalGraph);
    });
});

describe("Add a context to the graph.", () => {
    const graph = new GraphManagerService();
    graph.setGraph(new SpinalGraph("raph", undefined, undefined));
    test("Add a context to the graph with the given name, type and element", async () => {
        const ctx = await graph.addContext("Context", "context", new Str("element"));
        expect(ctx).toBeDefined();
        expect(ctx).toBeInstanceOf(SpinalContext);
        expect(ctx.getName()).toBeDefined();
        expect(ctx.getName()).toBeInstanceOf(Str);
        expect(ctx.getName().get()).toBeDefined();
        expect(ctx.getName().get()).toBe("Context");
        expect(ctx.getType()).toBeDefined();
        expect(ctx.getType()).toBeInstanceOf(Str);
        expect(ctx.getType().get()).toBeDefined();
        expect(ctx.getType().get()).toBe("context");
        const element = await ctx.getElement();
        expect(element).toBeDefined();
        expect(element).toBeInstanceOf(Str);
        expect(element.get()).toBeDefined();
        expect(element.get()).toBe("element");
    });
});

describe("Get the context from the graph", () => {
    const graph = new GraphManagerService();
    graph.setGraph(new SpinalGraph("raph", undefined, undefined));
    test("Fail getting any context.", async () => {
        const ctx = graph.getContext("Context");
        expect(ctx).toBeUndefined();
    });
    test("Get the context that was just set.", async () => {
        await graph.addContext("Context", "context", new Str("element"));
        const ctx = graph.getContext("Context");
        expect(ctx).toBeDefined();
        expect(ctx).toBeInstanceOf(SpinalContext);
        expect(ctx.getName()).toBeDefined();
        expect(ctx.getName()).toBeInstanceOf(Str);
        expect(ctx.getName().get()).toBeDefined();
        expect(ctx.getName().get()).toBe("Context");
    });
});

describe("Get the context from the graph by type", () => {
    const graph = new GraphManagerService();
    graph.setGraph(new SpinalGraph("raph", undefined, undefined));
    test("Fail getting any context.", async () => {
        const ctxs = graph.getContextWithType("context");
        expect(ctxs).toStrictEqual([]);
    });
    test("Get the context that was just set.", async () => {
        await graph.addContext("Context", "context", new Str("element"));
        await graph.addContext("Context1", "context", new Str("element"));
        const ctxs = graph.getContextWithType("context");
        expect(ctxs).toHaveLength(2);
        for (let ctx of ctxs)
        {
            expect(ctx).toBeDefined();
            expect(ctx).toBeInstanceOf(SpinalContext);
            expect(ctx.getName()).toBeDefined();
            expect(ctx.getName()).toBeInstanceOf(Str);
            expect(ctx.getName().get()).toBeDefined();
            expect(["Context", "Context1"]).toContain(ctx.getName().get());
        }
    });
});
