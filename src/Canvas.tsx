import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Box from "./Box";
import { Group as GroupType } from "./types";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { move, resetDeltas } from "./utils/dragHandlers";
import { Dispatch, SetStateAction } from "react";

interface CanvasProps {
  groups: GroupType[] | null;
  setGroups: Dispatch<SetStateAction<GroupType[] | null>>;
}

export default function Canvas({ groups, setGroups }: CanvasProps) {
  const style: React.CSSProperties = {
    flexGrow: 1,
    position: "relative",
  };

  const handleDragStart = () => {
    setGroups(resetDeltas(groups));
  };

  const handleDragMove = (active: string, delta: Coordinates) => {
    setGroups(move(groups, active, delta));
  };

  if (groups === null) {
    return "Grups is null. Check errors in console";
  }

  return (
    <div style={style}>
      <DndContext
        modifiers={[restrictToWindowEdges]}
        onDragStart={() => handleDragStart()}
        onDragMove={({ active, delta }) => {
          handleDragMove(active.id as string, delta);
        }}
      >
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
