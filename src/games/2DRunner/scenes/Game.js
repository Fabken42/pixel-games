import Phaser from 'phaser';

import Player from "../assets/img/player.png";
import EnemyAir from "../assets/img/enemyAir.png";
import EnemyGround from "../assets/img/enemyGround.png";
import GameBG from "../assets/img/gameBG.png";
import BackgroundMusic from "../assets/audio/game-audio.mp3";
import LooseSound from "../assets/audio/loose.mp3";
import JumpSound from "../assets/audio/jump.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'gameScene' });

        this.player = null;
        this.cursors = null;
        this.enemies = null;
        this.spawnDelay = 0;
        this.spawnTimer = 0;
        this.score = 0;
    }

    preload() {
        this.load.audio('backgroundMusic', BackgroundMusic);
        this.load.image('gameBG', GameBG);
        this.load.image('player', Player);
        this.load.image('enemyAir', EnemyAir);
        this.load.image('enemyGround', EnemyGround);

        this.load.audio('looseSound', LooseSound);
        this.load.audio('jumpSound', JumpSound);
    }

    create() {
        //música de fundo
        this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.5, loop: true });
        this.backgroundMusic.play();

        this.backgrounds = [
            this.add.image(0, 0, 'gameBG').setOrigin(0, 0).setScale(5),
            this.add.image(this.scale.width, 0, 'gameBG').setOrigin(0, 0).setScale(5)
        ];

        this.cameras.main.setBackgroundColor('#87CEEB');

        this.spawnDelay = 1500;
        this.score = 0;
        this.scoreText = this.add.text(16, 16, `Pontuação: ${this.score}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#333' });

        // Set up the player
        this.player = this.physics.add.sprite(150, 460, 'player').setScale(6);
        this.player.body.setGravityY(2000);//--------------------

        // Set up the ground
        const ground = this.add.rectangle(400, 550, 800, 100);
        this.physics.add.existing(ground, true);
        this.physics.add.collider(this.player, ground);

        // Set up the enemies group
        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, ground);
        this.physics.add.overlap(this.player, this.enemies, this.gameOver, null, this);

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();

        this.time.addEvent({
            delay: 500,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }

    updateScore() {
        this.scoreText.setText(`Pontuação: ${++this.score}`);
    }

    update(time, delta) {
        this.backgrounds.forEach(bg => {
            bg.x -= 2;
            if (bg.x <= -this.scale.width) {
                bg.x = this.scale.width - 2;
            }
        });

        // Handle player jumping
        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.sound.play('jumpSound', { volume: 0.5 });
            this.player.body.setVelocityY(-700);
        }

        // Spawn enemies
        this.spawnTimer += delta;

        if (this.spawnTimer > (Math.random() * 0.3 + 0.7) * this.spawnDelay) {
            console.log(this.spawnDelay);
            this.increaseDifficulty();
            this.spawnEnemy();
            this.spawnTimer = 0;
        }

        // Move enemies and check for off-screen
        this.enemies.children.iterate((enemy) => {
            if (enemy) {
                enemy.x -= 5;
                if (enemy.x < -enemy.width) {
                    enemy.destroy();
                }
            }
        });
    }

    increaseDifficulty() {
        if (this.spawnDelay > 900)
            this.spawnDelay -= 10;
    }

    spawnEnemy() {
        const groundY = 485;
        const skyY = 375;

        // Randomly choose ground or sky enemy
        const yPosition = Math.random() < 0.7 ? groundY : skyY;
        const enemyType = yPosition === groundY ? 'enemyGround' : 'enemyAir';

        const enemy = this.physics.add.sprite(800, yPosition, enemyType);
        enemy.body.setGravityY(0);
        enemyType === 'enemyGround' ? enemy.setScale(4) : enemy.setScale(3);
        this.enemies.add(enemy);
    }

    gameOver() {
        this.backgroundMusic.stop();
        this.sound.play('looseSound', { volume: 0.7 });
        this.registry.set('score', this.score);
        this.scene.start('menuScene');
    }
}