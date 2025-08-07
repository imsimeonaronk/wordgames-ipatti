import { Gvar } from "../utils/Gvar";
import WordBox from "./WordBox";

interface OptionsParams{
    text: string[],
    shape: string,
    onComplete: Function
}

class OptionsContainer extends Phaser.GameObjects.Container{

    public space: number = Math.min(Math.floor(Gvar.width * 0.10),Math.floor(Gvar.height * 0.10));
    public contentWidth: number = 0;
    private params: OptionsParams | undefined;
    private tweensList: Phaser.Tweens.Tween [] | undefined;

    constructor(scene:Phaser.Scene, params:OptionsParams){
        super(scene);
        scene.add.existing(this);
        this.params = params;
        this.init();
        this.reset();
    }

    private init(){
        let optionsText = this.params!.text;
        Phaser.Utils.Array.Shuffle(optionsText) // Shuffle text
        // Display box
        const column = Math.ceil(optionsText.length * 0.5);
        let xpos = 0, ypos = 0;
        for(let k=0; k<optionsText.length; k++){
            let box:WordBox = new WordBox(this.scene,{text: optionsText[k], type: "option-box-rectangle", currenttext: ""})
            box.x = xpos + box.getData("box-bounds").width * 0.5;
            box.y = ypos;
            xpos = xpos + box.getData("box-bounds").width + (this.space * 0.5);
            if((k+1)%column == 0){
                xpos = 0;
                if((k+2) == optionsText.length){
                    xpos = box.getData("box-bounds").width * 0.5 + (this.space * 0.5);
                }
                ypos = ypos + box.getData("box-bounds").height + (this.space * 0.5);
            }else{
                if((k+1) < column){
                    this.contentWidth += xpos - (this.space * 0.25);
                }
            }
            this.add(box);
            //Set data
            box.setData('box-position',{x: box.x, y: box.y});
        }
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

export default OptionsContainer;