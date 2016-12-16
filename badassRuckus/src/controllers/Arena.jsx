import Alea from 'alea';
import TAGS from '../Tags';
import Ladders from './Ladders';
import { range, pickFrom } from '../Util';
import { Controller } from '../Controller';

export default class Arena extends Controller {

    static selectCollideLayer(game) {
        return Controller.selectByTag(game, TAGS.COLLIDER_LAYER).first;
    }

    static config = {
        tile: { w: 32, h: 32 },
        chunks: { w: 4, h: 4 },
        chunkSize: { w: 20, h: 10 },
    }

    create(game, config) {
        const ladders = this.control(Ladders);
        const { tile, chunks, chunkSize } = config;
        const cols = chunks.w * chunkSize.w;
        const rows = chunks.h * chunkSize.h;
        const width = cols * tile.w;
        const height = rows * tile.h;

        game.world.setBounds(0, 0, width, height);

        // parallax bkg
        const bkgSet = 'set1';
        game.add.tileSprite(0, 0, width, height, `${bkgSet}_background`);
        this.bkg = game.add.tileSprite(0, 0, width, height, `${bkgSet}_tiles`);

        const bkgScale = 2;
        const bkgHeight = 480 * bkgScale;
        this.bkgTop = game.add.tileSprite(0, 0, width, bkgHeight, `${bkgSet}_hills`);
        this.bkgTop.tileScale.set(-bkgScale, -bkgScale);

        this.bkgBottom = game.add.tileSprite(0, height - bkgHeight, width, bkgHeight, `${bkgSet}_hills`);
        this.bkgBottom.tileScale.set(bkgScale);

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

        // bkg layer
        this.tilemap.createBlankLayer('bkg-layer', cols, rows, tile.w, tile.h);

        // collider layer
        let collideLayer = this.tilemap.createBlankLayer('collide-layer', cols, rows, tile.w, tile.h);
        this.tilemap.setCollisionByExclusion([8, 9, 10]);
        // collideLayer.canvas

        // tag collider layer for recall
        Controller.tag(collideLayer, TAGS.COLLIDER_LAYER);

        // rng tools
        let r = new Alea();//'rng-jesus');
        const coin = () => (r() * 100 < 50);

        // generate platform position
        const genPlatform = (x, y) => {
            let plat = {
                x: x + Math.round(r() * chunkSize.w),
                y: y + Math.round(r() * chunkSize.h),
                w: Math.max(3, Math.round(r() * chunkSize.w * 1.5)),
            };

            plat.left = plat.x - Math.round(plat.w * 0.5);
            plat.left = Math.max(1, plat.left);

            plat.right = plat.x + Math.round(plat.w * 0.5);
            plat.right = Math.min(cols - 2, plat.right);

            return plat;
        };

        // platform gen
        let platforms = [];
        for (let y=1; y < chunks.h; ++y) {
            for (let x=0; x < chunks.w; ++x) {
                let plat = genPlatform(x * chunkSize.w, y * chunkSize.h);
                platforms.push(plat);
            }
        }

        // prevent close plats
        platforms.sort((a, b) => b.y - a.y);
        let cursor = 1000;
        const spacing = 3;
        for (let i=0; i < platforms.length; ++i) {
            let plat = platforms[i];
            if (cursor - plat.y < spacing) {
                plat.y = cursor - spacing;
            }
            cursor = plat.y;
        }

        // plot platform tops
        const plotTiles = (x1, x2, y1, indexes) => {
            if (x1 === x2) {
                this.tilemap.putTile(indexes[0], x1, y1);
            } else {
                this.tilemap.putTile(indexes[1], x1, y1);
                for (let x=x1+1; x < x2; ++x) {
                    this.tilemap.putTile(indexes[2], x, y1);
                }
                this.tilemap.putTile(indexes[3], x2, y1);
            }
        };

        const plotTilesRng = (x1, x2, y1, indexes, layer) => {
            for (let x=x1; x <= x2; ++x) {
                this.tilemap.putTile(pickFrom(r, indexes), x, y1, layer);
            }
        };

        // sort by height
        platforms.sort((a, b) => a.y - b.y);

        platforms.forEach(plat => {
            if (coin()) {
                plotTiles(plat.left, plat.right, plat.y, [0, 1, 2, 3]);
            } else {
                plotTiles(plat.left, plat.right, plat.y, [4, 5, 6, 7]);
                let height = rows - plat.y;
                for (let y=1; y < height; ++y) {
                    plotTilesRng(plat.left, plat.right, plat.y + y, 
                        [8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 10], 'bkg-layer');
                }
            }
        });

        // floor
        plotTiles(0, cols - 1, rows - 1, [4, 5, 6, 7]);

        // detect open column
        const map = collideLayer.map;
        const whileEmpty = (x, y, test) => {
            let dx, dy;
            switch (test) {
                case 'collideUp': dx = 0; dy = 1; break;
                case 'collideDown': dx = 0; dy = -1; break;
                case 'collideLeft': dx = 1; dy = 0; break;
                case 'collideRight': dx = -1; dy = 0; break;
            }

            let tile;
            do {
                tile = map.getTile(x, y, collideLayer.index);
                x += dx; y += dy;
            } while ((!tile || !tile[test]) && (x >= 0 && x < cols && y >= 0 && y < rows));
            x -= dx; y -= dy;

            return { x, y };
        };

        platforms.forEach(plat => {            
            let x, y, w = plat.right - plat.left;

            const pickX = () => {
                return plat.left + 1 + Math.round(r() * (w-2));
            };

            const addLadder = () => {
                let { x, y } = whileEmpty(pickX(), plat.y + 1, 'collideUp');
                let h = y - plat.y;
                // too short
                if (h <= 1) return;
                // just right!
                ladders.add(game, { 
                    x: x * tile.w, 
                    y: plat.y * tile.h, 
                    h: h * tile.h - 16
                });
            };

            addLadder();
            if (w > 12 && coin()) addLadder();
        });
    }

    update(game, config) {
        const rear = (0.7);
        const mid = (0.4) * 0.5;
        this.bkgTop.tilePosition.set(game.camera.x * -mid, 0);
        this.bkgBottom.tilePosition.set(game.camera.x * mid, 0);
        this.bkg.tilePosition.set(game.camera.x * rear, game.camera.y * rear);
    }
}
