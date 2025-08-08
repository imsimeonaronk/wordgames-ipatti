import FpsText from "../object/FPS";
import FlatPreloadBar from "../object/Preloader";
import { Assets } from "../utils/Assets";
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
        
        //Load Images
        this.load.path = "assets/images/";
        for(const key in Assets.Images){
            this.load.image(Assets.Images[key][0],Assets.Images[key][1])
        }

        //Load Sprites
        this.load.path = "assets/sprite/";
        for(const key in Assets.Sprites){
            this.load.atlas(Assets.Sprites[key][0],Assets.Sprites[key][1],Assets.Sprites[key][2])
        }

        //Load Fonts
        this.load.path = "assets/fonts/bitmap/";
        for(const key in Assets.Fonts){
            this.load.bitmapFont(Assets.Fonts[key][0],Assets.Fonts[key][1],Assets.Fonts[key][2])
        }

        //Load Sounds
        this.load.path = "assets/audio/sfx/";
        for(const key in Assets.Sounds){
            this.load.audio(Assets.Sounds[key][0],Assets.Sounds[key][1],Assets.Sounds[key][2]);
        }

        //Load Videos
        this.load.path = "assets/video/";
        for(const key in Assets.Videos){
            this.load.video(Assets.Videos[key][0],Assets.Videos[key][1],Assets.Videos[key][2])
        }

        //Preload JSON Data
        const gameData = this.cache.json.get('game-data');
        Object.keys(gameData).forEach((element:any)=>{
            const taskData = gameData[element];
            switch(Gvar.GameData.Id){
                case 1:
                    Gvar.consolelog("Preload Game 1 Data");
                    this.loadimage(taskData["IMAGE"]);
                    this.loadaudio(taskData["IMAGE-AUDIO"]);
                    this.loadaudio(taskData["SENTENCE-AUDIO"]);
                    if(taskData["OPTIONS-AUDIO"]){
                        taskData["OPTIONS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["OPTIONS-AUDIO"][option]);
                        });
                    }
                break;
                case 2:
                    Gvar.consolelog("Preload Game 2 Data");
                    this.loadimage(taskData["IMAGE"]);
                    this.loadaudio(taskData["IMAGE-AUDIO"]);
                    this.loadaudio(taskData["ENG-WORD-AUDIO"]);
                    if(taskData["OPTIONS-AUDIO"]){
                        taskData["OPTIONS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["OPTIONS-AUDIO"][option]);
                        });
                    }
                break;
                case 3:
                    Gvar.consolelog("Preload Game 3 Data");
                    if(taskData["LEFT"]){
                        taskData["LEFT"].forEach((option:any) => {
                            this.loadimage(option["IMAGE"]);
                            this.loadaudio(option["AUDIO"]);
                        });
                    }
                    if(taskData["RIGHT"]){
                        taskData["RIGHT"].forEach((option:any) => {
                            this.loadimage(option["IMAGE"]);
                            this.loadaudio(option["AUDIO"]);
                        });
                    }
                break;
                case 4:
                    Gvar.consolelog("Preload Game 4 Data");
                    this.loadaudio(taskData["WORD-AUDIO"]);
                    if(taskData["OPTIONS-AUDIO"]){
                        taskData["OPTIONS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["OPTIONS-AUDIO"][option]);
                        });
                    }
                    if(taskData["OPTIONS-IMAGE"]){
                        taskData["OPTIONS-IMAGE"].forEach((option:any) => {
                            this.loadimage(taskData["OPTIONS-IMAGE"][option]);
                        });
                    }
                break;
                case 5:
                    Gvar.consolelog("Preload Game 5 Data");
                    this.loadaudio(taskData["SENTENCE-AUDIO"]);
                    this.loadaudio(taskData["ENGLISH-SENTENCE-AUDIO"]);
                break;
                case 6:
                    Gvar.consolelog("Preload Game 6 Data");
                    this.loadimage(taskData["IMAGE"]);
                    this.loadaudio(taskData["IMAGE-AUDIO"]);
                    this.loadaudio(taskData["SENTENCE-AUDIO"]);
                    if(taskData["OPTIONS-AUDIO"]){
                        taskData["OPTIONS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["OPTIONS-AUDIO"][option]);
                        });
                    }
                break;
                case 7:
                    Gvar.consolelog("Preload Game 7 Data");
                    this.loadaudio(taskData["TEXT-AUDIO"]);
                    if(taskData["OPTIONS-AUDIO"]){
                        taskData["OPTIONS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["OPTIONS-AUDIO"][option]);
                        });
                    }
                break;
                case 8:
                    Gvar.consolelog("Preload Game 8 Data");
                    if(taskData["ANSWER-AUDIO"]){
                        taskData["ANSWER-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["ANSWER-AUDIO"][option]);
                        });
                    }
                    if(taskData["IMAGE"]){
                        taskData["IMAGE"].forEach((option:any) => {
                            this.loadimage(taskData["IMAGE"][option]);
                        });
                    }
                break;
                case 9:
                    Gvar.consolelog("Preload Game 9 Data");
                    if(taskData["OPTIONS-AUDIO"]){
                        taskData["OPTIONS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["OPTIONS-AUDIO"][option]);
                        });
                    }
                    if(taskData["ANSWER-AUDIO"]){
                        taskData["ANSWER-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["ANSWER-AUDIO"][option]);
                        });
                    }
                break;
                case 10:
                    Gvar.consolelog("Preload Game 10 Data");
                    if(taskData["WORDS-AUDIO"]){
                        taskData["WORDS-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["WORDS-AUDIO"][option]);
                        });
                    }
                break;
                case 11:
                    Gvar.consolelog("Preload Game 11 Data");
                    this.loadaudio(taskData["AUDIO"]);
                break;
                case 12:
                    Gvar.consolelog("Preload Game 12 Data");
                    if(taskData["ANSWER-AUDIO"]){
                        taskData["ANSWER-AUDIO"].forEach((option:any) => {
                            this.loadaudio(taskData["ANSWER-AUDIO"][option]);
                        });
                    }
                    if(taskData["IMAGE"]){
                        taskData["IMAGE"].forEach((option:any) => {
                            this.loadimage(taskData["IMAGE"][option]);
                        });
                    }
                break;
            }
        });
    }

    create(){
        Gvar.consolelog("Preload scene created");
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

    private loadaudio(name:string){
        if(!name) return;
        this.load.path = "assets/audio/game/";
        this.load.audio(Gvar.fileextension(name),name);
    }

    private loadimage(name:string){
        if(!name) return;
        this.load.path = "assets/image/game/";
        this.load.image(Gvar.fileextension(name),name);
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