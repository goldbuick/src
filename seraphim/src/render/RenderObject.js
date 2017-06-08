import R from 'ramda';
import React from 'react';
import genUuid from 'uuid';
import * as THREE from 'three';
import RenderShell from './RenderShell';
import { shouldUpdate } from 'recompose';

const Pure = shouldUpdate((props, nextProps) => {
    const ignoreView = key => key !== 'view';    
    const propsKeys = Object.keys(props).filter(ignoreView);
    const nextPropsKeys = Object.keys(nextProps).filter(ignoreView);
    if (propsKeys.length !== nextPropsKeys.length) return true;

    const compare = key => props[key] === nextProps[key];
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

    static byChildren(children) {
        return children.filter(child => !child.notChild);
    }

    static animate(children, fn) {
        children.forEach((child, index) => fn(child, child.userData.animateState, index));
    }

    static defaultProps = {
        onShell3D: () => {},
        onRender3D: () => {},
        onAnimate3D: () => {},
        hasInputElement: false,
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

    get object3D() {
        return (this._object3D = this._object3D || new THREE.Object3D());
    }

    get animateState() {
        this._animateState = this._animateState || { };
        this.object3D.userData.animateState = this._animateState;
        return this._animateState;
    }

    findGeometry() {
        let geometryObject3D = undefined;
        // first pass check for shell
        if (this.shell) {
            geometryObject3D = this.shell;
        }
        // second pass use any geometry from content
        if (!geometryObject3D && this.content) {
            this.content.traverse(obj => {
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
        this.props.onInputEvent({ 
            type,
            event,
            point,
            object3D: this.object3D,
            animateState: this.animateState,
        });
    }

    startRayCheck3D() {
        const geometry = this.findGeometry();
        if (geometry && this.props.onInputEvent) {
            geometry.userData.onInputEvent = this.handleInputEvent;
            geometry.userData.hasInputElement = this.props.hasInputElement;            
            const root = this.root;
            if (root.startRayCheck3D) root.startRayCheck3D(geometry);
        }
    }

    stopRayCheck3D() {
        const geometry = this.findGeometry();
        if (geometry) {
            const root = this.root;
            if (root.stopRayCheck3D) root.stopRayCheck3D(geometry);
        }
    }

    componentDidMount() {
        this.startAnimate3D();
    }

    componentWillUnmount() {        
        this.stopAnimate3D();
        this.stopRayCheck3D();
        if (this.object3D.parent) this.object3D.parent.remove(this.object3D);
    }

    animate3D(delta) {
        this.props.onAnimate3D(this.object3D, this.animateState, delta);
    }

    render3D(children) {
        // standard values for object3D
        this.object3D.name = this.name;
        this.object3D.userData.uuid = this.uuid;
        this.object3D.userData.renderObject = this.props.ctor;

        // reset content
        this.stopRayCheck3D();
        if (this.shell) this.object3D.remove(this.shell);
        if (this.content) this.object3D.remove(this.content);

        // render content
        const content = this.props.onRender3D(this.uuid, children) || new THREE.Object3D();
        
        // special handling for scene
        if (content instanceof THREE.Scene) {
            this._object3D = content;
            return children;
        }

        // how we build our scenegraph
        const parent = this.parent && this.parent.object3D;
        if (parent && !this.object3D.parent) parent.add(this.object3D);
        
        // rendered content
        this.content = content;
        if (this.content) {
            this.content.notChild = true;
            this.object3D.add(this.content);
        }

        // create input raycheck shell
        this.shell = this.props.onShell3D(RenderShell);
        if (this.shell) {
            this.shell.notChild = true;
            this.object3D.add(this.shell);
        }
            
        // handle user input
        this.startRayCheck3D();
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

        return children;
    }

    render() {
        const name = this.name;
        const children = this.render3D(this.children3D());
        return <div data-name={name}>{children}</div>;
    }

}
