import Fx from './Fx';
import UI from './UI';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import Phaser from 'phaser';
import Ladders from './Ladders';
import Weapons from './Weapons';
import { pickFrom } from '../Util';
import globals, { r } from '../Globals';
import { Controller } from '../Controller';

export default class Players extends Controller {

    static selectPlayers(game) {
        return Controller.selectByTag(game, TAGS.PLAYER);
    }

    static config = {
        w: 10,
        h: 18,
        skw: 16,
        gravity: 1600,
        walkSpeed: 250,
        dashSpeed: 1024,
        jumpForce: -450,
        ladderSpeed: 125,
    }

    add(game, { x, y, pad, name, image, config }) {
        const fx = this.control(Fx);
        const ui = this.control(UI);
        const weapons = this.control(Weapons);
        const { jumpForce } = config;

        let player = game.add.sprite(x, y, image);
        player.width = config.w;
        player.height = config.h;
        player.anchor.set(0.5, 1);
        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.setSize(config.w, config.h);
        player.body.deltaMax.y = config.h * 0.75;

        player.data.gamePad = pad;
        player.data.healthGen = 1;
        player.data.healthTick = 0;
        player.data.jumpTimer = 0;
        player.data.jumpCount = 1;
        player.data.jumpForce = jumpForce;
        player.data.weapon = weapons.add(game, Phaser.Bullet);
        player.data.weapon.player = player;

        // add animated sprite
        let skin = game.make.sprite(0, 0, name);
        skin.width = config.skw;
        skin.height = config.skw * 2;
        skin.anchor.set(0.5, 1);
        skin.animations.add('climb', [0]);
        skin.animations.add('climbing', [0, 1]);
        skin.animations.add('dash', [2]);
        skin.animations.add('hit', [4]);
        skin.animations.add('jump', [5]);
        skin.animations.add('stand', [3, 6]);
        skin.animations.add('swim', [7, 8]);
        skin.animations.add('walk', [9, 10]);
        skin.play('stand', 3, true);
        player.addChild(skin);
        player.data.skin = skin;
        player.data.skinScale = skin.scale.x;

        // add gun
        let gunzSprite = pickFrom(r, [
            'raygun',
            'raygunBig',
            'raygunPurple',
            'raygunPurpleBig',
        ]);
        let gunz = game.make.sprite(0, 0, gunzSprite);
        gunz.width = gunz.height = 70 * 3;
        gunz.anchor.set(0.5, 0.5);
        gunz.x = 80;
        gunz.y = -45;
        skin.addChild(gunz);
        player.data.gunz = gunz;

        // config health
        player.health = player.maxHealth = 128;
        ui.healthMeter(game, player);

        // add fx
        player.data.fx = fx.add(game, { isRed: true });

        // start brain
        this.ACTIVE(player);

        // track it
        Controller.tag(player, TAGS.PLAYER);
    }

    handleCoinCollect(game, player, coin) {
        const fx = this.control(Fx);
        const ui = this.control(UI);
        fx.audio.coin.play();
        fx.addBeam(game, coin.x, coin.y, coin.width);
        fx.addTx(game, coin.x, coin.y - coin.height, 'unlock barrels', '#fff');
        player.data.coins = (player.data.coins || 0) + 1;
        if (player.data.coins > 5) {
            player.data.coins = 0;
        }
        ui.coinMeter(game, player);
    }

    handleCrownCollect(game, player, crown) {
        const fx = this.control(Fx);
        const ui = this.control(UI);
        fx.audio.crown.play();
        fx.addBeam(game, crown.x, crown.y, crown.width);
        player.data.crowns = (player.data.crowns || 0) + 1;
        if (player.data.crowns >= 5) {
            player.data.crowns = 0;
        }
        ui.crownMeter(game, player);
        return player.data.crowns;
    }

    handleCoinCheck(game, player) {
        const ui = this.control(UI);
        const coins = (player.data.coins || 0);
        const nextCoins = coins - 1;
        if (nextCoins < 0) return false;
        player.data.coins = nextCoins;
        ui.coinMeter(game, player);
        return true;
    }

    handleLadder = (player, ladder) => {
        player.data.ladderTop = ladder.y;
        player.data.ladderBottom = ladder.y + ladder.height - 2;
        if ((player.data.input.upIsPressed && player.y > player.data.ladderTop) ||
            (player.data.input.downIsPressed && player.y < player.data.ladderBottom)) {
            player.data.ladder = ladder;
            player.body.allowGravity = false;
            player.data.gunz.visible = false;
            this.LADDER(player);
        }
    }

