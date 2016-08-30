// base class for audio gen

class Module {

    get isAudio() {
        return this.synth;
    }

    constructor () {
        this.targetMods = [ ];
    }

    triggerEvent (type, value, time, source) {
        this.targetMods.forEach(mod => mod.handleEvent(type, value, time, source));
    }

    handleEvent (type, value, time, source) {
        console.log('Module', type, value, time, source);
    }

    connect (mod) {
        this.targetMods.push(mod);
    }

    disconnect (mod) {
        this.targetMods = this.targetMods.filter(target => target !== mod);
    }

}

export default Module;
