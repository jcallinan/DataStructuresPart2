import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const algorithms = {
  "Bubble Sort": function* (arr) {
    let a = [...arr];
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
        yield [...a];
      }
    }
  },
  "Selection Sort": function* (arr) {
    let a = [...arr];
    for (let i = 0; i < a.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        if (a[j] < a[minIdx]) minIdx = j;
        yield [...a];
      }
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield [...a];
    }
  },
  "Insertion Sort": function* (arr) {
    let a = [...arr];
    for (let i = 1; i < a.length; i++) {
      let key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
        yield [...a];
      }
      a[j + 1] = key;
      yield [...a];
    }
  }
};

const descriptions = {
  "Bubble Sort": "Bubble Sort compares each pair of adjacent items and swaps them if they’re in the wrong order. It repeats this process until the array is sorted.",
  "Selection Sort": "Selection Sort finds the smallest item in the unsorted portion of the list and swaps it into place, one by one.",
  "Insertion Sort": "Insertion Sort builds the sorted array one item at a time by inserting each element into its correct position."
};

export default function SortingVisualizer() {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [originalArray, setOriginalArray] = useState([5, 3, 8, 4, 2]);
  const [step, setStep] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [inputText, setInputText] = useState("5,3,8,4,2");
  const [running, setRunning] = useState(false);

  const generatorRef = useRef(null);
  const intervalRef = useRef(null);

  const startSorting = () => {
    if (running) return;

    const parsed = inputText
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));

    setOriginalArray(parsed);
    setArray(parsed);
    setStep(0);

    generatorRef.current = algorithms[selectedAlgorithm](parsed);
    setRunning(true);

    intervalRef.current = setInterval(() => {
      const next = generatorRef.current.next();
      if (next.done) {
        clearInterval(intervalRef.current);
        setRunning(false);
      } else {
        setArray(next.value);
        setStep((s) => s + 1);
      }
    }, 400);
  };

  const resetSorting = () => {
    clearInterval(intervalRef.current);
    setArray(originalArray);
    setRunning(false);
    setStep(0);
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Sorting Algorithm Visualizer</h2>

        <p className="text-sm text-gray-700">
          Select a sorting algorithm, enter numbers, and watch the sorting happen step-by-step.
          This tool helps visualize how sorting algorithms organize data.
        </p>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {Object.keys(algorithms).map((algo) => (
              <option key={algo} value={algo}>
                {algo}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 5,3,8,4,2"
            className="border px-2 py-1 w-48"
          />

          <Button onClick={startSorting} disabled={running}>
            {running ? "Sorting..." : "Start"}
          </Button>
          <Button onClick={resetSorting} variant="outline">
            Reset
          </Button>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Step:</strong> {step}
          </p>
          <div className="flex items-end gap-1 h-40 mt-2">
            {array.map((num, idx) => (
              <div
                key={idx}
                className="bg-blue-500 rounded shadow text-white text-center"
                style={{
                  height: `${num * 10}px`,
                  width: "30px",
                  transition: "all 0.3s ease"
                }}
              >
                <span className="text-xs block">{num}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <h3 className="font-semibold">{selectedAlgorithm} Explanation:</h3>
          <p>{descriptions[selectedAlgorithm]}</p>
        </div>
      </CardContent>
    </Card>
  );
}
