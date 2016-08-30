import './app.less';

class Test {

    static defaultProps = {
        autoPlay: false,
        maxLoops: 10,
    }

    static ops() {
        console.log(new Test(), Test.defaultProps);
    }

    prop = 'awesome'

    constructor() {
    }

    handleClick = (e) => {
        this.prop = false;
    }

}

Test.ops();

