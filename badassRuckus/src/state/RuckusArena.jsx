import Phaser from 'phaser';

export default class extends Phaser.State {

    tileWidth = 32;
    tileHeight = 32;

    columns = 100;
    rows = 10;

    create() {
        let tiWidth = this.tileWidth * 2,
            tiHeight = this.tileHeight * 2,
            tilesetImage = this.game.make.bitmapData(tiWidth, tiHeight);

        tilesetImage.rect(0, 0, tiWidth, tiHeight, '#f00');
        tilesetImage.rect(this.tileWidth, 0, this.tileWidth, this.tileHeight, '#fff');

        this.tilemap = this.game.add.tilemap(null, 
            this.tileWidth, this.tileHeight, this.columns, this.rows);

        this.tilemap.addTilesetImage('test', tilesetImage, 
            this.tileWidth, this.tileHeight);

        this.tilemap.createBlankLayer('test',
            this.columns, this.rows, this.tileWidth, this.tileHeight);

        this.tilemap.putTile(0, 0, 0);
        this.tilemap.putTile(1, 1, 0);

        // // simple tileset
        // let tileset = new Phaser.Bitmap(this.game, 64, 64);

        // this.layers = [
        //     this.tilemap.createBlankLayer('test', 
        //         this.columsn, this.rows, this.tileWidth, this.tileHeight)
        // ];
    }

}
