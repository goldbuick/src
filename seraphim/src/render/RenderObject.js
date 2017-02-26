import React from 'react';
import genUuid from 'uuid';
import { flatten } from '../util/array';

export default class RenderObject extends React.Component {

    static defaultProps = {
        onRender3D: () => { },
        onAnimate3D: () => { },
        hasInputElement: false,
        // onChildren3D, add this to customize props, children of this component 
    }

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

    findRoot(parent) {
        // this is the root
        if (parent && parent.startAnimate3D) {
            return parent;
        }
        
        // this is not the root, but there are still
        // parent components
        if (parent.props && parent.props.parent) {
            return this.findRoot(parent.props.parent);
        }

        // did not find root
        return undefined;
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

    componentDidMount() {
        console.log('componentDidMount');
        let root = this.findRoot(this);
        if (root) root.startAnimate3D(this);
    }

    componentDidUpdate() {
        let root = this.findRoot(this);
        if (root) root.startAnimate3D(this);
    }

    componentWillUnmount() {
        this.clear3D();
        let root = this.findRoot(this);
        if (root.stopAnimate3D) root.stopAnimate3D(this);
    }

    animate3D(delta) {
        this.animateState = this.animateState || { };
        this.props.onAnimate3D(this.object3D, this.animateState, delta);
    }

    handlePointer = (e, id, pressed, point) => {
        this.animateState = this.animateState || { };
        this.props.onPointer({ 
            id,
            point,
            pressed,
            object3D: this.object3D,
            animateState: this.animateState 
        });
    }

    render3D(children) {
        this.clear3D();
        this.object3D = this.props.onRender3D(this.uuid, children) || new THREE.Object3D();

        let parent = this.props.parent && this.props.parent.object3D;
        if (parent && this.object3D) {
            // make sure to build a proper 3D tree
            parent.add(this.object3D);

            // standard values for object3D
            this.object3D.name = this.props.name;
            this.object3D.userData.uuid = this.uuid;
            this.object3D.userData.renderObject = this.props.ctor;
            
            // standard props to apply
            this.applyProps3D(
                'scale-x', 'scale-y', 'scale-z',
                'rotation-x', 'rotation-y', 'rotation-z',
                'position-x', 'position-y', 'position-z'
            );
            
            // handle user input
            if (this.props.onPointer && !(this.object3D instanceof THREE.Scene)) {
                let placed = false;
                this.object3D.traverse(obj => {
                    if (placed === false && obj.geometry) {
                        placed = true;
                        obj.userData.onPointer = this.handlePointer;
                        obj.userData.hasInputElement = this.props.hasInputElement;
                    }
                });
            }
        }
    }

    children3D() {
        let children = React.Children.map(this.props.children || [], child => {
            return React.cloneElement(child, { parent: this });
        });

        if (this.props.onChildren3D) {
            children = this.props.onChildren3D(children);
            if (!Array.isArray(children)) children = [ children ];
            children = RenderObject.uniqueKey(flatten(children));
        }

        return React.Children.map(children, child => {
            return React.cloneElement(child, { parent: this });
        });
    }

    render() {
        if (this.uuid === undefined) this.uuid = genUuid();
        const name = this.props.name || 'RenderObject';
        const children = this.children3D();
        this.render3D(children);
        return <div data-name={name}>{children}</div>;
    }

}
