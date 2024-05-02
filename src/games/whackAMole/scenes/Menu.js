import Phaser from "phaser";

const GAME_FONT = '"Press Start 2P"';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' });
    }

    create() {
        this.add.text(400, 100, 'Whack a Mole', { fontFamily: GAME_FONT, fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

        let score = this.registry.get('score');
        let clicks = this.registry.get('clicks');
        if (clicks === 0) clicks = 1;
        let precision = (score / clicks * 100).toFixed(1);

        if (clicks !== undefined) {
            this.add.text(400, 200, `Precisão: ${precision}%`, { fontFamily: GAME_FONT, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        }

        if (score !== undefined) {
            this.add.text(400, 250, `Pontuação: ${score}`, { fontFamily: GAME_FONT, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        }

        const playButton = this.add.text(400, 350, 'Jogar', {
            fontFamily: GAME_FONT,
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#007bff', // Cor de fundo azul
            padding: { x: 30, y: 15 }, // Espaçamento interno
        }).setOrigin(0.5);

        playButton.setInteractive();

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