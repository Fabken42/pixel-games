import React from "react";
import Phaser from "phaser";
import GameComponent from "../components/GameComponent.js";
import GameBG from '../assets/whack-mole-bg.png';
import Enemy01 from "../assets/enemy01.png";
import Enemy02 from "../assets/enemy02.png";
import Enemy03 from "../assets/enemy03.png";
import HitEffect from "../assets/hit-effect.png";
import EnemyHit from "../assets/hit-enemy.wav";

class WhackMoleGameScene extends Phaser.Scene {
    constructor() {
        super({ key: "whackMoleGameScene" });
        this.spawnEnemyLocations = undefined;
        this.remainingTime = undefined;
        this.score = undefined;
        this.enemyGroup = undefined;
        this.scoreText = undefined;
        this.remainingTimeText = undefined;
    }

    preload() {
        this.load.image("gameBG", GameBG);
        this.load.image("enemy01", Enemy01);
        this.load.image("enemy02", Enemy02);
        this.load.image("enemy03", Enemy03);
        this.load.image("hit-particle", HitEffect);
        this.load.audio("enemy-hit-sound", EnemyHit);
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
        this.remainingTime = 30;
        this.score = 0;

        const gameBG = this.add.image(0, 0, 'gameBG').setOrigin(0);
        gameBG.setScale(5);

        this.scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#fff' });
        this.remainingTimeText = this.add.text(16, 60, 'Tempo restante: 30', { fontSize: '32px', fill: '#fff' });

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

        this.time.addEvent({
            delay: 1000,
            callback: this.updateRemainingTime,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 700,
            loop: true,
            callback: this.spawnEnemy,
            callbackScope: this
        });
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
        if (this.spawnEnemyLocations.length === 0) {
            return;
        }

        const randomIndex = Phaser.Math.RND.between(0, this.spawnEnemyLocations.length - 1);
        const randomLocation = this.spawnEnemyLocations[randomIndex];
        const removedLocation = this.spawnEnemyLocations.splice(randomIndex, 1)[0];

        let newEnemy = this.enemyGroup.create(randomLocation.x, randomLocation.y, 'enemy01');
        newEnemy.setScale(5);
        newEnemy.setInteractive();
        newEnemy.play('enemySpawnAnimation');

        newEnemy.on('pointerdown', (ptr) => this.onEnemyClick(ptr, newEnemy, removedLocation), this);

        //após 600ms, inimigo começa a desaparecer
        this.time.delayedCall(600, () => {
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
        this.spawnEnemyLocations.push(removedLocation);
        enemyClicked.destroy();

        let particle = this.add.particles(ptr.x, ptr.y, 'hit-particle',
            {
                speed: { min: -100, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                duration: 100,
                blendMode: 'ADD'
            })

        this.scoreText.setText(`Pontuação: ${++this.score}`);
        this.sound.play('enemy-hit-sound', { volume: 0.5 });
    }

    gameOver() {
        this.registry.set('score', this.score);
        this.scene.start('whackMoleMenuScene');
    }
}


class WhackMoleMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'whackMoleMenuScene' });
    }

    create() {
        // Adiciona o título do jogo
        this.add.text(400, 100, 'Whack a Mole', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);

        // Obtém a pontuação do registro do jogo
        let score = this.registry.get('score');

        // Adiciona o texto da pontuação na tela
        if (score) {
            this.add.text(400, 200, `Pontuação: ${score}`, { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        }

        // Adiciona o botão de jogar
        const playButton = this.add.text(400, 300, 'Jogar', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        playButton.setInteractive();

        // Define o evento de clique para o botão de jogar
        playButton.on('pointerdown', () => {
            this.scene.start('whackMoleGameScene');
        });
    }
}


export default function WhackAMoleScene() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: 800,
        height: 600,

        pixelArt: true,
        scene: [WhackMoleMenuScene, WhackMoleGameScene]
    };

    return <div>
        <GameComponent config={config} />
    </div>;
}
