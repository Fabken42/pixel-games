import Phaser from 'phaser';
import Wall from '../assets/img/wall.png';
import Enemy from '../assets/img/enemy.png';
import Player from '../assets/img/player.png';
import Goal from '../assets/img/goal.png';


export default class GameScene extends Phaser.Scene { 
    static gameFont = '"Press Start 2P"';
    static wallThickness = 10;
    static playerSpeed = 180;

    constructor() {
        super({ key: 'gameScene' });
        this.currentLevel = 0;
    }

    preload() {
        this.load.image('wall', Wall);
        this.load.image('enemy', Enemy);
        this.load.image('player', Player);
        this.load.image('goal', Goal);
    }

    create() {

        this.cameras.main.setBackgroundColor('#ddd');

        this.levels = [
            {
                walls: [
                    { x: 170, y: 50, width: GameScene.wallThickness, height: 200 },
                    { x: 340, y: 160, width: GameScene.wallThickness, height: 320 },
                    { x: 470, y: 50, width: GameScene.wallThickness, height: 250 },
                    { x: 600, y: 160, width: GameScene.wallThickness, height: 320 },
                    { x: 170, y: 250, width: 180, height: GameScene.wallThickness },
                    { x: 340, y: 400, width: 330, height: GameScene.wallThickness },
                ],
                enemies: [
                    { x: 320, y: 110, velocityX: 100, velocityY: 0 },
                    { x: 420, y: 240, velocityX: -100, velocityY: 0 },
                    { x: 480, y: 350, velocityX: 150, velocityY: 0 },
                    { x: 540, y: 240, velocityX: 100, velocityY: 0 },
                    { x: 290, y: 150, velocityX: 0, velocityY: 150 },
                    { x: 670, y: 190, velocityX: 80, velocityY: 0 },
                    { x: 670, y: 330, velocityX: -80, velocityY: 0 },
                    { x: 440, y: 470, velocityX: 0, velocityY: -80 },
                    { x: 530, y: 470, velocityX: 0, velocityY: 80 },
                    { x: 150, y: 340, velocityX: 100, velocityY: 0 },
                    { x: 150, y: 450, velocityX: 100, velocityY: 0 },
                    { x: 250, y: 420, velocityX: 0, velocityY: 100 },
                ],
                player: { x: 110, y: 100, width: 50, height: 50 },
                goal: { x: 205, y: 225, width: 50, height: 50 }
            },
            {
                walls: [
                    { x: 210, y: 50, width: GameScene.wallThickness, height: 370 },
                    { x: 370, y: 180, width: GameScene.wallThickness, height: 370 },
                    { x: 370, y: 330, width: 260, height: GameScene.wallThickness },
                    { x: 155, y: 410, width: 120, height: GameScene.wallThickness },
                    { x: 315, y: 180, width: 120, height: GameScene.wallThickness },
                    { x: 600, y: 240, width: 150, height: GameScene.wallThickness },
                ],
                enemies: [
                    { x: 100, y: 240, velocityX: 120, velocityY: 0 },
                    { x: 170, y: 350, velocityX: 120, velocityY: 0 },
                    { x: 260, y: 240, velocityX: 120, velocityY: 0 }, 
                    { x: 330, y: 350, velocityX: 120, velocityY: 0 }, 
                    { x: 205, y: 490, velocityX: 170, velocityY: 0 },
                    { x: 290, y: 490, velocityX: 0, velocityY: 200 },
                    { x: 590, y: 130, velocityX: 150, velocityY: 0 },
                    { x: 580, y: 210, velocityX: -150, velocityY: 0 },
                    { x: 530, y: 290, velocityX: 150, velocityY: 0 },
                    { x: 440, y: 410, velocityX: 180, velocityY: 0 },
                    { x: 560, y: 480, velocityX: 180, velocityY: 0 },
                    { x: 680, y: 490, velocityX: 0, velocityY: -200 },
                ],
                player: { x: 100, y: 100, width: 50, height: 50 },
                goal: { x: 405, y: 515, width: 50, height: 50 }
            },
            {
                walls: [
                    { x: 50, y: 220, width: 200, height: GameScene.wallThickness },
                    { x: 370, y: 50, width: GameScene.wallThickness, height: 320 },
                    { x: 200, y: 360, width: 170, height: GameScene.wallThickness },
                    { x: 380, y: 280, width: 260, height: GameScene.wallThickness },
                ],
                enemies: [
                    { x: 180, y: 160, velocityX: 0, velocityY: 0 },
                    { x: 170, y: 410, velocityX: 0, velocityY: 0 },
                    { x: 550, y: 160, velocityX: 0, velocityY: 0 },
                    { x: 310, y: 130, velocityX: 0, velocityY: -180 },
                    { x: 140, y: 300, velocityX: 180, velocityY: 0 },
                    { x: 130, y: 300, velocityX: 0, velocityY: 180 },
                    { x: 230, y: 450, velocityX: 0, velocityY: 140 },
                    { x: 330, y: 460, velocityX: 0, velocityY: 150 },
                    { x: 430, y: 470, velocityX: 0, velocityY: 160 },
                    { x: 530, y: 480, velocityX: 0, velocityY: 170 },
                    { x: 630, y: 490, velocityX: 0, velocityY: 180 },
                    { x: 630, y: 420, velocityX: -220, velocityY: 0 },
                    { x: 630, y: 500, velocityX: 220, velocityY: 0 },
                    { x: 630, y: 340, velocityX: 220, velocityY: 0 },
                    { x: 600, y: 170, velocityX: 0, velocityY: -140 },
                    { x: 500, y: 170, velocityX: 0, velocityY: 140 },
                    { x: 580, y: 190, velocityX: 140, velocityY: 0 },
                ],
                player: { x: 100, y: 100, width: 50, height: 50 },
                goal: { x: 405, y: 85, width: 50, height: 50 }
            }
            
        ];

        // Iniciar o nível atual
        this.startLevel(this.currentLevel);

        // Define controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Define colisões
        this.physics.add.collider(this.player, this.walls, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
    }

    startLevel(levelIndex) {
        this.currentLevel = levelIndex;
        const level = this.levels[this.currentLevel];

        // Define o labirinto
        this.createMaze(level.walls);

        // Adiciona o jogador
        this.createPlayer(level.player);

        // Adiciona inimigos
        this.createEnemies(level.enemies);

        // Adiciona região de chegada
        this.createGoal(level.goal);
    }

    createMaze(walls) {
        this.walls = this.physics.add.staticGroup();
        const graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });

