import { describe, expect, it } from "vitest";

import { getDropIndex, getShiftForRow, moveItem } from "@/lib/features/filters/filtersetOrder";

describe("moveItem", () => {
	it("moves an item down", () => {
		expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
	});

	it("moves an item up", () => {
		expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
	});

	it("does not modify the input", () => {
		const items = ["a", "b", "c"];
		moveItem(items, 0, 1);
		expect(items).toEqual(["a", "b", "c"]);
	});

	it("ignores out of range indices", () => {
		expect(moveItem(["a", "b"], 0, 5)).toEqual(["a", "b"]);
		expect(moveItem(["a", "b"], -1, 0)).toEqual(["a", "b"]);
	});
});

describe("getDropIndex", () => {
	const tops = [0, 52, 104, 156];

	it("stays in place for small movements", () => {
		expect(getDropIndex(tops, 1, 20)).toBe(1);
		expect(getDropIndex(tops, 1, -20)).toBe(1);
	});

	it("moves once past half a row", () => {
		expect(getDropIndex(tops, 1, 30)).toBe(2);
		expect(getDropIndex(tops, 1, -30)).toBe(0);
	});

	it("clamps to the list", () => {
		expect(getDropIndex(tops, 0, -500)).toBe(0);
		expect(getDropIndex(tops, 0, 500)).toBe(3);
	});

	it("handles single rows", () => {
		expect(getDropIndex([0], 0, 100)).toBe(0);
	});
});

describe("getShiftForRow", () => {
	it("shifts rows up when dragging down", () => {
		expect([0, 1, 2, 3].map((i) => getShiftForRow(i, 0, 2, 52))).toEqual([0, -52, -52, 0]);
	});

	it("shifts rows down when dragging up", () => {
		expect([0, 1, 2, 3].map((i) => getShiftForRow(i, 3, 1, 52))).toEqual([0, 52, 52, 0]);
	});

	it("does not shift anything in place", () => {
		expect([0, 1, 2].map((i) => getShiftForRow(i, 1, 1, 52))).toEqual([0, 0, 0]);
	});
});
