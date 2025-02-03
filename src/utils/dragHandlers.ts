import { Coordinates } from "@dnd-kit/core/dist/types";
import { Group } from "../types";
import { v4 as uuidv4 } from "uuid";
import { BOX_HEIGHT, BOX_WIDTH } from "../consts";

export function move(
  groups: Group[],
  boxId: string,
  delta: Coordinates,
): Group[] {
  const newGroups = [...groups];

  const movedGroup = getParentGroup(boxId, newGroups);
  if (movedGroup === null) {
    console.error("Error in move(): no group found\n");
    return newGroups;
  }

  // If moving the head of a group, move the whole group with it
  if (isHeadOfGroup(boxId, movedGroup)) {
    const groupIndex = findGroupIndex(movedGroup, newGroups);
    newGroups[groupIndex] = moveGroup(movedGroup, delta);
    return newGroups;
  }

  return newGroups;
}

// WARNING: Untested
// Moves a group
export function moveGroup(group: Group, delta: Coordinates): Group {
  const incrementalDelta = {
    x: delta.x - (group.lastDelta?.x ?? 0),
    y: delta.y - (group.lastDelta?.y ?? 0),
  };

  const newGroup = {
    ...group,
    topSnapPoint: {
      x: group.topSnapPoint.x + incrementalDelta.x,
      y: group.topSnapPoint.y + incrementalDelta.y,
    },
    bottomSnapPoint: {
      x: group.bottomSnapPoint.x + incrementalDelta.x,
      y: group.bottomSnapPoint.y + incrementalDelta.y,
    },
    lastDelta: delta,
    children: group.children.map((child) => {
      return {
        ...child,
        coords: {
          x: child.coords.x + incrementalDelta.x,
          y: child.coords.y + incrementalDelta.y,
        },
      };
    }),
  };

  return newGroup;
}

// Splits a group into two new groups at the specified box ID. First group contains boxes before split point, second contains split point and remaining boxes.
export function unSnap(group: Group, newHeadId: string): [Group, Group] {
  const newHeadIndex = findBoxIndex(newHeadId, group);

  // Create first group with boxes before split
  const g1: Group = {
    id: uuidv4(),
    children: group.children.slice(0, newHeadIndex),
    topSnapPoint: { x: 0, y: 0 },
    bottomSnapPoint: { x: 0, y: 0 },
  };
  const [g1TopSnap, g1BottomSnap] = calcGroupSnapPoints(g1);
  g1.topSnapPoint = g1TopSnap;
  g1.bottomSnapPoint = g1BottomSnap;

  // Create second group with remaining boxes
  const g2: Group = {
    id: uuidv4(),
    children: group.children.slice(newHeadIndex),
    topSnapPoint: { x: 0, y: 0 },
    bottomSnapPoint: { x: 0, y: 0 },
  };
  const [g2TopSnap, g2BottomSnap] = calcGroupSnapPoints(g2);
  g2.topSnapPoint = g2TopSnap;
  g2.bottomSnapPoint = g2BottomSnap;

  return [g1, g2];
}

export function calcGroupSnapPoints(group: Group): [Coordinates, Coordinates] {
  const headCoords = group.children[0].coords;
  return [
    { x: headCoords.x + BOX_WIDTH / 2, y: headCoords.y }, // Top
    {
      x: headCoords.x + BOX_WIDTH / 2,
      y: headCoords.y + BOX_HEIGHT * group.children.length,
    }, // Bottom
  ];
}

// Removes a group from an array of groups
export function removeGroup(group: Group, groups: Group[]): Group[] {
  return groups.filter((elem) => elem.id !== group.id);
}

// Removes original group from groups array and replaces it with two new groups created by splitting at draggedBoxId
export function splitGroup(
  movedGroup: Group,
  draggedBoxId: string,
  groups: Group[],
): Group[] {
  const newGroups = removeGroup(movedGroup, groups);
  const [g1, g2] = unSnap(movedGroup, draggedBoxId);
  newGroups.push(g1, g2);
  return newGroups;
}

// Returns the group id of the box with id == boxId
export function getParentGroup(boxId: string, groups: Group[]): Group | null {
  for (const group of groups) {
    for (const child of group.children) {
      if (child.id === boxId) {
        return group;
      }
    }
  }

  return null;
}

// Returns true if box is the head of group
export function isHeadOfGroup(boxId: string, group: Group): boolean {
  if (group.children.length === 0) {
    return false;
  }

  return group.children[0].id === boxId;
}

// Returns the index of a group in the groups array
export function findGroupIndex(group: Group, groups: Group[]): number {
  return groups.findIndex((elem) => elem.id === group.id);
}

// Resets deltas of all groups
export function resetDeltas(groups: Group[]): Group[] {
  return groups.map((group) => ({
    ...group,
    lastDelta: undefined,
  }));
}

// Returns the position of a box within the group's children
export function findBoxIndex(boxId: string, group: Group): number {
  return group.children.findIndex((elem) => elem.id === boxId);
}
