
import './App.less';
import Phaser from './Phaser';
import Preloader from './state/Preloader';
import RuckusArena from './state/RuckusArena';

let game = new Phaser.Game(1280, 720, Phaser.AUTO, 'nexus');
game.state.add('Preloader', Preloader);
game.state.add('RuckusArena', RuckusArena);

game.state.start('Preloader');
