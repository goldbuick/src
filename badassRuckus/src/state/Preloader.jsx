import Phaser from 'phaser';
import { gameFontName } from '../Text';

export default class extends Phaser.State {

    preload() {
        const { game } = this;

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

        // items
        [
            'buffbox',
            'godcoin',
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
            'alienBlue_climb1',
            'alienBlue_climb2',
            'alienBlue_duck',
            'alienBlue_front',
            'alienBlue_hit',
            'alienBlue_jump',
            'alienBlue_stand',
            'alienBlue_swim1',
            'alienBlue_swim2',
            'alienBlue_walk1',
            'alienBlue_walk2',
            'alienGreen_climb1',
            'alienGreen_climb2',
            'alienGreen_duck',
            'alienGreen_front',
            'alienGreen_hit',
            'alienGreen_jump',
            'alienGreen_stand',
            'alienGreen_swim1',
            'alienGreen_swim2',
            'alienGreen_walk1',
            'alienGreen_walk2',
            'alienPink_climb1',
            'alienPink_climb2',
            'alienPink_duck',
            'alienPink_front',
            'alienPink_hit',
            'alienPink_jump',
            'alienPink_stand',
            'alienPink_swim1',
            'alienPink_swim2',
            'alienPink_walk1',
            'alienPink_walk2',
            'alienYellow_climb1',
            'alienYellow_climb2',
            'alienYellow_duck',
            'alienYellow_front',
            'alienYellow_hit',
            'alienYellow_jump',
            'alienYellow_stand',
            'alienYellow_swim1',
            'alienYellow_swim2',
            'alienYellow_walk1',
            'alienYellow_walk2',
        ].forEach(file => game.load.image(`${file}`, `media/players/${file}.png`));

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
