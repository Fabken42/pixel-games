import React from "react";
import Phaser from "phaser";
import GameComponent from "../../../components/GameComponent.js";
import MenuScene from "./Menu.js";
import GameScene from "./Game.js";

export default function WhackAMoleScene() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: 800,
        height: 600,

        pixelArt: true,
        scene: [MenuScene, GameScene]
    };

    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <GameComponent config={config} />
    </div>;
}
