import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MinHeapVisualizer from "./components/MinHeapVisualizer";
import GraphBFSVisualizer from "./components/GraphBFSVisualizer";
import SortingVisualizer from "./components/SortingVisualizer";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import PrimMSTVisualizer from "./components/PrimMSTVisualizer";

export default function App() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <MinHeapVisualizer />
      <GraphBFSVisualizer />
      <DijkstraVisualizer />
      <PrimMSTVisualizer />
      <SortingVisualizer />
    </div>
  );
}