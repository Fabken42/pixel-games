import Phaser, { Game } from "phaser";

import Background from "../assets/img/background.png";
import Ball from "../assets/img/ball.png";
import Player from "../assets/img/player.png";
import Enemy from "../assets/img/enemy.png"
import PlayerConfetti from "../assets/img/player-confetti.png";
import EnemyConfetti from "../assets/img/enemy-confetti.png";

import PlayerWinRound from "../assets/audio/player-win-round.mp3";
import PlayerLooseRound from "../assets/audio/player-loose-round.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';
    static increaseTimes = 5;
    static ballInitialSpeedX = -500;
    static speed = 500;

    constructor() {
        super({ key: "gameScene" });
    }

    preload() {
        this.load.image("background", Background);
        this.load.image("ball", Ball);
        this.load.image("player", Player);
        this.load.image("enemy", Enemy);
        this.load.image("player-confetti", PlayerConfetti);
        this.load.image("enemy-confetti", EnemyConfetti);

        this.load.audio("player-win-round", PlayerWinRound);
        this.load.audio("player-loose-round", PlayerLooseRound);
    }

    create() {
        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        };

        this.roundEnd = false;
        this.playerScore = 0;
        this.enemyScore = 0;
        this.ballPlayerCollision = false;
        this.ballEnemyCollision = false;

        this.physics.world.checkCollision.left = false;
        this.physics.world.checkCollision.right = false;

        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

        this.add.image(0, 0, 'background').setOrigin(0).setScale(GameScene.increaseTimes);

        this.enemyScoreText = this.add.text(this.game.config.width / 2 - 90, 60, this.enemyScore, { fontFamily: GameScene.gameFont, fontSize: '36px', fill: '#fff' });
        this.playerScoreText = this.add.text(this.game.config.width / 2 + 65, 60, this.playerScore, { fontFamily: GameScene.gameFont, fontSize: '36px', fill: '#fff' });

        //alterei em 40
        this.player = this.physics.add.sprite(707, this.game.config.height / 2, 'player').setScale(GameScene.increaseTimes).setCollideWorldBounds(true).setImmovable(true);

        this.enemy = this.physics.add.sprite(92, this.game.config.height / 2, 'enemy').setScale(GameScene.increaseTimes).setCollideWorldBounds(true).setImmovable(true);

        this.ball = this.physics.add.sprite(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY, 'ball').setScale(GameScene.increaseTimes).setCollideWorldBounds(true).setVelocityX(GameScene.ballInitialSpeedX).setBounce(1);

        this.time.addEvent({
            delay: 65,
            callback: this.enemyMovement,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.playerMovement();
        if (!this.roundEnd) {
            this.ballCollision();

            if (this.ballPlayerCollision && this.ball.body.velocity.x > 0) {
                this.ballPlayerCollision = false;
                this.ball.body.velocity.x += 10; //bola fica mais rápida
                this.player.body.velocity.y += 10; //jogador mais rápido
                this.ball.body.velocity.y = (Math.random() * 100 - 50) + this.player.body.velocity.y;

                if (Math.abs(this.ball.body.velocity.y) < 30) {
                    this.ball.body.velocity.y *= 10;
                }
            }
            else if (this.ballEnemyCollision && this.ball.body.velocity.x < 0) {
                this.ballEnemyCollision = false;
                this.ball.body.velocity.x += 10; //bola fica mais rápida
                this.enemy.body.velocity.y += 10; //inimigo mais rápido
                this.ball.body.velocity.y = (Math.random() * 100 - 50) + this.enemy.body.velocity.y;

                if (Math.abs(this.ball.body.velocity.y) < 30) {
                    this.ball.body.velocity.y *= 10;
                }
            }

            if (this.ball.x > this.physics.world.bounds.right) {
                this.roundEnd = true;
                this.enemyWinsRound();
            }
            if (this.ball.x < this.physics.world.bounds.left) {
                this.roundEnd = true;
                this.playerWinsRound();
            }
        }
    }

    playerMovement() {
        if (this.keys.up.isDown || this.keys.w.isDown) {
            this.player.setVelocityY(-GameScene.speed);
        }
        else if (this.keys.down.isDown || this.keys.s.isDown) {
            this.player.setVelocityY(GameScene.speed);
        }
        else {
            this.player.setVelocityY(0);
        }
    }

    enemyMovement() {
        if (Math.abs(this.enemy.y - this.ball.y) <= 10) {
            this.enemy.setVelocityY(0); // Fica imóvel
        } else if (this.ball.y < this.enemy.y) {
            this.enemy.setVelocityY(-GameScene.speed); // Sobe 
        } else {
            this.enemy.setVelocityY(GameScene.speed); // Desce 
        }
    }

    ballCollision() {
        this.physics.collide(this.ball, this.player, () => this.ballPlayerCollision = true, null, this);
        this.physics.collide(this.ball, this.enemy, () => this.ballEnemyCollision = true, null, this);
    }

    playerWinsRound() {
        this.playerScoreText.setText(++this.playerScore);
        this.sound.play('player-win-round');
        this.checkGameOver();
        this.newRound();

        for (let i = -2; i <= 2; i++) {
            this.addConfetti(this.physics.world.bounds.right - 35, this.physics.world.bounds.centerY + i * 110, "player-confetti");
        }
    }

    enemyWinsRound() {
        this.enemyScoreText.setText(++this.enemyScore);
        this.sound.play('player-loose-round');
        this.checkGameOver();
        this.newRound();

        for (let i = -2; i <= 2; i++) {
            this.addConfetti(this.physics.world.bounds.left + 35, this.physics.world.bounds.centerY + i * 110, "enemy-confetti");
        }
    }

    addConfetti(posX, posY, particleName) {
        this.add.particles(posX, posY, particleName, {
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 3, end: 0 },
            duration: 500,
            blendMode: 'ADD'
        })
    }

    newRound() {
        this.time.delayedCall(1500, () => {
            this.roundEnd = false;
            this.ballPlayerCollision = false;
            this.ballEnemyCollision = false;

            this.ball.setVelocity(GameScene.ballInitialSpeedX, 0);

            this.player.y = this.physics.world.bounds.centerY;
            this.player.body.velocity.y = GameScene.speed;

            this.enemy.y = this.physics.world.bounds.centerY;
            this.enemy.body.velocity.y = GameScene.speed;

            this.ball.x = this.physics.world.bounds.centerX;
            this.ball.y = this.physics.world.bounds.centerY;
        }, [], this);

    }

    checkGameOver() {
        if (this.playerScore === 5 || this.enemyScore === 5) {
            this.registry.set('playerScore', this.playerScore);
            this.registry.set('enemyScore', this.enemyScore);
            this.scene.start('menuScene');
        }
    }

}
