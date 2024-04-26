import React from "react";
import Phaser from "phaser";
import GameComponent from "../components/GameComponent.js";
import GameBG from '../assets/whack-mole-bg.png';
import Enemy from "../assets/whack-mole-enemy.png";

class WhackMole extends Phaser.Scene {
    constructor() {
        super({ key: "whackMoleScene" });
    }

    preload() {
        this.load.image("gameBG", GameBG);
        this.load.image("enemy", Enemy);
    }

    create() {
        const gameBG = this.add.image(0, 0, 'gameBG').setOrigin(0);
        gameBG.setScale(this.game.config.width / gameBG.width, this.game.config.height / gameBG.height);
    }

    update() {
    }

}


export default function WhackAMoleScene() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: 800,
        height: 600,
        scene: WhackMole
    };

    return <div>
        <GameComponent config={config} />
    </div>;
}
