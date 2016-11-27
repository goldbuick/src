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
        const { tile, chunks, chunkSize } = config;
        const cols = chunks.w * chunkSize.w;
        const rows = chunks.h * chunkSize.h;

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

        // bkg layer
        this.tilemap.createBlankLayer('bkg-layer', cols, rows, tile.w, tile.h);

        // collider layer
        let collideLayer = this.tilemap.createBlankLayer('collide-layer', cols, rows, tile.w, tile.h);

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

        // make sure we have no matching y
        let ycount = { '32': 2 };
        while (Object.values(ycount).filter(v => v !== 1).length) {
            for (let i=0; i < platforms.length; ++i) {
                platforms[i].y += coin() ? 1 : -1;
            }

            ycount = {};
            for (let i=0; i < platforms.length; ++i) {
                let y2 = Math.round(platforms[i].y * 0.5);
                ycount[y2] = (ycount[y2] || 0) + 1;
            }
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

        const bottom = rows - 1;
        platforms.forEach(plat => {
            if (coin()) {
                plotTiles(plat.left, plat.right, plat.y, [0, 1, 2, 3]);
            } else {
                plotTiles(plat.left, plat.right, plat.y, [4, 5, 6, 7]);
                for (let y=plat.y+1; y < rows; ++y) {
                    plotTilesRng(plat.left, plat.right, y, 
                        [8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 10], 'bkg-layer');
                }
            }
        });

        // floor
        plotTiles(0, cols - 1, bottom, [4, 5, 6, 7]);

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
            }

            x = pickX();
            ({ x, y } = whileEmpty(x, plat.y + 1, 'collideUp'));
            Ladders.add(game, { x: x * tile.w, y: plat.y * tile.h, h: (y - plat.y) * tile.h });

            if (w > 12 && coin()) {
                x = pickX();
                ({ x, y } = whileEmpty(x, plat.y + 1, 'collideUp'));
                Ladders.add(game, { x: x * tile.w, y: plat.y * tile.h, h: (y - plat.y) * tile.h });
            }
        });

        /*/ layer cake
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
        */
    }

    update(game, config) {
    }
}
