import { Colors } from "../utils/Colors";
import { Gvar } from "../utils/Gvar";
import { TextStyle } from "../utils/TextStyle";

interface MatchParams{
    direction: string,
    data: Object[],
    shape: string,
    scale: number,
    space: number,
    onComplete: Function
}

interface MatchDotParams{
    boxsize: number[],
    direction: string,
    data: Object[],
    space: number,
    onComplete: Function
}

export class MatchBoxContainer extends Phaser.GameObjects.Container{

    private params: MatchParams;
    private tweensList: Phaser.Tweens.Tween [] | undefined;
    public contentWidth: number | undefined;
    public contentHeight: number | undefined;
    public boxWidth: number | undefined;
    public boxHeight: number | undefined;

    constructor(scene:Phaser.Scene, params:MatchParams){
        super(scene);
        scene.add.existing(this);
        this.params = params;
        this.init();
        this.reset();
    }

    private init(){
        const count = this.params.data.length;
        const size = this.getSize(this.params.shape, count); //Size(width, height) and space
        let ypos = 0;
        for(let i=0; i<count; i++){
            const data = this.params.data[i];
            let box = this.box(this.params.shape, size[0], size[1], data);
            box.y = ypos;
            ypos = box.y + size[1] + size[2];
            this.add(box);
        }
        this.boxWidth = size[0];
        this.boxHeight = size[1];
        this.contentWidth = size[0];
        this.contentHeight = (size[1] * count) + (size[2] * (count - 1));
        this.tweensList = [];
    }

    private getSize(shape:string, count:number){
        const maxWidth = (Gvar.width * 0.4 * Gvar.scaleRatio), maxHeight = (Gvar.height * 0.8 * Gvar.scaleRatio);
        const space = Math.floor(Gvar.height * this.params.space) //* Gvar.scaleRatio
        const avgHeight = (maxHeight - (space * (count-1))) / count;
        if(shape == "square"){
            return [Math.floor(avgHeight * 0.95), Math.floor(avgHeight * 0.95), space]
        }else{
            return [Math.min(Math.floor(Gvar.width * 0.35),Math.floor(avgHeight * 2)), Math.floor(avgHeight * 0.95), space]
        }
    }

    private box(boxshape:string, width:number, height: number, data:any){
        const box = this.scene.add.container();
            const direction = (this.params!.direction == "right") ? 0 : 1;
            const shaperadius = Math.min(width, height) / 10;
            const shapestroke = Math.min(width, height) / 50;
            // Shape
            let shape = this.scene.add.graphics();
            shape.fillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Match-Box"]);
            shape.lineStyle(shapestroke,Colors[`Game-${Gvar.GameData.Id}`]["Match-Box-Line"]);
            shape.fillRoundedRect((-1 * width * direction), (-1 * height * 0.5), width, height, shaperadius);
            shape.strokeRoundedRect((-1 * width * direction), (-1 * height * 0.5), width, height, shaperadius);
            box.add(shape);
            // Image
            if(Boolean(data[1]["IMAGE"])){
                let filename = Gvar.fileextension(data[1]["IMAGE"]);
                let image = this.scene.add.image(0, 0, filename).setOrigin(0.5);
                box.add(image);
                image.setScale(
                    Math.min(Math.floor(width * 0.95)/image.displayWidth,Math.floor(height * 0.95)/image.displayHeight)
                )
                const imagedirection = (this.params!.direction == "right") ? 1 : -1;
                const imageposratio = (boxshape == "square") ? 0.5 : Boolean(data[1]["TEXT"]) ? 0.25 : 0.5;
                image.x = imagedirection * width * imageposratio;
            }
            // Label
            if(Boolean(data[1]["TEXT"])){
                const labeldirection = (this.params!.direction == "right") ? 1 : -1;
                const labelposratio = (boxshape == "square") ? 0.5 : Boolean(data[1]["IMAGE"]) ? 0.7 : 0.5;
                const textbound = (Boolean(data[1]["IMAGE"]) || (boxshape == "square")) ? 0.90 : 1.95;
                let label = this.scene.add.text(0, 0, data[1]["TEXT"].toString(), TextStyle['match-box']).setOrigin(0.5)
                label.setFontSize(Math.floor(height * 0.15));
                label.setWordWrapWidth(Math.floor(height * textbound));
                box.add(label);
                label.x = labeldirection * width * labelposratio + 5; //5 offset
            }
        return box
    }

