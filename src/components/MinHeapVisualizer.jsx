import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MinHeapVisualizer() {
  const [heap, setHeap] = useState([]);
  const [input, setInput] = useState(0);

  const insert = (value) => {
    const newHeap = [...heap, value];
    let idx = newHeap.length - 1;
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      if (newHeap[idx] >= newHeap[parentIdx]) break;
      [newHeap[idx], newHeap[parentIdx]] = [newHeap[parentIdx], newHeap[idx]];
      idx = parentIdx;
    }
    setHeap(newHeap);
  };

  const extractMin = () => {
    if (heap.length === 0) return;
    const newHeap = [...heap];
    const min = newHeap[0];
    const end = newHeap.pop();
    if (newHeap.length > 0) {
      newHeap[0] = end;
      let idx = 0;
      while (true) {
        let left = 2 * idx + 1,
          right = 2 * idx + 2,
          smallest = idx;
        if (left < newHeap.length && newHeap[left] < newHeap[smallest]) smallest = left;
        if (right < newHeap.length && newHeap[right] < newHeap[smallest]) smallest = right;
        if (smallest === idx) break;
        [newHeap[idx], newHeap[smallest]] = [newHeap[smallest], newHeap[idx]];
        idx = smallest;
      }
    }
    setHeap(newHeap);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">MinHeap Visualizer</h2>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(parseInt(e.target.value))}
          className="border px-2 py-1 mr-2"
        />
        <Button onClick={() => insert(input)}>Insert</Button>
        <Button onClick={extractMin} className="ml-2">Extract Min</Button>
        <div className="mt-4 flex flex-wrap gap-2">
          {heap.map((v, i) => (
            <div key={i} className="px-3 py-2 bg-gray-200 rounded shadow">{v}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}