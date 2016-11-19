import Phaser from 'phaser';
import Fx from '../controllers/Fx';
import Arena from '../controllers/Arena';
import Camera from '../controllers/Camera';
import Players from '../controllers/Players';
import Weapons from '../controllers/Weapons';
import { ManagedState } from '../Controller';

export default class extends ManagedState {

    onCreate(game, manager) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = Players.config.gravity;
        manager.create(Fx);
        manager.create(Arena);
        manager.create(Camera);
        manager.create(Players);
        manager.create(Weapons);
    }

    onUpdate(game, manager) {
    }

}
