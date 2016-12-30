import Chained from './Chained';

class BulletMod extends Chained {
    update() {
        super.update();
        if (!this.exists) return;
        const { fx } = this.data.bulletManager;
        fx.emitParticle(this.position.x, this.position.y);
    }
}

export default BulletMod;
