// import * as THREE from 'three';
// import { throttle, debounce } from '../util/timing';
import Swipe from './Swipe';

export default class MouseWheel {

    constructor(events) {
        this.events = events;
        this.swipe = new Swipe();
        // this.events = {};
        // Object.keys(events).forEach(key => {
        //     this.events[key] = throttle(events[key], 400);
        // });

    }

    // reset = () => {
    //     this.up = undefined;
    //     this.down = undefined;
    //     this.left = undefined;
    //     this.right = undefined;
    // }

    // deltaActive() {
    //     return this.left || this.right || this.up || this.down;
    // }

    // deltaOverride(prop, delta) {
    //     return (this[prop] !== undefined && delta > this[prop]);
    //     // return (
    //     //     delta > (this.up || 0) ||
    //     //     delta > (this.down || 0) ||
    //     //     delta > (this.left || 0) ||
    //     //     delta > (this.right || 0) 
    //     // );
    // }

    // triggerSwipe(event) {
    //     if (this.events[event]) this.events[event]();
    // }

    // resetDelay = debounce(this.reset, 100)

    // handle(prop, event, delta) {
    //     if (!this.deltaActive() || this.deltaOverride(prop, delta)) {
    //         this.triggerSwipe(event);
    //         this[prop] = delta;
    //     }
    // }

    // handleUp(delta) {
    //     this.handle('up', 'onSwipeUp', delta);
    // }

    // handleDown(delta) {
    //     this.handle('down', 'onSwipeDown', delta);
    // }

    // handleLeft(delta) {
    //     this.handle('left', 'onSwipeLeft', delta);
    // }

    // handleRight(delta) {
    //     this.handle('right', 'onSwipeRight', delta);
    // }

    onWheel = (dx, dy) => {
        this.swipe.onVelocity(dx, dy);
        // const vec = new THREE.Vector2(Math.round(dx), Math.round(dy));
        // console.log(vec, vec.length());
        // if (dy < 0) this.handleUp(-dy);
        // if (dy > 0) this.handleDown(dy);
        // if (dx < 0) this.handleLeft(-dx);
        // if (dx > 0) this.handleRight(dx);
        // this.resetDelay();
    }

}
