import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrimMSTVisualizer() {
  const [nodes, setNodes] = useState(["A", "B", "C", "D"]);
  const [edges, setEdges] = useState([
    { from: "A", to: "B", weight: 2 },
    { from: "A", to: "C", weight: 3 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 4 },
    { from: "C", to: "D", weight: 5 },
  ]);
  const [mstEdges, setMstEdges] = useState([]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("");

  const radius = 120;
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

  const runPrimStepByStep = () => {
    const visited = new Set();
    const mst = [];
    const allNodes = new Set(nodes);
    visited.add(nodes[0]);

    let stepEdges = [];
    let totalWeight = 0;

    const interval = setInterval(() => {
      const availableEdges = edges.filter(
        (e) =>
          (visited.has(e.from) && !visited.has(e.to)) ||
          (visited.has(e.to) && !visited.has(e.from))
      );
      availableEdges.sort((a, b) => a.weight - b.weight);

      const next = availableEdges.find(
        (e) => !visited.has(e.from) || !visited.has(e.to)
      );

      if (!next) {
        clearInterval(interval);
        setRunning(false);
        return;
      }

      visited.add(next.from);
      visited.add(next.to);
      stepEdges.push(next);
      totalWeight += next.weight;

      setMstEdges([...stepEdges]);
      setStep(stepEdges.length);

      if (visited.size === allNodes.size) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 1000);

    setRunning(true);
    setMstEdges([]);
    setStep(0);
  };

  const resetGraph = () => {
    setNodes(["A", "B", "C", "D"]);
    setEdges([
      { from: "A", to: "B", weight: 2 },
      { from: "A", to: "C", weight: 3 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 4 },
      { from: "C", to: "D", weight: 5 },
    ]);
    setMstEdges([]);
    setStep(0);
    setRunning(false);
  };

  const isMSTEdge = (edge) =>
    mstEdges.some(
      (e) =>
        (e.from === edge.from && e.to === edge.to) ||
        (e.from === edge.to && e.to === edge.from)
    );

  const getNodeCoords = (label) => {
    const index = nodes.indexOf(label);
    const angle = (2 * Math.PI * index) / nodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Prim's MST Visualizer (with Graph)</h2>

        <p className="text-sm text-gray-700">
          Prim’s algorithm constructs a <strong>Minimum Spanning Tree</strong> by greedily choosing the smallest weight edge connecting the visited nodes to unvisited nodes.
          This visualizer lets you build a graph and see the MST form step-by-step.
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
          <Button onClick={runPrimStepByStep} disabled={running}>
            {running ? "Running..." : "Run Prim's Algorithm"}
          </Button>
          <Button onClick={resetGraph} variant="outline">
            Reset Graph
          </Button>
        </div>

        <div className="mt-6">
          <svg width="400" height="400" className="bg-gray-50 rounded">
            {edges.map((edge, idx) => {
              const from = getNodeCoords(edge.from);
              const to = getNodeCoords(edge.to);
              const isInMST = isMSTEdge(edge);
              return (
                <g key={idx}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isInMST ? "green" : "gray"}
                    strokeWidth={isInMST ? 3 : 1.5}
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
            {nodes.map((label, idx) => {
              const { x, y } = getNodeCoords(label);
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="15" fill="#4F46E5" />
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
          </svg>
        </div>

        <div className="text-sm">
          <p className="font-semibold">Step: {step}</p>
          {mstEdges.length === 0 ? (
            <p className="text-gray-500">No MST edges selected yet.</p>
          ) : (
            <div>
              <p className="font-semibold">Current MST:</p>
              <ul className="list-disc list-inside">
                {mstEdges.map((e, i) => (
                  <li key={i}>
                    {e.from} — {e.to} (Weight: {e.weight})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
