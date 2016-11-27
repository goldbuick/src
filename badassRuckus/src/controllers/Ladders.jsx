import Alea from 'alea';
import TAGS from '../Tags';
import { Controller } from '../Controller';

export default class Ladders extends Controller {

    static selectLadders(game) {
        return Controller.selectByTag(game, TAGS.LADDER);
    }

    static config = {
        w: 8
    }

    static add(game, {x, y, h} = {}) {
        const { config } = Ladders;
        
        // temp image
        let image = game.make.bitmapData(config.w, h);
        image.rect(0, 0, config.w, h, '#AA7243');

        let ladder = game.add.sprite(x, y, image);
        ladder.anchor.set(0.5, 0);
        game.physics.arcade.enable(ladder);

        ladder.body.setSize(config.w, h);
        ladder.body.allowGravity = false;

        Controller.tag(ladder, TAGS.LADDER);
    }
}
