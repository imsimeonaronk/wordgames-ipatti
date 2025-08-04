import { ssGetItem } from "../../utils/SessionStorage";
import FpsText from "../object/FPS";
import FlatPreloadBar from "../object/Preloader";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Boot extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Boot;
    private fpsText: FpsText | undefined;

    private preloaderBar: FlatPreloadBar | undefined;

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
        this.load.path = "assets/data/";
        this.load.json('game-data',`game-${Gvar.GameData.Id}.json`);

        this.load.path = "assets/image/";
        this.load.image("ipatti-logo","ipatti_logo.png");
    }

    create(){
        console.log("Boot scene created");
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
        this.preloaderBar = new FlatPreloadBar(this);
        this.preloaderBar.setXY(Gvar.centerX, Math.floor(Gvar.height * 0.8));
        this.preloadlistener();
    }

    private preloadlistener(){
        this.load.on('progress', (value:any)=>{
            this.preloaderBar!.progressValue = Math.floor(value * 1);
            this.preloaderBar!.updateValue();
        });
                    
        this.load.on('fileprogress', (file:any)=>{
            
        });

        this.load.on('loaderror', (file:any)=>{

        });

        this.load.on('complete', ()=>{ 
            this.movetoscene(Scenes.Preload);
        });
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