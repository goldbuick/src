import { Controller } from '../Controller';

const collideLayerName = 'collideLayer';

export default class Arena extends Controller {

    // finders
    static findCollideLayer(game) {
        return game.world.getByName(collideLayerName);
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

        this.tilemap = game.add.tilemap(null, tile.w, tile.h, this.cols, this.rows);
        this.tilemap.addTilesetImage('test', tilesetImage, tile.w, tile.h);
        this.tilemap.setCollisionByExclusion([]);

        this.collideLayer = this.tilemap.createBlankLayer(collideLayerName,
            this.cols, this.rows, tile.w, tile.h);

        const split = 10;
        for (let i=0; i < split; ++i)
            this.tilemap.putTile(0, i, this.rows-2);

        for (let i=split; i < this.cols; ++i)
            this.tilemap.putTile(0, i, this.rows-1);
    }

    update(game, config) {
    }
}
