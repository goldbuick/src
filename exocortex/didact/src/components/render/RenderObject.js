import R from 'ramda';
import React from 'react';
import genUuid from 'uuid';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import RenderShell from './RenderShell';

class RenderObject extends React.Component {

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
        device: PropTypes.object,
        parent: PropTypes.object,
    };

    static childContextTypes = {
        parent: PropTypes.object,
    };

    getChildContext() {
        return { parent: this };
    }

    get device() { return this.context.device; }
    get parent() { return this.context.parent; }
    get name() { return (this.props.name || 'RenderObject'); }
    get uuid() { return (this._uuid = this._uuid || genUuid()); }
    get object3D() { return (this._object3D = this._object3D || new THREE.Object3D()); }
    get animateState() {
        this._animateState = this._animateState || { };
        this.object3D.userData.animateState = this._animateState;
        return this._animateState;
    }

    runAnimation(delta) {
        this.props.onAnimate3D(this.object3D, this.animateState, delta);
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

    startInputEvent() {
        if (this.device && this.shell && this.props.onInputEvent) {
            this.shell.userData.onInputEvent = this.handleInputEvent;
            this.shell.userData.hasInputElement = this.props.hasInputElement;
            this.device.startInputEvent(this.shell);
        }
    }

    stopInputEvent() {
        if (this.device && this.shell) {
            this.device.stopInputEvent(this.shell);
        }
    }

    componentDidMount() {        
        // how we build our scenegraph
        const scene = this.device && this.device.scene;
        const parent = this.parent && this.parent.object3D;
        if (parent) {
            parent.add(this.object3D);
        } else if (scene) {
            scene.add(this.object3D);
        }
        if (this.device) this.device.startAnimation(this);
    }

    componentWillUnmount() {
        this.stopInputEvent();
        if (this.device) this.device.stopAnimation(this);
        if (this.object3D.parent) this.object3D.parent.remove(this.object3D);
    }

    children3D() {
        let children = React.Children.map(this.props.children || [], child => child);
        if (this.props.onChildren3D) {
            children = this.props.onChildren3D(children);
            children = RenderObject.uniqueKey(R.flatten(children));
        }
        return children;
    }

    render3D(children) {
        // standard values for object3D
        this.object3D.name = this.name;
        this.object3D.userData.uuid = this.uuid;
        this.object3D.userData.renderObject = this.props.ctor;

        // reset shell & content
        this.stopInputEvent();
        if (this.shell) this.object3D.remove(this.shell);
        if (this.content) this.object3D.remove(this.content);
        
        // render content
        this.content = this.props.onRender3D(this.uuid, children) || new THREE.Object3D();
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
        this.startInputEvent();

        // don't actually modify children, just pass through
        return children;
    }

    render() {
        const name = this.name;
        const children = this.render3D(this.children3D());
        return <div data-name={name}>{children}</div>;
    }
}

export default RenderObject;
