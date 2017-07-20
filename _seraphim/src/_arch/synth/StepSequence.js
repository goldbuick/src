import R from 'ramda';
import Tone from 'tone';
import React from 'react';
import Panel from 'elements/panel/Core';
import RenderObject from 'render/RenderObject';
import GridInput, { cellSize } from 'elements/panel/GridInput';

import choird from 'apps/synth/audio/choird.wav';
import wide_open from 'apps/synth/audio/wide_open.wav';
import noise_bass from 'apps/synth/audio/noise_bass.wav';
import washed_chord from 'apps/synth/audio/washed_chord.wav';
import panned_tidbit from 'apps/synth/audio/panned_tidbit.wav';

import clack from 'apps/synth/audio/drums/clack.wav';
import shing from 'apps/synth/audio/drums/shing.wav';
import wipe_snare from 'apps/synth/audio/drums/wipe_snare.wav';
import big_boy_kick from 'apps/synth/audio/drums/big_boy_kick.wav';
import tiny_crisp_clap from 'apps/synth/audio/drums/tiny_crisp_clap.wav';

class StepSequence extends React.Component {

    static defaultProps = {
        cols: 32,
        rows: 5,
    };

    state = {
        cursor: 0,
        enabled: {},
    };

    componentDidMount() {
        // this.synth = R.range(0, 5).map(i => new Tone.Sampler(washed_chord).toMaster());

        this.synth = new Tone.MultiPlayer({
            urls : {
                'G4': tiny_crisp_clap,
                'F4': shing,
                'E4': clack,
                'D4': wipe_snare,
                'C4': big_boy_kick,
            },
            volume : -10,
            fadeOut : 0.1,
        }).toMaster();

        // this.synth = new Tone.PolySynth(this.props.rows, Tone.Synth, {
        //     oscillator: {
        //         type: 'fatsawtooth',
        //         count: 3,
        //         spread: 30
        //     },
        //     envelope: {
        //         attack: 0.1,
        //         decay: 0.3,
        //         sustain: 0.3,
        //         release: 0.3,
        //         attackCurve: 'exponential'
        //     },
        // }).toMaster();

        const noteValues = ['G4', 'F4', 'E4', 'D4', 'C4'];
        // const noteValues = [4, 3, 2, 1, 0];
        this.loop = new Tone.Sequence((time, col) => {
            this.setState({ cursor: col });

            const { enabled } = this.state;
            const noteNames = Object.keys(enabled).filter(key => (
                enabled[key] && enabled[key].x === col
            )).map(key => (
                enabled[key].y
            )).map(y => noteValues[y]);

            noteNames.forEach(noteName => {
                // this.synth[noteName].triggerAttack((noteName * 2) - 4, time);
                this.synth.start(noteName, time);
                // this.synth.triggerAttackRelease(noteName, '8n', time, Math.random() * 0.5 + 0.5);
            });
        }, R.range(0, this.props.cols), '16n');
        
        this.loop.start();
    }

    componentWillUnmount() {

    }

    render() {
        const { enabled, cursor } = this.state;
        const { values, cols, rows } = this.props;
        return (
            <RenderObject
                name="StepSequence"

                onChildren3D={(children) => {
                    return [
                        RenderObject.byType(children, Panel),
                        RenderObject.byType(children, GridInput),
                    ];
                }}

                onAnimate3D={(object3D, animateState, delta) => {
                    const stepSize = cellSize + 16;
                    const panel = RenderObject.byType(object3D.children, Panel)[0];
                    panel.position.x = (stepSize * 0.5) + (cursor * stepSize) - (cols * stepSize * 0.5);
                    // console.log(cursor);
                }}
            >
                <Panel
                    name="StepSequenceCursor"
                    width={cellSize}
                    height={(rows + 2) * cellSize}
                />            
                <GridInput
                    cols={cols}
                    rows={rows}
                    filled={enabled}
                    elementId={values.id}
                    onCellTap={this.handleCellTap}
                />
            </RenderObject>
        );
    }

    handleCellTap = (cellKey, elementId, x, y) => {
        const filled = !!this.state.enabled[cellKey];
        const enabled = {
            ...this.state.enabled,
            [cellKey]: filled ? undefined : { x, y },
        };
        this.setState({ enabled });
    }

}

export default RenderObject.Pure(StepSequence);
