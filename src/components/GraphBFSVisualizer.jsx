import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function GraphBFSVisualizer() {
  const [log, setLog] = useState([]);

  const bfs = (graph, start) => {
    const visited = new Set();
    const queue = [start];
    const output = [];
    while (queue.length) {
      const node = queue.shift();
      if (!visited.has(node)) {
        output.push(node);
        visited.add(node);
        queue.push(...graph[node]);
      }
    }
    return output;
  };

  useEffect(() => {
    const graph = {
      A: ["B", "C"],
      B: ["D", "E"],
      C: ["F"],
      D: [],
      E: ["F"],
      F: [],
    };
    setLog(bfs(graph, "A"));
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">Graph BFS Visualizer</h2>
        <p>Traversal Order:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {log.map((node, i) => (
            <div key={i} className="px-3 py-2 bg-blue-100 rounded shadow">{node}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}