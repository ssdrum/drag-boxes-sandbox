import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  top: number;
  left: number;
  bg: string;
  height: number;
  width: number;
}

export default function Box({ id, top, left, height, width, bg }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: top,
    left: left,
    position: "absolute",
    backgroundColor: bg,
    height: `${height}px`,
    width: `${width}px`,
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
