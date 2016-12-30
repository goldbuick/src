import Phaser from 'phaser';

class BulletMod extends Phaser.Bullet {
    kill() {
        console.log('trigger nextWeapon');
        return super.kill();
    }
}

export default BulletMod;
