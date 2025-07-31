import Phaser from "phaser";
import Boot from "../game/scene/Boot";
import Preload from "../game/scene/Preload";
import Game1 from "../game/scene/Game1";
import Game2 from "../game/scene/Game2";
import Game3 from "../game/scene/Game3";
import Game4 from "../game/scene/Game4";
import Game5 from "../game/scene/Game5";
import Game6 from "../game/scene/Game6";
import Game7 from "../game/scene/Game7";
import Game8 from "../game/scene/Game8";
import Game9 from "../game/scene/Game9";
import Game10 from "../game/scene/Game10";
import Game11 from "../game/scene/Game11";
import Game12 from "../game/scene/Game12";

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
    scene: [
        Boot,
        Preload,
        Game1,
        Game2,
        Game3,
        Game4,
        Game5,
        Game6,
        Game7,
        Game8,
        Game9,
        Game10,
        Game11,
        Game12
    ],
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true,
    },
    autoRound: true,
    autoFocus: true,
}