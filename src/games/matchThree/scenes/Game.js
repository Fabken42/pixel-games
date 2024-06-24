import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'gameScene' });
        this.board = [];
        this.colors = ['blue', 'green', 'yellow', 'red', 'purple', 'orange'];
        this.selectedCircle = null;
        this.score = 0;
        this.timer = 30;
    }

    preload() {
        // Load assets if needed (not required for this example)
    }

    create() {
        this.createBoard();
        this.drawBoard();

        // Timer event for game over
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.timer <= 0) {
            this.gameOver();
        }
    }

    createBoard() {
        // Create an empty board
        for (let row = 0; row < 16; row++) {
            this.board[row] = [];
            for (let col = 0; col < 12; col++) {
                let color;
                do {
                    color = Phaser.Math.RND.pick(this.colors);
                } while (this.isMatch(row, col, color));
                this.board[row][col] = color;
            }
        }
    }

    drawBoard() {
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 12; col++) {
                this.drawCircle(row, col, this.board[row][col]);
            }
        }

        // Add input event for clicking circles
        this.input.on('gameobjectdown', this.selectCircle, this);
    }

    drawCircle(row, col, color) {
        let graphics = this.add.graphics({ fillStyle: { color: Phaser.Display.Color.HexStringToColor(color).color } });
        let circle = new Phaser.Geom.Circle(50 + col * 50, 50 + row * 50, 20);
        graphics.fillCircleShape(circle);

        let circleSprite = this.add.existing(graphics);
        circleSprite.setInteractive(new Phaser.Geom.Circle(circle.x, circle.y, circle.radius), Phaser.Geom.Circle.Contains);

        circleSprite.setData({ row: row, col: col, color: color });
    }

    selectCircle(pointer, gameObject) {
        if (this.selectedCircle) {
            this.swapCircles(this.selectedCircle, gameObject);
            this.selectedCircle = null;
        } else {
            this.selectedCircle = gameObject;
        }
    }

    swapCircles(circle1, circle2) {
        let row1 = circle1.getData('row');
        let col1 = circle1.getData('col');
        let row2 = circle2.getData('row');
        let col2 = circle2.getData('col');

        if (this.areAdjacent(row1, col1, row2, col2) && this.canSwap(row1, col1, row2, col2)) {
            [this.board[row1][col1], this.board[row2][col2]] = [this.board[row2][col2], this.board[row1][col1]];
            this.clearBoard();
            this.drawBoard();
            this.checkMatches();
        }
    }

    areAdjacent(row1, col1, row2, col2) {
        return (row1 === row2 && Math.abs(col1 - col2) === 1) || (col1 === col2 && Math.abs(row1 - row2) === 1);
    }

    canSwap(row1, col1, row2, col2) {
        // Swap circles in memory
        [this.board[row1][col1], this.board[row2][col2]] = [this.board[row2][col2], this.board[row1][col1]];

        let match = this.isMatch(row1, col1, this.board[row1][col1]) || this.isMatch(row2, col2, this.board[row2][col2]);

        // Swap back to original
        [this.board[row1][col1], this.board[row2][col2]] = [this.board[row2][col2], this.board[row1][col1]];

        return match;
    }

    isMatch(row, col, color) {
        return this.matchInRow(row, col, color) || this.matchInColumn(row, col, color);
    }

    matchInRow(row, col, color) {
        return col > 1 && this.board[row][col - 1] === color && this.board[row][col - 2] === color;
    }

    matchInColumn(row, col, color) {
        return row > 1 && this.board[row - 1][col] === color && this.board[row - 2][col] === color;
    }

    clearBoard() {
        this.children.removeAll();
    }

    checkMatches() {
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 12; col++) {
                let color = this.board[row][col];
                if (this.isMatch(row, col, color)) {
                    this.removeMatch(row, col, color);
                    this.updateBoard();
                }
            }
        }
    }

    removeMatch(row, col, color) {
        let matches = [];
        // Find all matching circles in the row
        for (let c = col; c < 12 && this.board[row][c] === color; c++) {
            matches.push({ row: row, col: c });
        }
        // Find all matching circles in the column
        for (let r = row; r < 16 && this.board[r][col] === color; r++) {
            matches.push({ row: r, col: col });
        }
        // Remove matches
        matches.forEach(match => {
            this.board[match.row][match.col] = null;
        });
        this.score += matches.length;
    }

    updateBoard() {
        for (let col = 0; col < 12; col++) {
            for (let row = 15; row >= 0; row--) {
                if (this.board[row][col] === null) {
                    for (let r = row; r >= 0; r--) {
                        if (this.board[r][col] !== null) {
                            this.board[row][col] = this.board[r][col];
                            this.board[r][col] = null;
                            break;
                        }
                    }
                    if (this.board[row][col] === null) {
                        this.board[row][col] = Phaser.Math.RND.pick(this.colors);
                    }
                }
            }
        }
        this.clearBoard();
        this.drawBoard();
    }

    updateTimer() {
        this.timer -= 1;
        if (this.timer <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        // Add game over logic
        console.log('Game Over');
    }
}
