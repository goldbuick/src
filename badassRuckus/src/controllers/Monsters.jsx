import Fx from './Fx';
import UI from './UI';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import Coins from './Coins';
import { r } from '../Globals';
import Weapons from './Weapons';
import { range, pickFrom } from '../Util';
import { Controller } from '../Controller';

export default class Monsters extends Controller {

    static selectMonsters(game) {
        return Controller.selectByTag(game, TAGS.MONSTER);
    }

    static config = {
    }

    shutdown(game, config) {
        game.time.events.remove(this.spawnTimer);
    }

    create(game, config) {
        this.behaviors({
            IDLE_START: (monster) => {
                monster.body.velocity.x = 0;
                this.wait(game, monster, Math.floor(r() * 8000));
                this.IDLE(monster);
            },

            IDLE: (monster) => this.ready(game, monster, this.TURN),

            TURN: (monster) => {
                monster.data.walk = r() < 0.5 ? -1 : 1;
                this.wait(game, monster, 2000 + Math.floor(r() * 4000));
                this.WALK(monster);
            },

            WALK: (monster, { collideLayer }) => {
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
                const fx = this.control(Fx);
                const coins = this.control(Coins);
                coins.add(game, monster.x, monster.y, monster.data.player);

                fx.audio.splat.play();
                monster.data.fx.spark(monster.x, monster.y);
                this.DEAD(monster);
            },

            DEAD: this.noop
        });

        for (let i=0; i < 10; ++i) this.spawn(game);
        this.spawnTimer = game.time.events.loop(10000, () => this.spawn(game));
    }

    spawn(game) {
        // not too many
        if (Monsters.selectMonsters(game).total >= 20) return;

        const arena = this.control(Arena);
        let { x, y } = arena.pickSpawn(game, 10);

        this.add(game, x, y - 10);
    }

    add(game, x, y) {
        const fx = this.control(Fx);
        const ui = this.control(UI);

        const type = pickFrom(r, range(0, 3));

        let w, h, color, health;
        switch (type) {
            case 0:
                w = h = 20;
                health = 8;
                color = '#BA55D3';
                break;
            case 1:
                w = 10;
                h = 22;
                health = 12;
                color = '#F59C5D';
                break;
            case 2:
                w = h = 10;
                health = 6;
                color = '#A32A51';
                break;
        }

        // temp image
        let image = game.make.bitmapData(w, h);
        image.rect(0, 0, w, h, color);

        // create sprite
        let monster = game.add.sprite(x, y, image);
        monster.anchor.set(0.5, 1);

        // config physics
        game.physics.arcade.enable(monster);
        monster.body.collideWorldBounds = true;
        monster.body.setSize(w, h);
        monster.body.deltaMax.y = h * 0.75;

        // config health
        monster.health = monster.maxHealth = 8;
        ui.healthMeter(game, monster);

        // add fx
        monster.data.fx = fx.add(game, { isRed: true });

        // add event handlers
        monster.events.onKilled.add(this.KILL);

        // start brain
        this.IDLE_START(monster);

        // spawn blip
        fx.audio.spawn.play();
        fx.addBeam(game, x, y, monster.width);

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
            const { player, bulletDamage } = bullet.data.bulletManager;
            bullet.kill();
            monster.damage(bulletDamage);
            ui.healthMeter(game, monster);
            monster.data.player = player;
            monster.data.fx.spark(monster.x, monster.y);
            fx.audio.impact.play();
            fx.addTx(game, monster.x, monster.y - monster.height, ''+bulletDamage);
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
