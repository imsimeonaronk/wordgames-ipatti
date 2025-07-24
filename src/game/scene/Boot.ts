import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Boot extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Boot;
    private fpsText: FpsText | undefined;

    constructor(){
        super({
            key: Scenes.Boot
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
        console.log("Boot scene created");

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
        
    }

    private movetoscene(sceneName:string){
        if(!this.sceneClose){
            this.sceneClose = true;
            if(Gvar.orientation == "portrait")
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
        this.scene.remove(Scenes.Boot);
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

export default Boot;