import './App.less';
import Phaser from './Phaser';
import Preloader from './state/Preloader';
import RuckusArena from './state/RuckusArena';

let game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'nexus', this, false, false);

game.state.add('Preloader', Preloader);
game.state.add('RuckusArena', RuckusArena);

game.state.start('Preloader');
