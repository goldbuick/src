
export function pick(source) {
    const dest = {};
    const keys = Array.prototype.slice.call(arguments, 1);
    keys.forEach(key => dest[key] = source[key]);
    return dest;
}
