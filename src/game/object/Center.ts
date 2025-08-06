import { Gvar } from "../utils/Gvar";

class Center extends Phaser.GameObjects.Container {
    constructor(scene:Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.init();
        this.setVisible(Gvar.debug);
    }

    public init() {
        const circle = this.scene.add.circle(0,0,Math.min(Math.floor(Gvar.width * 0.01),Math.floor(Gvar.height * 0.01)));
        circle.setFillStyle(0xff0000);
        circle.setPosition(Gvar.centerX, Gvar.centerY);
        circle.setOrigin(0.5);
        this.add(circle);
    }
}

export default Center