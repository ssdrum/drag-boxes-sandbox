import { Coordinates } from "@dnd-kit/core/dist/types";

export type Group = {
  id: string;
  lastDelta?: Coordinates;
  topSnapPoint: Coordinates;
  bottomSnapPoint: Coordinates;
  children: Box[];
};

export type Box = {
  id: string;
  coords: Coordinates;
  bg: string;
  showSnapPreviewUp: boolean;
  showSnapPreviewDown: boolean;
};
