import Phaser from "phaser";

import Enemy from "../assets/img/enemy.png";
import Player from "../assets/img/player.png";
import WinnerEffect from "../assets/img/winnerEffect.png";
import DrawEffect from "../assets/img/drawEffect.png";
import GameBG from "../assets/img/gameBG.png";

import MoveSound from "../assets/audio/move.mp3";
import DrawSound from "../assets/audio/player-draw-round.mp3";
import LooseSound from "../assets/audio/player-loose-round.mp3";
import WinSound from "../assets/audio/player-win-round.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';
    static increaseTimes = 5;
    static squareSize = 120;
    static boardLeft = 282;
    static boardTop = 242;
    static enemyMoveDelay = 1200;
    static winningCombinations = [
        [[0, 0], [0, 1], [0, 2]], // primeira linha
        [[1, 0], [1, 1], [1, 2]], // segunda linha
        [[2, 0], [2, 1], [2, 2]], // terceira linha
        [[0, 0], [1, 0], [2, 0]], // primeira coluna
        [[0, 1], [1, 1], [2, 1]], // segunda coluna
        [[0, 2], [1, 2], [2, 2]], // terceira coluna
        [[0, 0], [1, 1], [2, 2]], // diagonal principal
        [[0, 2], [1, 1], [2, 0]]  // diagonal secundária
    ];

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image('enemy', Enemy);
        this.load.image('player', Player);
        this.load.image('winnerEffect', WinnerEffect);
        this.load.image('drawEffect', DrawEffect);
        this.load.image('gameBG', GameBG);

        this.load.audio('moveSound', MoveSound);
        this.load.audio('drawRoundSound', DrawSound);
        this.load.audio('looseRoundSound', LooseSound);
        this.load.audio('winRoundSound', WinSound);
    }

    create() {
        this.initGame();
        this.createBoard();
    }

    initGame() {
        this.board = Array.from({ length: 3 }, () => Array(3).fill(0));

        this.playerScore = 0;
        this.enemyScore = 0;
        this.playerSymbols = [];
        this.enemySymbols = [];
        this.playerStarts = true;
        this.playerTurn = true;

        this.add.image(0, 0, 'gameBG').setOrigin(0).setScale(GameScene.increaseTimes);

        this.statusText = this.add.text(402, 80, 'SUA VEZ!', {
            fontFamily: GameScene.gameFont,
            fontSize: '26px',
            fill: '#333',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.playerScoreText = this.add.text(30, 560, `Você: ${this.playerScore}`, {
            fontFamily: GameScene.gameFont,
            fontSize: '20px',
            fill: '#333',
            align: 'left'
        });

        this.enemyScoreText = this.add.text(770, 560, `CPU: ${this.enemyScore}`, {
            fontFamily: GameScene.gameFont,
            fontSize: '20px',
            fill: '#333',
            align: 'right'
        }).setOrigin(1, 0);
    }

    createBoard() {
        this.clickableAreas = [];
        for (let i = 0; i < 3; i++) {
            this.clickableAreas[i] = [];
            for (let j = 0; j < 3; j++) {
                let x = GameScene.boardLeft + j * GameScene.squareSize;
                let y = GameScene.boardTop + i * GameScene.squareSize;

                let clickableArea = this.add.rectangle(x, y, GameScene.squareSize - 20, GameScene.squareSize - 20).setInteractive();

                clickableArea.on('pointerdown', () => {
                    this.playerMove(i, j);
                });

                this.clickableAreas[i][j] = clickableArea;
            }
        }
    }

    playerMove(row, col) {
        if (this.playerTurn && this.board[row][col] === 0) {
            this.sound.play('moveSound', { volume: 0.5 });
            this.board[row][col] = 1;
            let playerSymbol = this.add.image(this.clickableAreas[row][col].x, this.clickableAreas[row][col].y, 'player').setScale(GameScene.increaseTimes).setDepth(1);
            this.playerSymbols.push(playerSymbol);

            if (this.checkEndOfRound()) return;

            this.playerTurn = !this.playerTurn;
            this.updateStatusText('VEZ DO OPONENTE!');
            this.time.delayedCall(GameScene.enemyMoveDelay, () => this.enemyMove());
        }
    }

    enemyMove() {
        let move;
        if (Math.random() > 0.1) {
            move = this.findBestMove(-1) || this.findBestMove(1) || this.getRandomMove();
        } else { //10% de chance de CPU escolher posição aleatória
            move = this.getRandomMove();
        }

        if (move) {
            this.sound.play('moveSound', { volume: 0.5 });
            const { row, col } = move;
            this.board[row][col] = -1;
            let enemySymbol = this.add.image(this.clickableAreas[row][col].x, this.clickableAreas[row][col].y, 'enemy').setScale(GameScene.increaseTimes).setDepth(1);
            this.enemySymbols.push(enemySymbol);

            if (this.checkEndOfRound()) return;

            this.playerTurn = !this.playerTurn;
            this.updateStatusText('SUA VEZ!');
        }
    }

    findBestMove(player) {
        for (let combination of GameScene.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a[0]][a[1]] + this.board[b[0]][b[1]] + this.board[c[0]][c[1]] === 2 * player) {
                if (this.board[a[0]][a[1]] === 0) return { row: a[0], col: a[1] };
                if (this.board[b[0]][b[1]] === 0) return { row: b[0], col: b[1] };
                if (this.board[c[0]][c[1]] === 0) return { row: c[0], col: c[1] };
            }
        }
        return null;
    }

    getRandomMove() {
        const emptySpaces = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === 0) emptySpaces.push({ row: i, col: j });
            }
        }
        if (emptySpaces.length > 0) {
            return emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
        }
        return null;
    }

    checkEndOfRound() {
        const winner = this.getWinner();
        if (winner !== 0) {
            this.handleWin(winner);
            return true;
        }

        if (this.isDraw()) {
            this.handleDraw();
            return true;
        }

        return false;
    }

    isDraw() {
        return this.board.flat().every(cell => cell !== 0);
    }

    handleDraw() {
        this.time.delayedCall(100, () => this.sound.play('drawRoundSound', { volume: 0.5 }));
        this.updateStatusText('EMPATE!');
        this.playerScore += 0.5;
        this.enemyScore += 0.5;
        this.updateScores();
        this.showDrawEffects(() => this.resetBoard());
    }

    getWinner() {
        for (let combination of GameScene.winningCombinations) {
            const [a, b, c] = combination;
            const sum = this.board[a[0]][a[1]] + this.board[b[0]][b[1]] + this.board[c[0]][c[1]];
            if (sum === 3) return 1;
            if (sum === -3) return -1;
        }
        return 0;
    }

    handleWin(winner) {
        if (winner === 1) {
            this.time.delayedCall(100, () => this.sound.play('winRoundSound', { volume: 0.5 }));
            this.updateStatusText('VOCÊ VENCEU!');
            this.playerScore++;
        } else {
            this.time.delayedCall(100, () => this.sound.play('looseRoundSound', { volume: 0.5 }));
            this.updateStatusText('OPONENTE VENCEU!');
            this.enemyScore++;
        }

        this.updateScores();
        this.showWinEffects(winner, () => this.resetBoard());
    }

    updateScores() {
        this.playerScoreText.setText(`Você: ${this.playerScore}`);
        this.enemyScoreText.setText(`CPU: ${this.enemyScore}`);
    }

    showDrawEffects(callback) {
        const drawEffects = this.createEffects('drawEffect');
        this.animateEffects(drawEffects, callback);
    }

    showWinEffects(winner, callback) {
        const winEffects = this.createEffects('winnerEffect', winner);
        this.animateEffects(winEffects, callback);
    }

    createEffects(effectType, winner = null) {
        const effects = [];
        if (winner !== null) {
            for (let combination of GameScene.winningCombinations) {
                const [a, b, c] = combination;
                if (this.board[a[0]][a[1]] + this.board[b[0]][b[1]] + this.board[c[0]][c[1]] === 3 * winner) {
                    effects.push(
                        this.add.image(this.clickableAreas[a[0]][a[1]].x, this.clickableAreas[a[0]][a[1]].y, effectType).setScale(GameScene.increaseTimes).setAlpha(0),
                        this.add.image(this.clickableAreas[b[0]][b[1]].x, this.clickableAreas[b[0]][b[1]].y, effectType).setScale(GameScene.increaseTimes).setAlpha(0),
                        this.add.image(this.clickableAreas[c[0]][c[1]].x, this.clickableAreas[c[0]][c[1]].y, effectType).setScale(GameScene.increaseTimes).setAlpha(0)
                    );
                }
            }
        } else {
            for (let row = 0; row < this.board.length; row++) {
                for (let col = 0; col < this.board[row].length; col++) {
                    effects.push(
                        this.add.image(this.clickableAreas[row][col].x, this.clickableAreas[row][col].y, effectType).setScale(GameScene.increaseTimes).setAlpha(0)
                    );
                }
            }
        }
        return effects;
    }

    animateEffects(effects, callback) {
        this.tweens.add({
            targets: effects,
            alpha: 1,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(1200, () => {
                    this.tweens.add({
                        targets: effects,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2',
                        onComplete: () => {
                            effects.forEach(effect => effect.destroy());
                            callback();
                        }
                    });
                });
            }
        });
    }

    updateStatusText(message) {
        this.statusText.setText(message);
    }

    resetBoard() {
        if (this.playerScore >= 5 || this.enemyScore >= 5) this.gameOver();

        this.board = Array.from({ length: 3 }, () => Array(3).fill(0));
        this.playerSymbols.forEach(symbol => symbol.destroy());
        this.enemySymbols.forEach(symbol => symbol.destroy());
        this.playerSymbols = [];
        this.enemySymbols = [];
        this.playerStarts = !this.playerStarts;
        this.playerTurn = this.playerStarts;

        if (!this.playerStarts) {
            this.time.delayedCall(GameScene.enemyMoveDelay, () => this.enemyMove());
            this.updateStatusText('VEZ DO OPONENTE!');
        } else {
            this.updateStatusText('SUA VEZ!');
        }
    }

    update() {
    }

    gameOver() {
        this.registry.set('player_score', this.playerScore);
        this.registry.set('enemy_score', this.enemyScore);
        this.scene.start('menuScene');
    }
}
