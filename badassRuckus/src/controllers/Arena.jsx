import { Controller } from '../Controller';

export default class Arena extends Controller {

    static config = {
        tile: {
            w: 32,
            h: 32
        },
    }

    create(game, config) {
        this.cols = Math.round(game.width / config.tile.w);
        this.rows = Math.round(game.height / config.tile.h);

        let tile = config.tile;
        let image = {
            w: config.tile.w * 2,
            h: config.tile.h
        };

        let tilesetImage = game.make.bitmapData(image.w, image.h);
        tilesetImage.rect(0, 0, image.w, image.h, '#666');
        tilesetImage.rect(tile.w, 0, tile.w, tile.h, '#fff');

        this.tilemap = game.add.tilemap(null, tile.w, tile.h, this.cols, this.rows);
        this.tilemap.addTilesetImage('test', tilesetImage, tile.w, tile.h);
        this.tilemap.setCollisionByExclusion([]);

        this.collideLayer = this.tilemap.createBlankLayer('test',
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
