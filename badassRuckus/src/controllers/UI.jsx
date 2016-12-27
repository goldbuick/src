import TAGS from '../Tags';
import { Controller } from '../Controller';

export default class UI extends Controller {

    static config = {
    }

    healthMeter(game, sprite) {
        if (sprite.data.hMeter) sprite.removeChild(sprite.data.hMeter);
        const w = 64, h = 3, ratio = Math.max(0, sprite.health) / sprite.maxHealth;

        let image = game.make.bitmapData(w, h);
        image.rect(0, 0, w, h, '#333');
        image.rect(0, 0, w * ratio, h, '#F62');

        sprite.data.hMeter = game.make.sprite(0, 0, image);
        sprite.data.hMeter.anchor.set(0.5, 1);
        sprite.data.hMeter.y = -(sprite.height + 5);

        sprite.addChild(sprite.data.hMeter);
    }

    coinMeter(game, sprite) {
        if (sprite.data.cMeter) sprite.removeChild(sprite.data.cMeter);
        const w = 16;

        sprite.data.cMeter = game.make.group();
        sprite.data.cMeter.y = -(sprite.height + w) + 5;

        const left = (sprite.data.coins - 1) * w * 0.5;
        for (let i=0; i < sprite.data.coins; ++i) {
            let coin = game.make.sprite(i * w - left, 0, 'coin');
            coin.anchor.set(0.5, 1);
            coin.width = w - 2;
            coin.height = w - 2;
            sprite.data.cMeter.addChild(coin);
        }

        sprite.addChild(sprite.data.cMeter);
    }

    crownMeter(game, sprite) {
        if (sprite.data.rMeter) sprite.removeChild(sprite.data.rMeter);
        const w = 18, h = 16;

        sprite.data.rMeter = game.make.group();
        sprite.data.rMeter.y = -(sprite.height + h * 2) + 2;

        const left = (sprite.data.crowns - 1) * w * 0.5;
        for (let i=0; i < sprite.data.crowns; ++i) {
            let crown = game.make.sprite(i * w - left, 0, 'crown');
            crown.anchor.set(0.5, 1);
            crown.width = w - 4;
            crown.height = h - 2;
            sprite.data.rMeter.addChild(crown);
        }

        sprite.addChild(sprite.data.rMeter);
    }

    cooldownMeter(game, sprite, name, align, ratio) {
        if (sprite.data[name]) sprite.removeChild(sprite.data[name]);
        if (ratio === 0) return;
        const w = 24, h = 3, nudge = 8;

        let image = game.make.bitmapData(w, h);
        image.rect(0, 0, w, h, '#333');
        image.rect(0, 0, w * ratio, h, '#FA2');

        sprite.data[name] = game.make.sprite(0, 0, image);
        sprite.data[name].anchor.set(align, 1);
        sprite.data[name].y = 8;
        sprite.data[name].x = align ? -nudge : nudge;

        sprite.addChild(sprite.data[name]);
    }

}
