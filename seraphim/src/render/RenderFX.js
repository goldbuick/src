import React from 'react';
import Render from './Render';
import '../threejs/postprocessing/EffectComposer';

export default class RenderFX extends React.Component {
    
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
            console.error('onCreate for RenderFX should return a list of render passes');
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
        return <Render 
            {...this.props}
            onCreate={this.handleCreate} 
            onUpdate={this.handleUpdate} 
            onResize={this.handleResize}>{this.props.children}</Render>;
    }

}

