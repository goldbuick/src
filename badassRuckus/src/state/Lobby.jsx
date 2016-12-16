import Phaser from 'phaser';
import { gameText } from '../Text';

export default class extends Phaser.State {

    preload() {
        const { game } = this;   
    }

    create() {
        const { game } = this;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.layout(game);
    }

    ui(name, create, place) {
        const { game } = this;
        let obj = this[name];

        if (!obj) {
            if (typeof create === 'string') {
                obj = gameText(game, { text: create });
            } else {
                obj = create();
            }
            this[name] = obj;
        }

        place(obj, name);
    }

    layout(game) {
        const cX = game.world.centerX;
        const cY = game.world.centerY;
        const cL = cX * 0.5;
        const cR = cX + cL;
        const cT = cY * 0.5;
        const cB = cY + cT;

        const getReadyStr = 'Get Ready!!!?';
        this.ui('timer', getReadyStr, tx => { tx.x = cX; tx.y = cY; });

        const updateTimer = (msg) => {
            const { timer, counter } = this;
            if (msg) {
                timer.text = msg;
            } else {
                this.counter = counter - 1;
                timer.text = this.counter + '...';
                if (this.counter <= 0) {
                    game.state.start('RuckusArena');
                }
            }
        };

        const checkTimer = () => {
            const { p1, p2, p3, p4, timer, timerEvent } = this;
            let go = [ p1, p2, p3, p4 ].filter(p => p.ready).length > 0;
            if (go) {
                this.counter = 4;
                if (!timerEvent) {
                    updateTimer(getReadyStr);
                    this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, updateTimer);
                }
            } else if (timerEvent) {
                game.time.events.remove(timerEvent);
                updateTimer(getReadyStr);
                delete this.timerEvent;
            }
        };
        
        const joinStr = '\nPress X to Join';
        const onDown = (tx) => {
            if (tx.ready) {
                tx.ready = false;
                tx.joined = false;
                tx.text = joinStr;
            } else if (tx.joined) {
                tx.ready = true;
                tx.text = tx.name + ' is Ready\nPress X to Cancel';
            } else {
                tx.joined = true;
                tx.text = tx.name + ' Joined\nPress X for Ready';
            }
            checkTimer();
        };

        const txSetup = (tx, name, pad) => {
            tx.align = 'center';
            tx.name = name.toUpperCase(); 
            pad.addCallbacks(this, {
                onDown: btn => {
                    if (btn === Phaser.Gamepad.XBOX360_X) {
                        onDown(tx);
                    }
                }
            });
        };

        this.ui('p1', joinStr, (tx, name) => { 
            tx.x = cL; tx.y = cT; txSetup(tx, name, game.input.gamepad.pad1); });
        this.ui('p2', joinStr, (tx, name) => { 
            tx.x = cR; tx.y = cT; txSetup(tx, name, game.input.gamepad.pad2); });
        this.ui('p3', joinStr, (tx, name) => { 
            tx.x = cL; tx.y = cB; txSetup(tx, name, game.input.gamepad.pad3); });
        this.ui('p4', joinStr, (tx, name) => { 
            tx.x = cR; tx.y = cB; txSetup(tx, name, game.input.gamepad.pad4); });
    }

    update() {
        const { game } = this;
        // game.scale.setGameSize(game.scale.width, game.scale.height);
        this.layout(game);
    }

}
