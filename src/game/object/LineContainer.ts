import { Gvar } from "../utils/Gvar";
import WordBox from "./WordBox";

interface LineParams{
    sentence: string,
    finalsentence: string,
    answer: string,
    onComplete: Function
}

class LineContainer extends Phaser.GameObjects.Container{

    public space: number = Math.floor(Gvar.width * 0.01);
    private tweensList: Phaser.Tweens.Tween [] | undefined;
    private params: LineParams | undefined;

    constructor(scene:Phaser.Scene, params:LineParams){
        super(scene);
        scene.add.existing(this);
        this.params = params;
        this.init();
        this.reset();
    }

    private init(){
        //Split sentence into array
        let sentencearr = this.params!.sentence.split(" ");
        let finalsentencearr = this.params!.finalsentence.split(" ");
        let words:string[][] = [];
        for(let i=0; i<sentencearr.length; i++){
            words.push([sentencearr[i], finalsentencearr[i]]);
        }
        // Create box view
        let xpos = 0, ypos = 0;
        for(let i=0;i<words.length;i++){
            let word = words[i];
            let lineword:WordBox = new WordBox(this.scene,{type:"line-box", text: word[1], currenttext: word[0]});
            const boxwidth = lineword.getData("box-bounds").width;
            const boxheight = lineword.getData("box-bounds").height;
            lineword.x = xpos + boxwidth * 0.5;
            lineword.y = ypos;
            xpos = lineword.x + boxwidth * 0.5 + Math.floor(this.space * 0.5);
            //New Line
            if(xpos > Math.floor(Gvar.width * 0.85)){
                xpos = 0;
                ypos = ypos + boxheight + Math.floor(this.space * 0.6);
            }
            this.add(lineword);
            // Set Data
            lineword.setData('box-position',{x: lineword.x, y: lineword.y});
            if(lineword.getData('box-empty')){
                this.setData("box-empty-bounds",lineword.getData('box-bounds'))
            }
        }
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

export default LineContainer;