import Chained from './chained';

class BulletMod extends Chained {
    kill() {
        console.log('Mine!');
        return super.kill();
    }
    update() {
        super.update();
    }
}

export default BulletMod;
