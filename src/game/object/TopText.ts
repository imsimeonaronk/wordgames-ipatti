import { TextStyle } from "../utils/TextStyle";

interface TopTextParams{
    text: string,
    textstyle: string,
    color: string,
    textsize: number,
    onComplete: Function,
}

class TopText extends Phaser.GameObjects.Text{

    private params: TopTextParams | undefined;
    private tweensList: Phaser.Tweens.Tween [] | undefined;

    constructor(scene:Phaser.Scene,params:TopTextParams){
        super(scene,0,0,"",TextStyle[params.textstyle]);
        scene.add.existing(this);
        this.params = params;
        this.setText(params.text);
        this.setOrigin(0.5,0)
        this.setFill(params.color);
        this.setFontSize(params.textsize);
        this.reset();
    }

    public animate(){
        this.reset(); // Reset child before animate
        const yTween = this.scene.tweens.add({
            targets: this,
            y: (this.y - 5),
            yoyo: true,
            delay: 700,
            duration: 500
        });
        this.tweensList?.push(yTween);
        const alphaTween = this.scene.tweens.add({
            targets: this,
            alpha: 1,
            delay: 700,
            duration: 500,
            onComplete: ()=>{
                this.params?.onComplete();
            }
        });
        this.tweensList?.push(alphaTween);
    }

    private reset(){
        this.resetTween();
        this.setAlpha(0);
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

export default TopText;