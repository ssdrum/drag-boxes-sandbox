import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import { GroupType } from "./types";

const initialGroups: GroupType[] = [
  {
    id: "g-1",
    coords: { x: 0, y: 0 },
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
    coords: { x: 150, y: 0 },
    children: [
      {
        id: "g-2-c-1",
        coords: { x: 150, y: 0 },
        bg: "#FFB6C1",
      },
      {
        id: "g-2-c-2",
        coords: { x: 150, y: 50 },
        bg: "#FFB6C1",
      },
    ],
  },
];

export default function App() {
  // In your component:
  const [groups, setGroups] = useState<GroupType[]>(initialGroups);

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
      <Canvas groups={groups} />
      <div style={previewStyle}>
        <pre>{JSON.stringify(groups, null, 2)}</pre>
      </div>
    </main>
  );
}
