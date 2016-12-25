// import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import { gameText } from '../Text';
import { Controller } from '../Controller';

export default class Fx extends Controller {

    static selectFxs(game) {
        return Controller.selectByTag(game, TAGS.FX);
    }

    static selectFxTxs(game) {
        return Controller.selectByTag(game, TAGS.FX_TX);
    }

    static selectFxBxs(game) {
        return Controller.selectByTag(game, TAGS.FX_BX);
    }

    static config = {
        w: 2,
        h: 2
    }

    add(game, { isRed = false }) {
        let { config } = this;

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, isRed ? '#F00' : '#FFF');

        // create emitter
        let fx = game.add.emitter(0, 0);
        fx.makeParticles(image, 0, 250, true, true);

        const blurst = 256;
        fx.setXSpeed(-blurst, blurst);
        fx.setYSpeed(blurst * -2, 0);
        fx.bounce.x = fx.bounce.y = 0.5;
        const sMin = 0.25, sMax = 2;
        fx.setScale(sMin, sMax, sMin, sMax);
        fx.setAlpha(1, 0, fx.lifespan);

        // add our own emit function
        fx.spark = function (x, y) {
            for (let i=0; i < 10; ++i) {
                this.emitParticle(x, y);
            }
        };

        // tag it & return
        return Controller.tag(fx, TAGS.FX);
    }

    addTx(game, x, y, text, color = '#f00') {
        let tx = gameText(game, { x, y, text, fontSize: 12, color });
        tx.startY = y;
        // tag it & return
        return Controller.tag(tx, TAGS.FX_TX);
    }

    addBeam(game, x, y, w = 9) {
        // used for spawns
        let bx = game.add.sprite(x, y, 'blink');
        bx.anchor.set(0.5, 0.5);

        bx.width = w;
        bx.height = 512;

        // tag it & return
        return Controller.tag(bx, TAGS.FX_BX);
    }

    update(game, config) {
        const fxs = Fx.selectFxs(game);
        const txs = Fx.selectFxTxs(game);
        const bxs = Fx.selectFxBxs(game);
        const collideLayer = Arena.selectCollideLayer(game);

        let fx = fxs.first;
        while (fx) {
            // check for tiles 
            game.physics.arcade.collide(fx, collideLayer);
            fx = fxs.next;
        }

        let tx = txs.first;
        while (tx) {
            if (Math.abs(tx.y - tx.startY) < 16) {
                tx.y -= 2;
            }
            tx.alpha -= 0.01;
            if (tx.alpha <= 0) tx.kill();
            tx = txs.next;
        }

        let bx = bxs.first;
        while (bx) {
            bx.width--;
            bx.alpha -= 0.1;
            if (bx.width === 1) {
                bx.kill();
            }
            bx = bxs.next; 
        }
    }

}
