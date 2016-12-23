import TAGS from '../Tags';
import Phaser from 'phaser';
import Arena from './Arena';
import Players from './Players';
import { Controller } from '../Controller';

export default class Camera extends Controller {

    static selectScaleLayer(game) {
        return Controller.selectByTag(game, TAGS.SCALE_LAYER).first;
    }

    static config = {
    }

    create(game, config) {
        this.target = {
            postUpdate: () => { },
            worldPosition: { x: 0, y: 0 },
        };
        this.bounds = Phaser.Rectangle.clone(game.world.bounds);
        const lerp = 0.1;
        game.camera.follow(this.target, Phaser.Camera.FOLLOW_LOCKON, lerp, lerp);
        Controller.tag(game.add.group(), TAGS.SCALE_LAYER);
    }

    update(game, config) {
        const players = Players.selectPlayers(game);
        const collideLayer = Arena.selectCollideLayer(game);
        if (!players.total) return;

        let x = [], y = [];
        let player = players.first;
        while (player) {
            const { width, height } = player;
            x.push(player.worldPosition.x);
            x.push(player.worldPosition.x + width);
            y.push(player.worldPosition.y);
            y.push(player.worldPosition.y + height);
            player = players.next;
        }

        const margin = 100;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const left = Math.min.apply(Math, x) - margin;
        const right = Math.max.apply(Math, x) + margin;
        const top = Math.min.apply(Math, y) - margin;
        const bottom = Math.max.apply(Math, y) + margin;
        const width = Math.min(right - left, collideLayer.width);
        const height = Math.min(bottom - top, collideLayer.height);
        const scale = Math.max(1, width / winWidth, height / winHeight);
        const scaledWidth = winWidth * scale;
        const scaledHeight = winHeight * scale;

        if (game.width !== scaledWidth || 
            game.height !== scaledHeight) {
            const smoothItFucker = 1;
            game.scale._updateThrottle = smoothItFucker;
            game.scale._updateThrottleReset = smoothItFucker;
            game.scale.setGameSize(scaledWidth, scaledHeight);
            game.world.setBounds(0, 0, collideLayer.width, collideLayer.height);
        }

        this.target.worldPosition.x = left + width * 0.5;
        this.target.worldPosition.y = top + height * 0.5;

    }
}
