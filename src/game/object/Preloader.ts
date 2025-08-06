import { Gvar } from "../utils/Gvar";

class FlatPreloadBar extends Phaser.GameObjects.Container{
    public progressValue: number | undefined;

    constructor(scene: Phaser.Scene){
        super(scene,0,0);
        scene.add.existing(this);
        this.init();
    }

    private init(){
        let rectangleWidth = Math.floor(Gvar.width * 0.4);
        let rectangleHeight = Math.floor(Gvar.height * 0.02);
        if(Gvar.orientation.includes("portrait"))
            rectangleHeight = Math.floor(Gvar.height * 0.01);

        this.progressValue = 0;
        const stroke = Math.min(rectangleWidth, rectangleHeight) / 20;

        let outline = this.scene.add.rectangle(0,0,rectangleWidth,rectangleHeight).setOrigin(0.5);
        outline.setStrokeStyle(stroke,0x808080);
        outline.setPosition(0,0);

        let fillbar = this.scene.add.rectangle(0,0,rectangleWidth,rectangleHeight).setOrigin(0,0.5);
        fillbar.setFillStyle(0x000000);
        fillbar.setStrokeStyle(stroke,0x808080);
        fillbar.setPosition(outline.x - outline.displayWidth * 0.5, outline.y);
        fillbar.scaleX = this.progressValue;

        this.add(fillbar);
        this.add(outline);
    }

    public setXY(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    public updateValue(){
        let fillbar = this.getAt(0) as Phaser.GameObjects.Rectangle;
        fillbar.scaleX = this.progressValue!;
    }
}

export default FlatPreloadBar;