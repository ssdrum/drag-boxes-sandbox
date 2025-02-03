import { Coordinates } from "@dnd-kit/core/dist/types";

export type Group = {
  id: string;
  lastDelta?: Coordinates;
  children: Box[];
};

export type Box = {
  id: string;
  coords: Coordinates;
  bg: string;
};
