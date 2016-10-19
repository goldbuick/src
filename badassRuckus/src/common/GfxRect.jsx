import Phaser from 'phaser';

export default function(game, width, height, color) {
    let gfx = new Phaser.Graphics(game);
    
    gfx.beginFill(color, 1);
    gfx.drawRect(0, 0, width, height);
    gfx.endFill();

    let texture = gfx.generateTexture();
    gfx.destroy();

    return texture;
}
