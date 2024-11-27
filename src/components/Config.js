import Phaser from "phaser";
import GameComponent from "./GameComponent.js";

export default function GameSceneConfig({ folderName, canvasWidth, canvasHeight, gravity, isPixelArt }) {
    const GameScene = require(`../games/${folderName}/scenes/Game.js`).default;
    const MenuScene = require(`../games/${folderName}/scenes/Menu.js`).default;

    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: canvasWidth,
        height: canvasHeight,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: gravity },
                debug: false
            }
        },
        pixelArt: isPixelArt,
        scene: [MenuScene, GameScene]
    };

    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <GameComponent config={config} />
    </div>;
}
