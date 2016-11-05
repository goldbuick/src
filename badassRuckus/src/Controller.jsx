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

export class Controller {
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
