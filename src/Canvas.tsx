import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Box from "./Box";
import { GroupType } from "./types";

interface CanvasProps {
  groups: GroupType[];
}

export default function Canvas({ groups }: CanvasProps) {
  const style: React.CSSProperties = {
    flexGrow: 1,
    position: "relative",
  };

  return (
    <div style={style}>
      <DndContext modifiers={[restrictToWindowEdges]}>
        {groups.map((group) =>
          group.children.map((child) => {
            const { id, coords, bg } = child;
            return (
              <Box key={id} id={id} top={coords.y} left={coords.x} bg={bg} />
            );
          }),
        )}
      </DndContext>
    </div>
  );
}
