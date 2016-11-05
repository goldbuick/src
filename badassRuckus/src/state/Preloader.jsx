import Phaser from 'phaser';

export default class extends Phaser.State {

    preload() {
    }

    create() {
        const { game } = this;

        game.input.gamepad.start();
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        game.state.start('RuckusArena');
    }

}
