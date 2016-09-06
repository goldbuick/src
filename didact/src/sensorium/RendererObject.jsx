import React from 'react';

const THREE = require('three');

export default class RendererObject extends React.Component {

    static defaultProps = {
        onRender3D: () => { },
        onAnimate3D: () => { },
    }

    findRoot(parent) {
        if (!parent.props.parent) return parent;
        return this.findRoot(parent.props.parent);
    }

    applyProps3D() {
        if (this.object3D === undefined) return;

        let args = Array.prototype.slice.call(arguments);
        args.forEach(prop => {
            if (this.props[prop] === undefined) return;

            let prev,
                lastArg,
                base = this.object3D,
                keys = prop.split('-');

            keys.forEach(arg => {
                prev = base;
                base = base[arg]; 
                lastArg = arg;
            });

            if (prev === undefined || lastArg === undefined) return;
            
            prev[lastArg] = this.props[prop];
        });
    }

    clear3D() {
        if (!this.object3D || !this.object3D.parent) return;
        this.object3D.parent.remove(this.object3D);
        this.object3D = undefined;
    }

    children3D() {
        return React.Children.map(this.props.children, 
            out => React.cloneElement(out, { parent: this }));
    }

    animate3D(delta) {
        this.animateState = this.animateState || { };
        this.props.onAnimate3D(this.object3D, this.animateState, delta);
    }

    componentWillUnmount() {
        this.clear3D();
        let root = this.findRoot(this);
        if (root.stopAnimate3D) root.stopAnimate3D(this);
    }

    render() {
        let children = React.Children.map(this.props.children, 
            child => React.cloneElement(child, { parent: this })),
            parent = this.props.parent && this.props.parent.object3D;

        this.clear3D();
        this.object3D = this.props.onRender3D(children) || new THREE.Object3D();

        if (parent && this.object3D) {
            parent.add(this.object3D);
            this.object3D.name = this.props.name;
            this.applyProps3D(
                'scale-x', 'scale-y', 'scale-z',
                'rotation-x', 'rotation-y', 'rotation-z',
                'position-x', 'position-y', 'position-z'
            );

            let root = this.findRoot(this);
            if (root.startAnimate3D) root.startAnimate3D(this);
        }

        return <div>{children}</div>;
    }

}
