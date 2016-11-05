import Phaser from 'phaser';
import Arena from '../controllers/Arena';
import Player from '../controllers/Player';
import { ManagedState } from '../Controller';

export default class extends ManagedState {

    // tileWidth = 32;
    // tileHeight = 32;

    onCreate(game, manager) {
        game.physics.arcade.gravity.y = 1200;
        this.arena = manager.create(Arena);

        const pads = [
            game.input.gamepad.pad1,
            game.input.gamepad.pad2,
            game.input.gamepad.pad3,
            game.input.gamepad.pad4,
        ];
        for (let i=0; i < game.input.gamepad.padsConnected; ++i) {
            this.manager.create(Player, {
                x: 100 + 100 * i,
                gamePad: pads[i],
                collideLayer: this.arena.collideLayer,
            });
        }
    }

}
