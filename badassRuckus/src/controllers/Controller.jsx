
export class ControllerManager {
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