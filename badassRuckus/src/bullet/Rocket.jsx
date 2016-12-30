import Chained from './chained';

class BulletMod extends Chained {
    kill() {
        console.log('Rocket!');
        return super.kill();
    }
    update() {
        super.update();
    }
}

export default BulletMod;
