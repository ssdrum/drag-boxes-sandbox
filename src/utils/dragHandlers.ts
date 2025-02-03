import { Coordinates } from "@dnd-kit/core/dist/types";
import { Group } from "../types";
import { v4 as uuidv4 } from "uuid";

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
  const newHeadIndex = findBoxIndex(newHeadId, group); // find the index in the group's children arary of the new head
  return [
    {
      id: uuidv4(),
      children: group.children.slice(0, newHeadIndex),
    },
    {
      id: uuidv4(),
      children: group.children.slice(newHeadIndex),
    },
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
