import Fx from './Fx';
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
        const fx = this.control(Fx);
        fx.audio.gun.play();
        bullet.data.weapon = weapon;
        bullet.body.allowGravity = false;
    }

    add(game, klass) {
        const { config } = Weapons;
        const fx = this.control(Fx);

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#666');
        image.rect(1, 1, config.w - 2, config.h - 2, '#fff');

        // weapon factory
        let weapon = this.game.plugins.add(Phaser.Weapon);
        weapon._bulletClass = klass;
        weapon.createBullets(32, image);
        weapon.fireRate = 300;
        weapon.multiFire = true;
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
