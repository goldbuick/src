import Phaser from 'phaser';
import { r } from '../Globals';
import { pickFrom } from '../Util';
import Players from '../controllers/Players';
import Monsters from '../controllers/Monsters';

class BulletMod extends Phaser.Bullet {
    kill() {
        const { nextWeapon } = this.data.bulletManager;
        if (nextWeapon) {
            const { game, player } = nextWeapon;
            const players = Players.selectPlayers(game);
            const monsters = Monsters.selectMonsters(game);
            let targets = monsters.list.concat(players.list.filter(p => p !== player)).map(t => {
                const dx = t.x - this.x;
                const dy = t.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                return { t, dist };
            });
            targets.sort((a, b) => a.dist - b.dist);
            
            let target = targets[0].t;
            nextWeapon.altFire(this.position, target.position.x, target.position.y);
        }
        return super.kill();
    }
}

export default BulletMod;
