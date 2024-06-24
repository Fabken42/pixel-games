import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'menuScene' })
    }

    create() {
        this.add.text(400, 100, 'Memory Game', { fontFamily: MenuScene.gameFont, fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

        let timeInGame = this.registry.get('timeInGame');
        let moves = this.registry.get('moves');

        if (timeInGame !== undefined) {
            this.add.text(400, 200, `Tempo: ${timeInGame} segundos`, { fontFamily: MenuScene.gameFont, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        }
        if (moves !== undefined) {
            this.add.text(400, 250, `Jogadas: ${moves}`, { fontFamily: MenuScene.gameFont, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
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