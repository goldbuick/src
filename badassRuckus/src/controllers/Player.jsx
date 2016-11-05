import { Controller } from '../Controller';

export default class Player extends Controller {

    static config = {
        x: 100,
        y: 100,
        w: 8,
        h: 16,
        gamePad: undefined,
        collideLayer: undefined
    }

    create(game, config) {
        // temp image
        let image = game.make.bitmapData(8, 16);
        image.rect(0, 0, config.w, config.h, '#36D');

        this.player = game.add.sprite(config.x, config.y, image);
        game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(config.w, config.h);

        this.jumpTimer = 0;
        this.cursors = game.input.keyboard.createCursorKeys();
    }

    update(game, config) {
        config.collideLayer && game.physics.arcade.collide(this.player, config.collideLayer);

        let { player } = this;
        const walkSpeed = 150;
        const stickThreshold = 0.1;
        const { gamePad } = config;

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

        if (jumpIsPressed && player.body.onFloor() && game.time.now > this.jumpTimer) {
            player.body.velocity.y = -350;
            this.jumpTimer = game.time.now + 750; // prevent double jump??
        }
    }
}
