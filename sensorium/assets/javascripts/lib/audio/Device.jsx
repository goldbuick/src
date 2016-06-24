// generates / modifies audio data

import Module from 'lib/audio/Module';

class Device extends Module {

    constructor () {
        super();
    }

    connect (mod) {
        let self = this.isAudio,
            target = mod.isAudio;

        if (self && target) {
            self.connect(target);

        } else {
            super.connect(mod);
        }
    }

    disconnect (mod) {
        let self = this.isAudio,
            target = mod.isAudio;

        if (self && target) {
            self.disconnect(target);

        } else {
            super.disconnect(mod);
        }
    }

}

export default Device;
