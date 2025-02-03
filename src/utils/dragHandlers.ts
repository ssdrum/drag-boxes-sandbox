import { Coordinates } from "@dnd-kit/core/dist/types";
import { Group } from "../types";
import { v4 as uuidv4 } from "uuid";
import { BOX_HEIGHT, BOX_WIDTH, MIN_SNAP_DIST } from "../consts";

export function move(
  groups: Group[],
  boxId: string,
  delta: Coordinates,
): Group[] {
  let newGroups = [...groups];
  const movedGroup = getParentGroup(boxId, newGroups);
  if (!movedGroup) return newGroups;

  const groupIndex = findGroupIndex(movedGroup, newGroups);

  // Move the group first
  newGroups[groupIndex] = moveGroup(movedGroup, delta);

  // Always reset all preview flags first
  newGroups = resetPreviewFlags(newGroups);

  // Find snap points after resetting flags
  const closestSnap = findClosestSnapPoints(movedGroup, newGroups);

  // If no snap or too far, we're already done since we reset flags
  if (!closestSnap || closestSnap.distance >= MIN_SNAP_DIST) {
    return newGroups;
  }

  // Only set preview flag for the closest snap
  const targetIndex = findGroupIndex(closestSnap.targetGroup, newGroups);
  if (targetIndex !== -1) {
    // Safety check
    if (closestSnap.type === "top-to-bottom") {
      newGroups[targetIndex].children[
        newGroups[targetIndex].children.length - 1
      ].showSnapPreviewDown = true;
    } else {
      newGroups[targetIndex].children[0].showSnapPreviewUp = true;
    }
  }

  return newGroups;
}

export function snap(snapResult: SnapResult, groups: Group[]): Group[] {
  const newGroups = groups.filter(
    // Remove original groups
    (group) =>
      group.id !== snapResult.targetGroup.id &&
      group.id !== snapResult.sourceGroup.id,
  );

  let mergedGroup: Group;
  if (snapResult.type === "top-to-bottom") {
    const lastTargetChild =
      snapResult.targetGroup.children[
        snapResult.targetGroup.children.length - 1
      ];
    const firstSourceChild = snapResult.sourceGroup.children[0];
    const yOffset =
      lastTargetChild.coords.y + BOX_HEIGHT - firstSourceChild.coords.y;

    const adjustedSourceChildren = snapResult.sourceGroup.children.map(
      (child) => ({
        ...child,
        coords: {
          x: child.coords.x,
          y: child.coords.y + yOffset,
        },
      }),
    );

    const allChildren = [
      ...snapResult.targetGroup.children,
      ...adjustedSourceChildren,
    ];
    mergedGroup = {
      ...snapResult.targetGroup,
      children: allChildren,
      // Update both snap points
      topSnapPoint: {
        x: snapResult.targetGroup.children[0].coords.x + BOX_WIDTH / 2,
        y: snapResult.targetGroup.children[0].coords.y,
      },
      bottomSnapPoint: {
        x: snapResult.targetGroup.children[0].coords.x + BOX_WIDTH / 2,
        y: allChildren[allChildren.length - 1].coords.y + BOX_HEIGHT,
      },
    };
  } else {
    // Calculate the offset for the source group's children
    const firstTargetChild = snapResult.targetGroup.children[0];
    const lastSourceChild =
      snapResult.sourceGroup.children[
        snapResult.sourceGroup.children.length - 1
      ];
    const yOffset =
      firstTargetChild.coords.y - (lastSourceChild.coords.y + BOX_HEIGHT);

    // Adjust source children coordinates
    const adjustedSourceChildren = snapResult.sourceGroup.children.map(
      (child) => ({
        ...child,
        coords: {
          x: child.coords.x,
          y: child.coords.y + yOffset,
        },
      }),
    );

    const allChildren = [
      ...adjustedSourceChildren,
      ...snapResult.targetGroup.children,
    ];

    mergedGroup = {
      ...snapResult.targetGroup,
      children: allChildren,
      // Update both snap points
      topSnapPoint: {
        x: snapResult.targetGroup.topSnapPoint.x,
        y:
          snapResult.targetGroup.topSnapPoint.y +
          snapResult.sourceGroup.children.length * BOX_HEIGHT,
      },
      bottomSnapPoint: { ...snapResult.targetGroup.bottomSnapPoint },
    };
  }

  // Ensure x coordinates align
  mergedGroup.children = mergedGroup.children.map((child) => ({
    ...child,
    coords: {
      ...child.coords,
      x: snapResult.targetGroup.children[0].coords.x,
    },
  }));

  // Reset lastDelta since this is a new merged group
  mergedGroup = {
    ...mergedGroup,
    lastDelta: undefined,
  };

  newGroups.push(mergedGroup);
  return newGroups;
}

export function resetPreviewFlags(groups: Group[]): Group[] {
  return groups.map((group) => ({
    ...group,
    children: group.children.map((child) => ({
      ...child,
      showSnapPreviewUp: false,
      showSnapPreviewDown: false,
    })),
  }));
}

type SnapResult = {
  distance: number;
  type: "top-to-bottom" | "bottom-to-top";
  sourceGroup: Group;
  targetGroup: Group;
};

export function findClosestSnapPoints(
  draggedGroup: Group,
  allGroups: Group[],
): SnapResult | null {
  let closestDistance = Infinity;
  let closestSnap: SnapResult | null = null;

  // Skip creating array copy by using direct iteration
  for (let i = 0; i < allGroups.length; i++) {
    const targetGroup = allGroups[i];
    if (targetGroup.id === draggedGroup.id) continue;

    // Calculate top-to-bottom distance
    const topToBottomDistance = Math.hypot(
      draggedGroup.topSnapPoint.x - targetGroup.bottomSnapPoint.x,
      draggedGroup.topSnapPoint.y - targetGroup.bottomSnapPoint.y,
    );

    if (topToBottomDistance < closestDistance) {
      closestDistance = topToBottomDistance;
      closestSnap = {
        distance: topToBottomDistance,
        type: "top-to-bottom",
        sourceGroup: draggedGroup,
        targetGroup,
      };
    }

    // Calculate bottom-to-top distance
    const bottomToTopDistance = Math.hypot(
      draggedGroup.bottomSnapPoint.x - targetGroup.topSnapPoint.x,
      draggedGroup.bottomSnapPoint.y - targetGroup.topSnapPoint.y,
    );

    if (bottomToTopDistance < closestDistance) {
      closestDistance = bottomToTopDistance;
      closestSnap = {
        distance: bottomToTopDistance,
        type: "bottom-to-top",
        sourceGroup: draggedGroup,
        targetGroup,
      };
    }
  }

  return closestSnap;
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

// Calculates the distance between two points
export function calcDistance(p1: Coordinates, p2: Coordinates): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
