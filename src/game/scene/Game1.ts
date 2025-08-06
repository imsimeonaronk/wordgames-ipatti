import { lsGetItem, lsRemoveItem, lsSetItem } from "../../utils/LocalStorage";
import { ssGetItem } from "../../utils/SessionStorage";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import LineContainer from "../object/LineContainer";
import OptionsContainer from "../object/OptionsContainer";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Game1 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game1;
    private fpsText: FpsText | undefined;

    private gameContainer: Phaser.GameObjects.Container | undefined;

    constructor(){
        super({
            key: Scenes.Game1
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
        Gvar.consolelog("Game1 scene created");
        this.createscene();
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
    }

    private createscene(){
        const data = this.cache.json.get("game-data");
        const taskNumber = this.generatetasknumber(Object.keys(data).length);
        const taskData = data[`TASK${taskNumber}`];
        
        //Task details
        Gvar.consolelog("Task :"+taskNumber)
        Gvar.consolelog(taskData)
        
        //Final sentence
        const sentence:string = taskData["SENTENCE"].replace("_",taskData["ANSWER"]);
        let finalsentence = sentence.trim();
        if(!finalsentence.endsWith(".")){
            finalsentence = finalsentence + ".";
        }
        Gvar.consolelog(finalsentence)

        //Game container
        this.gameContainer = this.add.container();
        let lineContainer, optionsContainer;

        //Line
        lineContainer = new LineContainer(this,{
            sentence: taskData["SENTENCE"],
            finalsentence: finalsentence,
            answer: taskData["ANSWER"],
            onComplete: ()=>{
                Gvar.consolelog("Line Animate end");
                optionsContainer!.animate();
            }
        });
        lineContainer.x = Gvar.centerX - lineContainer.getBounds().width * 0.5 + lineContainer.space;
        lineContainer.y = Math.floor(Gvar.height * 0.25) + lineContainer.space //Gvar.centerY + lineContainer.space - lineContainer.getBounds().height * 0.5 ;
        this.gameContainer.add(lineContainer);

        //Options
        optionsContainer = new OptionsContainer(this,{
            shape: "rectangle",
            text: taskData["OPTIONS"],
            onComplete: ()=>{
                Gvar.consolelog("Option Animate end");
                this.interactivelistener(true);
            }
        })
        optionsContainer.x = Gvar.centerX - optionsContainer.contentWidth 
        optionsContainer.y = Math.floor(Gvar.height * 0.72) //Math.floor(Gvar.height * 0.75)
        this.gameContainer.add(optionsContainer);

        // Start game
        setTimeout(()=>{
            lineContainer.animate();
        },500)
    }

    private generatetasknumber(taskLength:number){
        const playedTask = lsGetItem(`Game-${Gvar.GameData.Id}-level`);
        let currentTask = 1;
        if(!playedTask){
            const totalTask = Array.from({length: taskLength},(_,i)=> i+1);
            const filtered = totalTask.filter((n:any) => n!= currentTask);
            lsSetItem(`Game-${Gvar.GameData.Id}-level`,JSON.stringify(filtered));
        }else{
            const savedTask = JSON.parse(playedTask);
            currentTask = savedTask.splice(0,1)[0];
            const filtered = savedTask.filter((n:any) => n!= currentTask);
            lsSetItem(`Game-${Gvar.GameData.Id}-level`,JSON.stringify(filtered));
            if(!currentTask){ // Loop if there is no task left
                lsRemoveItem(`Game-${Gvar.GameData.Id}-level`);
                currentTask = this.generatetasknumber(taskLength);
            }
        }
        return currentTask
    }

    private interactivelistener(flag:boolean){
        const lineContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(0) as Phaser.GameObjects.Container;
        const optionContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(1) as Phaser.GameObjects.Container;
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

export default Game1;