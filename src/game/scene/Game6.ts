import Sounds from "../libs/Sounds";
import { GenerateTaskNumber, ResetFirstVisit, ShouldPromptLogin, UpdateScore } from "../utils/UserPlay";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import ExplodeParticle from "../utils/Particles";
import { Scenes } from "../utils/Scenes";

class Game6 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game6;
    private fpsText: FpsText | undefined;

    private gameContainer: Phaser.GameObjects.Container | undefined;
    private startGame: boolean = false;
    private endGame: boolean = false;

    private explodeParticle: ExplodeParticle | undefined;

    private currentTask: number = 0;
    private totalTask: number = 0;

    private gameScore: number = 0;

    constructor(){
        super({
            key: Scenes.Game6
        })
    }

    //Basic Function
    init(){
        this.initscene();
        this.sceneevent();
    }

    preload(){

    }

    create(){
        Gvar.consolelog("Game6 scene created");
        window.Sounds = new Sounds(this);
        window.Sounds.load('general');

        this.createscene();

        this.explodeParticle = new ExplodeParticle(this);
        this.explodeParticle.init();

        const center = new Center(this);

        this.fpsText = new FpsText(this);
    }

    update(){
        if(this.fpsText) //FPS
            this.fpsText.update();
    }

    //Other Function
    private initscene(){
        this.sceneClose = false;
        this.startGame = false;
        this.endGame = false;
        this.gameScore = 0;
        this.currentTask = 0;
        this.totalTask = 0;
    }

    private createscene(){
        const data = this.cache.json.get("game-data");
        const taskNumber = GenerateTaskNumber(Object.keys(data).length);
        const taskData = data[`TASK${taskNumber}`];
        
        //Task details
        Gvar.consolelog("Task :"+taskNumber)
        Gvar.consolelog(taskData)

        this.currentTask = taskNumber;
        this.totalTask = Object.keys(data).length;
        
        
    }

    private interactivelistener(flag:boolean){
        
    }

    private checkresult(){
        this.endGame = true;
        this.gameScore ++; //Game Score increment
        // Send score to firebase leaderboard
        UpdateScore();
        // Check for login
        const loginPrompt = ShouldPromptLogin();
        if(loginPrompt){
            ResetFirstVisit();
            if(window.openLoginBoard){
                window.openLoginBoard();
            }
        }
        //Load Next Task
        setTimeout(()=>{
            this.loadnexttask();
        },500)
    }

    private loadnexttask(){
        this.scene.restart();
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
        this.explodeParticle?.clear();
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

export default Game6;