import loadFont from 'load-bmfont';

let fontData = { },
    fontQueue = { },
    Texture = new THREE.TextureLoader(),
    VizFont = (name, retry) => {
        if (fontData[name]) {
            return fontData[name];
        }
        if (fontQueue[name] === undefined) {
            fontQueue[name] = [ ];
        }
        fontQueue[name].push(retry());
        return undefined;
    };

[ 'LOGO', 'TECH', 'TECHMONO' ].forEach(name => {
    let url = `media/${name}.fnt`;
    loadFont(url, (err, config) => {
        if (err) throw err;
        url = `media/${name}.png`;
        Texture.load(url, texture => {
    
            texture.needsUpdate = true;
            texture.generateMipmaps = true;
            texture.anisotropy = window.maxAni;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            fontData[name] = {
                config: config,
                texture: texture
            };

            if (fontQueue[name] !== undefined) {
                fontQueue[name].forEach(fn => fn());
                delete fontQueue[name];
            }
        });
    });
});

export default VizFont;

