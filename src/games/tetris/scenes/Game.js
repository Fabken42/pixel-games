import Phaser from "phaser";

import ClearLineSound from "../assets/audio/clearLine.mp3";
import LooseSound from "../assets/audio/loose.mp3";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'gameScene' });

        this.grid = [];
        this.activePiece = null;
        this.nextPiece = null;
        this.dropTime = 0;
        this.dropInterval = 800;
        this.score = 0;
        this.gridWidth = 10;
        this.gridHeight = 20;
        this.blockSize = 25;
        this.gridGraphics = null;
        this.nextPieceGraphics = null;
        this.scoreText = null;
        this.colors = {
            1: 0x00f0f0, // I
            2: 0x0000f0, // J
            3: 0xf0a000, // L
            4: 0xf0f000, // O
            5: 0x00f000, // S
            6: 0xa000f0, // T
            7: 0xf00000  // Z
        };
    }

    preload() {
        this.load.audio('clearLineSound', ClearLineSound);
        this.load.audio('looseSound', LooseSound);
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.gridOffsetX = (800 - (this.gridWidth * this.blockSize)) / 2;
        this.gridOffsetY = (600 - (this.gridHeight * this.blockSize)) / 2;

        for (let row = 0; row < this.gridHeight; row++) {
            this.grid[row] = new Array(this.gridWidth).fill(0);
        }

        this.gridGraphics = this.add.graphics();
        this.nextPieceGraphics = this.add.graphics();
        this.updateGrid();
        this.spawnNewPiece();

        this.scoreText = this.add.text(this.gridOffsetX, this.gridOffsetY - 30, 'Pontuação: 0', {
            fontSize: '18px',
            fontFamily: GameScene.gameFont,
            fill: '#ffffff'
        });

        this.input.keyboard.on('keydown-A', () => this.movePiece(-1));
        this.input.keyboard.on('keydown-LEFT', () => this.movePiece(-1));
        this.input.keyboard.on('keydown-D', () => this.movePiece(1));
        this.input.keyboard.on('keydown-RIGHT', () => this.movePiece(1));
        this.input.keyboard.on('keydown-S', () => this.dropPiece());
        this.input.keyboard.on('keydown-DOWN', () => this.dropPiece());
        this.input.keyboard.on('keydown-SPACE', () => this.rotatePiece());

        this.time.addEvent({
            delay: this.dropInterval,
            callback: this.updateDrop,
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        this.dropTime += delta;
        if (this.dropTime >= this.dropInterval) {
            this.dropTime = 0;
            this.dropPiece();
        }
    }

    updateGrid() {
        this.gridGraphics.clear();
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const x = this.gridOffsetX + col * this.blockSize;
                const y = this.gridOffsetY + row * this.blockSize;
                if (this.grid[row][col] === 0) {
                    this.gridGraphics
                        .fillStyle(0x000000, 1)
                        .fillRect(x, y, this.blockSize, this.blockSize)
                        .lineStyle(1, 0xffffff, 0.7)
                        .strokeRect(x, y, this.blockSize, this.blockSize);
                } else {
                    const color = this.colors[this.grid[row][col]];
                    this.gridGraphics
                        .fillStyle(color, 1)
                        .fillRect(x, y, this.blockSize, this.blockSize)
                        .lineStyle(1, 0xffffff, 0.7)
                        .strokeRect(x, y, this.blockSize, this.blockSize);
                }
            }
        }
    }

    spawnNewPiece() {
        if (this.activePiece) {
            this.activePiece = this.nextPiece;
        } else {
            this.activePiece = this.getRandomPiece();
        }
        this.nextPiece = this.getRandomPiece();
        this.activePiece.y = 0;
        this.activePiece.x = Math.floor(this.gridWidth / 2) - 1;

        if (this.collides(this.activePiece)) {
            this.gameOver();
        } else {
            this.drawPiece(this.activePiece);
        }

        this.drawNextPiece();
    }

    getRandomPiece() {
        const pieces = [
            { shape: [[1, 1, 1, 1]], color: 1 }, // I
            { shape: [[1, 0, 0], [1, 1, 1]], color: 2 }, // J
            { shape: [[0, 0, 1], [1, 1, 1]], color: 3 }, // L
            { shape: [[1, 1], [1, 1]], color: 4 }, // O
            { shape: [[0, 1, 1], [1, 1, 0]], color: 5 }, // S
            { shape: [[0, 1, 0], [1, 1, 1]], color: 6 }, // T
            { shape: [[1, 1, 0], [0, 1, 1]], color: 7 } // Z
        ];
        const piece = Phaser.Utils.Array.GetRandom(pieces);
        return {
            shape: piece.shape,
            color: piece.color,
            x: 0,
            y: 0
        };
    }

    clearPiece(piece) {
        if (piece.graphics) {
            piece.graphics.clear();
            piece.graphics.destroy();
        }
    }

    movePiece(direction) {
        if (this.activePiece) {
            this.clearPiece(this.activePiece);
            this.activePiece.x += direction;
            if (this.collides(this.activePiece)) {
                this.activePiece.x -= direction;
            }
            this.drawPiece(this.activePiece);
        }
    }

    drawPiece(piece) {
        if (piece.graphics) {
            piece.graphics.clear();
        }
        piece.graphics = this.add.graphics({ fillStyle: { color: this.colors[piece.color] } });
        piece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    const x = this.gridOffsetX + (piece.x + colIndex) * this.blockSize;
                    const y = this.gridOffsetY + (piece.y + rowIndex) * this.blockSize;
                    piece.graphics.fillRect(x, y, this.blockSize, this.blockSize)
                        .lineStyle(1, 0xffffff, 0.7)
                        .strokeRect(x, y, this.blockSize, this.blockSize);
                }
            });
        });
    }

    drawNextPiece() {
        this.nextPieceGraphics.clear();
        const nextPieceX = this.gridOffsetX + (this.gridWidth + 1) * this.blockSize;
        const nextPieceY = this.gridOffsetY + this.blockSize;

        this.nextPiece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    const x = nextPieceX + colIndex * this.blockSize;
                    const y = nextPieceY + rowIndex * this.blockSize;
                    this.nextPieceGraphics.fillStyle(this.colors[this.nextPiece.color], 1)
                        .fillRect(x, y, this.blockSize, this.blockSize)
                        .lineStyle(1, 0xffffff, 0.7)
                        .strokeRect(x, y, this.blockSize, this.blockSize);
                }
            });
        });
    }

    dropPiece() {
        if (this.activePiece) {
            this.clearPiece(this.activePiece);
            this.activePiece.y += 1;
            if (this.collides(this.activePiece)) {
                this.activePiece.y -= 1;
                this.lockPiece(this.activePiece);
                this.spawnNewPiece();
            } else {
                this.drawPiece(this.activePiece);
            }
        }
    }

    rotatePiece() {
        if (this.activePiece) {
            this.clearPiece(this.activePiece);
            const rotatedShape = this.activePiece.shape[0].map((val, index) =>
                this.activePiece.shape.map(row => row[index]).reverse()
            );
            const previousShape = this.activePiece.shape;
            this.activePiece.shape = rotatedShape;
            if (this.collides(this.activePiece)) {
                this.activePiece.shape = previousShape;
            }
            this.drawPiece(this.activePiece);
        }
    }

    collides(piece) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (
                    piece.shape[row][col] &&
                    (this.grid[piece.y + row] &&
                        this.grid[piece.y + row][piece.x + col]) !== 0
                ) {
                    return true;
                }
                if (
                    piece.shape[row][col] &&
                    (piece.x + col < 0 ||
                        piece.x + col >= this.gridWidth ||
                        piece.y + row >= this.gridHeight)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece(piece) {
        piece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    const x = piece.x + colIndex;
                    const y = piece.y + rowIndex;
                    this.grid[y][x] = piece.color;
                }
            });
        });

        const linesCleared = this.clearLines();
        this.updateGrid();
        this.updateScore(linesCleared);
        this.increaseDifficulty(linesCleared);
    }

    clearLines() {
        let linesCleared = 0;
        for (let row = this.gridHeight - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                this.grid.splice(row, 1);
                this.grid.unshift(new Array(this.gridWidth).fill(0));
                linesCleared++;
                row++;
            }
        }
        if (linesCleared) this.sound.play('clearLineSound', { volume: 0.7 });

        return linesCleared;
    }

    updateScore(linesCleared) {
        const scoreValues = [0, 40, 100, 300, 1200];
        this.score += scoreValues[linesCleared];
        this.scoreText.setText(`Pontuação: ${this.score}`);
    }

    increaseDifficulty(linesCleared) {
        if (linesCleared > 0) {
            this.dropInterval = Math.max(100, this.dropInterval - (linesCleared * 15));
        }
    }

    gameOver() {
        this.sound.play('looseSound', { volume: 0.7 });
        this.registry.set('score', this.score);

        let record = localStorage.getItem('tetris_record') || 0;
        if (record < this.score) localStorage.setItem('tetris_record', this.score);

        this.scene.start('menuScene');
    }
}
