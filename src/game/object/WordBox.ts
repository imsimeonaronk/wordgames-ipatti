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
        const fontsize = Math.min(Gvar.width * 0.035, Gvar.height * 0.035)
        let label, line, shape;
        let shapewidth, shapeheight;

        switch(params.type){
            case "line-box":
                label = this.scene.add.text(0, 0, params.text.toString(), TextStyle["word-box"]).setOrigin(0.5);
                label.setFontSize(fontsize);

                shape = this.scene.add.rectangle(0, 0, (label.displayWidth + 5), 100)
                shape.setFillStyle(0x67a6b6).setOrigin(0.5).setVisible(false);

                line = this.scene.add.rectangle(0, 0, (label.displayWidth + 5), 10)
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

                shapewidth = Math.min(Math.floor(Gvar.width * 0.3), Math.floor(Gvar.height * 0.3))//(label.displayWidth + 5);
                shapeheight = 100;

                shape = this.scene.add.graphics();
                shape.fillStyle(0xa22626);
                shape.lineStyle(5,0x000000);
                shape.fillRoundedRect((-1 * shapewidth * 0.5), (-1 * shapeheight * 0.5), shapewidth, shapeheight, 20);
                shape.strokeRoundedRect((-1 * shapewidth * 0.5), (-1 * shapeheight * 0.5), shapewidth, shapeheight, 20);

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