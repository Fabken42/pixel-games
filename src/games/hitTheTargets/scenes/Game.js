import Phaser from "phaser";
import Target from "../assets/img/target.png";
import Life from "../assets/img/life.png";
import HitSound from "../assets/audio/hitTarget.wav";
import MissSound from "../assets/audio/missTarget.wav";

export default class GameScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        this.load.image('target', Target);
        this.load.image('life', Life);

        this.load.audio('hitSound', HitSound);
        this.load.audio('missSound', MissSound);
    }

    create() {
        this.cameras.main.setBackgroundColor('#002238');

        this.spawnTargetDelay = 800;
        this.clicks = 0;
        this.hits = 0;
        this.score = 0;
        this.targets = [];
        this.targetGrowing = true;
        this.targetMaxSize = 50;
        this.targetMinSize = 0;
        this.targetSize = 0;
        this.lives = 3;
        this.lifeSprites = [];

        this.scoreText = this.add.text(16, 16, `Pontuação: ${this.score}`, { fontFamily: GameScene.gameFont, fontSize: '24px', fill: '#fff' });

        // Set up the life sprites
        this.createLifeSprites();

        this.time.delayedCall(800, () => this.spawnTarget());

        // Set up input
        this.input.on('pointerdown', this.checkHit, this);
    }

    update(time, delta) {
        this.targets.forEach(target => {
            if (target.growing) {
                target.size += 0.6;
                if (target.size >= this.targetMaxSize) {
                    target.growing = false;
                }
            } else {
                target.size -= 0.6;
                if (target.size <= this.targetMinSize) {
                    this.missTarget(target);
                }
            }
            target.sprite.setDisplaySize(target.size, target.size);
        });
    }

    createLifeSprites() {
        for (let i = 0; i < this.lives; i++) {
            let life = this.add.image(680 + i * 32, 16, 'life').setOrigin(0).setScale(4);
            this.lifeSprites.push(life);
        }
    }

    checkHit(pointer) {
        this.clicks++;
        this.targets.forEach(target => {
            if (target.sprite.getBounds().contains(pointer.x, pointer.y)) {
                this.hits++;
                this.hitTarget(target);
            }
        });
    }

    hitTarget(target) {
        this.sound.play('hitSound', { volume: 0.6 });
        this.score++;
        this.updateScore();
        target.sprite.destroy();
        this.targets = this.targets.filter(t => t !== target);
    }

    missTarget(target) {
        this.sound.play('missSound', { volume: 0.6 });
        this.lives--;
        this.spawnTargetDelay += 100;
        this.updateLives();
        target.sprite.destroy();
        this.targets = this.targets.filter(t => t !== target);
        if (this.lives <= 0) this.gameOver();
    }

    updateScore() {
        this.scoreText.setText(`Pontuação: ${this.score}`);
    }

    updateLives() {
        this.lifeSprites[this.lives].destroy();
    }

    spawnTarget() {
        if (this.spawnTargetDelay > 350)
            this.spawnTargetDelay -= 5;
        console.log(this.spawnTargetDelay);
        this.time.delayedCall(this.spawnTargetDelay, () => this.spawnTarget());

        const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const y = Phaser.Math.Between(100, this.cameras.main.height - 100);

        let targetSprite = this.add.image(x, y, 'target');
        let target = {
            sprite: targetSprite,
            size: this.targetMinSize,
            growing: true
        };
        targetSprite.setDisplaySize(target.size, target.size);
        this.targets.push(target);
    }

    gameOver() {
        let precision = (100 * this.hits / this.clicks).toFixed(2);

        this.registry.set('precision', precision);
        this.registry.set('score', this.score);
        this.scene.start('menuScene');
    }
}