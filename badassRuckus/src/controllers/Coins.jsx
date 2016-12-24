import Fx from './Fx';
import TAGS from '../Tags';
import Players from './Players';
import { Controller } from '../Controller';

export default class Coins extends Controller {

    static selectCoins(game) {
        return Controller.selectByTag(game, TAGS.COINS);
    }

    static config = {
        w: 14,
        h: 14
    }

    add(game, x, y, player) {
        const { config } = this;

        // create sprite
        let coin = game.add.sprite(x, y, 'godcoin');
        coin.anchor.set(0.5, 1);
        coin.width = config.w;
        coin.height = config.h;
        coin.data.player = player;
        
        // tag it 
        Controller.tag(coin, TAGS.COINS);
    }

    update(game, config) {
        const player = this.control(Players);
        const coins = Coins.selectCoins(game);
        
        let coin = coins.first;
        while (coin) {
            const dx = coin.data.player.x - coin.x;
            const dy = coin.data.player.y - coin.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / dist;
            const ny = dy / dist;

            if (dist < 8) {
                coin.kill();
                player.handleCoinCollect(game, coin.data.player);
            } else {
                const vel = Math.min(dist * 0.1, 16);
                coin.x += nx * vel;
                coin.y += ny * vel;
            }

            coin = coins.next;
        }
    }

}