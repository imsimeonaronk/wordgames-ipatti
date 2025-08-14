import Sounds from "../libs/Sounds";
import { GenerateTaskNumber, ResetFirstVisit, ShouldPromptLogin, UpdateScore } from "../utils/UserPlay";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import ExplodeParticle from "../utils/Particles";
import { Scenes } from "../utils/Scenes";
import TopText from "../object/TopText";
import { Colors } from "../utils/Colors";
import WordBox from "../object/WordBox";
import OptionsContainer from "../object/OptionsContainer";

class Game2 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game2;
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
            key: Scenes.Game2
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
        Gvar.consolelog("Game2 scene created");
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
        
        //Game container
        this.gameContainer = this.add.container();
        let topWord, optionsContainer, emptyBox;

        //Word
        topWord = new TopText(this,{
            text: taskData["ENG-WORD"],
            textstyle: "top-text",
            textsize: Math.floor(Math.min(Gvar.width * 0.06, Gvar.height * 0.06) * Gvar.scaleRatio),
            color: Colors["Game-2"]["Top-Word"],
            onComplete: ()=>{
                Gvar.consolelog("Top Text Animate end");
                emptyBox!.reform(()=>{
                    Gvar.consolelog("Empty box Animate end");
                    optionsContainer!.animate()
                });
            }
        });
        topWord.x = Gvar.centerX;
        topWord.y = Math.floor(Gvar.height * 0.25);
        this.gameContainer?.add(topWord);

        emptyBox = new WordBox(this,{
            text: taskData["ANSWER"],
            currenttext: "_",
            type: "empty-box-rectangle"
        });
        emptyBox.x = Gvar.centerX;
        emptyBox.y = Math.floor(Gvar.height * 0.5);
        this.gameContainer?.add(emptyBox);

        //Options
        optionsContainer = new OptionsContainer(this,{
            shape: "option-box-rectangle",
            text: taskData["OPTIONS"],
            onComplete: ()=>{
                Gvar.consolelog("Option Animate end");
                // Start game play
                this.startGame = true;
                this.interactivelistener(true);
            }
        })
        optionsContainer.x = Gvar.centerX - optionsContainer.contentWidth * 0.5
        optionsContainer.y = Math.floor(Gvar.height * 0.75) //Math.floor(Gvar.height * 0.75)
        this.gameContainer?.add(optionsContainer);

        //Update scale value
        const labelScale = optionsContainer.list[0].getData('box-text-scale');
        const emptyLabel = emptyBox.list[1] as Phaser.GameObjects.Text;
        emptyLabel.setScale(labelScale);

        // Start game
        setTimeout(()=>{
            topWord.animate();
        },500)

    }

    private interactivelistener(flag:boolean){
        const emptyBox: WordBox = this.gameContainer?.getAt(1) as WordBox;
        const optionContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(2) as Phaser.GameObjects.Container;

        //Drop Zone
        if(flag){
            let bounds = emptyBox.getData('box-bounds');
            emptyBox.setInteractive({
                hitArea: new Phaser.Geom.Rectangle((0-bounds.width*0.5),(0-bounds.height*0.5),bounds.width,bounds.height), 
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                dropZone: true
            });
        }else{
            emptyBox.setInteractive(false);
            emptyBox.input!.dropZone = false;
        }

        //Drag Zone
        optionContainer.iterate((element:any) => {
            if(flag){
                let bounds = element.getData("box-bounds");
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
                element.on('drop',(pointer:Phaser.Input.Pointer, dropZone:any)=>{
                    if(!this.startGame) return;
                    let dpdata:WordBox = dropZone.getData('box-text');
                    let eldata:WordBox = element.getData('box-text');
                    Gvar.consolelog(dpdata+"  -  "+eldata);
                    if(dpdata == eldata){
                        this.explodeParticle?.explode(pointer);
                        window.Sounds.play("general","correct",()=>{
                            this.startGame = false // Disable game start
                        });
                        dropZone.list[1].setText(dpdata);
                        dropZone.list[1].visible = true;
                        dropZone.list[2].visible = false;
                        setTimeout(()=>{
                            this.checkresult();
                        },500);
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

export default Game2;