import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Orientation extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Orientation;
    private fpsText: FpsText | undefined;

    constructor(){
        super({
            key: Scenes.Orientation
        })
    }

    //Basic Function
    init(){
        this.initscene();
        this.createscene();
        this.sceneevent();
    }

    preload(){
        
    }

    create(){
        console.log("Orientation scene created");
        console.log("Game loaded: "+ Gvar.GameData.Id);
        this.fpsText = new FpsText(this);
    }

    update(){
        if(this.fpsText) //FPS
            this.fpsText.update();
    }

    //Other Function
    private initscene(){
        this.sceneClose = false;
    }

    private createscene(){
        let device = this.add.image(0,0,'device-icon').setOrigin(0.5,0.5).setScale(0.4)
        device.x = Gvar.width * 0.5;
        device.y = Gvar.height * 0.5 - device.displayHeight * 0.2;

        let label = this.add.bitmapText(0, 0, 'myriadpro-condense', 'Please rotate your device', Math.round(Gvar.height * 0.025), Phaser.GameObjects.BitmapText.ALIGN_CENTER).setOrigin(0.5);
        label.x = device.x
        label.y = device.y + device.displayHeight * 0.45 + Math.round(Gvar.width * 0.1);

        //Start Animation
        let rotateTween = this.tweens.add({
            targets: device,
            rotation: 90,
            duration: 1000,
            delay: 500,
            repeatDelay: 3000,
            onUpdate:()=>{
                device.setAngle(rotateTween.getValue()!);
            },
            repeat: -1,
            yoyo: true,
            hold: 3000
        });
    }

    private movetoscene(sceneName:string){
        if(!this.sceneClose){
            this.sceneClose = true;
            if(Gvar.orientation.includes("portrait"))
                sceneName = Scenes.Orientation
            this.time.addEvent({
                delay: Gvar.sceneMoveDelay,
                callback: ()=>{
                    this.scene.stop(this.sceneName);
                    this.scene.start(sceneName);
                },
                callbackScope: this
            })
        }
    }

    //Scene Event
    private onscenepause(){

    }

    private onsceneresume(){

    }

    private onsceneclear(){
        this.sound.stopAll();
        this.scene.remove(Scenes.Orientation);
    }

    private onscenedestroy(){
        
    }

    private sceneevent(){
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            this.onsceneclear();
        });

        this.events.once(Phaser.Scenes.Events.DESTROY, ()=>{
            this.onscenedestroy();
        });

        this.events.on(Phaser.Scenes.Events.PAUSE, ()=>{
            this.onscenepause();
        });

        this.events.on(Phaser.Scenes.Events.RESUME, ()=>{
            this.onsceneresume();
        });
    }
}

export default Orientation;