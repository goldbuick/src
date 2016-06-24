
import Device from 'lib/audio/Device';
import DeviceMaster from 'lib/audio/mods/DeviceMaster';

class DeviceMonoSynth extends Device {

    constructor() {
        super();
        this.synth = new Tone.MonoSynth();
    }

    handleEvent (type, value, time, source) {
        switch (type) {
            case DeviceMaster.EVENTS.NOTE:
                this.synth.triggerAttackRelease(value.notes[0], value.length);
                break;
        }
    }

}

export default DeviceMonoSynth;

