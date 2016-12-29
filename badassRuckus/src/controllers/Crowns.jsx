import Fx from './Fx';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import { r } from '../Globals';
import Players from './Players';
import { Controller } from '../Controller';
import { range, pickFrom } from '../Util';

export default class Crowns extends Controller {

    static selectCrowns(game) {
        return Controller.selectByTag(game, TAGS.CROWNS);
    }

    static config = {
        w: 14,
        h: 14
    }

    shutdown(game, config) {
        game.time.events.remove(this.spawnTimer);
    }
    
    create(game, config) {
        this.spawnTimer = game.time.events.repeat(120 * 1000, 0, () => this.reset(game));
    }

    spawn(game) {
        const arena = this.control(Arena);
        let { x, y } = arena.pickSpawn(game, 10);
        this.add(game, x, y - 10);
    }

    reset(game) {
        for (let i=0; i < 5; ++i) {
            this.spawn(game);
        }
    }

    add(game, x, y) {
        const { config } = this;
        const fx = this.control(Fx);

        // create sprite
        let crown = game.add.sprite(x, y, 'crown');
        crown.anchor.set(0.5, 1);

        // config physics
        game.physics.arcade.enable(crown);
        crown.body.collideWorldBounds = true;
        crown.body.setSize(config.w, config.h);
        crown.body.deltaMax.y = config.h * 0.75;

        // spawn blip
        fx.audio.spawn.play();
        fx.addBeam(game, x, y, crown.width);
        
        // tag it 
        Controller.tag(crown, TAGS.CROWNS);
    }

    update(game, config) {
        const fx = this.control(Fx);
        const player = this.control(Players);
        const crowns = Crowns.selectCrowns(game);
        const players = Players.selectPlayers(game);
        const collideLayer = Arena.selectCollideLayer(game);

        const handlePickup = (crown, player) => {
            const players = this.control(Players);
            const count = players.handleCrownCollect(game, player, crown);
            crown.kill();
            fx.addBeam(game, crown.x, crown.y, crown.width);
            const phrase = [
                'you wot m8',
                'collect all 5',
                '3 to go',
                '2 to go',
                '1 to go (kill them)',
            ][count];
            fx.addTx(game, crown.x, crown.y - crown.height, phrase, '#fff');
        };
        
        let crown = crowns.first;
        while (crown) {
            // check for tiles 
            game.physics.arcade.collide(crown, collideLayer);  

            // check for players
            game.physics.arcade.overlap(crown, players.list, handlePickup);

            // update next crown
            crown = crowns.next;
        }
    }

}