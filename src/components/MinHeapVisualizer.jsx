import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function buildHeap(arr, isMinHeap) {
  const comparator = isMinHeap
    ? (a, b) => a < b
    : (a, b) => a > b;

  const heap = [...arr];
  const n = heap.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyDown(heap, i, comparator);
  }
  return heap;
}

function heapifyUp(heap, index, comparator) {
  let current = index;
  while (current > 0) {
    const parent = Math.floor((current - 1) / 2);
    if (comparator(heap[current], heap[parent])) {
      [heap[current], heap[parent]] = [heap[parent], heap[current]];
      current = parent;
    } else {
      break;
    }
  }
}

function heapifyDown(heap, index, comparator) {
  const n = heap.length;
  let current = index;
  while (true) {
    let left = 2 * current + 1;
    let right = 2 * current + 2;
    let smallest = current;

    if (left < n && comparator(heap[left], heap[smallest])) {
      smallest = left;
    }
    if (right < n && comparator(heap[right], heap[smallest])) {
      smallest = right;
    }
    if (smallest !== current) {
      [heap[current], heap[smallest]] = [heap[smallest], heap[current]];
      current = smallest;
    } else {
      break;
    }
  }
}

export default function MinHeapVisualizer() {
  const [heap, setHeap] = useState([]);
  const [input, setInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isMinHeap, setIsMinHeap] = useState(true);

  const comparator = isMinHeap
    ? (a, b) => a < b
    : (a, b) => a > b;

  const toggleHeapType = () => {
    const newHeap = buildHeap(heap, !isMinHeap);
    setHeap(newHeap);
    setIsMinHeap(!isMinHeap);
  };

  const handleInsert = () => {
    const value = parseInt(input);
    if (isNaN(value)) return;

    const newHeap = [...heap, value];
    heapifyUp(newHeap, newHeap.length - 1, comparator);
    setHeap(newHeap);
    setInput("");
  };

  const handleExtract = () => {
    if (heap.length === 0) return;

    const newHeap = [...heap];
    const root = newHeap[0];
    const end = newHeap.pop();
    if (newHeap.length > 0) {
      newHeap[0] = end;
      heapifyDown(newHeap, 0, comparator);
    }
    setHeap(newHeap);
  };

  const handleHeapify = () => {
    const values = bulkInput
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    const built = buildHeap(values, isMinHeap);
    setHeap(built);
    setBulkInput("");
  };

  const renderTree = () => {
    const levels = [];
    let level = 0;
    let index = 0;
    const n = heap.length;

    while (index < n) {
      const count = 2 ** level;
      const row = heap.slice(index, index + count);
      levels.push(row);
      index += count;
      level++;
    }

    return (
      <div className="space-y-4 mt-4">
        {levels.map((row, i) => (
          <div key={i} className="flex justify-center gap-4">
            {row.map((val, j) => (
              <div
                key={j}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-green-200 font-bold shadow"
              >
                {val}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Min/Max Heap Visualizer</h2>

        <p className="text-sm text-gray-700">
          This visualization shows how a heap maintains order during insertions and extractions.
          Use the toggle below to switch between MinHeap and MaxHeap behavior. You can also heapify
          multiple values at once to build a complete heap.
        </p>

        <div className="space-x-2">
          <Button onClick={toggleHeapType}>
            Switch to {isMinHeap ? "MaxHeap" : "MinHeap"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="number"
            placeholder="Insert value"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-2 py-1"
          />
          <Button onClick={handleInsert}>Insert</Button>
          <Button onClick={handleExtract}>Extract Root</Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="e.g. 4, 7, 2, 9"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="border px-2 py-1 w-64"
          />
          <Button onClick={handleHeapify}>Heapify</Button>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Heap Tree View:</h3>
          {heap.length === 0 ? (
            <p className="text-sm text-gray-500">Heap is empty.</p>
          ) : (
            renderTree()
          )}
        </div>
      </CardContent>
    </Card>
  );
}
