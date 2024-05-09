import Phaser from "phaser";

import panel from "../assets/img/panel.png";
import playButton from "../assets/img/playButton.png";

import yellowButtonActive from "../assets/img/yellowButtonActive.png";
import blueButtonActive from "../assets/img/blueButtonActive.png";
import greenButtonActive from "../assets/img/greenButtonActive.png";
import redButtonActive from "../assets/img/redButtonActive.png";

import yellowButtonSound from "../assets/audio/yellowButton.mp3";
import blueButtonSound from "../assets/audio/blueButton.mp3";
import greenButtonSound from "../assets/audio/greenButton.mp3";
import redButtonSound from "../assets/audio/redButton.mp3";
import looseGameSound from "../assets/audio/looseGame.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';
    static timeToNewRound = 1300;
    static increaseTimes = 5;
    static standardReproductionLimit = 3;
    static buttonOptions = ["yellow", "blue", "green", "red"];
    static buttonVertices = {
        yellow: [
            new Phaser.Geom.Point(175, 290),
            new Phaser.Geom.Point(240, 140),
            new Phaser.Geom.Point(390, 75),
            new Phaser.Geom.Point(390, 210),
            new Phaser.Geom.Point(310, 290)
        ],
        blue: [
            new Phaser.Geom.Point(415, 75),
            new Phaser.Geom.Point(565, 140),
            new Phaser.Geom.Point(630, 290),
            new Phaser.Geom.Point(495, 290),
            new Phaser.Geom.Point(415, 210)
        ],
        green: [
            new Phaser.Geom.Point(415, 395),
            new Phaser.Geom.Point(495, 315),
            new Phaser.Geom.Point(630, 320),
            new Phaser.Geom.Point(565, 465),
            new Phaser.Geom.Point(415, 530)
        ],
        red: [
            new Phaser.Geom.Point(310, 315),
            new Phaser.Geom.Point(390, 395),
            new Phaser.Geom.Point(390, 530),
            new Phaser.Geom.Point(240, 465),
            new Phaser.Geom.Point(175, 315)
        ]
    };
    static delayedCallTime = {
        standardReproduction: {
            showNextButton: 700,
            buttonActive: 550,
        },
        fastReproduction: {
            showNextButton: 400,
            buttonActive: 250,
        }
    }

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image("panel", panel);
        this.load.image("playButton", playButton);

        this.load.image("yellowButtonActive", yellowButtonActive);
        this.load.image("blueButtonActive", blueButtonActive);
        this.load.image("greenButtonActive", greenButtonActive);
        this.load.image("redButtonActive", redButtonActive);

        this.load.audio("yellowButtonSound", yellowButtonSound);
        this.load.audio("blueButtonSound", blueButtonSound);
        this.load.audio("greenButtonSound", greenButtonSound);
        this.load.audio("redButtonSound", redButtonSound);
        this.load.audio("looseGameSound", looseGameSound);
    }

    create() {
        this.currentRecord = localStorage.getItem('simon_record');
        if (!this.currentRecord) this.currentRecord = 0;
        this.score = 0;
        this.rightSequence = [];
        this.buttonsToBePressed = [];

        this.add.image(0, 0, "panel").setOrigin(0).setScale(GameScene.increaseTimes);

        this.add.text(15, 15, 'Voltar ao menu', {
            fontFamily: GameScene.gameFont,
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#777',
            padding: { x: 20, y: 10 },
        }).setOrigin(0).setInteractive().on('pointerdown', () => this.scene.start('menuScene'));

        this.recordText = this.add.text(this.sys.game.config.width - 15, this.sys.game.config.height - 15, `Recorde: ${this.currentRecord <= 9 ? `0${this.currentRecord}` : this.currentRecord}`, {
            fontFamily: GameScene.gameFont,
            fontSize: '20px',
            fill: '#333',
        }).setOrigin(1);

        this.playButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "playButton").setOrigin(0.5).setScale(GameScene.increaseTimes).setInteractive();

        this.scoreText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, '00', { fontFamily: GameScene.gameFont, fontSize: '32px', fill: '#000' }).setOrigin(0.5).setVisible(false);

        const buttonPositions = [
            { color: 'yellow', position: { x: 282.5, y: 183 } },
            { color: 'blue', position: { x: 522, y: 183 } },
            { color: 'green', position: { x: 522, y: 422.5 } },
            { color: 'red', position: { x: 282.5, y: 422.5 } }
        ];

        this.activeButtonMap = {};
        buttonPositions.forEach((val) => {
            const { color, position } = val;
            this.activeButtonMap[color] = this.add.image(position.x, position.y, `${color}ButtonActive`)
                .setScale(GameScene.increaseTimes)
                .setVisible(false);
            this.createClickZone(color, new Phaser.Geom.Polygon(GameScene.buttonVertices[color]));
        });

        this.playButton.on('pointerdown', () => {
            this.playButton.setVisible(false);
            this.scoreText.setVisible(true);
            this.newRound();
        })
    }

    createClickZone(color, polygon) {
        const clickZone = this.add.zone(0, 0, 0, 0).setInteractive(polygon, Phaser.Geom.Polygon.Contains);
        clickZone.on('pointerdown', () => {
            this.sound.play(`${color}ButtonSound`);
            this.checkSequence(color);

            const activeButton = this.activeButtonMap[color];
            activeButton.setVisible(true);
            this.time.delayedCall(350, () => {
                activeButton.setVisible(false)
            });
        });
        this[`${color}ClickZone`] = clickZone;
    }

    update() { }

    disableButtons() {
        ['red', 'green', 'blue', 'yellow'].forEach(color => {
            this[`${color}ClickZone`].input.enabled = false;
        });
    }

    enableButtons() {
        ['red', 'green', 'blue', 'yellow'].forEach(color => {
            this[`${color}ClickZone`].input.enabled = true;
        });
    }

    newRound() {
        this.addRandomButton();
        this.showCorrectButton(0);
    }

    addRandomButton() {
        const random_button = GameScene.buttonOptions[Phaser.Math.Between(0, 3)];
        this.rightSequence.push(random_button);

        this.buttonsToBePressed = [...this.rightSequence];
    }

    checkSequence(buttonClickedColor) {
        if (!this.buttonsToBePressed || this.playButton.visible) return;

        if (buttonClickedColor === this.buttonsToBePressed[0]) {
            this.buttonsToBePressed.shift();
            if (!this.buttonsToBePressed.length) {
                this.scoreText.setText(this.score < 9 ? `0${++this.score}` : ++this.score);
                this.disableButtons();
                this.time.delayedCall(GameScene.timeToNewRound, () => this.newRound());
            }
            return;
        }
        this.gameOver();
    }

    showCorrectButton(pos) {
        if (pos === this.rightSequence.length) {
            this.enableButtons();
            return;
        }
        const color = this.rightSequence[pos];

        const delayed_time = this.rightSequence.length - pos > GameScene.standardReproductionLimit ? GameScene.delayedCallTime.fastReproduction : GameScene.delayedCallTime.standardReproduction;

        this.playButtonSound(color);
        this.changeButtonColor(this.activeButtonMap[color], delayed_time.buttonActive);


        this.time.delayedCall(delayed_time.showNextButton, () => this.showCorrectButton(pos + 1));
    }

    playButtonSound(color) {
        if (!color) return;
        this.sound.play(`${color}ButtonSound`);
    }

    changeButtonColor(activeButton, time) {
        if (!activeButton) return;
        activeButton.setVisible(true);

        this.time.delayedCall(time, () => {
            activeButton.setVisible(false);
        });
    }


    gameOver() {
        if (this.score > this.currentRecord) {
            this.currentRecord = this.score;
            this.recordText.setText(`Recorde: ${this.currentRecord <= 9 ? `0${this.currentRecord}` : this.currentRecord}`);
            localStorage.setItem('simon_record', this.score);
        }

        this.sound.play("looseGameSound");
        this.resetVariables();
    }

    resetVariables() {
        this.rightSequence = [];
        this.buttonsToBePressed = [];
        this.playButton.setVisible(true);

        this.score = 0;
        this.scoreText.setText('00')
        this.scoreText.setVisible(false);
    }
}