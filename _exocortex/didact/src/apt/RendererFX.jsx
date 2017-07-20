import React from 'react';
import Renderer from './Renderer';

const THREE = require('three');
import './threejs/postprocessing/EffectComposer';

export default class RendererFX extends React.Component {
    
    static defaultProps = {
        onCreate: () => [ ],
        onUpdate: () => { },
        onResize: () => { },
    }

    handleCreate = (renderer, width, height) => {
        renderer.autoClear = false;
        this.composer = new THREE.EffectComposer(renderer);
        let passes = this.props.onCreate(renderer, this.composer, width, height);        
        
        if (!Array.isArray(passes)) {
            console.error('onCreate for RendererFX should return a list of render passes');
            passes = [ ];
        }
        passes.forEach(pass => this.composer.addPass(pass));

        let lastPass = passes.pop();
        if (lastPass) lastPass.renderToScreen = true;
    }

    handleUpdate = (renderer, delta) => {
        renderer.clear();
        this.composer.render(delta);
        this.props.onUpdate(renderer, this.composer, delta);
    }

    handleResize = (renderer, width, height) => {
        this.composer.setSize(width, height);
        this.props.onResize(renderer, this.composer, width, height);
    }

    render() {
        return <Renderer 
            {...this.props}
            onCreate={this.handleCreate} 
            onUpdate={this.handleUpdate} 
            onResize={this.handleResize}>{this.props.children}</Renderer>;
    }

}

