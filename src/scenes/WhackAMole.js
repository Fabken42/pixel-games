import React from "react";
import Phaser from "phaser";
import GameComponent from "../components/GameComponent.js";
import GameBG from '../assets/whack-mole-bg.png';
import Enemy01 from "../assets/enemy01.png";
import Enemy02 from "../assets/enemy02.png";
import Enemy03 from "../assets/enemy03.png";
import EnemyHit from "../assets/hit-enemy.wav";

class WhackMoleGameScene extends Phaser.Scene {
    constructor() {
        super({ key: "whackMoleGameScene" });
        this.spawnEnemyLocations = [
            { x: 175, y: 170 },
            { x: 420, y: 170 },
            { x: 665, y: 170 },
            { x: 175, y: 335 },
            { x: 420, y: 335 },
            { x: 665, y: 335 },
            { x: 175, y: 500 },
            { x: 420, y: 500 },
            { x: 665, y: 500 },
        ];

        this.remainingTime = 10;
        this.score = 0;
        this.enemyGroup = undefined;
        this.scoreText = undefined;
        this.remainingTimeText = undefined;
    }

    preload() {
        this.load.image("gameBG", GameBG);
        this.load.image("enemy01", Enemy01);
        this.load.image("enemy02", Enemy02);
        this.load.image("enemy03", Enemy03);
        this.load.audio("enemy-hit-sound", EnemyHit);
    }

    create() {
        this.enemyGroup = this.add.group();

        this.remainingTime = 10;
        this.score = 0;

        const gameBG = this.add.image(0, 0, 'gameBG').setOrigin(0);
        gameBG.setScale(5);

        this.scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#fff' });
        this.remainingTimeText = this.add.text(16, 60, 'Tempo restante: 30', { fontSize: '32px', fill: '#fff' });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateRemainingTime,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: Phaser.Math.Between(800, 1600),
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
        const randomLocation = Phaser.Math.RND.pick(this.spawnEnemyLocations);

        let newEnemy = this.enemyGroup.create(randomLocation.x, randomLocation.y, 'enemy03');
        newEnemy.setScale(5);
        newEnemy.setInteractive();

        newEnemy.on('pointerdown', () => this.onEnemyClick(newEnemy), this);
    }

    onEnemyClick(enemyClicked) {
        enemyClicked.destroy();
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
        const score = this.registry.get('score');

        // Adiciona o texto da pontuação na tela
        this.add.text(400, 200, `Pontuação: ${score}`, { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

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
        scene: [WhackMoleGameScene, WhackMoleMenuScene]
    };

    return <div>
        <GameComponent config={config} />
    </div>;
}
