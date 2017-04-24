import TWEEN from 'tween.js';

const CONST = {
    delay: 256,
    duration1: 400,
    duration2: 1400,
    smallScale: 0.00001,
    algo1: TWEEN.Easing.Back.Out,
    algo2: TWEEN.Easing.Elastic.Out,
};

function tween(anim, key, from, to, duration, algo, delay) {
    if (anim[key] === undefined) {
        anim[key] = from;
        const _to = (typeof to === 'function') ? to() : to
        new TWEEN
            .Tween(anim)
            .to({ [key]: _to }, duration)
            .easing(algo)
            .delay(delay)
            .start();
        return true;
    }
    return false;
}

export default {
    // common tween values
    CONST: CONST,
    // common tweens
    primary: (anim, key, from, to) => tween(anim, key, from, to, CONST.duration1, CONST.algo1, CONST.delay),
    secondary: (anim, key, from, to) => tween(anim, key, from, to, CONST.duration2, CONST.algo2, CONST.delay),
    // common setters
    setScale: (anim, object3D) => object3D.scale.setScalar(anim.scale),
}
