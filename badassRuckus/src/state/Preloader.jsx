import Phaser from 'phaser';
import { gameFontName } from '../Text';

export default class extends Phaser.State {

    preload() {
        const { game } = this;

        // audio
        [
            'buff',
            'coin',
            'crown',
            'dash',
            'gameover',
            'gun',
            'impact',
            'loop',
            'spawn',
            'splat',
            'voice1',
            'voice2',
            'voice3',
            'voiceFight',
        ].forEach(file => game.load.audio(`${file}`, `media/audio/${file}.wav`));

        // mobs
        [
            'enemyFloating_1',
            'enemyFloating_2',
            'enemyFloating_3',
            'enemyFloating_4',
            'enemyFlying_1',
            'enemyFlying_2',
            'enemyFlying_3',
            'enemyFlying_4',
            'enemyFlyingAlt_1',
            'enemyFlyingAlt_2',
            'enemyFlyingAlt_3',
            'enemyFlyingAlt_4',
            'enemySpikey_1',
            'enemySpikey_2',
            'enemySpikey_3',
            'enemySpikey_4',
            'enemySwimming_1',
            'enemySwimming_2',
            'enemySwimming_3',
            'enemySwimming_4',
            'enemyWalking_1',
            'enemyWalking_2',
            'enemyWalking_3',
            'enemyWalking_4',
        ].forEach(file => game.load.image(`${file}`, `media/monster/${file}.png`));

        // items & extras
        [
            'coin',
            'crown',
            'blink',
            'buffbox',
        ].forEach(file => game.load.image(`${file}`, `media/tiles/${file}.png`));

        // tiles & bkg
        game.load.image('tilesheet', `media/tiles/tilesheet.png`);
        [
            'set1_background',
            'set1_hills',
            'set1_tiles',
            'set2_background',
            'set2_hills',
            'set2_tiles',
            'set3_background',
            'set3_hills',
            'set3_tiles',
            'set4_background',
            'set4_hills',
            'set4_tiles',
        ].forEach(file => game.load.image(`${file}`, `media/bkg/${file}.png`));

        // player gear
        [
            'raygun',
            'raygunBig',
            'raygunPurple',
            'raygunPurpleBig',
        ].forEach(file => game.load.image(`${file}`, `media/weapons/${file}.png`));

        // player anim
        [
            'alienBlue',
            'alienGreen',
            'alienPink',
            'alienYellow',
        ].forEach(file => {
            game.load.atlas(`${file}`, `media/players/${file}.png`, `media/players/${file}.json`);
        });

        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js');       
    }

    ready = () => {
        const { game } = this;
        game.state.start('Lobby');
        game.input.gamepad.start();
    }

    create() {
        const { game } = this;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        WebFont.load({
            active: this.ready,
            google: { families: [ gameFontName ] },
        });
    }

}
