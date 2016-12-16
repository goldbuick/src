import './App.less';
import Phaser from './Phaser';
import Lobby from './state/Lobby';
import Preloader from './state/Preloader';
import RuckusArena from './state/RuckusArena';

// const size = 3000;
let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'nexus', this, false, false);

game.state.add('Lobby', Lobby);
game.state.add('Preloader', Preloader);
game.state.add('RuckusArena', RuckusArena);

game.state.start('Preloader');
