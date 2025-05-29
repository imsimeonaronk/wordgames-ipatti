export {};
declare global{
    interface Window {
        Game: Phaser.Game | undefined;
        selectedGameID: number;
    }
}