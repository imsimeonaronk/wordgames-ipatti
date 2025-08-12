import { Colors } from "../utils/Colors";
import { Gvar } from "../utils/Gvar";
import { TextStyle } from "../utils/TextStyle";

interface WordBoxParsms{
    type: string,
    text: string,
    currenttext: string
}

class WordBox extends Phaser.GameObjects.Container{

    private tweensList: Phaser.Tweens.Tween [] | undefined;

    constructor(scene:Phaser.Scene, params:WordBoxParsms){
        super(scene);
        scene.add.existing(this);
        this.init(params);
    }
    
    private init(params:WordBoxParsms){
        this.tweensList = [];
        const fontsize = Math.floor(Math.min(Gvar.width * 0.04, Gvar.height * 0.04) * Gvar.scaleRatio)
        const emptywidth = Math.min(Math.floor(Gvar.width * 0.4 * Gvar.scaleRatio), Math.floor(Gvar.height * 0.4 * Gvar.scaleRatio))//(label.displayWidth + 5);
        let label, line, shape, emptylabel;
        let shapewidth, shapeheight, shaperadius;
        let shapestroke

        switch(params.type){
            case "line-box":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);
                label.setFill(Colors[`Game-${Gvar.GameData.Id}`]["Sentence"]);

                emptylabel = this.scene.add.text(0, 0, "?", TextStyle["word-box"]).setOrigin(0.5);
                emptylabel.setFontSize(fontsize).setVisible(false);
                emptylabel.setFill(Colors[`Game-${Gvar.GameData.Id}`]["Empty"]);

                shapewidth = (params.currenttext == "_") ? emptywidth : (label.displayWidth + 5);
                shapeheight = (params.currenttext == "_") ? Math.floor(fontsize * 2) : Math.floor(fontsize * 1.5);
                shapestroke = Math.min(shapewidth, shapeheight) / 12;

                shape = this.scene.add.rectangle(0, 0, shapewidth, shapeheight)
                shape.setFillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Line"]).setOrigin(0.5).setVisible(false);

                line = this.scene.add.rectangle(0, 0, shapewidth, shapestroke)
                line.setFillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Line"]).setOrigin(0.5).setVisible(false);
                line.y = shape.y + shape.height * 0.5

                this.add(shape);
                this.add(line);
                this.add(label);
                this.add(emptylabel);

                // Check empty box
                if(params.currenttext == "_"){
                    label.setVisible(false);
                    emptylabel.setVisible(true);
                    line.setVisible(true);
                }

                // Set Data
                this.setData('box-type',params.type);
                this.setData('box-text',params.text.toString());
                this.setData('box-empty',(params.currenttext == "_"));
                this.setData('box-bounds',{width: shape.width, height: shape.height});
            break;
            case "empty-box-rectangle":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);
                label.setFill(Colors[`Game-${Gvar.GameData.Id}`]["Word"]);

                emptylabel = this.scene.add.text(0, 0, "?", TextStyle["word-box"]).setOrigin(0.5);
                emptylabel.setFontSize(fontsize).setVisible(false);
                emptylabel.setFill(Colors[`Game-${Gvar.GameData.Id}`]["Empty-Text"]);

                shapewidth = emptywidth;
                shapeheight = Math.floor(fontsize * 2);
                shaperadius = Math.min(shapewidth, shapeheight) / 10;
                shapestroke = Math.min(shapewidth, shapeheight) / 20;

                shape = this.scene.add.graphics();
                shape.fillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Empty-Box"]);
                shape.lineStyle(shapestroke,Colors[`Game-${Gvar.GameData.Id}`]["Empty-Box-Line"]);
                shape.fillRoundedRect((-1 * shapewidth * 0.5), (-1 * shapeheight * 0.5), shapewidth, shapeheight, shaperadius);
                shape.strokeRoundedRect((-1 * shapewidth * 0.5), (-1 * shapeheight * 0.5), shapewidth, shapeheight, shaperadius);

                this.add(shape);
                this.add(label);
                this.add(emptylabel);

                // Check empty box
                if(params.currenttext == "_"){
                    label.setVisible(false);
                    emptylabel.setVisible(true);
                }

                //Reset for animation
                this.setAlpha(0);

                // Set Data
                this.setData('box-type',params.type);
                this.setData('box-text',params.text.toString());
                this.setData('box-bounds',{width: shapewidth, height: shapeheight});
            break;
            case "option-box-rectangle":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);
                label.setFill(Colors[`Game-${Gvar.GameData.Id}`]["Word"]);

                shapewidth = emptywidth;
                shapeheight = Math.floor(fontsize * 2);
                shaperadius = Math.min(shapewidth, shapeheight) / 10;
                shapestroke = Math.min(shapewidth, shapeheight) / 20;

                shape = this.scene.add.graphics();
                shape.fillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Options-Box"]);
                shape.lineStyle(shapestroke,Colors[`Game-${Gvar.GameData.Id}`]["Options-Box-Line"]);
                shape.fillRoundedRect((-1 * shapewidth * 0.5), (-1 * shapeheight * 0.5), shapewidth, shapeheight, shaperadius);
                shape.strokeRoundedRect((-1 * shapewidth * 0.5), (-1 * shapeheight * 0.5), shapewidth, shapeheight, shaperadius);

                this.add(shape);
                this.add(label);

                // Set Data
                this.setData('box-type',params.type);
                this.setData('box-text',params.text.toString());
                this.setData('box-bounds',{width: shapewidth, height: shapeheight});
            break;
        }
    }

    public reform(listener:Function){
        const fontsize = Math.floor(Math.min(Gvar.width * 0.05, Gvar.height * 0.05) * Gvar.scaleRatio)
        const boxtype = this.getData('box-type');
        let label, emptylabel, line;

        switch(boxtype){
            case "line-box":
                label = this.getAt(2) as Phaser.GameObjects.Text;
                emptylabel = this.getAt(3) as Phaser.GameObjects.Text;
                line = this.getAt(1) as Phaser.GameObjects.Rectangle;
                line.setVisible(false);
                emptylabel.setVisible(false);
                label.setVisible(true);
                this.animate(label, boxtype, listener);
            break;
            case "empty-box-rectangle":
                this.animate(this, boxtype, listener);
            break;
        }
    }

    private animate(obj:Phaser.GameObjects.GameObject, boxtype: string, listener:Function){
        if(!obj)return;
        switch(boxtype){
            case "line-box":
                this.reset(false);
                this.scene.tweens.add({
                    targets: obj,
                    scale: 1.2,
                    yoyo: true,
                    delay: 500,
                    duration: 500,
                    onComplete: ()=>{
                        listener();
                    }
                });
            break;
            case "empty-box-rectangle":
                this.reset(true);
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
                        listener();
                    }
                });
                this.tweensList?.push(alphaTween);
            break;
        }
    }

    private reset(flag:boolean){
        this.resetTween();
        if(flag)
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

export default WordBox;