import React from 'react';
import AppRender from 'apps/AppRender';
import GridInput from 'apps/test/GridInput';

let element;

export default () => (
    <AppRender 
        onCreate={(ElementStore) => {
            for (let i=0; i<5; ++i) {
                element = ElementStore.createElement(
                    ElementStore.render(GridInput)
                );
            }
            setTimeout(() => {
                console.log('updated...');
                ElementStore.setValue(element, 'test', true);
            }, 5000);
        }}
    />
);
