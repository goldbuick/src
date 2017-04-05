import MouseWheel from './MouseWheel';

export default class Gesture {

    constructor(events = {}) {
        this.pointers = {};
        this.events = events;
        this.mousewheel = new MouseWheel({
            onSwipeLeft: this.onSwipeLeft,
            onSwipeRight: this.onSwipeRight,
            onSwipeUp: this.onSwipeUp,
            onSwipeDown: this.onSwipeDown,
        });
    }

    triggerSwipe(event) {
        this.events[event] && this.events[event]();
    }

    onSwipeLeft = () => {
        console.log('left');
        this.events.onSwipeLeft && this.events.onSwipeLeft();
    }
    
    onSwipeRight = () => {
        console.log('right');
        this.events.onSwipeRight && this.events.onSwipeRight();
    }
    
    onSwipeUp = () => {
        console.log('up');        
        this.events.onSwipeUp && this.events.onSwipeUp();
    }
    
    onSwipeDown = () => {
        console.log('down');        
        this.events.onSwipeDown && this.events.onSwipeDown();
    }

    onWheel = (dx, dy) => {
        this.mousewheel.onWheel(dx, dy);
    }

    pointerDelta(id, pressed, x, y) {
        const timestamp = performance.now();

        let pointer = this.pointers[id];
        if (pointer === undefined) {
            let sx = x, sy = y;
            pointer = { x, y, sx, sy, timestamp };
            this.pointers[id] = pointer;
        }

        const sx = pointer.sx;
        const sy = pointer.sy;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        
        pointer.x = x;
        pointer.y = y;

        const delta = timestamp - pointer.timestamp;
        pointer.timestamp = timestamp;
        
        const vx = delta ? dx / delta : 0;
        const vy = delta ? dy / delta : 0;

        if (pressed === false) {
            delete this.pointers[id];
        }

        return { sx, sy, dx, dy, vx, vy };
    }

    onPointer = (e, id, pressed, x, y) => {
        const { dx, dy, vx, vy } = this.pointerDelta(id, pressed, x, y);
        if (pressed && Math.abs(vx) > 0.3) {
            console.log(vx);
        }
    }

}
