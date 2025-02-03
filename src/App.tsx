import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import { Group as GroupType } from "./types";
import { BOX_HEIGHT, BOX_WIDTH } from "./consts";

const initialGroups: GroupType[] = [
  {
    id: "g-1",
    topSnapPoint: { x: BOX_WIDTH / 2, y: 0 },
    bottomSnapPoint: { x: BOX_WIDTH / 2, y: BOX_HEIGHT },
    children: [
      {
        id: "g-1-c-1",
        coords: { x: 0, y: 0 },
        bg: "#4A90E2",
        showSnapPreviewUp: true,
        showSnapPreviewDown: true,
      },
    ],
  },
  {
    id: "g-2",
    topSnapPoint: { x: 300 + BOX_WIDTH / 2, y: 300 },
    bottomSnapPoint: { x: 300 + BOX_WIDTH / 2, y: 300 + BOX_HEIGHT * 3 },
    children: [
      {
        id: "g-2-c-1",
        coords: { x: 300, y: 300 },
        bg: "#90EE90",
        showSnapPreviewUp: false,
        showSnapPreviewDown: false,
      },
      {
        id: "g-2-c-2",
        coords: { x: 300, y: 350 },
        bg: "#FFD700",
        showSnapPreviewUp: false,
        showSnapPreviewDown: false,
      },
      {
        id: "g-2-c-3",
        coords: { x: 300, y: 400 },
        bg: "#FF4040",
        showSnapPreviewUp: false,
        showSnapPreviewDown: false,
      },
    ],
  },
];

export default function App() {
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
      <Canvas groups={groups} setGroups={setGroups} />
      <div style={previewStyle}>
        <pre>{JSON.stringify(groups, null, 2)}</pre>
      </div>
    </main>
  );
}
