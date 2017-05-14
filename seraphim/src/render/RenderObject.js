import R from 'ramda';
import React from 'react';
import genUuid from 'uuid';
import * as THREE from 'three';
import RenderShell from './RenderShell';
import { shouldUpdate } from 'recompose';

const Pure = shouldUpdate((props, nextProps) => {
    const ignoreView = key => key !== 'view';    
    const propsKeys = Object.keys(props).filter(ignoreView);
    const nextPropsKeys = Object.keys(props).filter(ignoreView);

    if (propsKeys.length !== nextPropsKeys.length) return true;

    const compare = key => propsKeys[key] === nextPropsKeys[key];
    if (propsKeys.filter(compare).length !== propsKeys.length) return true;
    if (nextPropsKeys.filter(compare).length !== nextPropsKeys.length) return true;

    return false;
});

export default class RenderObject extends React.PureComponent {

    static Pure = Pure;

    static DIRECTION = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right',
    };

    static byType(children, ctor, props = {}) {
        // react children ?
        const isReact = (
            children && 
            children[0] && 
            children[0].type && 
            children[0].props);

        // filter by constructor & patch props with ctor
        if (isReact) {
            return RenderObject.clone(children.filter(c => c.type === ctor), {...props, ctor});
        }

        // filter by constructor 
        return children.filter(c => (c.userData && c.userData.renderObject === ctor));
    }

    static clone(children, props) {
        return children.map(child => React.cloneElement(child, props));        
    }

    static uniqueKey(children) {
        return children.map((child, i) => {
            if (child.props.key === undefined) {
                return React.cloneElement(child, { key: i });
            }
            return child;
        });
    }

    static animate(children, animateState, fn) {
        children.forEach((child, index) => {
            const uuid = child.userData.uuid || child.uuid;
            if (animateState[uuid] === undefined) animateState[uuid] = { };
            fn(child, animateState[uuid], index);
        });
    }

    static defaultProps = {
        onShell3D: () => {},
        onRender3D: () => {},
        onAnimate3D: () => {},
        hasInputElement: false,
        // onChildren3D, add this to customize props, children of this component 
    };

    static contextTypes = {
        root: React.PropTypes.object,
        parent: React.PropTypes.object
    };

    static childContextTypes = {
        parent: React.PropTypes.object
    };

    getChildContext() {
        return { parent: this };
    }

    get root() {
        return this.context.root;
    }

    get parent() {
        return this.context.parent;
    }

    get name() { 
        return (this.props.name || 'RenderObject'); 
    }

    get uuid() { 
        return (this._uuid = this._uuid || genUuid()); 
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

    findGeometry(object3D) {
        let geometryObject3D = undefined;
        // first pass check for isShell
        object3D.traverse(obj => {
            if (!geometryObject3D && obj.isShell) {
                geometryObject3D = obj;
            }
        });
        // second pass use any geometry
        if (!geometryObject3D) {
            object3D.traverse(obj => {
                if (!geometryObject3D && obj.geometry) {
                    geometryObject3D = obj;
                }
            });
        }
        return geometryObject3D;
    }

    startAnimate3D() {
        const root = this.root;
        if (root.startAnimate3D) root.startAnimate3D(this);
    }

    stopAnimate3D() {
        const root = this.root;
        if (root.stopAnimate3D) root.stopAnimate3D(this);
    }

    handleInputEvent = (event, point) => {
        const { type } = event;
        this.animateState = this.animateState || { };
        this.props.onInputEvent({ 
            type,
            event,
            point,
            object3D: this.object3D,
            animateState: this.animateState 
        });
    }

    startRayCheck3D(object3D) {
        const geometry = this.findGeometry(object3D);
        if (geometry && this.props.onInputEvent) {
            geometry.userData.onInputEvent = this.handleInputEvent;
            geometry.userData.hasInputElement = this.props.hasInputElement;            
            const root = this.root;
            if (root.startRayCheck3D) root.startRayCheck3D(geometry);
        }
    }

    stopRayCheck3D(object3D) {
        const geometry = this.findGeometry(object3D);
        if (geometry) {
            const root = this.root;
            if (root.stopRayCheck3D) root.stopRayCheck3D(geometry);
        }
    }

    clear3D() {
        if (!this.object3D || !this.object3D.parent) return;
        this.stopRayCheck3D(this.object3D);
        this.object3D.parent.remove(this.object3D);
        this.object3D = undefined;
    }

    componentDidMount() {
        this.startAnimate3D();
    }

    componentWillUnmount() {
        this.clear3D();
        this.stopAnimate3D();
    }

    animate3D(delta) {
        this.animateState = this.animateState || { };
        this.props.onAnimate3D(this.object3D, this.animateState, delta);
    }

    render3D(children) {
        const name = this.name;

        this.clear3D();
        this.object3D = this.props.onRender3D(this.uuid, children) || new THREE.Object3D();

        // how we build our scenegraph
        const parent = this.parent && this.parent.object3D;

        // we have a parent & object3D
        if (parent && this.object3D) {
            // make sure to build a proper 3D tree
            parent.add(this.object3D);

            // standard values for object3D
            this.object3D.name = name;
            this.object3D.userData.uuid = this.uuid;
            this.object3D.userData.renderObject = this.props.ctor;
            
            // standard props to apply
            this.applyProps3D(
                'scale-x', 'scale-y', 'scale-z',
                'rotation-x', 'rotation-y', 'rotation-z',
                'position-x', 'position-y', 'position-z'
            );

            // create input raycheck shell
            const shell = this.props.onShell3D(RenderShell);
            if (shell) this.object3D.add(shell);
            
            // handle user input
            if (!(this.object3D instanceof THREE.Scene)) {
                this.startRayCheck3D(this.object3D);
            }
        }

        return children;
    }

    mapChildren(children) {
        return React.Children.map(children || [], child => child);
    }

    children3D() {
        let children = this.mapChildren(this.props.children);

        if (this.props.onChildren3D) {
            children = this.props.onChildren3D(children);
            children = RenderObject.uniqueKey(R.flatten(children));
        }

        return children;//this.mapChildren(children);
    }

    render() {
        const name = this.name;
        console.log('RenderObject', this.name);
        const children = this.render3D(this.children3D());
        return <div data-name={name}>{children}</div>;
    }

}
