import Phaser from "phaser";

import GameBG from '../assets/img/game-bg.png';
import Enemy01 from "../assets/img/enemy01.png";
import Enemy02 from "../assets/img/enemy02.png";
import Enemy03 from "../assets/img/enemy03.png";
import EnemyHitImg from "../assets/img/enemy-hit.png";
import HitEffect from "../assets/img/hit-effect.png";
import EnemyHit01 from "../assets/audio/hit-enemy-01.wav";  
import EnemyHit02 from "../assets/audio/hit-enemy-02.wav";
import EnemyHit03 from "../assets/audio/hit-enemy-03.wav";
import BackgroundMusic from "../assets/audio/background-music.wav";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"'
    static increaseTimes = 5;

    constructor() {
        super({ key: "gameScene" });
    }

    preload() {
        this.load.image("gameBG", GameBG);
        this.load.image("enemy01", Enemy01);
        this.load.image("enemy02", Enemy02);
        this.load.image("enemy03", Enemy03);
        this.load.image("enemy-hit", EnemyHitImg);
        this.load.image("hit-particle", HitEffect);
        this.load.audio("hit-enemy-sound-01", EnemyHit01);
        this.load.audio("hit-enemy-sound-02", EnemyHit02);
        this.load.audio("hit-enemy-sound-03", EnemyHit03);
        this.load.audio("background-music", BackgroundMusic);
    }

    create() {
        this.spawnEnemyLocations = [
            { x: 152, y: 180 },
            { x: 397, y: 180 },
            { x: 642, y: 180 },
            { x: 152, y: 345 },
            { x: 397, y: 345 },
            { x: 642, y: 345 },
            { x: 152, y: 510 },
            { x: 397, y: 510 },
            { x: 642, y: 510 },
        ];
        this.enemyGroup = this.add.group();
        this.remainingTime = 45;
        this.score = 0;
        this.level = 1;
        this.clickCounter = 0;
        this.spawnEnemyDelayMin = 700;
        this.spawnEnemyDelayMax = 1100;

        this.add.image(0, 0, 'gameBG').setOrigin(0).setScale(GameScene.increaseTimes);

        this.backgroundMusic = this.sound.add('background-music', { loop: true, volume: 0.75 });
        this.backgroundMusic.play();

        this.scoreText = this.add.text(16, 16, `Pontuação: ${this.score}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#fff' });
        this.remainingTimeText = this.add.text(16, 60, `Tempo restante: ${this.remainingTime}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#fff' });
        this.levelText = this.add.text(this.cameras.main.width - 16, 16, `Nível: ${this.level}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#fff', align: 'right' }).setOrigin(1, 0);

        this.anims.create({
            key: 'enemySpawnAnimation',
            frames: [
                { key: 'enemy01' },
                { key: 'enemy02' },
                { key: 'enemy03' }
            ],
            frameRate: 5,
            repeat: false
        });

        this.anims.create({
            key: 'enemyDespawnAnimation',
            frames: [
                { key: 'enemy03' },
                { key: 'enemy02' },
                { key: 'enemy01' }
            ],
            frameRate: 5,
            repeat: false
        });

        this.input.on('pointerdown', () => this.clickCounter++, this);

        this.time.addEvent({
            delay: 1000,
            callback: this.updateRemainingTime,
            callbackScope: this,
            loop: true
        });

        this.time.delayedCall(1000, this.spawnEnemy, [], this);
    }

    update() {
    }

    updateRemainingTime() {
        this.remainingTimeText.setText(`Tempo restante: ${--this.remainingTime}`);
        if (this.remainingTime <= 0) {
            this.gameOver();
        }
    }

    spawnEnemy() {
        this.time.delayedCall(Phaser.Math.Between(this.spawnEnemyDelayMin, this.spawnEnemyDelayMax), this.spawnEnemy, [], this);

        if (this.spawnEnemyLocations.length === 0) {
            return;
        }

        const randomIndex = Phaser.Math.RND.between(0, this.spawnEnemyLocations.length - 1);
        const randomLocation = this.spawnEnemyLocations[randomIndex];
        const removedLocation = this.spawnEnemyLocations.splice(randomIndex, 1)[0];

        let newEnemy = this.enemyGroup.create(randomLocation.x, randomLocation.y, 'enemy01');
        newEnemy.setScale(GameScene.increaseTimes);
        newEnemy.setInteractive();
        newEnemy.play('enemySpawnAnimation');

        newEnemy.on('pointerdown', (ptr) => this.onEnemyClick(ptr, newEnemy, removedLocation), this);

        //tempo após inimigo começar a desaparecer
        this.time.delayedCall(700, () => {
            if (newEnemy && newEnemy.active) {
                this.despawnEnemy(newEnemy, removedLocation);
            }
        });
    }

    despawnEnemy(newEnemy, removedLocation) {
        newEnemy.play('enemyDespawnAnimation');
        //alterar valor conforme 'frameRate de this.anims.create em create()'
        this.time.delayedCall(600, () => {
            if (newEnemy && newEnemy.active) {
                this.spawnEnemyLocations.push(removedLocation);
                newEnemy.destroy();
            }
        });
    }

    onEnemyClick(ptr, enemyClicked, removedLocation) {
        this.clickCounter++;

        let enemyHitSprite = this.add.sprite(enemyClicked.x, enemyClicked.y, 'enemy-hit');
        enemyHitSprite.setScale(GameScene.increaseTimes);

        this.time.delayedCall(500, () => {
            enemyHitSprite.destroy();
            this.spawnEnemyLocations.push(removedLocation);
        }, [], this);

        this.add.particles(ptr.x, ptr.y, 'hit-particle',
            {
                speed: { min: -100, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 3, end: 0 },
                duration: 100,
                blendMode: 'ADD'
            })

        this.scoreText.setText(`Pontuação: ${++this.score}`);

        switch (this.score) {
            case 15:
                this.level = 2;
                this.levelText.setText(`Nível: ${this.level}`);
                this.spawnEnemy();
                break;
            case 40:
                this.level = 3;
                this.levelText.setText(`Nível: ${this.level}`);
                this.spawnEnemy();
                break;
            case 80:
                this.level = 4;
                this.levelText.setText(`Nível: ${this.level}`);
                this.spawnEnemy();
                break;
            default:
                break;
        }

        let soundKey = `hit-enemy-sound-0${Phaser.Math.Between(1, 3)}`;
        this.sound.play(soundKey, { volume: 0.75 });

        enemyClicked.destroy();
    }

    gameOver() {
        this.backgroundMusic.stop();
        this.registry.set('score', this.score);
        this.registry.set('clicks', this.clickCounter);
        this.scene.start('menuScene');
    }
}