import { ssGetItem } from "../../utils/SessionStorage";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Game7 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game7;
    private fpsText: FpsText | undefined;

    constructor(){
        super({
            key: Scenes.Game7
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
        console.log("Game7 scene created");
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

export default Game7;