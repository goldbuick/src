import { Controller } from '../Controller';

const collideLayerTag = 'collideLayer';

export default class Arena extends Controller {

    // selectors
    static selectCollideLayer(game) {
        return Controller.selectByTag(game, collideLayerTag)[0];
    }

    static config = {
        cols: 100,
        rows: 50,
        tile: {
            w: 32,
            h: 32
        },
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
        this.tilemap.setCollisionByExclusion([]);

        Controller.tag(this.tilemap.createBlankLayer('collide-layer',
            cols, rows, tile.w, tile.h), collideLayerTag);

        for (let y=10; y < rows; ++y) {
            for (let x=0; x < cols; ++x) {
                this.tilemap.putTile(0, x, y);
            }
        }

        // const split = 10;
        // for (let i=0; i < split; ++i)
        //     this.tilemap.putTile(0, i, this.rows-2);

        // for (let i=split; i < this.cols; ++i)
        //     this.tilemap.putTile(0, i, this.rows-1);
    }

    update(game, config) {
    }
}
