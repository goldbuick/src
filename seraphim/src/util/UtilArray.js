
export function first(a, count) {
    return a.slice(0, count);
}

export function flatten(a) {
    return [].concat.apply([], a);
}

export function range(a, b) {
	const _a = Math.round(Math.min(a, b));
	const _b = Math.round(Math.max(a, b));
	let list = [];
	for (let i=a; i <= b; ++i) {
		list.push(i);
	}
	return list;
}
