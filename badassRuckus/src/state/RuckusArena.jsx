import Phaser from 'phaser';
import Fx from '../controllers/Fx';
import UI from '../controllers/UI';
import Arena from '../controllers/Arena';
import Camera from '../controllers/Camera';
import Players from '../controllers/Players';
import Weapons from '../controllers/Weapons';
import Monsters from '../controllers/Monsters';
import { ManagedState } from '../Controller';

export default class extends ManagedState {

    onCreate(game, manager) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = Players.config.gravity;
        manager.create(Camera);
        manager.create(Fx);
        manager.create(UI);
        manager.create(Arena);
        manager.create(Players);
        manager.create(Monsters);
        manager.create(Weapons);

        const spawn = () => {
            manager.control(Monsters).add(game, { 
                x: 800 + Math.random() * 600, 
                y: 140
            });
        };
        this.spawnTimer = game.time.events.loop(60000, spawn);
        spawn();
    }

    onUpdate(game, manager) {
    }

    shutdown() {
        this.game.time.events.remove(this.spawnTimer);
    }

}
