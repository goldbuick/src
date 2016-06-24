// send audio to the speakers

import Device from 'lib/audio/Device';

class DeviceMaster extends Device {

    get EVENTS() {
        return {
            NOTE: 'DeviceMaster.NOTE'
        };
    }

    constructor() {
        super();
        this.synth = Tone.Master;
    }

    start() {
        Tone.Transport.start();
    }

}

export default new DeviceMaster();

