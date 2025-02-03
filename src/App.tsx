import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import { Group as GroupType } from "./types";

const initialGroups: GroupType[] = [
  {
    id: "g-1",
    children: [
      {
        id: "g-1-c-1",
        coords: { x: 0, y: 0 },
        bg: "#4A90E2",
      },
    ],
  },
  {
    id: "g-2",
    children: [
      {
        id: "g-2-c-1",
        coords: { x: 300, y: 300 },
        bg: "#FFB6C1",
      },
      {
        id: "g-2-c-2",
        coords: { x: 300, y: 350 },
        bg: "#FFB6C1",
      },
    ],
  },
];

export default function App() {
  const [groups, setGroups] = useState<GroupType[] | null>(initialGroups);

  const mainStyle: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
    display: "flex",
  };

  const previewStyle: React.CSSProperties = {
    width: "300px",
  };

  return (
    <main style={mainStyle}>
      <Canvas groups={groups} setGroups={setGroups} />
      <div style={previewStyle}>
        <pre>{JSON.stringify(groups, null, 2)}</pre>
      </div>
    </main>
  );
}
