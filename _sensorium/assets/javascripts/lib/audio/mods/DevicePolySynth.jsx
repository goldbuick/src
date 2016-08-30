
import Device from 'lib/audio/Device';
import DeviceMaster from 'lib/audio/mods/DeviceMaster';

class DevicePolySynth extends Device {

    constructor() {
        super();
        this.synth = new Tone.PolySynth();
    }

    handleEvent (type, value, time, source) {
        switch (type) {
            case DeviceMaster.EVENTS.NOTE:
                this.synth.triggerAttackRelease(value.notes, value.length);
                break;
        }
    }

}

export default DevicePolySynth;

