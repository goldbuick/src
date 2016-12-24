import Phaser from 'phaser';
import { ManagedState } from '../Controller';

import Fx from '../controllers/Fx';
import UI from '../controllers/UI';
import Arena from '../controllers/Arena';
import Coins from '../controllers/Coins';
import Camera from '../controllers/Camera';
import Ladders from '../controllers/Ladders';
import Players from '../controllers/Players';
import Weapons from '../controllers/Weapons';
import Monsters from '../controllers/Monsters';

export default class extends ManagedState {

    onCreate(game, manager) {
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = Players.config.gravity;

        manager.create(Camera);

        manager.create(Fx);
        manager.create(UI);
        manager.create(Coins);
        manager.create(Ladders);
        manager.create(Weapons);

        manager.create(Arena);

        manager.create(Players);
        manager.create(Monsters);
    }

}