    leaveLadder(player) {
        delete player.data.ladder;
        player.body.allowGravity = true;
        player.data.gunz.visible = true;
        player.data.jumpsLeft = player.data.jumpCount - 1;
        this.ACTIVE(player);
    }

    create(game, config) {
        const { walkSpeed, dashSpeed, ladderSpeed } = config;

        this.cooldown({
            alt: 5, // secondary weapon
            dash: 5, // primary dodge
        });

        this.behaviors({
            ACTIVE: (player, { fx, ladders, collideLayer }) => {
                const { skin } = player.data;
                const { currentAnim } = skin.animations;
                const { jumpIsPressed, 
                    leftIsPressed, rightIsPressed,
                    primaryDodgePressed, secondaryDodgePressed,
                    primaryWeaponPressed, secondaryWeaponPressed } = player.data.input;

                // check for ladders first
                game.physics.arcade.overlap(player, ladders.list, this.handleLadder);

                // check for tiles second
                game.physics.arcade.collide(player, collideLayer);

                // triggers
                if (primaryWeaponPressed) {
                    const { weapon, facing } = player.data;
                    let from = player.position.clone();
                    from.y -= 6;
                    from.x += player.width * (facing || 1);
                    for (let i=0; i < weapon.shouldFire; ++i) {
                        weapon.fire(from, from.x + facing * 32, from.y);
                    }
                }
                if (secondaryWeaponPressed && this.altCooldown(game, player)) {
                }
                if (primaryDodgePressed && this.dashCooldown(game, player)) {
                    this.DASH_START(player);
                }
                if (secondaryDodgePressed && this.dashCooldown(game, player)) {
                }

                // update animation
                switch (currentAnim.name) {
                    case 'stand':
                        if (!player.body.onFloor()) {
                            skin.play('jump');
                        } else if (leftIsPressed || rightIsPressed) {
                            skin.play('walk', 6, true);
                        }
                        break;
                    case 'walk':
                        if (!player.body.onFloor()) {
                            skin.play('jump');
                        } else if (!leftIsPressed && !rightIsPressed) {
                            skin.play('stand', 3, true);
                        }
                        break;
                    default:
                        if (player.body.onFloor()) {
                            skin.play('stand', 3, true);
                        }
                        break;
                }

                // update movement
                player.body.velocity.x = 0;
                if (leftIsPressed) player.body.velocity.x = -walkSpeed;
                if (rightIsPressed) player.body.velocity.x = walkSpeed;

                if (player.body.onFloor()) {
                    player.data.floorTimer = game.time.now + 100;
                    player.data.jumpsLeft = player.data.jumpCount;
                }

                if (jumpIsPressed &&
                    game.time.now > player.data.jumpTimer) {

                    const jumpsLeft = player.data.jumpsLeft > 0;
                    const onFloor = game.time.now < player.data.floorTimer;
                    const canJump = onFloor || (!onFloor && jumpsLeft);

                    player.data.jumpTimer = game.time.now + 300;
                    if (canJump) {
                        --player.data.jumpsLeft;
                        player.body.velocity.y = player.data.jumpForce;
                    }
                }
            },
            LADDER: (player, { fx }) => {
                const { skin, ladder, ladderTop, ladderBottom } = player.data;
                const { currentAnim } = skin.animations;
                const { leftIsPressed, rightIsPressed, upIsPressed, downIsPressed,
                    jumpIsPressed, primaryWeaponPressed, secondaryWeaponPressed } = player.data.input;
                
                // update animation
                switch (currentAnim.name) {
                    default:
                    case 'climb':
                        if (upIsPressed || downIsPressed) {
                            skin.play('climbing', 6, true);
                        }
                        break;
                    case 'climbing':
                        if (!upIsPressed && !downIsPressed) {
                            skin.play('climb');
                        }
                        break;
                }

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
                    player.body.velocity.y = player.data.jumpForce;
                    player.data.jumpTimer = game.time.now + 150;
                }

                // climb off the top of the ladder AND
                // climb off the bottom of the ladder
                if (player.y < ladderTop || player.y > ladderBottom) {
                    this.leaveLadder(player, ladderTop);
                }
            },
            DASH_START: (player, { fx }) => {
                const { skin } = player.data;
                skin.play('dash');
                fx.audio.dash.play();
                player.data.dashing = true;
                player.body.allowGravity = false;
                player.data.gunz.visible = false;
                this.wait(game, player, 128);
                this.DASH(player);
            },
            DASH: (player, { collideLayer }) => {
                const facing = player.data.facing || 1;
                player.body.velocity.y = 0;
                player.body.velocity.x = facing * dashSpeed;

                // check for tiles second
                game.physics.arcade.collide(player, collideLayer);

                // bail when done
                this.ready(game, player, this.DASH_DONE);
            },
            DASH_DONE: (player) => {
                player.data.dashing = false;
                player.data.skin.play('jump');
                player.body.allowGravity = true;
                player.data.gunz.visible = true;
                this.ACTIVE(player);
            },
            UNDEAD: (player) => {

            }
        });

