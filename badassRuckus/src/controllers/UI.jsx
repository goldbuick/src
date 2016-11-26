import Fx from './Fx';
import TAGS from '../Tags';
import { Controller } from '../Controller';

export default class UI extends Controller {

    static config = {
    }

    healthMeter(game, sprite, x, y) {
        let w = 64, h = 3;

        let image = game.make.bitmapData(w, h);
        image.rect(0, 0, w, h, '#36D');

        let meter = game.make.sprite(0, 0, image);
        meter.anchor.set(0.5, 1);
        meter.x = x;
        meter.y = y;

        return meter;
    }

}
