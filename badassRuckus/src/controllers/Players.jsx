import TAGS from '../Tags';
import Arena from './Arena';
import Ladders from './Ladders';
import Weapons from './Weapons';
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
        gravity: 1600,
        walkSpeed: 250,
        jumpForce: -450,
        ladderSpeed: 125,
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
            player.data.weapon = Weapons.add(game, { count: 30 });

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
    }

    leaveLadder(player) {
        delete player.data.ladder;
        player.body.allowGravity = true;
    }

    update(game, config) {
        const stickThreshold = 0.5;
        const { walkSpeed, jumpForce, ladderSpeed } = config;

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

            const jumpIsPressed = (
                gamePad.isDown(Phaser.Gamepad.XBOX360_A) ||
                gamePad.isDown(Phaser.Gamepad.XBOX360_B) ||
                gamePad.isDown(Phaser.Gamepad.XBOX360_X) ||
                gamePad.isDown(Phaser.Gamepad.XBOX360_Y));

            const primaryDodgePressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER));
            const primaryWeaponPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER));
            const secondaryDodgePressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER));
            const secondaryWeaponPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER));

            // cache this for collider callbacks
            player.data.input = {
                leftIsPressed, rightIsPressed,
                upIsPressed, downIsPressed,
                primaryDodgePressed, primaryWeaponPressed, 
                secondaryDodgePressed, secondaryWeaponPressed, 
            };

            // cache current facing direction
            if (leftIsPressed && !rightIsPressed) {
                player.data.facing = -1;
            }
            if (!leftIsPressed && rightIsPressed) {
                player.data.facing = 2;
            }

            // shoootan
            if (primaryWeaponPressed) {
                const facing = player.data.facing || 1;
                let from = player.position.clone();
                from.y += 5;
                from.x += player.width * facing;
                player.data.weapon.fire(from, from.x + facing * 32, from.y);
            }

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
                game.physics.arcade.overlap(player, selectLadders.list, this.handleLadder);

                // check for tiles second
                game.physics.arcade.collide(player, collideLayer);

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
