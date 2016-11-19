import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import Weapons from './Weapons';
import { Controller } from '../Controller';

export default class Monsters extends Controller {

    static selectMonsters(game) {
        return Controller.selectByTag(game, TAGS.MONSTER);
    }

    static config = {
        w: 20,
        h: 20
    }

    static add(game, { x, y }) {
        const { config } = Monsters;

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#BA55D3');

        let monster = game.add.sprite(x, y, image);
        game.physics.arcade.enable(monster);

        monster.body.collideWorldBounds = true;
        monster.body.setSize(config.w, config.h);

        Controller.tag(monster, TAGS.MONSTER);
    }

    handleWeaponHit = (monster, bullet) => {
        monster.kill();
        bullet.kill();
    }

    update(game, config) {
        const weapons = Weapons.selectWeapons(game);
        const monsters = Monsters.selectMonsters(game);
        const collideLayer = Arena.selectCollideLayer(game);

        let monster = monsters.first;
        while (monster) {
            // check for tiles 
            game.physics.arcade.collide(monster, collideLayer);  

            // check for bullets
            game.physics.arcade.overlap(monster, weapons.list, this.handleWeaponHit);

            // walk switch timer
            if (!monster.data.turn || game.time.now > monster.data.turn) {
                monster.data.walk = Math.random() < 0.5 ? -1 : 1;
                monster.data.turn = game.time.now + Math.floor(Math.random() * 8000);
            }

            monster.body.velocity.x = 0;
            if (monster.body.onFloor()) {
                // walk movement 
                monster.body.velocity.x = monster.data.walk * 100;

                // edge detection
                let facing = monster.x + (monster.data.walk < 0 ? -1 : 0.25) * monster.width;
                const map = collideLayer.map;
                const tile = map.getTileBelow(
                    collideLayer.index,
                    Math.round(facing / map.tileWidth),
                    Math.round(monster.y / map.tileHeight));

                if (!tile.collideUp) monster.data.walk *= -1;
            }
    
            // update next monster
            monster = monsters.next;
        }
    }

}
