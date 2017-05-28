import React from 'react';
import AppRender from 'apps/AppRender';
import Panel from 'elements/panel/Core';

let element;

export default () => (
    <AppRender 
        onCreate={(ElementStore) => {

            for (let i=0; i<5; ++i) {
                element = ElementStore.createElement(
                    ElementStore.render(Panel)
                );
            }

            setTimeout(() => {
                console.log('updated...');
                ElementStore.setValue(element, 'test', true);
            }, 5000);
        }}
    />
);
