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
        let xpos = 0, ypos = 0, labelscale = 1;
        let boxwidth = 0, boxheight = 0, boxlabel;
        for(let k=0; k<optionsText.length; k++){
            let box:WordBox = new WordBox(this.scene,{text: optionsText[k], type: this.params!.shape || "option-box-rectangle", currenttext: ""});
            if(boxwidth == 0){
                boxwidth = box.getData("box-bounds").width;
                boxheight = box.getData("box-bounds").height;
            }
            box.x = xpos + boxwidth * 0.5;
            box.y = ypos;
            xpos = xpos + boxwidth + (this.space * 0.5);
            if((k+1)%column == 0){
                xpos = 0;
                if((k+2) == optionsText.length){
                    xpos = boxwidth * 0.5 + (this.space * 0.5);
                }
                ypos = ypos + boxheight + (this.space * 0.5);
            }else{
                if((k+1) < column){
                    this.contentWidth += xpos - (this.space * 0.25);
                }
            }
            this.add(box);
            // Set data
            box.setData('box-position',{x: box.x, y: box.y});
            // Uniform scale text inside box
            boxlabel = box.list[box.getData('box-label-index')] as Phaser.GameObjects.Text;
            labelscale = Math.min(labelscale, Math.min((boxwidth* 0.90)/boxlabel.displayWidth, (boxheight * 0.80)/boxlabel.displayHeight));
        }
        // Update Label Text with Uniform Scale
        this.iterate((element:WordBox)=>{
            boxlabel = element.list[element.getData('box-label-index')] as Phaser.GameObjects.Text;
            boxlabel.setScale(labelscale);
            element.setData('box-text-scale',labelscale);
        });
        // Init variable
        this.tweensList = [];
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