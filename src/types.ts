import { Coordinates } from "@dnd-kit/core/dist/types";

export type GroupType = {
  id: string;
  coords: Coordinates;
  children: BoxType[];
};

export type BoxType = {
  id: string;
  coords: Coordinates;
  bg: string;
};
