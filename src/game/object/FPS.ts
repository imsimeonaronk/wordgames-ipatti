import { Gvar } from "../utils/Gvar";

class FpsText extends Phaser.GameObjects.Text {
    constructor(scene:Phaser.Scene) {
        super(scene, 0, 0, '', { color: 'red', fontSize: '20px' });
        scene.add.existing(this)
        this.setOrigin(0)
        this.setVisible(Gvar.debug);
    }

    public update() {
        this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
    }
}

export default FpsText