import React from 'react';

export default class RendererObject extends React.Component {

    static defaultProps = {
        onRender3D: () => { },
        onAnimate3D: () => { },
        hasInputElement: false,
        // onChildren3D, add this to customize props, children of this component 
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

    render3D() {
        this.clear3D();
        this.object3D = this.props.onRender3D() || new THREE.Object3D();

        let parent = this.props.parent && this.props.parent.object3D;
        if (parent && this.object3D) {
            parent.add(this.object3D);
            this.object3D.name = this.props.name;
            this.applyProps3D(
                'scale-x', 'scale-y', 'scale-z',
                'rotation-x', 'rotation-y', 'rotation-z',
                'position-x', 'position-y', 'position-z'
            );
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
        let children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { parent: this });
        });

        if (this.props.onChildren3D) {
            children = this.props.onChildren3D(children);
        }

        return children || null;
    }

    render() {
        this.render3D();
        return <div>{this.children3D()}</div>;
    }

}
