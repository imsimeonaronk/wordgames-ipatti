import { lsGetItem, lsRemoveItem, lsSetItem } from "../../utils/LocalStorage";
import Sounds from "../libs/Sounds";
import { UpdateScore } from "../libs/UserPlay";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import LineContainer from "../object/LineContainer";
import OptionsContainer from "../object/OptionsContainer";
import WordBox from "../object/WordBox";
import { Gvar } from "../utils/Gvar";
import { Scenes } from "../utils/Scenes";

class Game1 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game1;
    private fpsText: FpsText | undefined;

    private gameContainer: Phaser.GameObjects.Container | undefined;
    private startGame: boolean = false;
    private endGame: boolean = false;

    private gameScore: number = 0;

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
        window.Sounds = new Sounds(this);
        window.Sounds.load('general');

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
        this.startGame = false;
        this.endGame = false;
        this.gameScore = 0;
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
        let lineContainer, optionsContainer, sentenceContainer;

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

        //Complete Line
        sentenceContainer = new LineContainer(this,{
            sentence: finalsentence,
            finalsentence: finalsentence,
            answer: taskData["ANSWER"],
            onComplete: ()=>{
                
            }
        });
        sentenceContainer.setVisible(false);
        sentenceContainer.x = Gvar.centerX - sentenceContainer.getBounds().width * 0.5 + sentenceContainer.space;
        sentenceContainer.y = Math.floor(Gvar.height * 0.25) + sentenceContainer.space;
        this.gameContainer.add(sentenceContainer);

        //Options
        optionsContainer = new OptionsContainer(this,{
            shape: "rectangle",
            text: taskData["OPTIONS"],
            onComplete: ()=>{
                Gvar.consolelog("Option Animate end");
                // Start game play
                this.startGame = true;
                this.interactivelistener(true);
            }
        })
        optionsContainer.x = Gvar.centerX - optionsContainer.contentWidth 
        optionsContainer.y = Math.floor(Gvar.height * 0.72) //Math.floor(Gvar.height * 0.75)
        this.gameContainer.add(optionsContainer);

        // Start game
        setTimeout(()=>{
            lineContainer.animate();
            sentenceContainer.animate();
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
        const sentenceContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(1) as Phaser.GameObjects.Container;
        const optionContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(2) as Phaser.GameObjects.Container;

        //Drop Zone
        lineContainer.iterate((element:any) => {
            const isempty = element.getData("box-empty");
            if(!isempty) return;
            if(flag){
                let bounds = element.getBounds();
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle((0),(0-bounds.height*0.5),bounds.width,bounds.height), 
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    dropZone: true
                });
            }else{
                element.setInteractive(false);
                element.input.dropZone = false;
            }
        });

        //Drag Zone
        optionContainer.iterate((element:any) => {
            if(flag){
                let bounds = element.getBounds();
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle((0-bounds.width*0.5),(0-bounds.height*0.5),bounds.width,bounds.height), 
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    draggable: true,
                    useHandCursor: true 
                });
                element.on('dragstart',(pointer:any, dragX:any, dragY:any)=>{
                    if(!this.startGame) return;
                    window.Sounds.play("general","pick",()=>{});
                }, this);
                element.on('drag',(pointer:any, dragX:any, dragY:any)=>{
                    if(!this.startGame) return;
                    element.setPosition(dragX, dragY);
                    element.parentContainer.bringToTop(element);
                }, this);
                element.on('dragend',(pointer:any, dragX:any, dragY:any)=>{
                    if(!this.startGame) return;
                    let posdata = element.getData('box-position');
                    element.x = posdata.x;
                    element.y = posdata.y;
                }, this);
                element.on('drop',(pointer:any, dropZone:any)=>{
                    if(!this.startGame) return;
                    let dpdata:WordBox = dropZone.getData('box-text');
                    let eldata:WordBox = element.getData('box-text');
                    if(dpdata == eldata){
                        window.Sounds.play("general","correct",()=>{
                            this.startGame = false // Disable game start
                        });
                        dropZone.reform(()=>{
                            setTimeout(()=>{
                                sentenceContainer.setVisible(true);
                                lineContainer.setVisible(false);
                                this.checkresult();
                            },500);
                        });
                    }else{
                        window.Sounds.play("general","wrong",()=>{});
                    }
                }, this);
            }else{
                element.setInteractive(false);
                element.input.draggable = false;
                element.input.cursor = 'default';
            }
        });
    }

    private checkresult(){
        this.endGame = true;
        this.gameScore ++; //Game Score increment
        UpdateScore();
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