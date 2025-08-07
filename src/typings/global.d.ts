import Sounds from "../game/libs/Sounds";

export {};
declare global{
    interface Window {
        Game: Phaser.Game | undefined;
        selectedGameID: number;
        Sounds: Sounds;
    }
}