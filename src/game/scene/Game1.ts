import { lsGetItem, lsRemoveItem, lsSetItem } from "../../utils/LocalStorage";
import { ssGetItem } from "../../utils/SessionStorage";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Game1 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game1;
    private fpsText: FpsText | undefined;

    constructor(){
        super({
            key: Scenes.Game1
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
        console.log("Game1 scene created");
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