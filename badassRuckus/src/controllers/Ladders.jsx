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
        image.rect(0, 0, config.w, h, '#D36');

        let ladder = game.add.sprite(x, y, image);
        game.physics.arcade.enable(ladder);

        ladder.body.setSize(config.w, h);
        ladder.body.allowGravity = false;

        Controller.tag(ladder, TAGS.LADDER);
    }
}
