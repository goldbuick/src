import Fx from './Fx';
import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import Players from './Players';
import { r, coin } from '../Globals';
import { Controller } from '../Controller';
import { range, pickFrom } from '../Util';

const BUFFS = {
    GUN: 'gun',
    JUMP: 'jump',
    HEALTH: 'health',
    COOLDOWN: 'cooldown',
    ALT_DASH: 'alt dash ',
    ALT_WEAPON: 'alt weapon ',
};

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
        for (let i=0; i < 5; ++i) this.spawn(game);
        this.spawnTimer = game.time.events.loop(10000, () => this.spawn(game));
    }

    spawn(game) {
        // not too many
        if (Buffs.selectBuffs(game).total >= 15) return;

        const arena = this.control(Arena);
        let { x, y } = arena.pickSpawn(game, 10);

        this.add(game, x, y - 10);
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
            
            // pick category
            const type = pickFrom(r, [
                BUFFS.GUN,
                BUFFS.GUN,
                BUFFS.GUN,
                BUFFS.GUN,
                BUFFS.JUMP,
                BUFFS.JUMP,
                BUFFS.JUMP,
                BUFFS.HEALTH,
                BUFFS.ALT_WEAPON,
                BUFFS.ALT_DASH,
                BUFFS.COOLDOWN,
                BUFFS.COOLDOWN,
            ]);

            // pick specific 
            let buffName = type;
            switch (type) {
                case BUFFS.GUN:
                    let weapon = player.data.weapon;
                    switch (pickFrom(r, [0, 1, 2, 3])) {
                        case 0:
                            buffName = 'gun fire rate increased';
                            weapon.fireRate = Math.max(30, weapon.fireRate - 10);
                            break;
                        case 1:
                            buffName = 'increased gun damage';
                            weapon.bulletDamage += 2;
                            break;
                        case 2:
                            buffName = 'increased gun range';
                            weapon.bulletLifespan += 32;
                            break;
                        case 3:
                            buffName = 'increased gun accuracy';
                            weapon.bulletAngleVariance =
                                Math.max(1, weapon.bulletAngleVariance - 1);
                            break;
                    }
                    break;

                case BUFFS.JUMP:
                    switch (pickFrom(r, [0, 0, 0, 0, 1])) {
                        case 0:
                            buffName = 'jump height increased';
                            player.data.jumpForce -= 64;
                            break;
                        case 1:
                            buffName = 'extra jump';
                            ++player.data.jumpCount;
                            break;
                    }
                    break;

                case BUFFS.HEALTH:
                    if (coin()) {
                        buffName = 'health regen increased';
                        ++player.data.healthGen;
                    } else {
                        buffName = 'max health increased';
                        player.maxHealth += 16;
                    }
                    break;

                case BUFFS.ALT_DASH:
                    buffName += players.handleAltDashAdd(game, player);
                    break;

                case BUFFS.ALT_WEAPON:
                    buffName += players.handleAltWeaponAdd(game, player);
                    break;

                case BUFFS.COOLDOWN:
                    if (coin()) {
                        buffName = 'alt cooldown reduced';
                        let v = players.altTimer(player);
                        v = players.altTimer(player, Math.max(1, v - 1));
                    } else {
                        buffName = 'dash cooldown reduced';
                        let v = players.dashTimer(player);
                        v = players.dashTimer(player, Math.max(1, v - 1));
                    }
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