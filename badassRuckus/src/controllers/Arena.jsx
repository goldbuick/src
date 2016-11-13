import Alea from 'alea';
import TAGS from '../Tags';
import { Controller } from '../Controller';

export default class Arena extends Controller {

    static selectCollideLayer(game) {
        return Controller.selectByTag(game, TAGS.COLLIDER_LAYER).first;
    }

    static config = {
        cols: 70,
        rows: 40,
        tile: { w: 32, h: 32 },
    }

    create(game, config) {
        const { cols, rows, tile } = config;

        game.world.setBounds(0, 0, cols * tile.w, rows * tile.h);

        let image = { w: config.tile.w * 2, h: config.tile.h };
        let tilesetImage = game.make.bitmapData(image.w, image.h);
        tilesetImage.rect(0, 0, image.w, image.h, '#666');
        tilesetImage.rect(tile.w, 0, tile.w, tile.h, '#fff');

        this.tilemap = game.add.tilemap(null, tile.w, tile.h, cols, rows);
        this.tilemap.addTilesetImage('test', tilesetImage, tile.w, tile.h);
        this.tilemap.setCollisionByExclusion([1]);

        Controller.tag(this.tilemap.createBlankLayer('collide-layer',
            cols, rows, tile.w, tile.h), TAGS.COLLIDER_LAYER);

        let r = new Alea('rng-jesus');

        const layerStep = 6;
        const bottom = rows - 1;

        let left = 0,
            layer = bottom,
            right = cols - 1;

        for (let i=0; i < 5; ++i) {
            for (let x=left; x <= right; ++x) {
                this.tilemap.putTile(0, x, layer);
            }

            const nudge = 8;
            left += nudge;
            right -= nudge;

            layer -= layerStep;
        }

        const edge = 4;
        layer = bottom - 4;
        left = edge;
        right = cols - edge;

        for (let i=0; i < 5; ++i) {
            for (let x=0; x < left; ++x) {
                this.tilemap.putTile(0, x, layer);
            }
            for (let x=right; x < cols; ++x) {
                this.tilemap.putTile(0, x, layer);
            }

            // const nudge = 8;
            // left += nudge;
            // right -= nudge;

            layer -= layerStep;
        }
    }

    update(game, config) {
    }
}
