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

    handleFire = (bullet, weapon) => {
        bullet.data.weapon = weapon;
        bullet.body.allowGravity = false;
    }

    handleKilled = (bullet) => {
        // const { weapon } = bullet.data;
        // const { fx } = weapon;
        // fx.spark(bullet.x, bullet.y);
    }

    add(game) {
        const { config } = Weapons;
        const fx = this.control(Fx);

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#666');
        image.rect(1, 1, config.w - 2, config.h - 2, '#fff');

        // weapon factory
        let weapon = game.add.weapon(10, image);
        weapon.fireRate = 256;
        weapon.bulletSpeed = 1024;
        weapon.bulletLifespan = 512;
        weapon.bulletAngleVariance = 1;
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        console.log('weapon', weapon.bulletDistance, weapon.bulletKillType);

        weapon.fx = fx.add(game, {});
        weapon.onFire.add(this.handleFire);
        weapon.onKill.add(this.handleKilled);

        // tag it
        Controller.tag(weapon.bullets, TAGS.WEAPON);

        // return it
        return weapon;
    }

    handleCollideLayer = (bullet, other) => {
        const { weapon } = bullet.data;
        const { fx } = weapon;
        fx.spark(bullet.x, bullet.y);
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
