import Phaser from 'phaser';

export default class extends Phaser.State {

    preload() {
    }

    create() {
        this.game.state.start('RuckusArena');
    }

}
