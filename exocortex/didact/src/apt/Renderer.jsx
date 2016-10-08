import React from 'react';
import UtilDebounce from './UtilDebounce';
const THREE = require('three');
// hack for bmfont
global.THREE = THREE;

export default class Renderer extends React.Component {

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
            antialias: true,
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

    handleResize = UtilDebounce(() => this.updateSize(), 250)

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

    handleWheel = (e) => this.props.onWheel(this.renderer, e)
    handleTouchStart = (e) => this.props.onTouchStart(this.renderer, e)
    handleTouchMove = (e) => this.props.onTouchMove(this.renderer, e)
    handleTouchEnd = (e) => this.props.onTouchEnd(this.renderer, e)
    handleMouseDown = (e) => this.props.onMouseDown(this.renderer, e)
    handleMouseMove = (e) => this.props.onMouseMove(this.renderer, e)
    handleMouseUp = (e) => this.props.onMouseUp(this.renderer, e)

    render() {
        return <div 
            className="renderer"
            ref={el => this.container = el}
            onWheel={this.handleWheel}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}>{this.props.children}</div>;
    }

}

