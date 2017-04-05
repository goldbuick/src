import * as THREE from 'three';
// import { throttle, debounce } from '../util/timing';
import ZScore from './ZScore';

export default class Swipe {

    dxSignal = new ZScore();
    dySignal = new ZScore();

    // constructor() {
    //     // this.trigger = new THREE.Vector2(0, 0);
    //     // this.peakVelocity = new THREE.Vector2(0, 0);
    //     // this.lastVelocity = new THREE.Vector2(0, 0);
    //     // this.currentVelocity = new THREE.Vector2(0, 0);
    //     // this.dyValues = [];
    //     // this.dxValues = [];
    // }

    // onLeft = () => { console.log('Left'); }
    // onLeftDelay = throttle(this.onLeft, 300)

    // onRight = () => { console.log('Right'); }
    // onRightDelay = throttle(this.onRight, 300)

    // onUp = () => { console.log('Up'); }
    // onUpDelay = throttle(this.onUp, 300)

    // onDown = () => { console.log('Down'); }
    // onDownDelay = throttle(this.onDown, 300)

    // capture(array, value) {
    //     array.push(value);
    //     if (array.length > 3) array.shift();
    // }

    // min(array) {
    //     return array.length ? Math.min.apply(Math, array) : 0;
    // }

    // max(array) {
    //     return array.length ? Math.max.apply(Math, array) : 0;
    // }

    onVelocity(dx, dy) {
        this.dySignal.push(dy);
        
        // const dxMax = this.max(this.dxValues);
        // const dxMin = this.min(this.dxValues);
        // this.capture(this.dxValues, dx);

        // const dyMax = this.max(this.dyValues);
        // const dyMin = this.min(this.dyValues);
        // this.capture(this.dyValues, dy);

        // // if (dx < 0 && dx < dxMin) this.onLeftDelay();
        // // if (dx > 0 && dx > dxMax) this.onRightDelay();
        // // if (dy < 0 && dy < dyMin) this.onUpDelay();
        // // if (dy > 0 && dy > dyMax) {
        // //     this.onDownDelay();
        // // }
        // console.log(dy > dyMax, dy, dyMax);

        // // console.log(dyAverage);

        // // if (this.timestamp === undefined) this.timestamp = performance.now();
        // // const timestamp = performance.now();
        // // const delta = timestamp - this.timestamp;
        // // this.timestamp = timestamp;
        // // console.log(delta);

        // // dx = Math.round(dx);
        // // dy = Math.round(dy);
        // // this.currentVelocity.set(dx, dy);

        // // // if (this.currentVelocity.y < 0 && this.lastVelocity.y < 0) {
        // // //     // if (this.trigger.y > 0) this.trigger.y = 0;
        // // //     // if (this.trigger.y > this.currentVelocity.y) console.log('up');
        // // //     // console.log(this.trigger.y, this.currentVelocity.y);
        // // //     // this.trigger.y = this.currentVelocity.y;
        // // // } else if (this.currentVelocity.y > 0 && this.lastVelocity.y > 0) {
        // // //     // if (this.trigger.y < 0) this.trigger.y = 0;
        // // //     // if (this.trigger.y < this.currentVelocity.y) console.log('down');
        // // //     // this.trigger.y = this.currentVelocity.y;
        // // // } else if (this.currentVelocity.x < 0 && this.lastVelocity.x < 0) {

        // // // } else if (this.currentVelocity.x > 0 && this.lastVelocity.x > 0) {

        // // // }

        // // // if (this.currentVelocity.x < 0) {
        // // //     this.peakVelocity.x = Math.min(this.peakVelocity.x, this.currentVelocity.x);
        // // // } else {
        // // //     this.peakVelocity.x = Math.max(this.peakVelocity.x, this.currentVelocity.x);
        // // // }

        // // // if (this.currentVelocity.y < 0) {
        // // //     this.peakVelocity.y = Math.min(this.peakVelocity.y, this.currentVelocity.y);
        // // // } else {
        // // //     this.peakVelocity.y = Math.max(this.peakVelocity.y, this.currentVelocity.y);
        // // // }
        // // // const deltaY = Math.abs(this.peakVelocity.y) - Math.abs(this.currentVelocity.y);

        // // // console.log(this.peakVelocity.y, deltaY);

        // // // console.log(dy);
        // // this.lastVelocity.set(dx, dy);
    }

}
