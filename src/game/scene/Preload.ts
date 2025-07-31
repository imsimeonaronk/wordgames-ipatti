import { ssGetItem } from "../../utils/SessionStorage";
import FpsText from "../object/FPS";
import FlatPreloadBar from "../object/Preloader";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Preload extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Preload;
    private fpsText: FpsText | undefined;

    private logo: Phaser.GameObjects.Image | undefined;
    private preloaderBar: FlatPreloadBar | undefined;

    private logoTween: Phaser.Tweens.Tween | undefined;

    constructor(){
        super({
            key: Scenes.Preload
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
        console.log("Preload scene created");
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
        this.logo = this.add.image(0, 0, "ipatti-logo").setOrigin(0.5);
        this.logo.setScale(Math.floor(Gvar.height * 0.25)/this.logo.displayHeight);
        this.logo.x = Gvar.centerX;
        this.logo.y = Gvar.centerY - Math.floor(Gvar.height * 0.1);

        this.preloaderBar = new FlatPreloadBar(this);
        this.preloaderBar.setXY(Gvar.centerX, Math.floor(Gvar.height * 0.8));

        this.initanim();
        this.preloadlistener();
    }

    private initanim(){
        /* Logo Animation */
        this.logoTween = this.tweens.add({
            targets: this.logo,
            y: (this.logo!.y - 50),
            yoyo: true,
            alpha: 0.8,
            loop: -1,
            delay: 500,
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStop: ()=>{
                this.logo!.alpha = 1;
                this.logo!.y = Gvar.centerY - Math.floor(Gvar.height * 0.1);
            }
        });
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
            this.logoTween?.stop();
            setTimeout(()=>{
                this.movetoscene(Scenes[`Game${Gvar.GameData.Id}`]);
            },1000);
        });
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
        this.scene.remove(Scenes.Preload);
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

export default Preload;