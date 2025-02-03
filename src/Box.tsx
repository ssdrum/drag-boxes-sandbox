import { useDraggable } from "@dnd-kit/core";
import { BOX_HEIGHT, BOX_WIDTH } from "./consts";

interface Props {
  id: string;
  top: number;
  left: number;
  bg: string;
  showSnapPreviewUp: boolean;
  showSnapPreviewDown: boolean;
}

export default function Box({
  id,
  top,
  left,
  bg,
  showSnapPreviewUp,
  showSnapPreviewDown,
}: Props) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = {
    top: top,
    left: left,
    position: "absolute",
    backgroundColor: bg,
    height: `${BOX_HEIGHT}px`,
    width: `${BOX_WIDTH}px`,
    borderRadius: "5px",
    cursor: "grab",
  };

  return (
    <>
      {showSnapPreviewUp && (
        <div
          style={{
            position: "absolute",
            top: top - BOX_HEIGHT,
            left: left,
            height: `${BOX_HEIGHT}px`,
            width: `${BOX_WIDTH}px`,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "5px",
          }}
        />
      )}
      <div
        key={id}
        style={style}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      />
      {showSnapPreviewDown && (
        <div
          style={{
            position: "absolute",
            top: top + BOX_HEIGHT,
            left: left,
            height: `${BOX_HEIGHT}px`,
            width: `${BOX_WIDTH}px`,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "5px",
          }}
        />
      )}
    </>
  );
}
