import TAGS from '../Tags';
import Arena from './Arena';
import Ladders from './Ladders';
import { Controller } from '../Controller';

export default class Players extends Controller {

    static selectPlayers(game) {
        return Controller.selectByTag(game, TAGS.PLAYER);
    }

    static config = {
        x: 70 * 16,
        y: 100,
        w: 8,
        h: 16,
    }

    create(game, config) {
        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#36D');

        const pads = [
            game.input.gamepad.pad1,
            game.input.gamepad.pad2,
            game.input.gamepad.pad3,
            game.input.gamepad.pad4,
        ];

        const step = 16;
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

    handleLadder = (player, ladder) => {
        player.data.ladderTop = ladder.y - player.height;
        player.data.ladderBottom = ladder.y + ladder.height - player.height - 2;
        if ((player.data.input.upIsPressed && player.y > player.data.ladderTop) ||
            (player.data.input.downIsPressed && player.y < player.data.ladderBottom)) {
            player.body.allowGravity = false;
            player.data.ladder = ladder;
        }
        return false;
    }

    leaveLadder(player) {
        delete player.data.ladder;
        player.body.allowGravity = true;
    }

    update(game, config) {
        const walkSpeed = 150;
        const jumpForce = -350;
        const ladderSpeed = 150;
        const stickThreshold = 0.5;

        const players = Players.selectPlayers(game);
        const selectLadders = Ladders.selectLadders(game);
        const collideLayer = Arena.selectCollideLayer(game);

        let player = players.first;
        while (player) { 
            const { gamePad, jumpTimer } = player.data;

            // update input
            const leftIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -stickThreshold);
            const rightIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > stickThreshold);

            const upIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -stickThreshold);
            const downIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > stickThreshold);

            const jumpIsPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_A));

            // cache this for collider callbacks
            player.data.input = {
                leftIsPressed, rightIsPressed,
                upIsPressed, downIsPressed,
            };

            if (player.data.ladder) {
                const { ladder, ladderTop, ladderBottom } = player.data;

                // update movement
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                if (upIsPressed) player.body.velocity.y = -ladderSpeed;
                if (downIsPressed) player.body.velocity.y = ladderSpeed;

                // snap to ladder
                player.x = ladder.x;

                // jump from ladder
                if (jumpIsPressed && !upIsPressed && !downIsPressed &&
                    (leftIsPressed || rightIsPressed)) {
                    this.leaveLadder(player, ladderTop)
                    player.body.velocity.y = jumpForce;
                    player.data.jumpTimer = game.time.now + 150;
                }

                // climb off the top of the ladder AND
                // climb off the bottom of the ladder
                if (player.y < ladderTop || player.y > ladderBottom) {
                    this.leaveLadder(player, ladderTop);
                }

            } else {
                // check for ladders first
                game.physics.arcade.collide(player, selectLadders.list, null, this.handleLadder);

                // check for tiles second
                collideLayer && game.physics.arcade.collide(player, collideLayer);

                // update movement
                player.body.velocity.x = 0;
                if (leftIsPressed) player.body.velocity.x = -walkSpeed;
                if (rightIsPressed) player.body.velocity.x = walkSpeed;

                if (jumpIsPressed && player.body.onFloor() && game.time.now > jumpTimer) {
                    player.body.velocity.y = jumpForce;
                    player.data.jumpTimer = game.time.now + 150;
                }
            }

            player = players.next;
        }
    }
}
