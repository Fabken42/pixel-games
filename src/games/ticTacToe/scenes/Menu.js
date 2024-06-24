import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    static gameFont = '"Press Start 2P"';

    constructor() {
        super({ key: 'menuScene' })
    }

    create() {
        this.add.text(400, 100, 'Tic Tac Toe', { fontFamily: MenuScene.gameFont, fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
    
        let player_score = this.registry.get('player_score');
        let enemy_score = this.registry.get('enemy_score');

        if (player_score !== undefined && enemy_score !== undefined) {
            this.add.text(400, 200, `CPU ${enemy_score} x ${player_score} JOG`, { fontFamily: MenuScene.gameFont, fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
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