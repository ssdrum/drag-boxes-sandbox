import "./App.css";
import Canvas from "./Canvas";

export default function App() {
  const style: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
  };

  return (
    <main style={style}>
      <Canvas />
    </main>
  );
}
