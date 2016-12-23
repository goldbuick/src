import Fx from './Fx';
import UI from './UI';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import Weapons from './Weapons';
import { pickFrom } from '../Util';
import { Controller } from '../Controller';

export default class Monsters extends Controller {

    static selectMonsters(game) {
        return Controller.selectByTag(game, TAGS.MONSTER);
    }

    static config = {
        w: 20,
        h: 20
    }

    shutdown(game, config) {
        game.time.events.remove(this.spawnTimer);
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
                fx.spark(monster.x, monster.y);
                this.DEAD(monster);
            },

            DEAD: this.noop
        });

        this.spawn(game);
        this.spawnTimer = game.time.events.loop(10000, () => this.spawn(game));        
    }

    spawn(game) {
        // not too many
        if (Monsters.selectMonsters(game).total >= 20) return;

        let r = new Alea();
        const collideLayer = Arena.selectCollideLayer(game);
        const plat = pickFrom(r, collideLayer.data.platforms);
        const x = Math.round(plat.pleft + r() * plat.pwidth);
        const y = plat.py - 10;

        this.add(game, { x, y });
    }

    add(game, { x, y }) {
        const { config } = this;
        const fx = this.control(Fx);
        const ui = this.control(UI);

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
        monster.body.deltaMax.y = config.h * 0.75;

        // config health
        monster.health = monster.maxHealth = 8;
        ui.healthMeter(game, monster);

        // add fx
        monster.data.fx = fx.add(game, { isRed: true });

        // add event handlers
        monster.events.onKilled.add(this.KILL);

        // start brain
        this.IDLE_START(monster);

        // tag it 
        Controller.tag(monster, TAGS.MONSTER);
    }

    update(game, config) {
        const fx = this.control(Fx);
        const ui = this.control(UI);
        const weapons = Weapons.selectWeapons(game);
        const monsters = Monsters.selectMonsters(game);
        const collideLayer = Arena.selectCollideLayer(game);

        const handleHit = (monster, bullet) => {
            const dmg = 1;
            bullet.kill();
            monster.damage(dmg);
            ui.healthMeter(game, monster);
            fx.addTx(game, monster.x, monster.y - monster.height, ''+dmg);
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
