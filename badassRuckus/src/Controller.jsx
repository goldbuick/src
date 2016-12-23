import Phaser from 'phaser';

class ControllerManager {
    controllers = []

    constructor(game) {
        this.game = game;
    }

    control(Klass) {
        return this.controllers.filter(k => k instanceof Klass)[0];
    }

    create(Klass, config = {}) {
        let control = new Klass(this.game, this, Klass.config, config);
        this.controllers.push(control);
        control.create(this.game, control.config);
        return control;  
    }

    update() {
        this.controllers.forEach(c => c.update && c.update(this.game, c.config));
    }

    shutdown() {
        this.controllers.forEach(c => c.shutdown && c.shutdown(this.game, c.config));
    }
}

export class ManagedState extends Phaser.State {

    create() {
        this.manager = new ControllerManager(this.game);
        this.onCreate && this.onCreate(this.game, this.manager);
    }

    update() {
        this.manager.update();
        this.onUpdate && this.onUpdate(this.game, this.manager);
    }

    shutdown() {
        this.manager.shutdown();
        this.onShutdown && this.onShutdown(this.game, this.manager);
    }

}

export function hash(obj) {
    for (let i=1; i < arguments.length; ++i) {
        let key = arguments[i];
        if (obj[key] === undefined) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    return obj;
}

export function array(obj, key) {
    if (obj[key] === undefined) {
        obj[key] = [];
    }
    return obj[key];
}

export class Controller {

    static tag(obj, tag) {
        hash(obj, 'data', 'tags')[tag] = true;
        return obj;
    }

    static selectByTag(game, tag) {
        let list = [];

        const check = (child) => {
            if (hash(child, 'data', 'tags')[tag] === true) {
                list.push(child);
            }
            if (child.type === Phaser.GROUP) {
                child.forEachExists(check);
            }
        };

        game.world.forEachExists(check);
        return Controller.result(list);
    }

    static result(list) {
        return new Phaser.ArraySet(Array.isArray(list) ? list : [list]);
    }

    constructor(game, manager, configDefaults, config) {
        this.game = game;
        this.manager = manager;
        this.config = { ...configDefaults, ...config };
    }

    create(game, config) { }

    update(game, config) { }

    shutdown(game, config) { }

    control(Klass) {
        return this.manager.control(Klass);
    }

    noop() { }

    behaviors(STATES) {
        Object.keys(STATES).forEach(STATE => {
            this[STATE.toUpperCase()] = (object, args = {}) => {
                object.data.STATE = STATE.toUpperCase();
                const fn = STATES[object.data.STATE];
                if (fn) fn(object, args);
            };
        });
    }

    run(object, args) {
        const fn = this[object.data.STATE];
        if (fn) fn(object, args);
    }

    ready(game, object, fn, args) {
        if (game.time.now > object.data.TIMER) fn(object, args);
    }

    wait(game, object, delay = 0) {
        object.data.TIMER = game.time.now + delay;
    }

}
