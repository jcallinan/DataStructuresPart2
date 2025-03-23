import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function primMST(graph) {
  const nodes = Object.keys(graph);
  const mst = [];
  const visited = new Set();
  let totalWeight = 0;

  visited.add(nodes[0]);
  while (visited.size < nodes.length) {
    let edges = [];
    for (let node of visited) {
      for (let neighbor of graph[node]) {
        if (!visited.has(neighbor.node)) {
          edges.push({ from: node, to: neighbor.node, weight: neighbor.weight });
        }
      }
    }
    edges.sort((a, b) => a.weight - b.weight);
    const edge = edges.find((e) => !visited.has(e.to));
    if (edge) {
      visited.add(edge.to);
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }

  return { mst, totalWeight };
}

export default function PrimMSTVisualizer() {
  const [result, setResult] = useState(null);

  const sampleGraph = {
    A: [{ node: "B", weight: 2 }, { node: "C", weight: 3 }],
    B: [{ node: "A", weight: 2 }, { node: "C", weight: 1 }, { node: "D", weight: 4 }],
    C: [{ node: "A", weight: 3 }, { node: "B", weight: 1 }, { node: "D", weight: 5 }],
    D: [{ node: "B", weight: 4 }, { node: "C", weight: 5 }],
  };

  const runPrim = () => {
    const res = primMST(sampleGraph);
    setResult(res);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">Prim's MST Algorithm</h2>
        <p className="mb-2">Click below to compute MST starting from node A.</p>
        <Button onClick={runPrim}>Run Prim</Button>
        {result && (
          <div className="mt-4">
            <h3 className="font-semibold">Minimum Spanning Tree:</h3>
            <ul className="list-disc list-inside">
              {result.mst.map((edge, idx) => (
                <li key={idx}>{edge.from} → {edge.to} (Weight: {edge.weight})</li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Total Weight: {result.totalWeight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}