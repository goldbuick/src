import Alea from 'alea';
import TAGS from '../Tags';
import Ladders from './Ladders';
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

        let image = { w: 12, h: 1 };
        image.w *= 64; image.h *= 64;
        let tilesetImage = game.make.bitmapData(image.w, image.h);
        tilesetImage.clear(0, 0, image.w, image.h);

        let x = 0;
        const drawTile = (source, o) => tilesetImage.copy(source, 0, 0, 64, 64, o * 32, 0, 32, 32);

        drawTile('tileCrust', x++);
        drawTile('tileCrustLeft', x++);
        drawTile('tileCrustCenter', x++);
        drawTile('tileCrustRight', x++);

        drawTile('tileTop', x++);
        drawTile('tileTopLeft', x++);
        drawTile('tileTopCenter', x++);
        drawTile('tileTopRight', x++);

        drawTile('tileCenter1', x++);
        drawTile('tileCenter2', x++);
        drawTile('tileCenter3', x++);

        this.tilemap = game.add.tilemap(null, tile.w, tile.h, cols, rows);
        this.tilemap.addTilesetImage(tilesetImage);
        this.tilemap.setCollisionByExclusion([8, 9, 10]);

        Controller.tag(this.tilemap.createBlankLayer('collide-layer',
            cols, rows, tile.w, tile.h), TAGS.COLLIDER_LAYER);

        let r = new Alea('rng-jesus');

        // layer cake
        const count = 4;
        const nudge = 8;
        const layerStep = 8;
        const bottom = rows - 1;

        let left = count * nudge,
            layer = bottom - (count * layerStep),
            right = (cols - 1) - count * nudge;

        for (let i=0; i <= count; ++i) {

            this.tilemap.putTile(5, left, layer);
            for (let x=left+1; x < right; ++x) {
                this.tilemap.putTile(6, x, layer);
            }
            this.tilemap.putTile(7, right, layer);

            for (let y=layer+1; y < rows; ++y) {
                for (let x=left; x <= right; ++x) {
                    this.tilemap.putTile(8, x, y);
                }
            }

            console.log(layer, bottom, left, right);

            left -= nudge;
            right += nudge;

            layer += layerStep;
        }

        // mob entries
        // const edge = 4;
        // layer = bottom - 4;
        // left = edge;
        // right = cols - edge;

        // for (let i=0; i < 5; ++i) {
        //     for (let x=0; x < left; ++x) {
        //         this.tilemap.putTile(0, x, layer);
        //     }
        //     for (let x=right; x < cols; ++x) {
        //         this.tilemap.putTile(0, x, layer);
        //     }
        //     layer -= layerStep;
        // }

        // create ladders
        Ladders.add(game, { x: 1100, y: 224, h: 256 });
        Ladders.add(game, { x: 800, y: 480, h: 256 });
        Ladders.add(game, { x: 1600, y: 736, h: 256 });
        Ladders.add(game, { x: 1100, y: 992, h: 256 });
    }

    update(game, config) {
    }
}
