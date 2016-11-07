
export function range(a, b) {
    let numbers = [],
        n1 = Math.round(Math.min(a, b)),
        n2 = Math.round(Math.max(a, b));

    for (let i=n1; i < n2; ++i) numbers.push(i);
    return numbers;
}