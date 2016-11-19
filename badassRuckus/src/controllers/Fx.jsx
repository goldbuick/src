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
        let emitter = game.add.emitter(0, 0);
        emitter.makeParticles(image, 0, 250, true, true);

        return emitter;
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
