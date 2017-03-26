import * as THREE from 'three';
import loadFont from 'load-bmfont';

import LOGO_fnt from '../media/LOGO.fnt';
import LOGO_png from '../media/LOGO.png';
import TECH_fnt from '../media/TECH.fnt';
import TECH_png from '../media/TECH.png';
import TECHMONO_fnt from '../media/TECHMONO.fnt';
import TECHMONO_png from '../media/TECHMONO.png';
import NEONOIRE_fnt from '../media/NEONOIRE.fnt';
import NEONOIRE_png from '../media/NEONOIRE.png';

const LOGO = [ LOGO_fnt, LOGO_png ];
const TECH = [ TECH_fnt, TECH_png ];
const TECHMONO = [ TECHMONO_fnt, TECHMONO_png ];
const NEONOIRE = [ NEONOIRE_fnt, NEONOIRE_png ];
const FONTS = { LOGO, TECH, TECHMONO, NEONOIRE };

const fontData = {};
const fontQueue = [];
const textureLoader = new THREE.TextureLoader();

const configLoader = (name) => {
    loadFont(FONTS[name][0], (err, config) => {
        if (err) throw err;
        textureLoader.load(FONTS[name][1], texture => {
            texture.needsUpdate = true;
            texture.generateMipmaps = true;
            texture.anisotropy = window.maxAni;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            fontData[name] = { config, texture };

            if (fontQueue[name] !== undefined) {
                fontQueue[name].forEach(fn => fn());
                delete fontQueue[name];
            }
        });
    });
};

const fontLoader = (name, retry) => {
    if (!FONTS[name]) {
        return;
    }
    if (fontData[name]) {
        return fontData[name];
    }
    if (!fontQueue[name]) {
        configLoader(name);
        fontQueue[name] = [];
    }
    fontQueue[name].push(retry());
    return undefined;
};

export default fontLoader;
