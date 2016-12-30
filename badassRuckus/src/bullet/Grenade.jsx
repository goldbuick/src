import Chained from './Chained';

class BulletMod extends Chained {
    kill() {
        console.log('Grenade!');
        return super.kill();
    }
    update() {
        super.update();
    }
}

export default BulletMod;