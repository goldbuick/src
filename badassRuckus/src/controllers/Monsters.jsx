import Fx from './Fx';
import UI from './UI';
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
                    const map = collideLayer.map;
                    let xTest = monster.x + monster.data.walk * monster.width;
                    let yTest = monster.y - monster.height;
                    xTest = Math.round(xTest / map.tileWidth);
                    yTest = Math.round(yTest / map.tileHeight);

                    // turn around!
                    const tile = map.getTileBelow(collideLayer.index, xTest, yTest);
                    if (tile && !tile.collideUp) monster.data.walk *= -1;
                }

                // randomly turn around
                this.ready(game, monster, this.IDLE_START);
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
        const ui = this.manager.control(UI);

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#BA55D3');

        // create sprite
        let monster = game.add.sprite(x, y, image);
        monster.anchor.set(0.5, 1);

        // config physics
        game.physics.arcade.enable(monster);
        monster.body.collideWorldBounds = true;
        monster.body.setSize(config.w, config.h);
        monster.body.deltaMax.y = config.h - 2;

        // config health
        monster.health = monster.maxHealth = 8;
        ui.healthMeter(game, monster);

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
        const ui = this.manager.control(UI);
        const weapons = Weapons.selectWeapons(game);
        const monsters = Monsters.selectMonsters(game);
        const collideLayer = Arena.selectCollideLayer(game);

        const handleHit = (monster, bullet) => {
            monster.damage(1);
            bullet.kill();
            ui.healthMeter(game, monster);
        };

        let monster = monsters.first;
        while (monster) {
            // check for tiles 
            game.physics.arcade.collide(monster, collideLayer);  

            // check for bullets
            game.physics.arcade.overlap(monster, weapons.list, handleHit);

            // execute current behavior
            this.run(monster, { collideLayer });
    
            // update next monster
            monster = monsters.next;
        }
    }

}
