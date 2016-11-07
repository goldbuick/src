import Phaser from 'phaser';
import { range } from '../Util';
import Arena from '../controllers/Arena';
import Players from '../controllers/Players';
import { ManagedState } from '../Controller';

export default class extends ManagedState {

    onCreate(game, manager) {
        game.physics.arcade.gravity.y = 1200;
        this.arena = manager.create(Arena);
        this.players = manager.create(Players);
    }

    onUpdate(game, manager) {

    }

}
