import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const previous = {};
  const pq = new Set(Object.keys(graph));

  Object.keys(graph).forEach((v) => (distances[v] = Infinity));
  distances[start] = 0;

  while (pq.size) {
    const current = [...pq].reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );
    pq.delete(current);
    visited.add(current);

    for (let neighbor of graph[current]) {
      const { node, weight } = neighbor;
      if (visited.has(node)) continue;
      const newDist = distances[current] + weight;
      if (newDist < distances[node]) {
        distances[node] = newDist;
        previous[node] = current;
      }
    }
  }

  return { distances, previous };
}

export default function DijkstraVisualizer() {
  const [result, setResult] = useState(null);

  const sampleGraph = {
    A: [{ node: "B", weight: 4 }, { node: "C", weight: 2 }],
    B: [{ node: "D", weight: 5 }],
    C: [{ node: "B", weight: 1 }, { node: "D", weight: 8 }],
    D: [{ node: "E", weight: 6 }],
    E: [],
  };

  const runDijkstra = () => {
    const res = dijkstra(sampleGraph, "A");
    setResult(res);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">Dijkstra's Algorithm</h2>
        <p className="mb-2">Click below to run Dijkstra’s algorithm from node A.</p>
        <Button onClick={runDijkstra}>Run Dijkstra</Button>
        {result && (
          <div className="mt-4">
            <h3 className="font-semibold">Distances from A:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(result.distances).map(([node, dist]) => (
                <li key={node}>{node}: {dist}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}