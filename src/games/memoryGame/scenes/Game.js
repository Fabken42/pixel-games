import Phaser, { RIGHT } from "phaser";

import GameBG from "../assets/img/gameBG.png";
import Icon01 from "../assets/img/icon01.png";
import Icon02 from "../assets/img/icon02.png";
import Icon03 from "../assets/img/icon03.png";
import Icon04 from "../assets/img/icon04.png";
import Icon05 from "../assets/img/icon05.png";
import Icon06 from "../assets/img/icon06.png";
import Icon07 from "../assets/img/icon07.png";
import Icon08 from "../assets/img/icon08.png";
import Icon09 from "../assets/img/icon09.png";
import Icon10 from "../assets/img/icon10.png";
import IconHidden from "../assets/img/iconHidden.png";

import CorrectCombination from "../assets/audio/correctCombination.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image('gameBG', GameBG);
        this.load.image('icon01', Icon01);
        this.load.image('icon02', Icon02);
        this.load.image('icon03', Icon03);
        this.load.image('icon04', Icon04);
        this.load.image('icon05', Icon05);
        this.load.image('icon06', Icon06);
        this.load.image('icon07', Icon07);
        this.load.image('icon08', Icon08);
        this.load.image('icon09', Icon09);
        this.load.image('icon10', Icon10);
        this.load.image('iconHidden', IconHidden);

        this.load.audio('correctCombination', CorrectCombination);
    }

    create() {
        this.icons = [];
        this.cards = [];
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = true;
        this.moves = 0;
        this.timeInGame = 0;
        this.matchedPairs = 0;

        this.add.image(0, 0, 'gameBG').setOrigin(0).setScale(5);

        this.timeText = this.add.text(20, 20, `Tempo: ${this.timeInGame}`, { fontFamily: GameScene.gameFont, fontSize: '20px', fill: '#ffffff', align: 'left' });
        this.movesText = this.add.text(780, 20, `Jogadas: ${this.moves}`, { fontFamily: GameScene.gameFont, fontSize: '20px', fill: '#ffffff', align: 'right' }).setOrigin(1, 0);

        // Criar array de ícones
        this.icons = [
            'icon01', 'icon02', 'icon03', 'icon04', 'icon05',
            'icon06', 'icon07', 'icon08', 'icon09', 'icon10'
        ];

        // Duplicar e embaralhar ícones
        this.cards = Phaser.Utils.Array.Shuffle([...this.icons, ...this.icons]);

        this.time.delayedCall(500, () => {
            this.lockBoard = false
        })

        this.time.addEvent({
            delay: 1000,
            callback: this.incrementTime,
            callbackScope: this,
            loop: true
        })

        // Configurar a grade de cartas
        const gridConfig = {
            rows: 4,
            cols: 5,
            cardWidth: 100,
            cardHeight: 100,
            spacing: 20,
            startX: 160,
            startY: 140
        };

        // Criar cartas
        this.createCardGrid(gridConfig);
    }

    incrementTime() {
        this.timeText.setText(`Tempo: ${++this.timeInGame}`);
    }

    createCardGrid(config) {
        const { rows, cols, cardWidth, cardHeight, spacing, startX, startY } = config;
        let cardIndex = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (cardWidth + spacing);
                const y = startY + row * (cardHeight + spacing);
                this.createCard(x, y, this.cards[cardIndex]);
                cardIndex++;
            }
        }
    }

    createCard(x, y, iconKey) {
        const card = this.add.sprite(x, y, 'iconHidden').setInteractive().setScale(7);
        card.iconKey = iconKey;
        card.isFlipped = false;
        card.on('pointerup', () => {
            card.clearTint();
            this.flipCard(card)
        });
        card.on('pointerover', () => {
            if (!card.isFlipped) {
                card.setTint(0xCCCCCC);
            }
        });
        card.on('pointerout', () => {
            if (!card.isFlipped) {
                card.clearTint();
            }
        });
    }

    flipCard(card) {
        if (this.lockBoard || card.isFlipped) return;

        card.setTexture(card.iconKey);
        card.isFlipped = true;

        if (!this.firstCard) {
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.lockBoard = true;
            this.movesText.setText(`Jogadas: ${++this.moves}`);
            this.checkForMatch();
        }
    }

    checkForMatch() {
        const match = this.firstCard.iconKey === this.secondCard.iconKey;

        if (match) {
            this.sound.play('correctCombination', { volume: 0.7 });
            this.disableCards();
            this.matchedPairs++;
            if (this.matchedPairs === this.icons.length) {
                this.gameOver();
            }
        } else {
            this.unflipCards();
        }
    }

    disableCards() {
        this.firstCard.off('pointerup');
        this.secondCard.off('pointerup');
        this.firstCard.setTint(0x777777);
        this.secondCard.setTint(0x777777);
        this.resetBoard();
    }

    unflipCards() {
        this.time.delayedCall(1500, () => {
            this.firstCard.setTexture('iconHidden');
            this.secondCard.setTexture('iconHidden');
            this.firstCard.isFlipped = false;
            this.secondCard.isFlipped = false;
            this.resetBoard();
        });
    }

    resetBoard() {
        [this.firstCard, this.secondCard, this.lockBoard] = [null, null, false];
    }

    gameOver() {
        this.registry.set('moves', this.moves);
        this.registry.set('timeInGame', this.timeInGame);
        this.scene.start('menuScene');
    }

    update() {
        // Atualizações do jogo, se necessário
    }
}
