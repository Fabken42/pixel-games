import Phaser from "phaser";
import Apple from "../assets/img/apple.png";
import Basket from "../assets/img/basket.png";
import GameBG from "../assets/img/gameBG.png";
import GoldenApple from "../assets/img/goldenApple.png";
import SpeedPowerUp from "../assets/img/speedPowerUp.png";

import CollectAppleAudio from "../assets/audio/collectApple.mp3";
import CollectPowerUpAudio from "../assets/audio/collectPowerUp.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';
    static increaseTimes = 5;
    static spawnPowerUpDelay = 10000;
    static powerUpDuration = 5000;

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image('gameBG', GameBG);
        this.load.image('apple', Apple);
        this.load.image('basket', Basket);
        this.load.image('goldenApple', GoldenApple);
        this.load.image('speedPowerUp', SpeedPowerUp);

        this.load.audio('collectAppleAudio', CollectAppleAudio);
        this.load.audio('collectPowerUpAudio', CollectPowerUpAudio);
    }

    create() { 
        this.keyMap = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        this.moveSpeed = 420;
        this.remainingTime = 45;
        this.score = 0;
        this.timeToSpawnApple = 1000;
        this.appleGroup = this.add.group();

        this.add.image(0, 0, 'gameBG').setOrigin(0).setScale(GameScene.increaseTimes);
        this.player = this.physics.add.image(this.game.config.width / 2, this.game.config.height - 50, 'basket').setOrigin(0.5).setScale(GameScene.increaseTimes).setImmovable(true).setCollideWorldBounds(true);
        this.player.body.allowGravity = false;
        this.player.body.setSize(15, 1);

        this.scoreText = this.add.text(16, 16, `Pontuação: ${this.score}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#322C2B' });
        this.remainingTimeText = this.add.text(this.cameras.main.width - 16, 16, `Tempo: ${this.remainingTime}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#322C2B', align: 'right' }).setOrigin(1, 0);

        this.time.delayedCall(GameScene.spawnPowerUpDelay, () => this.spawnPowerUp());
        this.time.delayedCall(this.timeToSpawnApple, () => this.spawnApple()); //ajustar
        this.physics.add.collider(this.player, this.appleGroup, this.collectApple, null, this);

        this.time.addEvent({
            delay: 1000,
            callback: this.updateRemainingTime,
            callbackScope: this,
            loop: true
        });
    }

    spawnPowerUp() {
        this.time.delayedCall(GameScene.spawnPowerUpDelay, () => this.spawnPowerUp());

        let randomX = Math.random() * 600 + 100;
        let randomY = Math.random() * 110 + 80;

        this.powerUp = this.physics.add.sprite(randomX, randomY, 'speedPowerUp');

        this.powerUp.setScale(5);
        this.time.delayedCall(400, () => this.physics.world.enable(this.powerUp));

        this.physics.add.collider(this.player, this.powerUp, this.collectPowerUp, null, this);
    }

    spawnApple() {
        let newApple;
        if (this.timeToSpawnApple > 600) this.timeToSpawnApple -= 15;
        this.time.delayedCall(this.timeToSpawnApple, () => this.spawnApple());

        let randomX = Math.random() * 600 + 100;
        let randomY = Math.random() * 110 + 80;

        if (Math.random() * 20 > 19) {
            newApple = this.appleGroup.create(randomX, randomY, 'goldenApple');
            newApple.score = 3;

        } else {
            newApple = this.appleGroup.create(randomX, randomY, 'apple');
            newApple.score = 1;
        }

        newApple.setScale(4);
        this.time.delayedCall(400, () => this.physics.world.enable(newApple));
    }

    collectApple(player, apple) {
        this.sound.play('collectAppleAudio', { volume: 0.6 });
        this.score += apple.score;
        this.scoreText.setText(`Pontuação: ${this.score}`);
        apple.destroy();

        let scoreText = this.add.text(apple.x, apple.y, `+${apple.score}`, { fontFamily: GameScene.gameFont, fontSize: '16px', color: '#FFFF00' }).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            alpha: 0,
            duration: 1000,  
            onComplete: () => {
                scoreText.destroy();
            }
        });
    }

    collectPowerUp() {
        this.sound.play('collectPowerUpAudio', { volume: 0.8 });
        this.powerUp.destroy();
        this.moveSpeed *= 1.5;
        this.time.delayedCall(GameScene.powerUpDuration, () => this.moveSpeed /= 1.5);
    }

    updateRemainingTime() {
        this.remainingTimeText.setText(`Tempo: ${--this.remainingTime}`);
        if (this.remainingTime <= 0) this.gameOver();
    }

    update() {
        if (this.keyMap.left.isDown) {
            this.player.setVelocityX(-this.moveSpeed);
        }
        else if (this.keyMap.right.isDown) {
            this.player.setVelocityX(this.moveSpeed);
        }
        else {
            this.player.setVelocityX(0);
        }

        this.appleGroup.getChildren().forEach((apple) => {
            if (apple.y > this.game.config.height) {
                apple.destroy();
            }
        }, this);

        if (this.powerUp && this.powerUp.y > this.game.config.height) this.powerUp.destroy();
    }

    gameOver() {
        this.registry.set('score', this.score);
        this.scene.start('menuScene');
    }
}