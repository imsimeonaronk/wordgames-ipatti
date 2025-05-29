class FpsText extends Phaser.GameObjects.Text {

    private thisDebug: boolean = true;

    constructor(scene:Phaser.Scene) {
        super(scene, 0, 0, '', { color: 'red', fontSize: '2rem' });
        scene.add.existing(this)
        this.setOrigin(0)
        this.setVisible(this.thisDebug);
    }

    public update() {
        this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
    }
}

export default FpsText