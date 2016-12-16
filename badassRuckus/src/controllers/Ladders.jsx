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

    add(game, {x, y, h} = {}) {
        const { config } = this;
        
        // temp image
        let image = game.make.bitmapData(config.w, h);
        let hw = config.w * 0.5;
        image.rect(hw * 0.5, 0, hw, h, '#AA7243');

        let ladder = game.add.sprite(x, y, image);
        ladder.anchor.set(0.5, 0);
        game.physics.arcade.enable(ladder);

        ladder.body.setSize(config.w, h);
        ladder.body.allowGravity = false;

        // return it
        return Controller.tag(ladder, TAGS.LADDER);
    }
}
