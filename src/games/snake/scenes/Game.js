import Phaser from "phaser";
import DragonBG from "../assets/img/dragonBG.png";
import DragonHead from "../assets/img/dragonHead.png";
import DragonBody from "../assets/img/dragonBody.png";
import DragonBall from "../assets/img/dragonBall.png";

import BackgroundMusic from "../assets/audio/background-music.wav";
import EatingSound from "../assets/audio/eating-sound.mp3";
import LooseGame from "../assets/audio/looseGame.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';
    static increaseTimes = 5;
    static squareSize = 50;
    static moveDelay = 150;

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image('dragonBG', DragonBG);
        this.load.image('dragonHead', DragonHead);
        this.load.image('dragonBody', DragonBody);
        this.load.image('dragonBall', DragonBall);
        this.load.audio("backgroundMusic", BackgroundMusic);
        this.load.audio("eatingSound", EatingSound);
        this.load.audio("looseGame", LooseGame);

    }

    create() {
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.moveDirection = 'up';
        this.moveDragonKeyPressed = false;
        this.score = 0;

        this.add.image(0, 0, 'dragonBG').setOrigin(0).setScale(GameScene.increaseTimes);
        this.drawInitialDragon();
        this.dragonBall = this.add.sprite(10 * GameScene.squareSize - GameScene.squareSize / 2, 6 * GameScene.squareSize - GameScene.squareSize / 2, 'dragonBall').setScale(GameScene.increaseTimes).setOrigin(0.5);

        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.75 });
        this.backgroundMusic.play();

        this.time.addEvent({
            delay: GameScene.moveDelay,
            callback: this.moveDragon,
            callbackScope: this,
            loop: true
        });
    }

    drawInitialDragon() {
        const initialX = 6 * GameScene.squareSize;
        const initialY = 8 * GameScene.squareSize;

        this.dragonHead = this.add.sprite(initialX - GameScene.squareSize / 2, initialY - GameScene.squareSize / 2, 'dragonHead').setScale(GameScene.increaseTimes).setOrigin(0.5);

        this.dragonBodyParts = [];
        for (let i = 1; i <= 3; i++) {
            const bodyPart = this.add.sprite(initialX - GameScene.squareSize / 2, (8 + i) * GameScene.squareSize - (GameScene.squareSize / 2), 'dragonBody').setScale(GameScene.increaseTimes).setOrigin(0.5);
            this.dragonBodyParts.push(bodyPart);
        }
    }

    moveDragon() {
        if (this.dragonHead.x === this.dragonBall.x && this.dragonHead.y === this.dragonBall.y) {
            this.dragonEatBall();
        }

        const directions = {
            up: { rotation: 0, dx: 0, dy: -GameScene.squareSize },
            down: { rotation: Math.PI, dx: 0, dy: GameScene.squareSize },
            left: { rotation: -Math.PI / 2, dx: -GameScene.squareSize, dy: 0 },
            right: { rotation: Math.PI / 2, dx: GameScene.squareSize, dy: 0 }
        };

        const direction = directions[this.moveDirection];

        if (direction) {
            this.dragonHead.setRotation(direction.rotation);

            if (this.increaseDragonSize) {
                let newBodyPart = this.add.sprite(this.dragonHead.x, this.dragonHead.y, 'dragonBody').setScale(GameScene.increaseTimes).setOrigin(0.5).setRotation(direction.rotation);
                this.dragonBodyParts.unshift(newBodyPart);
            } else {
                let removedDragonPart = this.dragonBodyParts.pop();
                removedDragonPart.x = this.dragonHead.x;
                removedDragonPart.y = this.dragonHead.y;
                removedDragonPart.setRotation(direction.rotation);
                this.dragonBodyParts.unshift(removedDragonPart);
            }
            this.dragonHead.x += direction.dx;
            this.dragonHead.y += direction.dy;
        }

        if (this.nextMoveDirection) {
            this.moveDirection = this.nextMoveDirection;
            this.nextMoveDirection = '';
        } else {
            this.moveDragonKeyPressed = false;
        }

        this.checkGameOver();
        this.increaseDragonSize = false;
    }

    dragonEatBall() {
        this.sound.play("eatingSound", { volume: 0.4 });
        var scoreText = this.add.text(this.dragonBall.x, this.dragonBall.y, ++this.score, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#e6cc00' }).setDepth(1).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            alpha: 0,
            duration: 1800,
            onComplete: () => {
                scoreText.destroy();
            }
        });

        this.moveDragonBall();
        this.increaseDragonSize = true;
    }

    moveDragonBall() {
        let randomX = Math.ceil(Math.random() * 15) * GameScene.squareSize - GameScene.squareSize / 2;
        let randomY = Math.ceil(Math.random() * 11) * GameScene.squareSize - GameScene.squareSize / 2;

        if (this.isOverlappingWithDragon(randomX, randomY)) return this.moveDragonBall();

        this.dragonBall.x = randomX;
        this.dragonBall.y = randomY;
    }

    isOverlappingWithDragon(x, y) {
        if (this.dragonHead.x === x && this.dragonHead.y === y) {
            return true;
        }

        for (let i = 0; i < this.dragonBodyParts.length; i++) {
            if (this.dragonBodyParts[i].x === x && this.dragonBodyParts[i].y === y) {
                return true;
            }
        }
        return false;
    }

    checkGameOver() {
        if (this.dragonHead.x - GameScene.squareSize / 2 < 0 || this.dragonHead.y - GameScene.squareSize / 2 < 0) {
            this.gameOver();
            return;
        } else if (this.dragonHead.x + GameScene.squareSize / 2 > this.game.config.width || this.dragonHead.y + GameScene.squareSize / 2 > this.game.config.height) {
            this.gameOver();
            return;
        }

        for (let i = 0; i < this.dragonBodyParts.length; i++) {
            if (this.dragonHead.x === this.dragonBodyParts[i].x && this.dragonHead.y === this.dragonBodyParts[i].y) {
                this.gameOver();
                return;
            }
        }
    }
    update() {
        const directionMap = {
            up: { key: this.keys.up, opposite: 'down' },
            down: { key: this.keys.down, opposite: 'up' },
            left: { key: this.keys.left, opposite: 'right' },
            right: { key: this.keys.right, opposite: 'left' }
        };

        for (const direction in directionMap) {
            const key = directionMap[direction].key;

            if (key.isDown && this.moveDirection !== directionMap[direction].opposite) {
                this.moveDragonKeyPressed = true;
                if (!this.moveDragonKeyPressed) {
                    this.moveDirection = direction;
                } else if (this.moveDirection !== directionMap[direction].opposite) {
                    this.nextMoveDirection = direction;
                }
            }
        }
    }

    gameOver() {
        this.sound.play('looseGame', { volume: 0.6 })
        this.backgroundMusic.stop();
        this.registry.set('score', this.score);
        this.scene.start('menuScene');
    }
}