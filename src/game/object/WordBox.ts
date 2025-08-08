import { Gvar } from "../utils/Gvar";
import { TextStyle } from "../utils/TextStyle";

interface WordBoxParsms{
    type: string,
    text: string,
    currenttext: string
}

class WordBox extends Phaser.GameObjects.Container{
    constructor(scene:Phaser.Scene, params:WordBoxParsms){
        super(scene);
        scene.add.existing(this);
        this.init(params);
    }
    
    private init(params:WordBoxParsms){
        const fontsize = Math.floor(Math.min(Gvar.width * 0.04, Gvar.height * 0.04) * Gvar.scaleRatio)
        const emptywidth = Math.min(Math.floor(Gvar.width * 0.4 * Gvar.scaleRatio), Math.floor(Gvar.height * 0.4 * Gvar.scaleRatio))//(label.displayWidth + 5);
        let label, line, shape, emptylabel;
        let shapewidth, shapeheight, shaperadius;
        let shapestroke

        switch(params.type){
            case "line-box":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);

                emptylabel = this.scene.add.text(0, 0, "?", TextStyle["word-box"]).setOrigin(0.5);
                emptylabel.setFontSize(fontsize).setVisible(false);

                shapewidth = (params.currenttext == "_") ? emptywidth : (label.displayWidth + 5);
                shapeheight = Math.floor(fontsize * 1.5);
                shapestroke = Math.min(shapewidth, shapeheight) / 12;

                shape = this.scene.add.rectangle(0, 0, shapewidth, shapeheight)
                shape.setFillStyle(0x67a6b6).setOrigin(0.5).setVisible(false);

                line = this.scene.add.rectangle(0, 0, shapewidth, shapestroke)
                line.setFillStyle(0x67a6b6).setOrigin(0.5).setVisible(false);
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
            case "option-box-rectangle":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);
                label.setFill("#ffffff");

                shapewidth = emptywidth;
                shapeheight = Math.floor(fontsize * 1.75);
                shaperadius = Math.min(shapewidth, shapeheight) / 10;
                shapestroke = Math.min(shapewidth, shapeheight) / 20;

                shape = this.scene.add.graphics();
                shape.fillStyle(0xa22626);
                shape.lineStyle(shapestroke,0x000000);
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
                this.animate(label, listener);
            break;
        }
    }

    private animate(obj:Phaser.GameObjects.GameObject, listener:Function){
        if(!obj)return;
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
    }

}

export default WordBox;