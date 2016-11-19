import Alea from 'alea';
import TAGS from '../Tags';
import { Controller } from '../Controller';

export default class Weapons extends Controller {

    static config = {
        w: 8,
        h: 3
    }

    static add(game, {count}) {
        const { config } = Weapons;

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#FFF');

        // weapon factory
        let weapon = game.add.weapon(count, image);
        weapon.fireRate = 256;
        weapon.bulletSpeed = 1024;
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        weapon.onFire.add((bullet, weapon) => bullet.body.allowGravity = false, this);

        // tag it
        Controller.tag(weapon, TAGS.WEAPON);

        // return it
        return weapon;
    }

}
