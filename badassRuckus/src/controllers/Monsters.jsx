import Fx from './Fx';
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

    create(game, config) {
        this.behaviors({
            IDLE_START: (monster) => {
                monster.body.velocity.x = 0;
                this.wait(game, monster, Math.floor(Math.random() * 8000));
                this.IDLE(monster);
            },

            IDLE: (monster) => this.ready(game, monster, this.TURN),

            TURN: (monster) => {
                monster.data.walk = Math.random() < 0.5 ? -1 : 1;
                this.wait(game, monster, Math.floor(Math.random() * 2000));
                this.WALK(monster);
            },

            WALK: (monster, { collideLayer }) => {
                collideLayer = collideLayer || Arena.selectCollideLayer(game);

                monster.body.velocity.x = 0;
                if (monster.body.onFloor()) {
                    // walkin
                    monster.body.velocity.x = monster.data.walk * 100;

                    // edge detection
                    let facing = monster.x + (monster.data.walk < 0 ? -1 : 0.25) * monster.width;
                    const map = collideLayer.map;
                    const tile = map.getTileBelow(
                        collideLayer.index,
                        Math.round(facing / map.tileWidth),
                        Math.round(monster.y / map.tileHeight));

                    // turn around!
                    if (!tile.collideUp) monster.data.walk *= -1;
                }

                // randomly turn around
                this.ready(game, monster, this.IDLE_START);
            },

            WEAPON_HIT: (monster, bullet) => {
                monster.kill();
                bullet.kill();
            },

            KILL: (monster) => {
                const { fx } = monster.data;
                Fx.spark(fx, monster.x, monster.y);
                this.DEAD(monster);
            },

            DEAD: this.noop
        });
    }


    add(game, { x, y }) {
        const { config } = this;

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#BA55D3');

        // create sprite
        let monster = game.add.sprite(x, y, image);        

        // config physics
        game.physics.arcade.enable(monster);
        monster.body.collideWorldBounds = true;
        monster.body.setSize(config.w, config.h);

        // add fx
        monster.data.fx = Fx.add(game, { isRed: true });

        // add event handlers
        monster.events.onKilled.add(this.KILL);

        // start brain
        this.IDLE_START(monster);

        // tag it 
        Controller.tag(monster, TAGS.MONSTER);
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
            game.physics.arcade.overlap(monster, weapons.list, this.WEAPON_HIT);

            // execute current behavior
            this.run(monster, { collideLayer });
    
            // update next monster
            monster = monsters.next;
        }
    }

}
