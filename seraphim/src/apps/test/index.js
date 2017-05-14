import React from 'react';
import Panel from 'elements/panel/Core';
import Sphere from 'elements/sphere/Core';
import InterfaceDisplay from 'interfaces/InterfaceDisplay';

export default () => (
    <InterfaceDisplay>
        <Panel position-z={-1024} position-x={-300} />
        <Sphere position-z={-1024} position-x={300} />
    </InterfaceDisplay>
);


/*

1. need a redux model to track elements
2. need a redux model to track drivers ??
3. need a redux model to track active driver ?
4. is it possible to split element & driver implementation into micro-services ?

<App> 
    <LinearDriver />
    <GridDriver />
    <Simple />
    <Simple />
    <Simple />
    <Simple />
    <Simple />
    <Simple />
</App>





*/