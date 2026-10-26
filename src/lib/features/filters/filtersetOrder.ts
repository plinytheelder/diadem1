export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
	const result = [...items];
	if (from < 0 || from >= result.length || to < 0 || to >= result.length || from === to) {
		return result;
	}
	const [item] = result.splice(from, 1);
	result.splice(to, 0, item);
	return result;
}

export function getDropIndex(rowTops: readonly number[], from: number, offsetY: number): number {
	if (rowTops.length < 2) return from;
	const step = rowTops[1] - rowTops[0];
	if (step <= 0) return from;
	const target = from + Math.round(offsetY / step);
	return Math.min(rowTops.length - 1, Math.max(0, target));
}

export function getShiftForRow(index: number, from: number, to: number, step: number): number {
	if (from < to && index > from && index <= to) return -step;
	if (from > to && index >= to && index < from) return step;
	return 0;
}