        // Paredes comuns a todas as fases
        this.addWall(graphics, 50, 50, 700, GameScene.wallThickness); // Parede superior
        this.addWall(graphics, 50, 50, GameScene.wallThickness, 500); // Parede esquerda
        this.addWall(graphics, 50, 540, 700, GameScene.wallThickness); // Parede inferior
        this.addWall(graphics, 740, 50, GameScene.wallThickness, 500); // Parede direita

        // Paredes específicas do nível
        walls.forEach(wall => {
            this.addWall(graphics, wall.x, wall.y, wall.width, wall.height);
        });

        graphics.fillPath();
    }

    addWall(graphics, x, y, width, height) {
        graphics.fillRect(x, y, width, height);
        const wall = this.walls.create(x + width / 2, y + height / 2, 'wall');
        wall.setDisplaySize(width, height);
        wall.refreshBody();
    }

    createPlayer(playerConfig) {
        this.player = this.physics.add.sprite(playerConfig.x, playerConfig.y, 'player').setScale(3.5).setCollideWorldBounds(true);
    }

    createEnemies(enemies) {
        this.enemies = this.physics.add.group();

        // Inimigos específicos do nível
        enemies.forEach(enemyConfig => {
            this.addEnemy(enemyConfig.x, enemyConfig.y, enemyConfig.velocityX, enemyConfig.velocityY);
        });

        this.physics.add.collider(this.enemies, this.walls, this.changeEnemyDirection, null, this);
    }

    addEnemy(x, y, velocityX, velocityY) {
        const enemy = this.enemies.create(x, y, 'enemy')
        enemy.velocityX = velocityX;
        enemy.velocityY = velocityY;
        enemy.setScale(2)
            .setVelocity(velocityX, velocityY)
            .setCollideWorldBounds(true);
    }

    changeEnemyDirection(enemy, wall) {
        enemy.setVelocityX(-enemy.velocityX);
        enemy.setVelocityY(-enemy.velocityY);

        enemy.velocityX *= -1;
        enemy.velocityY *= -1;
    }

    createGoal(goalConfig) {
        this.goal = this.physics.add.staticGroup();
        const goal = this.goal.create(goalConfig.x, goalConfig.y, 'goal');
        goal.setDisplaySize(goalConfig.width, goalConfig.height)
            .refreshBody();
    }

    update() {
        this.handlePlayerControls();
    }

    handlePlayerControls() {
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) {
            velocityX = -GameScene.playerSpeed;
        } else if (this.cursors.right.isDown) {
            velocityX = GameScene.playerSpeed;
        }

        if (this.cursors.up.isDown) {
            velocityY = -GameScene.playerSpeed;
        } else if (this.cursors.down.isDown) {
            velocityY = GameScene.playerSpeed;
        }

        // Ajusta velocidade para movimentos diagonais
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= Math.SQRT1_2;
            velocityY *= Math.SQRT1_2;
        }

        this.player.setVelocityX(velocityX);
        this.player.setVelocityY(velocityY);
    }

    reachGoal() {
        this.currentLevel = (this.currentLevel + 1) % this.levels.length;
        if(this.currentLevel === 0){
            this.scene.start('menuScene');
            return;
        }
        this.scene.restart();
    }

    gameOver() {
        this.scene.restart();
    }
}
