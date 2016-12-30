import Fx from './Fx';
import TAGS from '../Tags';
import Arena from './Arena';
import { r } from '../Globals';
import { pickFrom } from '../Util';
import { Controller } from '../Controller';

const ALTS = {
    MINE: 'land mine',
    PLASMA: 'plasma',
    ROCKET: 'rocket',
    GRENADE: 'grenade',
    SHOTGUN: 'shotgun',
    RAILGUN: 'railgun',
    BLACKHOLE: 'singularity',
};

export default class Weapons extends Controller {

    static selectWeapons(game) {
        return Controller.selectByTag(game, TAGS.WEAPON);
    }

    static config = {
    }

    handleFire = (bullet, weapon) => {
        const fx = this.control(Fx);
        fx.audio.gun.play();
        bullet.data.weapon = weapon;
        bullet.body.allowGravity = false;
    }

    addAlt(game, player) {
        let type = pickFrom(r, [ 
            ALTS.PLASMA,
            ALTS.SHOTGUN,
            // ALTS.MINE, ALTS.PLASMA, ALTS.ROCKET, 
            // ALTS.GRENADE, ALTS.SHOTGUN, ALTS.RAILGUN, ALTS.BLACKHOLE 
        ]);

        let weapon;
        switch (type) {
            case ALTS.MINE:
                break;
            case ALTS.PLASMA:
                break;
            case ALTS.ROCKET:
                break;
            case ALTS.GRENADE:
                break;
            case ALTS.SHOTGUN:
                break;
            case ALTS.RAILGUN:
                break;
            case ALTS.BLACKHOLE:
                break;
        }

        weapon.weaponName = type;
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
        weapon.createBullets(32, image);
        weapon.shouldFire = 1;
        weapon.multiFire = true;
        weapon.fireRate = 300;
        weapon.bulletDamage = 1;
        weapon.bulletSpeed = 1024;
        weapon.bulletLifespan = 512;
        weapon.bulletAngleVariance = 6;
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;

        weapon.fx = fx.add(game, {});
        weapon.onFire.add(this.handleFire);

        // tag it
        Controller.tag(weapon.bullets, TAGS.WEAPON);

        // return it
        return weapon;
    }

    handleCollideLayer = (bullet, other) => {
        const { weapon } = bullet.data;
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
            // check for tiles 
            game.physics.arcade.collide(weapon, collideLayer, this.handleCollideLayer);

            weapon = weapons.next;
        }
    }

}
