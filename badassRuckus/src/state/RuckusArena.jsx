import Phaser from 'phaser';
import Player from '../controllers/Player';
import { ControllerManager } from '../controllers/Controller';

export default class extends Phaser.State {

    tileWidth = 32;
    tileHeight = 32;

    create() {
        this.game.physics.arcade.gravity.y = 1000;
        this.manager = new ControllerManager(this.game);

        this.columns = Math.round(this.game.width / this.tileWidth);
        this.rows = Math.round(this.game.height / this.tileHeight);

        let tiWidth = this.tileWidth * 2,
            tiHeight = this.tileHeight * 2,
            tilesetImage = this.game.make.bitmapData(tiWidth, tiHeight);

        tilesetImage.rect(0, 0, tiWidth, tiHeight, '#666');
        tilesetImage.rect(this.tileWidth, 0, this.tileWidth, this.tileHeight, '#fff');

        this.tilemap = this.game.add.tilemap(null, 
            this.tileWidth, this.tileHeight, this.columns, this.rows);

        this.tilemap.addTilesetImage('test', tilesetImage, 
            this.tileWidth, this.tileHeight);

        this.tilemap.setCollisionByExclusion([]);

        let collideLayer = this.tilemap.createBlankLayer('test',
            this.columns, this.rows, this.tileWidth, this.tileHeight);

        const split = 10;
        for (let i=0; i<split; ++i)
            this.tilemap.putTile(0, i, this.rows-2);

        for (let i=split; i<this.columns; ++i)
            this.tilemap.putTile(0, i, this.rows-1);

        this.manager.create(Player, {collideLayer});
    }

    update() {
        this.manager.update();
    }

}
