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
        const fontsize = Math.min(Gvar.width * 0.05, Gvar.height * 0.05) * Gvar.scaleRatio
        let label, line, shape;
        
        let shapewidth, shapeheight, shaperadius;
        let shapestroke

        switch(params.type){
            case "line-box":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);

                shapewidth = (label.displayWidth + 5);
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

                // Check empty box
                if(params.currenttext == "_"){
                    label.setText("?");
                    line.setVisible(true);
                }

                // Set Data
                this.setData('box-empty',(params.currenttext == "_"));
                this.setData('box-text',params.text.toString());
                this.setData('box-bounds',{width: shape.width, height: shape.height});
            break;
            case "option-box-rectangle":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);
                label.setFill("#ffffff");

                shapewidth = Math.min(Math.floor(Gvar.width * 0.4 * Gvar.scaleRatio), Math.floor(Gvar.height * 0.4 * Gvar.scaleRatio))//(label.displayWidth + 5);
                shapeheight = Math.floor(fontsize * 1.5);
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
                this.setData('box-text',params.text.toString());
                this.setData('box-bounds',{width: shapewidth, height: shapeheight});
            break;
        }
    }
}

export default WordBox;