
export function range(a, b) {
    let numbers = [],
        n1 = Math.round(Math.min(a, b)),
        n2 = Math.round(Math.max(a, b));

    for (let i=n1; i < n2; ++i) numbers.push(i);
    return numbers;
}

export function pickFrom(r, array) {
    const ratio = r();
    const index = Math.floor(ratio * array.length);
    return array[index];
}

