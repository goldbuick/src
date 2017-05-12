import React from 'react';
import Driver from '../../sim/Driver';
import Simple from './Simple'; 

export default () => (
    <Driver>
        <Simple />
        <Simple />
        <Simple />
        <Simple />
        <Simple />
    </Driver>
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