
import Trigger from 'lib/audio/Trigger';
import DeviceMaster from 'lib/audio/mods/DeviceMaster';

class TriggerStep extends Trigger {

    get EVENTS() {
        return {
            CHORD: 'TriggerStep.CHORD',
            PATTERN: 'TriggerStep.PATTERN',
            STEP_LENGTH: 'TriggerStep.STEP_LENGTH',
            NOTE_LENGTH: 'TriggerStep.NOTE_LENGTH'
        };
    }

    constructor () {
        super();
    }

    run () {
        if (this.sequence) {
            this.sequence.dispose();
        }

        let pattern = this.pattern || [],
            stepLength = this.stepLength || '4n',
            noteLength = this.noteLength || '4n';

        this.sequence = new Tone.Sequence((time, index) => {

            let values = this.pattern[index].map((on, i) => {
                return on ? this.chord[i] : undefined;

            }).filter(v => {
                return v !== undefined;

            });

            this.triggerEvent(DeviceMaster.EVENTS.NOTE, {
                notes: values,
                length: noteLength
            });

        }, pattern.map((v, i) => i), stepLength);

        this.sequence.start();
    }

    handleEvent (type, value, time, source) {
        switch (type) {
            case this.EVENTS.PATTERN:
                this.pattern = value;
                this.run();
                break;

            case this.EVENTS.CHORD:
                this.chord = value;
                break;

            case this.EVENTS.NOTE_LENGTH:
                this.noteLength = value;
                this.run();
                break;

            case this.EVENTS.STEP_LENGTH:
                this.stepLength = value;
                this.run();
                break;
        }
    }

}

export default TriggerStep;

