import React from "react";
import Phaser from "phaser";
import GameComponent from "../../../components/GameComponent.js";

export default function FruitCatchScene() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: 800,
        height: 600,

        pixelArt: true,
        scene: []
    };

    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <GameComponent config={config} />
    </div>;
}
