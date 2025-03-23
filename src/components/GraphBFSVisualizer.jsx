import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GraphBFSVisualizer() {
  const [graph, setGraph] = useState({
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["F"],
    D: [],
    E: ["F"],
    F: [],
  });
  const [log, setLog] = useState([]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [startNode, setStartNode] = useState("A");
  const [newNode, setNewNode] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");

  const addNode = () => {
    if (!graph[newNode]) {
      setGraph({ ...graph, [newNode]: [] });
    }
    setNewNode("");
  };

  const addEdge = () => {
    if (graph[fromNode] && toNode) {
      const updated = { ...graph };
      updated[fromNode] = [...new Set([...updated[fromNode], toNode])];
      setGraph(updated);
    }
    setFromNode("");
    setToNode("");
  };

  const startBFS = () => {
    const visited = new Set();
    const queue = [startNode];
    const output = [];

    setRunning(true);
    setLog([]);
    setStep(0);

    let interval = setInterval(() => {
      if (!queue.length) {
        clearInterval(interval);
        setRunning(false);
        return;
      }
      const node = queue.shift();
      if (!visited.has(node)) {
        output.push(node);
        visited.add(node);
        if (graph[node]) queue.push(...graph[node]);
        setLog([...output]);
        setStep(output.length);
      }
    }, 700);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Graph BFS Visualizer</h2>

        <p className="text-sm text-gray-700">
          Breadth-First Search (BFS) is a graph traversal algorithm that explores all neighbors of a node before moving to the next level.
          Below, you can build your own graph, then run BFS from any starting node to see the traversal order step-by-step.
        </p>

        <div className="space-y-2">
          <h3 className="font-semibold">1. Add Nodes</h3>
          <input
            value={newNode}
            onChange={(e) => setNewNode(e.target.value)}
            placeholder="Node name"
            className="border p-1 mr-2"
          />
          <Button onClick={addNode}>Add Node</Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">2. Add Edges</h3>
          <input
            value={fromNode}
            onChange={(e) => setFromNode(e.target.value)}
            placeholder="From"
            className="border p-1 mr-2"
          />
          <input
            value={toNode}
            onChange={(e) => setToNode(e.target.value)}
            placeholder="To"
            className="border p-1 mr-2"
          />
          <Button onClick={addEdge}>Add Edge</Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">3. Run BFS</h3>
          <input
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            placeholder="Start Node"
            className="border p-1 mr-2"
          />
          <Button onClick={startBFS} disabled={running}>
            {running ? "Running..." : "Start BFS"}
          </Button>
        </div>

        <div className="space-y-1">
          <p className="font-semibold">Step: {step}</p>
          <p className="text-sm">Traversal Order (Animated):</p>
          <div className="flex flex-wrap gap-2">
            {log.map((node, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-blue-500 text-white font-bold rounded shadow animate-pulse"
              >
                {node}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mt-4">Graph Preview:</h3>
          <pre className="bg-gray-100 p-2 text-sm rounded">
            {JSON.stringify(graph, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
