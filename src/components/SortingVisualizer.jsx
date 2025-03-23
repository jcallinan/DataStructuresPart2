import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function SortingVisualizer() {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let i = 0;
    let arr = [...array];
    const interval = setInterval(() => {
      if (i >= arr.length - 1) return clearInterval(interval);
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
      setArray([...arr]);
      i++;
      setStep(i);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">Bubble Sort Visualization</h2>
        <p>Step: {step}</p>
        <div className="flex items-end gap-1 h-40 mt-4">
          {array.map((num, idx) => (
            <div
              key={idx}
              className="bg-green-400 rounded"
              style={{ height: `${num * 20}px`, width: "30px" }}
            >
              <span className="text-xs block text-center text-white">{num}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}