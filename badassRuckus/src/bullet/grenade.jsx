import Phaser from 'phaser';

class BulletMod extends Phaser.Bullet {
    kill() {
        console.log('BOOOM!');
        return super.kill();
    }
    update() {
        super.update();
    }
}

export default BulletMod;
