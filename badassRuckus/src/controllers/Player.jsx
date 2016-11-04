import { Controller } from './Controller';

export default class Player extends Controller {

    static config = {
        x: 100,
        y: 100,
        w: 8,
        h: 16,
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

        const walkSpeed = 150;
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) this.player.body.velocity.x = -walkSpeed;
        if (this.cursors.right.isDown) this.player.body.velocity.x = walkSpeed;
        if (this.cursors.up.isDown && this.player.body.onFloor() && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -350;
            this.jumpTimer = game.time.now + 750; // prevent double jump??
        }
    }
}
