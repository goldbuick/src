import * as THREE from 'three';
import loadFont from 'load-bmfont';

import Logo_fnt from '../media/fonts/Logo.fnt';
import Logo_png from '../media/fonts/Logo.png';
import NeoNoire_fnt from '../media/fonts/NeoNoire.fnt';
import NeoNoire_png from '../media/fonts/NeoNoire.png';
import SCPLight_fnt from '../media/fonts/SCPLight.fnt';
import SCPLight_png from '../media/fonts/SCPLight.png';
import FSUltraLight_fnt from '../media/fonts/FSUltraLight.fnt';
import FSUltraLight_png from '../media/fonts/FSUltraLight.png';

const LOGO = [ Logo_fnt, Logo_png ];
const NEONOIRE = [ NeoNoire_fnt, NeoNoire_png ];
const SCPLIGHT = [ SCPLight_fnt, SCPLight_png ];
const FSULTRALIGHT = [ FSUltraLight_fnt, FSUltraLight_png ];
const FONTS = { LOGO, NEONOIRE, SCPLIGHT, FSULTRALIGHT };

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
