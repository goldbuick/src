import Fx from './Fx';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import { Controller } from '../Controller';

export default class Weapons extends Controller {

    static selectWeapons(game) {
        return Controller.selectByTag(game, TAGS.WEAPON);
    }

    static config = {
        w: 8,
        h: 3
    }

    static handleFire = (bullet, weapon) => {
        bullet.data.weapon = weapon;
        bullet.body.allowGravity = false;
    }

    static handleKilled = (bullet) => {
        const { weapon } = bullet.data;
        const { fx } = weapon;
        Fx.spark(fx, bullet.x, bullet.y);
    }

    static add(game, {count}) {
        const { config } = Weapons;

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#FF0');

        // weapon factory
        let weapon = game.add.weapon(count, image);
        weapon.fireRate = 256;
        weapon.bulletSpeed = 1024;
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        weapon.fx = Fx.add(game, {});
        weapon.onFire.add(Weapons.handleFire);
        weapon.onKill.add(Weapons.handleKilled);

        // tag it
        Controller.tag(weapon.bullets, TAGS.WEAPON);

        // return it
        return weapon;
    }

    handleCollideLayer = (bullet, other) => {
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
