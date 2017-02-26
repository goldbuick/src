
export function debounce(func, wait, immediate) {
    let timeout;
    return () => {
        let args = arguments;
        let later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

export function throttle(func, wait) {
    let timeout;
    return () => {
        if (timeout) return;
        func.apply(this, arguments);
        timeout = setTimeout(() => (timeout = undefined), wait);
    }
}

