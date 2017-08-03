import React from 'react';
import TWEEN from 'tween.js';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import HammerComponent from 'react-hammerjs';
import * as RI from './RenderImports';

class RenderDevice extends React.Component {

    static childContextTypes = {
        device: PropTypes.object,
    };

    getChildContext() {
        return { device: this };
    }
    
    animationObjects = [];
    inputEventObjects = [];
    get scene() { return (this._scene = this._scene || new THREE.Scene()); }

    startAnimation(component) {
        if (component.animate && component.props && component.props.onAnimate) {        
            this.stopAnimation(component);
            this.animationObjects.push(component);
        }
    }

    stopAnimation(component) {
        this.animationObjects = this.animationObjects.filter(item => item !== component);
    }

    runAnimation(delta) {
        this.animationObjects.forEach(item => item.runAnimation(delta));
    }

    startInputEvent(object3D) {
        if (object3D && object3D.userData && object3D.userData.onInputEvent) {
            this.stopInputEvent(object3D);
            this.inputEventObjects.push(object3D);
        }
    }

    stopInputEvent(object3D) {
        this.inputEventObjects = this.inputEventObjects.filter(item => item !== object3D);
    }

    performInputCheck(rayCaster) {
        this.inputEventObjects.forEach(object3D => object3D.visible = true);
        const intersects = rayCaster.intersectObjects(this.inputEventObjects, false);
        this.inputEventObjects.forEach(object3D => object3D.visible = false);
        return intersects[0];
    }

    componentDidMount() {
        let width = this.container.offsetWidth,
            height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // this.renderer.sortObjects = false;
        this.renderer.vr.enabled = true;

        this.clock = new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

        this.composer = new RI.EffectComposer(this.renderer);

        const rez = 1024;
        let passes = [
            new RI.RenderPass(this.scene, this.camera),
            new RI.SMAAPass(width, height),
            new RI.BloomBlendPass(2, 1.2, new THREE.Vector2(rez, rez)),
            new RI.FilmPass(0.25, 0.5, height * 2, false),
        ];

        passes.forEach(pass => this.composer.addPass(pass));
        passes.pop().renderToScreen = true;

        window.maxAni = this.renderer.getMaxAnisotropy();
        window.addEventListener('resize', this.handleResize, true);

        this.renderer.animate(this.handleUpdate);

        // RI.WEBVR.checkAvailability().catch(( message ) => {
        // this is commented out because we want normal behavior on non-vr platforms
        //     document.body.appendChild(RI.WEBVR.getMessageContainer(message));
        // });
        RI.WEBVR.getVRDisplay((display) => {
            this.renderer.vr.setDevice(display);
            document.body.appendChild(RI.WEBVR.getButton(display, this.renderer.domElement));
        });

        // default scene junk
        const tilt = 32;
        [ -tilt, tilt ].map(tilt => {
            const light = new THREE.DirectionalLight(0xffffff, 0.2);
            light.position.set(tilt, 0, 8);
            return light;
        }).forEach(light => this.scene.add(light));

        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ color: 0x666666 });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -2;
        this.scene.add(mesh);

        geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -1;
        this.scene.add(mesh);

    }

    render() {
        return (
            <HammerComponent
                direction="DIRECTION_ALL">
                <div
                    className="renderer"
                    data-name="RenderDevice"
                    ref={this.handleRef}>
                    {this.props.children}
                </div>
            </HammerComponent>
        );
    }

    handleRef = (el) => {
        this.container = el;
    }

    handleResize = debounce(() => this.updateSize(), 250)

    handleUpdate = () => {
        const delta = this.clock.getDelta();
        TWEEN.update();
        this.runAnimation(delta);
        // this.composer.render(delta);
        this.renderer.render(this.scene, this.camera);
    }

    updateSize() {
        let width = this.container.offsetWidth,
            height = this.container.offsetHeight;
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

}

export default RenderDevice;
