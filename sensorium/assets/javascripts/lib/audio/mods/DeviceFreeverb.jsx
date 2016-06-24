
import Device from 'lib/audio/Device';

class DeviceFreeverb extends Device {

    constructor() {
        super();
        this.synth = new Tone.Freeverb();
    }

}

export default DeviceFreeverb;

