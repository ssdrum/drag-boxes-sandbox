import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BOX_HEIGHT, BOX_WIDTH } from "./consts";

interface Props {
  id: string;
  top: number;
  left: number;
  bg: string;
}

export default function Box({ id, top, left, bg }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
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
    <div
      key={id}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    ></div>
  );
}
