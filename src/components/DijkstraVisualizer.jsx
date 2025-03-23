import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DijkstraVisualizer() {
  const [nodes, setNodes] = useState(["A", "B", "C", "D", "E"]);
  const [edges, setEdges] = useState([
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "C", to: "B", weight: 1 },
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "D", to: "E", weight: 6 },
  ]);
  const [startNode, setStartNode] = useState("A");
  const [distances, setDistances] = useState({});
  const [previous, setPrevious] = useState({});
  const [visited, setVisited] = useState([]);
  const [current, setCurrent] = useState(null);
  const [running, setRunning] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("");

  const radius = 140;
  const centerX = 200;
  const centerY = 200;

  const addEdge = () => {
    if (!from || !to || isNaN(parseInt(weight))) return;
    setEdges([...edges, { from, to, weight: parseInt(weight) }]);
    if (!nodes.includes(from)) setNodes([...nodes, from]);
    if (!nodes.includes(to)) setNodes([...nodes, to]);
    setFrom("");
    setTo("");
    setWeight("");
  };

  const getNodeCoords = (label) => {
    const index = nodes.indexOf(label);
    const angle = (2 * Math.PI * index) / nodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  const runDijkstraStepByStep = () => {
    const dist = {};
    const prev = {};
    const queue = [...nodes];
    const visitList = [];
    nodes.forEach((n) => (dist[n] = Infinity));
    dist[startNode] = 0;

    setDistances({ ...dist });
    setPrevious({});
    setVisited([]);
    setCurrent(null);
    setRunning(true);

    const interval = setInterval(() => {
      if (!queue.length) {
        clearInterval(interval);
        setRunning(false);
        return;
      }

      const currentNode = queue.reduce((a, b) =>
        dist[a] < dist[b] ? a : b
      );

      queue.splice(queue.indexOf(currentNode), 1);
      visitList.push(currentNode);
      setVisited([...visitList]);
      setCurrent(currentNode);

      const neighbors = edges.filter((e) => e.from === currentNode);
      for (const edge of neighbors) {
        const alt = dist[currentNode] + edge.weight;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = currentNode;
        }
      }

      setDistances({ ...dist });
      setPrevious({ ...prev });

    }, 1000);
  };

  const tracePath = (node) => {
    const path = [];
    let curr = node;
    while (previous[curr]) {
      path.unshift(curr);
      curr = previous[curr];
    }
    if (curr === startNode) path.unshift(curr);
    return path.join(" → ");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Dijkstra's Shortest Path Visualizer</h2>
        <p className="text-sm text-gray-700">
          This tool demonstrates Dijkstra's algorithm, which finds the shortest path from a selected start node to all others.
          It works by always visiting the unvisited node with the smallest known distance. Edges are weighted and directional.
        </p>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value.toUpperCase())}
            className="border p-1"
          />
          <input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value.toUpperCase())}
            className="border p-1"
          />
          <input
            placeholder="Weight"
            value={weight}
            type="number"
            onChange={(e) => setWeight(e.target.value)}
            className="border p-1 w-20"
          />
          <Button onClick={addEdge}>Add Edge</Button>
        </div>

        <div className="space-x-2">
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            className="border px-2 py-1"
          >
            {nodes.map((n) => (
              <option key={n} value={n}>
                Start: {n}
              </option>
            ))}
          </select>
          <Button onClick={runDijkstraStepByStep} disabled={running}>
            {running ? "Running..." : "Run Dijkstra"}
          </Button>
        </div>

        <svg width="420" height="420" className="bg-gray-50 rounded">
          {edges.map((edge, idx) => {
            const from = getNodeCoords(edge.from);
            const to = getNodeCoords(edge.to);
            const isVisited = visited.includes(edge.from);
            return (
              <g key={idx}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isVisited ? "green" : "gray"}
                  strokeWidth={isVisited ? 3 : 1.5}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  fontSize="10"
                  textAnchor="middle"
                  fill="black"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          {nodes.map((label, i) => {
            const { x, y } = getNodeCoords(label);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="15" fill="#1D4ED8" />
                <text
                  x={x}
                  y={y + 4}
                  fontSize="12"
                  fill="white"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            );
          })}
          <defs>
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="gray" />
            </marker>
          </defs>
        </svg>

        {Object.keys(distances).length > 0 && (
          <div className="text-sm mt-4">
            <h3 className="font-semibold">Shortest Distances from {startNode}:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(distances).map(([node, dist]) => (
                <li key={node}>
                  {node}: {dist}{" "}
                  <span className="text-gray-500">
                    {tracePath(node) && `(${tracePath(node)})`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
