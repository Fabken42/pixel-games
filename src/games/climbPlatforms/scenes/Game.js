import Phaser from 'phaser';
import Enemy from '../assets/img/enemy.png';
import Lava01 from '../assets/img/lava01.png';
import Lava02 from '../assets/img/lava02.png';
import Platform from '../assets/img/platform.png';
import Player from '../assets/img/player.png';
import Nuvem from '../assets/img/nuvem.png';
import Jump from '../assets/audio/jump.mp3';
import Loose from '../assets/audio/loose.mp3';
import Win from '../assets/audio/win.mp3';

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';
    static playerJumpVelocity = -450;
    static platformAmount = 45;
    static initialPlatformY = 550;
    static platformDistanceY = 140;
    static platformPositions = [150, 400, 650];
    static dificulties = {
        easy: {
            enemySpawnProb: 0.6,
            enemyMovingProb: 0.5,
            raiseLavaInterval: 30,
        },
        medium: {
            enemySpawnProb: 0.75,
            enemyMovingProb: 0.7,
            raiseLavaInterval: 25,
        },
        hard: {
            enemySpawnProb: 0.9,
            enemyMovingProb: 0.9,
            raiseLavaInterval: 20,
        }
    };

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image('cloud', Nuvem);
        this.load.image('enemy', Enemy);
        this.load.image('lava01', Lava01);
        this.load.image('lava02', Lava02);
        this.load.image('platform', Platform);
        this.load.image('player', Player);
        this.load.audio('jumpSound', Jump);
        this.load.audio('looseSound', Loose);
        this.load.audio('winSound', Win);
    }

    create() {
        this.currentDifficulty = 'easy';
        this.raiseLavaTime = 0;
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.clouds = this.add.group();
        const totalClouds = 32; // Aumentar o número total de nuvens

        for (let i = 0; i < totalClouds; i++) {
            const x = Phaser.Math.Between(0, 800); // Posição horizontal aleatória
            const y = (-200 * i) + 500; // Posição vertical com distribuição controlada

            const cloud = this.add.image(x, y, 'cloud')
                .setScale(4)
                .setAlpha(0.75);

            cloud.direction = Math.random() > 0.5 ? 'right' : 'left'; // Define direção aleatória
            cloud.cloudIndex = i;
            this.clouds.add(cloud);
        }

        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.createInitialPlatforms();
        this.physics.world.checkCollision.up = false;

        const initialPlatform = this.platforms.getChildren()[0];
        this.player = this.physics.add.sprite(GameScene.platformPositions[1], initialPlatform.y - 30, 'player').setScale(5).setCollideWorldBounds(true).setGravityY(350);

        this.lava = this.physics.add.sprite(400, 900, 'lava01').setScale(5);
        this.lava.body.setAllowGravity(false);

        this.isLava01 = true; // Variável para controlar qual sprite está atualmente ativo

        this.time.addEvent({
            delay: 900, // Tempo entre as trocas em milissegundos (ajuste conforme necessário)
            callback: () => {
                this.lava.setTexture(this.isLava01 ? 'lava02' : 'lava01');
                this.isLava01 = !this.isLava01; // Alterna entre true e false
            },
            loop: true // Repete indefinidamente
        });


        this.setColliders();
        this.setControls();

        this.cameras.main.startFollow(this.player, true, 0, 1);

        this.time.addEvent({
            delay: 2000,
            loop: true,
            callbackScope: this,
            callback: this.changeEnemyDirection
        });

        // Criação do texto de tempo no canto superior esquerdo
        this.startTime = this.time.now;
        this.timeText = this.add.text(10, 10, 'Tempo: 0s', { fontFamily: GameScene.gameFont, fontSize: '20px', fill: '#000' }).setScrollFactor(0);
    }

    createInitialPlatforms() {
        this.createPlatform(GameScene.platformPositions[1], GameScene.initialPlatformY);
        for (let i = 1; i < GameScene.platformAmount; i++) {
            const y = GameScene.initialPlatformY - i * GameScene.platformDistanceY;

            let auxDifficulty = '';
            if (i < 15) {
                auxDifficulty = 'easy';
            } else if (i < 30) {
                auxDifficulty = 'medium';
            } else {
                auxDifficulty = 'hard';
            }

            this.createNextPlatform(y, auxDifficulty);
        }
    }

    createNextPlatform(y, auxDifficulty) {
        const previousPlatform = this.platforms.getChildren()[this.platforms.getChildren().length - 1];
        const previousPositionIndex = GameScene.platformPositions.indexOf(previousPlatform.x);

        let newPositionIndex;
        if (previousPositionIndex === 0) {
            newPositionIndex = Phaser.Math.Between(0, 1);
        } else if (previousPositionIndex === 1) {
            newPositionIndex = Phaser.Math.Between(0, 2);
        } else {
            newPositionIndex = Phaser.Math.Between(1, 2);
        }

        this.createPlatform(GameScene.platformPositions[newPositionIndex], y, true, auxDifficulty);
    }

    createPlatform(x, y, spawnEnemy = false, difficulty) {
        this.platforms.create(x, y, 'platform').setScale(5).refreshBody();

        if (spawnEnemy) {
            const shouldSpawnEnemy = Math.random() < GameScene.dificulties[difficulty].enemySpawnProb;
            if (shouldSpawnEnemy) {
                this.addEnemy(x, y, difficulty);
            }
        }
    }

    addEnemy(x, y, difficulty) {
        const enemy = this.enemies.create(x + 100, y - 20, 'enemy').setScale(3);

        if (Math.random() < GameScene.dificulties[difficulty].enemyMovingProb) {
            enemy.moving = true;
            enemy.direction = 'left';
            enemy.speed = 100;
        } else {
            enemy.x -= Math.floor(Math.random() * 101) + 50;
        }
    }

    changeEnemyDirection() {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.direction === 'left') {
                enemy.direction = 'right'
            } else {
                enemy.direction = 'left'
            }
        })
    }

    setColliders() {
        this.physics.add.collider(this.player, this.platforms, this.platformCollision, null, this);
        this.physics.add.collider(this.player, this.lava, () => this.gameOver('looseSound'), null, this);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.player, this.enemies, () => this.gameOver('looseSound'), null, this);
    }

    setControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    }

    handlePlayerControls() {
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.wasd.W.isDown) && this.player.body.touching.down) {
            this.sound.play('jumpSound', { volume: 0.5 });
            this.player.setVelocityY(GameScene.playerJumpVelocity);
        }
    }

    removeCollisionWhenMovingUp() {
        if (this.player.body.velocity.y < 0) {
            this.physics.world.colliders.getActive().forEach(collider => {
                if (collider.object1 === this.player && collider.object2 === this.platforms) {
                    collider.active = false;
                }
            });
        } else {
            this.physics.world.colliders.getActive().forEach(collider => {
                if (collider.object1 === this.player && collider.object2 === this.platforms) {
                    collider.active = true;
                }
            });
        }
    }

    raiseLava() {
        this.lava.y -= 1;
        this.lava.body.updateFromGameObject();
    }

    adjustLavaPosition() {
        if (this.player.y - this.lava.y < -500) {
            this.lava.y = this.player.y + 500;
            this.lava.body.updateFromGameObject();
        }
    }

    platformCollision(player, platform) {
        if (player.body.velocity.y < 0) {
            this.physics.world.colliders.getActive().forEach(collider => {
                if (collider.object1 === this.player && collider.object2 === this.platforms) {
                    collider.active = false;
                }
            });
        } else {
            this.physics.world.colliders.getActive().forEach(collider => {
                if (collider.object1 === this.player && collider.object2 === this.platforms) {
                    collider.active = true;
                }
            });
        }
    }

    updateEnemyMovement() {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.moving) {
                if (enemy.direction === 'left') {
                    enemy.setVelocityX(-enemy.speed);
                } else {
                    enemy.setVelocityX(enemy.speed);
                }
            }
        });
    }

    update(time, delta) {
        // Atualizar posição das nuvens
        this.clouds.getChildren().forEach(cloud => {
            const speed = 0.5; // Velocidade de movimento

            // Movimenta nuvens conforme a direção
            if (cloud.direction === 'right') {
                cloud.x += speed;
                if (cloud.x > 900) { // Saiu pela direita
                    cloud.x = -100; // Reaparece na esquerda
                    cloud.y = (-200 * cloud.cloudIndex) + 500; // Reajusta com base no índice
                }
            } else {
                cloud.x -= speed;
                if (cloud.x < -100) { // Saiu pela esquerda
                    cloud.x = 900; // Reaparece na direita
                    cloud.y = (-200 * cloud.cloudIndex) + 500; // Reajusta com base no índice
                }
            }
        });

        if (this.player.y < -5635) {
            this.gameOver('winSound');
        } else if (this.player.y < -3580) {
            this.currentDifficulty = 'hard';
        } else if (this.player.y < -1530) {
            this.currentDifficulty = 'medium';
        }

        this.raiseLavaTime += delta;
        if (this.raiseLavaTime >= GameScene.dificulties[this.currentDifficulty].raiseLavaInterval) {
            this.raiseLavaTime = 0;
            this.raiseLava();
        }

        this.handlePlayerControls();
        this.removeCollisionWhenMovingUp();
        this.adjustLavaPosition();
        this.updateEnemyMovement();

        // Atualizar o texto do tempo
        const elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
        this.timeText.setText('Tempo: ' + elapsedTime + 's');
    }

    gameOver(soundName = 'looseSound') {
        this.registry.set('win', soundName === 'winSound');
        this.sound.play(soundName, { volume: 0.7 });
        this.scene.start('menuScene');
    }
}
