import Phaser from 'phaser';

export default class extends Phaser.State {

    preload() {
    }

    create() {
        const { game } = this;

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        game.input.gamepad.start();
        game.input.gamepad.addCallbacks(this, { onConnect: this.onConnect });
    }

    onConnect() {
        const { game } = this;
        clearTimeout(this.ready);
        this.ready = setTimeout(() => game.state.start('RuckusArena'), 500);
    }

}
