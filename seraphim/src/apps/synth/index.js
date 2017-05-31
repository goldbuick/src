import React from 'react';
import AppRender from 'apps/AppRender';
import StepSequence from 'apps/synth/StepSequence';

let element;

export default () => (
    <AppRender 
        onCreate={(ElementStore) => {
            for (let i=0; i<3; ++i) {
                element = ElementStore.createElement(
                    ElementStore.render(StepSequence)
                );
            }
        }}
    />
);
