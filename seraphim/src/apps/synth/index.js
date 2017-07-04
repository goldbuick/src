import Tone from 'tone';
import React from 'react';
import AppRender from 'apps/AppRender';
import StepSequence from 'apps/synth/StepSequence';

Tone.Transport.start();

export default () => (
    <AppRender 
        onCreate={(ElementStore) => {
            // for (let i=0; i<3; ++i) {
                ElementStore.createElement(
                    ElementStore.render(StepSequence)
                );
            // }
        }}
    />
);
