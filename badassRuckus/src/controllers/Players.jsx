import TAGS from '../Tags';
import Arena from './Arena';
import { Controller } from '../Controller';

export default class Players extends Controller {

    static selectPlayers(game) {
        return Controller.selectByTag(game, TAGS.PLAYER);
    }

    static config = {
        x: 100,
        y: 100,
        w: 8,
        h: 16,
    }

    create(game, config) {
        // temp image
        let image = game.make.bitmapData(8, 16);
        image.rect(0, 0, config.w, config.h, '#36D');

        const pads = [
            game.input.gamepad.pad1,
            game.input.gamepad.pad2,
            game.input.gamepad.pad3,
            game.input.gamepad.pad4,
        ];

        const step = 2000;
        for (let i=0; i < game.input.gamepad.padsConnected; ++i) {
            let player = game.add.sprite(config.x + i * step, config.y, image);
            game.physics.arcade.enable(player);

            player.body.collideWorldBounds = true;
            player.body.setSize(config.w, config.h);

            player.data.jumpTimer = 0;
            player.data.gamePad = pads[i];

            Controller.tag(player, TAGS.PLAYER);
        }
    }

    update(game, config) {
        const players = Players.selectPlayers(game);
        const collideLayer = Arena.selectCollideLayer(game);

        let player = players.first;
        while (player) { 
            collideLayer && game.physics.arcade.collide(player, collideLayer);

            const walkSpeed = 150;
            const stickThreshold = 0.1;
            const { gamePad, jumpTimer } = player.data;

            const leftIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -stickThreshold);
            const rightIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > stickThreshold);

            const upIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -stickThreshold);
            const downIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > stickThreshold);

            const jumpIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_A));

            player.body.velocity.x = 0;
            if (leftIsPressed) player.body.velocity.x = -walkSpeed;
            if (rightIsPressed) player.body.velocity.x = walkSpeed;

            if (jumpIsPressed && player.body.onFloor() && game.time.now > jumpTimer) {
                player.body.velocity.y = -350;
                player.data.jumpTimer = game.time.now + 150;
            }

            player = players.next;
        }
    }
}
