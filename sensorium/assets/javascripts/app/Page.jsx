
import Debug from 'lib/audio/mods/Debug';
import DeviceMaster from 'lib/audio/mods/DeviceMaster';
import TriggerStep from 'lib/audio/mods/TriggerStep';
import DeviceMonoSynth from 'lib/audio/mods/DeviceMonoSynth';
import DevicePolySynth from 'lib/audio/mods/DevicePolySynth';
import DeviceFreeverb from 'lib/audio/mods/DeviceFreeverb';
import DeviceCompressor from 'lib/audio/mods/DeviceCompressor';


let Page = React.createClass({
    mixins: [
    ],

    getInitialState: function () {
        return { };
    },

    componentDidMount() {
        let debug = new Debug(),
            step = new TriggerStep(),
            synth = new DevicePolySynth(),
            echo = new DeviceFreeverb(),
            compressor = new DeviceCompressor();

        step.handleEvent(step.EVENTS.PATTERN, [
            [0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
        ]);
        step.handleEvent(step.EVENTS.CHORD, [
            'C3', 'D3', 'Eb3', 'G3', 'Ab3'
        ]);

        step.handleEvent(step.EVENTS.STEP_LENGTH, '16n');
        step.handleEvent(step.EVENTS.NOTE_LENGTH, '32n');
        step.connect(synth);

        synth.connect(echo);
        echo.connect(compressor);
        compressor.connect(DeviceMaster);

        DeviceMaster.start();


        // let synth = new Tone.PolySynth(6, Tone.SimpleAM).toMaster();
        // synth.set('carrier', {
        //     oscillator: {
        //         type: 'sawtooth',
        //     }
        // });

        // let seq = new Tone.Sequence((time, note) => {
        //     console.log(note);
        //     // synth.triggerAttackRelease([note], '8n');

        // }, [{ hi: true}, 'C4', 'E4', 'G4', 'A4'], '4n');

        // seq.start();


        // // synth.set('harmonicity', 6);


        // synth.set('modulator', {
        //     // volume: -3,
        //     oscillator: {
        //         // detune: -2000,
        //         type: 'pulse'
        //     }
        // });

        // let chord = new Tone.Event((time, chord) => {
        //     // console.log(time, chord);
        //     synth.triggerAttackRelease(chord, '8n');

        // }, ['D4', 'E4', 'F4']);

        // // loop it every measure for 8 measures
        // chord.start();
        // chord.loop = true;
        // chord.loopEnd = '1n';
    },

    render: function () {
        return <div>
        </div>;
    },

});

export default Page;
