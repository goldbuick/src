import React from 'react';
import debounce from '../util/debounce';

export default class Render extends React.Component {

    static defaultProps = {
        onCreate: () => { },
        onUpdate: () => { },
        onResize: () => { },
        onWheel: () => { },
        onTouchStart: () => { },
        onTouchMove: () => { },
        onTouchEnd: () => { },
        onMouseDown: () => { },
        onMouseMove: () => { },
        onMouseUp: () => { },
    }

    componentDidMount() {
        let width = this.container.offsetWidth,
            height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        window.maxAni = this.renderer.getMaxAnisotropy();
        window.addEventListener('resize', this.handleResize, true);

        this.props.onCreate(this.renderer, width, height);
        this.updateSize();
        this.handleUpdate();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.updateID);
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = debounce(() => this.updateSize(), 250)

    handleUpdate = (now) => {
        let diff = this.last ? now - this.last : (1.0 / 60.0),
            delta = diff / 1000;
        // 1000 µs = 1 ms
        // 1000 ms = 1 second
        this.last = now;
        this.props.onUpdate(this.renderer, delta);
        this.updateID = requestAnimationFrame(this.handleUpdate);
    }

    updateSize() {
        let width = this.container.offsetWidth,
            height = this.container.offsetHeight;
        this.renderer.setSize(width, height);
        this.props.onResize(this.renderer, width, height);        
    }

    render() {
        return <div 
            className="renderer"
            ref={el => this.container = el}
            onWheel={this.props.onWheel}
            onTouchStart={this.props.onTouchStart}
            onTouchMove={this.props.onTouchMove}
            onTouchEnd={this.props.onTouchEnd}
            onMouseDown={this.props.onMouseDown}
            onMouseMove={this.props.onMouseMove}
            onMouseUp={this.props.onMouseUp}>{this.props.children}</div>;
    }

}

