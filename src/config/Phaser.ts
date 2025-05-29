import Phaser from "phaser";

const gameWidth = window.innerWidth //* window.devicePixelRatio;
const gameHeight = window.innerHeight //* window.devicePixelRatio;

export const PhaserGameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    backgroundColor: '#FFFFFF',
    parent: 'phaser-game',
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.NONE,
        width: gameWidth,
        height: gameHeight,
    },
    seed: [ (Date.now() * Math.random()).toString() ],
    scene: {

    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true,
    },
    autoRound: true,
    autoFocus: true,
}