        const names = [
            'alienBlue',
            'alienGreen',
            'alienPink',
            'alienYellow',
        ];

        const pads = [
            game.input.gamepad.pad1,
            game.input.gamepad.pad2,
            game.input.gamepad.pad3,
            game.input.gamepad.pad4,
        ];
        
        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        // image.rect(0, 0, config.w, config.h, '#36D');

        const arena = this.control(Arena);
        for (let i=0; i < 4; ++i) {
            if (globals.playerActive[i]) {
                let { x, y } = arena.pickSpawn(game, 10);
                y -= 10;
                const pad = pads[i];
                const name = names[i];
                this.add(game, { x, y, pad, name, image, config });
            }
        }
    }

    update(game, config) {
        const stickThreshold = 0.5;
        const fx = this.control(Fx);
        const ui = this.control(UI);
        const players = Players.selectPlayers(game);
        const weapons = Weapons.selectWeapons(game);
        const ladders = Ladders.selectLadders(game);
        const collideLayer = Arena.selectCollideLayer(game);

        const handleHit = (target, bullet) => {
            const { player, bulletDamage } = bullet.data.bulletManager;
            if (target === player) return;
            bullet.kill();
            target.damage(bulletDamage);
            ui.healthMeter(game, target);
            fx.audio.impact.play();
            fx.addTx(game, target.x, target.y - target.height, ''+bulletDamage);
        };

        let player = players.first;
        while (player) { 
            const { gamePad } = player.data;

            // update input
            const leftIsPressed = gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -stickThreshold ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -stickThreshold;
            const rightIsPressed = gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > stickThreshold ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > stickThreshold;

            const upIsPressed = gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -stickThreshold ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -stickThreshold;
            const downIsPressed = gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > stickThreshold ||
                gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > stickThreshold;

            const jumpIsPressed = (
                gamePad.isDown(Phaser.Gamepad.XBOX360_A) ||
                gamePad.isDown(Phaser.Gamepad.XBOX360_B) ||
                gamePad.isDown(Phaser.Gamepad.XBOX360_X) ||
                gamePad.isDown(Phaser.Gamepad.XBOX360_Y));

            const primaryDodgePressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER));
            const primaryWeaponPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER));
            const secondaryDodgePressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER));
            const secondaryWeaponPressed = (gamePad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER));

            // cache inputs
            player.data.input = {
                jumpIsPressed,
                leftIsPressed,
                rightIsPressed,
                upIsPressed, 
                downIsPressed,
                primaryDodgePressed, 
                primaryWeaponPressed, 
                secondaryDodgePressed, 
                secondaryWeaponPressed, 
            };

            // cache current facing direction
            if (leftIsPressed && !rightIsPressed) {
                player.data.facing = -1;
            }
            if (!leftIsPressed && rightIsPressed) {
                player.data.facing = 1;
            }
            if (player.data.facing) {                
                player.data.skin.scale.x = player.data.skinScale * player.data.facing;
            }

            // execute current behavior
            this.run(player, { fx, ui, players, weapons, ladders, collideLayer });

            // check for bullets
            if (!player.data.dashing) {
                game.physics.arcade.overlap(player, weapons.list, handleHit);
            }

            // update cooldowns
            const altMeter = this.altRatio(game, player);
            const dashMeter = this.dashRatio(game, player);
            ui.cooldownMeter(game, player, 'altMeter', 0, altMeter);
            ui.cooldownMeter(game, player, 'dashMeter', 1, dashMeter);

            // update health
            if (++player.data.healthTick > 30) {
                player.data.healthTick = 0;
                player.heal(player.data.healthGen);
            }

            // update next player
            player = players.next;
        }
    }
}
