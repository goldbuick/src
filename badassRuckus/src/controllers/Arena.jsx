import Alea from 'alea';
import TAGS from '../Tags';
import { r } from '../Globals';
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
        const { tile, chunks, chunkSize, sourceTile } = config;
        const cols = chunks.w * chunkSize.w;
        const rows = chunks.h * chunkSize.h;
        const width = cols * tile.w;
        const height = rows * tile.h;

        // just incase camera scale doesn't change
        game.world.setBounds(0, 0, width, height);

        // rng tools
        let r = new Alea('rng-jesus');
        const coin = () => (r() * 100 < 50);

        // parallax bkg
        const bkgSet = pickFrom(r, ['set2']);
        game.add.tileSprite(0, 0, width, height, `${bkgSet}_background`);
        this.bkg = game.add.tileSprite(0, 0, width, height, `${bkgSet}_tiles`);

        const bkgScale = 2;
        const bkgHeight = 480 * bkgScale;
        this.bkgTop = game.add.tileSprite(0, 0, width, bkgHeight, `${bkgSet}_hills`);
        this.bkgTop.tileScale.set(-bkgScale, -bkgScale);

        this.bkgBottom = game.add.tileSprite(0, height - bkgHeight, width, bkgHeight, `${bkgSet}_hills`);
        this.bkgBottom.tileScale.set(bkgScale);

        // tilemap
        this.tilemap = game.add.tilemap(null, tile.w, tile.h, cols, rows);
        this.tilemap.addTilesetImage('tilesheet');

        // bkg layer
        let bkgLayer = this.tilemap.createBlankLayer('bkg-layer', cols, rows, tile.w, tile.h);

        // deco layer
        let decoLayer = this.tilemap.createBlankLayer('deco-layer', cols, rows, tile.w, tile.h);

        // collider layer
        let collideLayer = this.tilemap.createBlankLayer('collide-layer', cols, rows, tile.w, tile.h);

        // pick base tile index
        // 22 x 12, 22 x 3, 66
        const tset = pickFrom(r, [0, 1, 2, 3]);
        const ti = arr => arr.map(v => (tset * 66) + v);
        const td = arr => arr.map(v => (tset * 44) + v);

        // define collision tiles
        this.tilemap.setCollision(ti([1, 2, 3, 4, 5, 6, 7, 8]));

        // fix layer sizing
        [ bkgLayer, decoLayer, collideLayer ].forEach(l => l.resize(width, height));

        // tag collider layer for recall
        Controller.tag(collideLayer, TAGS.COLLIDER_LAYER);

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

        // drop plats that are off the bottom of the map
        platforms = platforms.filter(p => (rows - p.y) > 5);

        // calc pixel x & y
        platforms.forEach(p => {
            p.py = p.y * tile.h;
            p.pleft = p.left * tile.w;
            p.pright = p.right * tile.w;
            p.pwidth = p.pright - p.pleft;
        });

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
                let t = pickFrom(r, indexes);
                if (t !== -1) this.tilemap.putTile(t, x, y1, layer);
            }
        };

        // sort by height
        platforms.sort((a, b) => a.y - b.y);

        platforms.forEach(plat => {
            if (coin()) {
                plotTiles(plat.left, plat.right, plat.y, ti([8, 5, 6, 7]));
            } else {
                plotTiles(plat.left, plat.right, plat.y, ti([4, 1, 2, 3]));
                let height = rows - plat.y;
                for (let y=1; y < height; ++y) {
                    plotTilesRng(plat.left, plat.right, plat.y + y, 
                        ti([22, 44,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        ]), 'bkg-layer');
                }
            }
            // deco tops
            plotTilesRng(plat.left, plat.right, plat.y - 1, 
                td([9, 10, 11, 31, 32, 33]).concat([
                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                ]), 'deco-layer');
        });

        // floor
        plotTiles(0, cols - 1, rows - 1, ti([4, 1, 2, 3]));

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

        collideLayer.data.platforms = platforms;
    }

    pickSpawn(game, padding) {
        const collideLayer = Arena.selectCollideLayer(game);
        const plat = pickFrom(r, collideLayer.data.platforms);
        const left = plat.pleft + padding;
        const width = plat.pwidth - padding * 2;
        const x = Math.round(left + r() * width);
        const y = plat.py;
        return { x, y };        
    }

    update(game, config) {
        const rear = (0.7);
        const mid = (0.4) * 0.5;
        this.bkgTop.tilePosition.set(game.camera.x * -mid, 0);
        this.bkgBottom.tilePosition.set(game.camera.x * mid, 0);
        this.bkg.tilePosition.set(game.camera.x * rear, game.camera.y * rear);
    }
}
