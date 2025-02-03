import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Box from "./Box";
import { v4 as uuidv4 } from "uuid";

export default function Canvas() {
  const style: React.CSSProperties = {
    flexGrow: 1,
  };

  return (
    <div style={style}>
      <DndContext modifiers={[restrictToWindowEdges]}>
        <Box id={uuidv4()} bg="green" height={50} width={150} />
      </DndContext>
    </div>
  );
}
