import { expect, test, describe } from "bun:test";
import { Coordinates } from "@dnd-kit/core/dist/types";
import {
  findBoxIndex,
  findGroupIndex,
  getParentGroup,
  isHeadOfGroup,
  removeGroup,
  resetDeltas,
  unSnap,
} from "../utils/dragHandlers";
import { Box, Group } from "../types";

// Test utilities
const createBox = (id: string, coords: Coordinates = { x: 0, y: 0 }): Box => ({
  id,
  coords,
  bg: "#FFB6C1",
  showSnapPreviewUp: false,
  showSnapPreviewDown: false,
});

const createGroup = (id: string, children: Box[] = []): Group => ({
  id,
  children,
  topSnapPoint: { x: 0, y: 0 },
  bottomSnapPoint: { x: 0, y: 0 },
});

describe("getParentGroup", () => {
  const box1 = createBox("box-1");
  const box2 = createBox("box-2", { x: 100, y: 0 });
  const box3 = createBox("box-3", { x: 100, y: 50 });

  const testGroups: Group[] = [
    createGroup("group-1", [box1]),
    createGroup("group-2", [box2, box3]),
  ];

  test("should return null for empty groups array", () => {
    expect(getParentGroup("box-1", [])).toBe(null);
  });

  test("should return null for non-existent box", () => {
    expect(getParentGroup("non-existent-box", testGroups)).toBe(null);
  });

  test("should find group containing box", () => {
    expect(getParentGroup("box-1", testGroups)).toBe(testGroups[0]);
    expect(getParentGroup("box-2", testGroups)).toBe(testGroups[1]);
    expect(getParentGroup("box-3", testGroups)).toBe(testGroups[1]);
  });
});

describe("isHeadOfGroup", () => {
  const box = createBox("box-2");
  const group = createGroup("group-1", [box]);
  const emptyGroup = createGroup("empty-group");

  test("should handle empty groups and non-head boxes", () => {
    expect(isHeadOfGroup("box-1", emptyGroup)).toBe(false);
    expect(isHeadOfGroup("box-1", group)).toBe(false);
  });

  test("should identify head of group", () => {
    expect(isHeadOfGroup("box-2", group)).toBe(true);
  });
});

describe("findGroupIndex", () => {
  const box = createBox("box-1");
  const group1 = createGroup("group-1", [box]);
  const group2 = createGroup("group-2", [box]);
  const testGroups = [group1, group2];

  test("should find group positions", () => {
    expect(findGroupIndex(createGroup("non-existent"), testGroups)).toBe(-1);
    expect(findGroupIndex(group1, testGroups)).toBe(0);
    expect(findGroupIndex(group2, testGroups)).toBe(1);
  });
});

describe("resetDeltas", () => {
  test("should reset lastDelta in all groups", () => {
    const groups: Group[] = [
      { ...createGroup("1"), lastDelta: { x: 10, y: 20 } },
      { ...createGroup("2"), lastDelta: { x: -5, y: 15 } },
    ];

    const result = resetDeltas(groups);
    expect(result).toHaveLength(2);
    expect(result[0].lastDelta).toBeUndefined();
    expect(result[1].lastDelta).toBeUndefined();
  });
});

describe("findBoxIndex", () => {
  const boxes = [createBox("b-1"), createBox("b-2"), createBox("b-3")];
  const group = createGroup("g-1", boxes);

  test("should find correct box indices", () => {
    expect(findBoxIndex("b-1", group)).toBe(0);
    expect(findBoxIndex("b-2", group)).toBe(1);
    expect(findBoxIndex("b-3", group)).toBe(2);
    expect(findBoxIndex("non-existent", group)).toBe(-1);
  });
});

describe("unSnap", () => {
  const boxes = [createBox("b-1"), createBox("b-2"), createBox("b-3")];
  const group = createGroup("g-1", boxes);

  test("should split group at specified box", () => {
    const [g1, g2] = unSnap(group, "b-2");
    expect(g1.children.map((b) => b.id)).toEqual(["b-1"]);
    expect(g2.children.map((b) => b.id)).toEqual(["b-2", "b-3"]);

    const [g3, g4] = unSnap(group, "b-3");
    expect(g3.children.map((b) => b.id)).toEqual(["b-1", "b-2"]);
    expect(g4.children.map((b) => b.id)).toEqual(["b-3"]);
  });
});

describe("removeGroup", () => {
  const groups = [createGroup("g1"), createGroup("g2"), createGroup("g3")];

  test("should remove groups correctly", () => {
    expect(removeGroup(groups[0], groups).map((g) => g.id)).toEqual([
      "g2",
      "g3",
    ]);
    expect(removeGroup(groups[1], groups).map((g) => g.id)).toEqual([
      "g1",
      "g3",
    ]);
    expect(removeGroup(groups[2], groups).map((g) => g.id)).toEqual([
      "g1",
      "g2",
    ]);
    expect(removeGroup(createGroup("non-existent"), groups)).toEqual(groups);
  });
});
