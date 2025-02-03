import { expect, test, describe } from "bun:test";
import {
  findGroupIndex,
  getParentGroup,
  isHeadOfGroup,
  resetDeltas,
} from "../utils/dragHandlers";
import { Box, Group } from "../types";

describe("getParentGroupId", () => {
  // Set up test data
  const testGroups: Group[] = [
    {
      id: "group-1",
      children: [
        {
          id: "box-1",
          coords: { x: 0, y: 0 },
          bg: "#FFB6C1",
        },
      ],
    },
    {
      id: "group-2",
      children: [
        {
          id: "box-2",
          coords: { x: 100, y: 0 },
          bg: "#FFB6C1",
        },
        {
          id: "box-3",
          coords: { x: 100, y: 50 },
          bg: "#4A90E2",
        },
      ],
    },
  ];

  test("should return null when groups array is null", () => {
    expect(getParentGroup("box-1", [])).toBe(null);
  });

  test("should return null when groups array is empty", () => {
    expect(getParentGroup("box-1", [])).toBe(null);
  });

  test("should return null when box is not found in any group", () => {
    expect(getParentGroup("non-existent-box", testGroups)).toBe(null);
  });

  test("should find group containing single box", () => {
    expect(getParentGroup("box-1", testGroups)).toBe(testGroups[0]); // Group 1
  });

  test("should find group containing box in multi-box group", () => {
    expect(getParentGroup("box-2", testGroups)).toBe(testGroups[1]); // Group 2
    expect(getParentGroup("box-3", testGroups)).toBe(testGroups[1]); // Group 2
  });
});

describe("isHeadOfGroup", () => {
  const box2: Box = {
    id: "box-2",
    coords: { x: 0, y: 0 },
    bg: "#FFB6C1",
  };

  const emptyGroup: Group = {
    id: "group-1",
    children: [],
  };

  const group1: Group = {
    id: "group-1",
    children: [box2],
  };

  test("should return false if group is empty", () => {
    expect(isHeadOfGroup("box-1", emptyGroup)).toBe(false);
  });

  test("should return false if box is not the head of the group", () => {
    expect(isHeadOfGroup("box-1", group1)).toBe(false);
  });

  test("should return true if box is the head of the group", () => {
    expect(isHeadOfGroup("box-2", group1)).toBe(true);
  });
});

describe("findGroupIndex", () => {
  const group0 = {
    id: "group-0",
    coords: { x: 0, y: 0 },
    children: [
      {
        id: "box-1",
        coords: { x: 0, y: 0 },
        bg: "#FFB6C1",
      },
    ],
  };

  const group1 = {
    id: "group-1",
    coords: { x: 0, y: 0 },
    children: [
      {
        id: "box-1",
        coords: { x: 0, y: 0 },
        bg: "#FFB6C1",
      },
    ],
  };

  const group2 = {
    id: "group-2",
    coords: { x: 0, y: 0 },
    children: [
      {
        id: "box-1",
        coords: { x: 0, y: 0 },
        bg: "#FFB6C1",
      },
    ],
  };

  const testGroups: Group[] = [
    {
      id: "group-1",
      children: [
        {
          id: "box-1",
          coords: { x: 0, y: 0 },
          bg: "#FFB6C1",
        },
      ],
    },
    {
      id: "group-2",
      children: [
        {
          id: "box-2",
          coords: { x: 100, y: 0 },
          bg: "#FFB6C1",
        },
        {
          id: "box-3",
          coords: { x: 100, y: 50 },
          bg: "#4A90E2",
        },
      ],
    },
  ];

  test("should return -1 if group is not in groups array", () => {
    expect(findGroupIndex(group0, testGroups)).toBe(-1);
  });

  test("should return 0 if group is the first group in the groups array", () => {
    expect(findGroupIndex(group1, testGroups)).toBe(0);
  });

  test("should return 1 if group is the second group in the groups array", () => {
    expect(findGroupIndex(group2, testGroups)).toBe(1);
  });
});

describe("resetDeltas", () => {
  test("resets lastDelta to undefined for all groups", () => {
    const groups = [
      {
        id: "1",
        children: [],
        coords: { x: 0, y: 0 },
        lastDelta: { x: 10, y: 20 },
      },
      {
        id: "2",
        children: [],
        coords: { x: 100, y: 100 },
        lastDelta: { x: -5, y: 15 },
      },
    ];

    const result = resetDeltas(groups);

    expect(result).toHaveLength(2);
    expect(result![0].lastDelta).toBeUndefined();
    expect(result![1].lastDelta).toBeUndefined();
  });
});
