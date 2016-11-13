import Phaser from 'phaser';

class ControllerManager {
    controllers = []

    constructor(game) {
        this.game = game;
    }

    create(Klass, config = {}) {
        let control = new Klass(this.game, Klass.config, config);
        this.controllers.push(control);
        control.create(this.game, control.config);
        return control;  
    }

    update() {
        this.controllers.forEach(c => c.update && c.update(this.game, c.config));
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

    constructor(game, configDefaults, config) {
        this.game = game;
        this.config = {
            ...configDefaults,
            ...config
        };
    }
    create() { }
    update() { }
}
