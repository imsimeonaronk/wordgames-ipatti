import { Gvar } from "../utils/Gvar";
import WordBox from "./WordBox";

interface OptionsParams{
    text: string[],
    shape: string,
}

class OptionsContainer extends Phaser.GameObjects.Container{

    public space: number = Math.min(Math.floor(Gvar.width * 0.10),Math.floor(Gvar.height * 0.10));
    public contentWidth: number = 0;

    constructor(scene:Phaser.Scene, params:OptionsParams){
        super(scene);
        scene.add.existing(this);
        this.init(params);
    }

    private init(params:OptionsParams){
        let optionsText = params.text;
        Phaser.Utils.Array.Shuffle(optionsText) // Shuffle text

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
        }
    }
}

export default OptionsContainer;