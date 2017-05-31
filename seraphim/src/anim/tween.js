import TWEEN from 'tween.js';

const CONST = {
    delay: 256,
    duration1: 400,
    duration2: 1400,
    duration3: 300,
    smallScale: 0.00001,
    algo1: TWEEN.Easing.Back.Out,
    algo2: TWEEN.Easing.Elastic.Out,
    algo3: TWEEN.Easing.Quintic.In,
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

function tweenBounce(anim, key, from, to, duration, algo) {
    anim[key] = from;
    const tween = new TWEEN
        .Tween(anim)
        .to({ [key]: to }, duration * 0.5)
        .easing(algo);
    const tweenBack = new TWEEN
        .Tween(anim)
        .to({ [key]: from }, duration)
        .easing(algo);
    tween.chain(tweenBack);
    tween.start();
}

export default {
    // common tween values
    CONST: CONST,
    // common tweens
    primary: (anim, key, from, to) => tween(anim, key, from, to, CONST.duration1, CONST.algo1, CONST.delay),
    secondary: (anim, key, from, to) => tween(anim, key, from, to, CONST.duration2, CONST.algo2, CONST.delay),
    bounce: (anim, key, from, to) => tweenBounce(anim, key, from, to, CONST.duration3, CONST.algo3),
    // common setters
    setScale: (anim, object3D) => object3D.scale.setScalar(anim.scale),
}
