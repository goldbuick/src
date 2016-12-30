import Fx from './Fx';
import TAGS from '../Tags';
import Arena from './Arena';
import { r } from '../Globals';
import { pickFrom } from '../Util';
import Chained from '../bullet/Chained';
import Trailer from '../bullet/Trailer';
import { Controller } from '../Controller';

const ALTS = {
    MINE: 'land mine',
    PLASMA: 'plasma',
    ROCKETS: 'rockets',
    GRENADE: 'grenade',
    SHOTGUN: 'shotgun',
    RAILGUN: 'railgun',
};

const MAX_SHIT = 64;

export default class Weapons extends Controller {

    static selectWeapons(game) {
        return Controller.selectByTag(game, TAGS.WEAPON);
    }

    static config = {
    }

    handleFire = (bullet, weapon) => {
        const fx = this.control(Fx);
        fx.audio.gun.play();
        bullet.body.allowGravity = (weapon.hasGravity === true);
    }

    handleFireLimit = (weapon, fireLimit) => {
        weapon.resetShots();
    }

    addAlt(game, player) {
        const fx = this.control(Fx);

        let type = pickFrom(r, [ 
            ALTS.MINE, ALTS.PLASMA, ALTS.ROCKETS, 
            ALTS.GRENADE, ALTS.SHOTGUN, ALTS.RAILGUN
        ]);

        let weapon;
        switch (type) {
            case ALTS.MINE:
                weapon = this.add(game, { 
                    player, w: 10, h: 6, color: '#666', klass: Chained });
                weapon.bulletSpeed = 0;
                weapon.hasGravity = true;
                weapon.bulletDamage = 64;
                weapon.bulletLifespan = 10000;
                weapon.bulletAngleVariance = 0;
                break;
            case ALTS.PLASMA:
                weapon = this.add(game, { 
                    player, w: 14, h: 14, color: '#06f', square: false, klass: Chained });
                weapon.bulletSpeed = 512;
                weapon.bulletDamage = 16;
                weapon.bulletLifespan = 1000;
                weapon.bulletAngleVariance = 0;
                break;
            case ALTS.ROCKETS:
                weapon = this.add(game, { 
                    player, w: 14, h: 4, color: '#f40', klass: Trailer });
                weapon.fx = fx.add(game);
                weapon.shouldFire = 2;
                weapon.bulletDamage = 8;
                weapon.bulletAngleVariance = 3;
                break;
            case ALTS.GRENADE:
                weapon = this.add(game, { 
                    player, w: 8, h: 8, color: '#2f4', klass: Trailer });
                weapon.fx = fx.add(game);
                weapon.bulletDamage = 32;
                weapon.hasGravity = true;
                weapon.angleOffset = -128;
                weapon.bulletLifespan = 1000;
                weapon.bulletAngleVariance = 0;
                break;
            case ALTS.SHOTGUN:
                weapon = this.add(game, { player, klass: Chained });
                weapon.shouldFire = 6;
                weapon.bulletDamage = 8;
                weapon.bulletAngleVariance = 10;
                break;
            case ALTS.RAILGUN:
                weapon = this.add(game, { 
                    player, w: 64, h: 3, color: '#fff', klass: Trailer });
                weapon.fx = fx.add(game, { noGravity: true });
                weapon.bulletDamage = 8;
                weapon.bulletSpeed = 3000;
                weapon.bulletLifespan = 512;
                weapon.bulletAngleVariance = 0;
                break;
        }

        weapon.fireRate = 0;
        weapon.weaponName = type;
        weapon.fireLimit = MAX_SHIT;
        weapon.bullets.data.noClip = true;
        weapon.bullets.data.hasGravity = weapon.hasGravity;
        return weapon;
    }

    add(game, { player, 
        w = 8, h = 3, color = '#fff', square = true, klass = Phaser.Bullet } = {}) {
        const { config } = Weapons;
        const fx = this.control(Fx);

        // temp image
        let image = game.make.bitmapData(w, h);
        image.clear(0, 0, w, h);
        if (square) {
            image.rect(0, 0, w, h, '#333');
            image.rect(1, 1, w - 2, h - 2, color);
        } else {
            const cx = w * 0.5;
            const cy = h * 0.5;
            const radius = Math.min(w, h) * 0.5;
            image.circle(cx, cy, radius, '#333');
            image.circle(cx, cy, radius - 1, color);
        }

        // weapon factory
        let weapon = this.game.plugins.add(Phaser.Weapon);
        weapon.player = player;
        weapon._bulletClass = klass;
        weapon.createBullets(MAX_SHIT, image);
        weapon.fireRate = 300;
        weapon.bulletDamage = 1;
        weapon.bulletSpeed = 1024;
        weapon.bulletLifespan = 512;
        weapon.bulletAngleVariance = 6;
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;

        weapon.fx = fx.add(game, {});
        weapon.onFire.add(this.handleFire);
        weapon.onFireLimit.add(this.handleFireLimit);

        weapon.altFire = function (from, tx, ty, angleOffset = 0) {
            const fireCount = this.shouldFire || 1;
            for (let i=0; i < fireCount; ++i) this.fire(from, tx, ty + angleOffset);
        };

        // tag it & return it
        Controller.tag(weapon.bullets, TAGS.WEAPON);
        return weapon;
    }

    handleCollideLayer = (bullet, other) => {
        const { bulletManager: weapon } = bullet.data;
        const fx = this.control(Fx);
        fx.audio.impact.play();
        weapon.fx.spark(bullet.x, bullet.y);
        bullet.kill();
    }

    update(game, config) {
        const weapons = Weapons.selectWeapons(game);
        const collideLayer = Arena.selectCollideLayer(game);

        let weapon = weapons.first;
        while (weapon) { 
            const { noClip, hasGravity } = weapon.data;

            // check for tiles 
            if (hasGravity) {
                game.physics.arcade.collide(weapon, collideLayer);
            } else if (!noClip) {
                game.physics.arcade.collide(weapon, collideLayer, this.handleCollideLayer);
            }

            weapon = weapons.next;
        }
    }

}
