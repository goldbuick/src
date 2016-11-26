import Fx from './Fx';
import TAGS from '../Tags';
import { Controller } from '../Controller';

export default class UI extends Controller {

    static config = {
    }

    healthMeter(game, sprite) {
        if (sprite.data.meter) sprite.removeChild(sprite.data.meter);

        let w = 64, h = 3, ratio = sprite.health / sprite.maxHealth;

        let image = game.make.bitmapData(w, h);
        image.rect(0, 0, w, h, '#333');
        image.rect(0, 0, w * ratio, h, '#F62');

        sprite.data.meter = game.make.sprite(0, 0, image);
        sprite.data.meter.anchor.set(0.5, 1);
        sprite.data.meter.y = -(sprite.height + 5);

        sprite.addChild(sprite.data.meter);
    }

}
