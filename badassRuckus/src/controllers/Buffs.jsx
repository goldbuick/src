import Fx from './Fx';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import { r } from '../Globals';
import Players from './Players';
import { Controller } from '../Controller';
import { range, pickFrom } from '../Util';

export default class Buffs extends Controller {

    static selectBuffs(game) {
        return Controller.selectByTag(game, TAGS.BUFFS);
    }

    static config = {
        w: 10,
        h: 14
    }

    shutdown(game, config) {
        game.time.events.remove(this.spawnTimer);
    }
    
    create(game, config) {
        this.spawn(game);
        this.spawnTimer = game.time.events.loop(10000, () => this.spawn(game));
    }

    spawn(game) {
        // not too many
        if (Buffs.selectBuffs(game).total >= 5) return;

        const collideLayer = Arena.selectCollideLayer(game);
        const plat = pickFrom(r, collideLayer.data.platforms);
        const x = Math.round(plat.pleft + r() * plat.pwidth);
        const y = plat.py - 10;

        this.add(game, x, y);
    }

    add(game, x, y) {
        const { config } = this;
        const fx = this.control(Fx);

        // create sprite
        let buff = game.add.sprite(x, y, 'buffbox');
        buff.anchor.set(0.5, 1);

        // config physics
        game.physics.arcade.enable(buff);
        buff.body.collideWorldBounds = true;
        buff.body.setSize(config.w, config.h);
        buff.body.deltaMax.y = config.h * 0.75;

        // spawn blip
        fx.audio.spawn.play();
        fx.addBeam(game, x, y, buff.width);
        
        // tag it 
        Controller.tag(buff, TAGS.BUFFS);
    }

    update(game, config) {
        const fx = this.control(Fx);
        const player = this.control(Players);
        const buffs = Buffs.selectBuffs(game);
        const players = Players.selectPlayers(game);
        const collideLayer = Arena.selectCollideLayer(game);

        const handlePickup = (buff, player) => {
            const players = this.control(Players);
            if (!players.handleCoinCheck(game, player)) return;
            
            const types = 5;
            let buffName = '';
            switch (pickFrom(r, range(0, types))) {
                case 0:
                    buffName = 'spread shot';
                    break;
                case 1:
                    buffName = 'seeking shot';
                    break;
                case 2:
                    buffName = 'damage up';
                    break;
                case 3:
                    buffName = 'accuracy';
                    break;
                case 4:
                    buffName = 'range up';
                    break;
                case 5:
                    buffName = 'speed up';
                    break;
            }

            buff.kill();
            fx.audio.buff.play();
            fx.addBeam(game, buff.x, buff.y, buff.width);
            fx.addTx(game, buff.x, buff.y - buff.height, buffName, '#0f0');
        };
        
        let buff = buffs.first;
        while (buff) {
            // check for tiles 
            game.physics.arcade.collide(buff, collideLayer);  

            // check for players
            game.physics.arcade.overlap(buff, players.list, handlePickup);

            // update next buff
            buff = buffs.next;
        }
    }

}