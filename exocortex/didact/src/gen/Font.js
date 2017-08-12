import * as THREE from 'three';
import loadFont from 'load-bmfont';

import Logo_fnt from '../media/fonts/Logo.fnt';
import Logo_png from '../media/fonts/Logo.png';
import NeoNoire_fnt from '../media/fonts/NeoNoire.fnt';
import NeoNoire_png from '../media/fonts/NeoNoire.png';
import Exo2Thin_fnt from '../media/fonts/Exo2Thin.fnt';
import Exo2Thin_png from '../media/fonts/Exo2Thin.png';
import FMRegular_fnt from '../media/fonts/FMRegular.fnt';
import FMRegular_png from '../media/fonts/FMRegular.png';
import FSUltraLight_fnt from '../media/fonts/FSUltraLight.fnt';
import FSUltraLight_png from '../media/fonts/FSUltraLight.png';

const LOGO = [ Logo_fnt, Logo_png, 1, 0 ];
const NEONOIRE = [ NeoNoire_fnt, NeoNoire_png, 1.55, -3 ];
const EXO2THIN = [ Exo2Thin_fnt, Exo2Thin_png, 1.4, 1 ];
const FMREGULAR = [ FMRegular_fnt, FMRegular_png, 2.9, -6 ];
const FSULTRALIGHT = [ FSUltraLight_fnt, FSUltraLight_png, 2, -6 ];
const FONTS = { LOGO, NEONOIRE, EXO2THIN, FMREGULAR, FSULTRALIGHT };

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

            fontData[name] = {
                config,
                texture,
                scale: FONTS[name][2],
                descender: FONTS[name][3],
            };

            if (fontQueue[name] !== undefined) {
                fontQueue[name].forEach(fn => fn(fontData[name]));
                delete fontQueue[name];
            }
        });
    });
};

export default function(name) {
    return new Promise((resolve, reject) => {
        if (!FONTS[name]) {
            return reject();
        }
        if (fontData[name]) {
            return resolve(fontData[name]);
        }
        if (!fontQueue[name]) {
            configLoader(name);
            fontQueue[name] = [];
        }
        fontQueue[name].push(resolve);        
    });
}
