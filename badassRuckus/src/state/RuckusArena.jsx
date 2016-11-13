import Phaser from 'phaser';
import Arena from '../controllers/Arena';
import Camera from '../controllers/Camera';
import Players from '../controllers/Players';
import { ManagedState } from '../Controller';

export default class extends ManagedState {

    onCreate(game, manager) {
        game.physics.arcade.gravity.y = 1200;
        manager.create(Camera);
        manager.create(Arena);
        manager.create(Players);
    }

    onUpdate(game, manager) {

    }

}
