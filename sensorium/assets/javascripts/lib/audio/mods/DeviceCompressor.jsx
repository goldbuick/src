
import Device from 'lib/audio/Device';

class DeviceCompressor extends Device {

    constructor() {
        super();
        this.synth = new Tone.Compressor();
    }

}

export default DeviceCompressor;