    public animate(){
        this.reset(); // Reset child before animate
        this.list.forEach((element:any,index:number)=>{
            const yTween = this.scene.tweens.add({
                targets: element,
                y: (element.y - 5),
                yoyo: true,
                delay: 500 + (200 * index),
                duration: 500
            });
            this.tweensList?.push(yTween);
            const alphaTween = this.scene.tweens.add({
                targets: element,
                alpha: 1,
                delay: 500 + (200 * index),
                duration: 500,
                onComplete: ()=>{
                    if((index+1) === this.list.length){
                        this.params?.onComplete();
                    }
                }
            });
            this.tweensList?.push(alphaTween);
        });
    }

    private reset(){
        this.resetTween();
        this.list.forEach((element:any)=>{
            element.setAlpha(0);
        });
    }

    private resetTween(){
        if(this.tweensList){
            this.tweensList.forEach((element:Phaser.Tweens.Tween)=>{
                element.stop();
                element.destroy();
            });
        }
    }

}

export class MatchPointContainer extends Phaser.GameObjects.Container{

    private params: MatchDotParams | undefined;
    private tweensList: Phaser.Tweens.Tween [] | undefined;
    public radius: number = 0;

    constructor(scene:Phaser.Scene, params:MatchDotParams){
        super(scene);
        scene.add.existing(this);
        this.params = params;
        this.init();
        this.reset();
    }

    private init(){
        const radiusValue = Math.min(Math.floor(Gvar.width * 0.025), Math.floor(Gvar.height * 0.025));
        const radius = Math.floor(radiusValue * Gvar.scaleRatio);
        const space = Math.floor(Gvar.height * this.params!.space) //* Gvar.scaleRatio
        let ypos = 0;
        for(let i=0; i<this.params!.data.length; i++){
            const data = this.params!.data[i] as any
            let dot = this.scene.add.circle(0, 0, radius);
            dot.setOrigin(0.5).setFillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Dot"])
            dot.setStrokeStyle(Math.floor(radius * 0.1),0x000000);
            dot.y = ypos;
            ypos = dot.y + this.params!.boxsize[1] + space;
            dot.setData('box-index',data[0]);
            dot.setData('box-position',{x: dot.x, y: dot.y});
            this.add(dot);
        }
        // Init variable
        this.tweensList = [];
        this.radius = radius;
    }

    public animate(){
        this.reset(); // Reset child before animate
        this.list.forEach((element:any,index:number)=>{
            const yTween = this.scene.tweens.add({
                targets: element,
                y: (element.y - 5),
                yoyo: true,
                delay: 500 + (200 * index),
                duration: 500
            });
            this.tweensList?.push(yTween);
            const alphaTween = this.scene.tweens.add({
                targets: element,
                alpha: 1,
                delay: 500 + (200 * index),
                duration: 500,
                onComplete: ()=>{
                    if((index+1) === this.list.length){
                        this.params?.onComplete();
                    }
                }
            });
            this.tweensList?.push(alphaTween);
        });
    }

    private reset(){
        this.resetTween();
        this.list.forEach((element:any)=>{
            element.setAlpha(0);
        });
    }

    private resetTween(){
        if(this.tweensList){
            this.tweensList.forEach((element:Phaser.Tweens.Tween)=>{
                element.stop();
                element.destroy();
            });
        }
    }

}