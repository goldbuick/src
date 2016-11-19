import Alea from 'alea';
import TAGS from '../Tags';
import Arena from './Arena';
import { Controller } from '../Controller';

export default class Fx extends Controller {

    static selectFxs(game) {
        return Controller.selectByTag(game, TAGS.FX);
    }

    static config = {
        w: 2,
        h: 2
    }

    static add(game, {}) {
        const { config } = Fx;

        // temp image
        let image = game.make.bitmapData(config.w, config.h);
        image.rect(0, 0, config.w, config.h, '#FFF');

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

        // tag it
        Controller.tag(fx, TAGS.FX);

        // return it
        return fx;
    }

    static spark(fx, x, y) {
        for (let i=0; i < 10; ++i) {
            fx.emitParticle(x, y);
        }
    }

    update(game, config) {
        const fxs = Fx.selectFxs(game);
        const collideLayer = Arena.selectCollideLayer(game);

        let fx = fxs.first;
        while (fx) {
            // check for tiles 
            game.physics.arcade.collide(fx, collideLayer);            

            fx = fxs.next;
        }
    }

}
