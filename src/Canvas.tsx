import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Box from "./Box";
import { Group as GroupType } from "./types";
import { Coordinates } from "@dnd-kit/core/dist/types";
import {
  getParentGroup,
  isHeadOfGroup,
  move,
  resetDeltas,
  splitGroup,
} from "./utils/dragHandlers";
import { Dispatch, SetStateAction } from "react";

interface CanvasProps {
  groups: GroupType[];
  setGroups: Dispatch<SetStateAction<GroupType[]>>;
}

export default function Canvas({ groups, setGroups }: CanvasProps) {
  const handleDragStart = (draggedBoxId: string) => {
    const newGroups = resetDeltas(groups); // Reset all deltas

    const movedGroup = getParentGroup(draggedBoxId, groups); // Get moved grouped
    if (!movedGroup) {
      console.error("this is bad brotherrrrr\n");
      return; // Should be unreachable
    }

    // If dragging the head of a group, move the whole group
    if (isHeadOfGroup(draggedBoxId, movedGroup)) {
      setGroups(newGroups);
      return; // Move execution to handleDragMove
    }

    // If not dragging the head of a group, split the group and move the new group
    setGroups(splitGroup(movedGroup, draggedBoxId, newGroups));
  };

  const handleDragMove = (draggedBoxId: string, delta: Coordinates) => {
    setGroups((prevGroups) => move(prevGroups, draggedBoxId, delta));
  };

  const style: React.CSSProperties = {
    flexGrow: 1,
    position: "relative",
  };

  return (
    <div style={style}>
      <DndContext
        modifiers={[restrictToWindowEdges]}
        onDragStart={({ active }) => handleDragStart(active.id as string)}
        onDragMove={({ active, delta }) => {
          handleDragMove(active.id as string, delta);
        }}
      >
        {groups.map((group) =>
          group.children.map((child) => {
            const { id, coords, bg, showSnapPreviewUp, showSnapPreviewDown } =
              child;
            return (
              <Box
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                bg={bg}
                showSnapPreviewUp={showSnapPreviewUp}
                showSnapPreviewDown={showSnapPreviewDown}
              />
            );
          }),
        )}
      </DndContext>
    </div>
  );
}
