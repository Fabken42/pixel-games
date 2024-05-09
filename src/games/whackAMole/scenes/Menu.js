import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'menuScene' });
    }

    create() {
        this.add.text(400, 100, 'Whack a Mole', { fontFamily: MenuScene.gameFont, fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

        let score = this.registry.get('score');
        let clicks = this.registry.get('clicks');
        if (clicks === 0) clicks = 1;
        let precision = (score / clicks * 100).toFixed(1);

        if (clicks !== undefined) {
            this.add.text(400, 200, `Precisão: ${precision}%`, { fontFamily: MenuScene.gameFont, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        }

        if (score !== undefined) {
            this.add.text(400, 250, `Pontuação: ${score}`, { fontFamily: MenuScene.gameFont, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        }

        this.time.delayedCall(650, () => {
            this.addButton();
        });
    }

    addButton() {
        const playButton = this.add.text(400, 350, 'Jogar', {
            fontFamily: MenuScene.gameFont,
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#007bff', // Cor de fundo azul
            padding: { x: 30, y: 15 }, // Espaçamento interno
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerover', () => {
            playButton.setBackgroundColor('#0056b3'); // Mudar a cor de fundo quando o mouse entra
        });

        playButton.on('pointerout', () => {
            playButton.setBackgroundColor('#007bff'); // Restaurar a cor de fundo padrão quando o mouse sai
        });

        playButton.on('pointerdown', () => {
            this.scene.start('gameScene');
        });
    }
}