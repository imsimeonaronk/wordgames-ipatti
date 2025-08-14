import Sounds from "../libs/Sounds";
import { GenerateTaskNumber, ResetFirstVisit, ShouldPromptLogin, UpdateScore } from "../utils/UserPlay";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import ExplodeParticle from "../utils/Particles";
import { Scenes } from "../utils/Scenes";
import OptionsContainer from "../object/OptionsContainer";
import LineContainer from "../object/LineContainer";
import KuralContainer from "../object/KuralContainer";
import { Colors } from "../utils/Colors";
import { Assets } from "../utils/Assets";

class Game11 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game11;
    private fpsText: FpsText | undefined;

    private gameContainer: Phaser.GameObjects.Container | undefined;
    private startGame: boolean = false;
    private endGame: boolean = false;

    private speakerAudio: string = "";

    private correctFound: number = 0;
    private totalFound: number = 0;

    private explodeParticle: ExplodeParticle | undefined;

    private currentTask: number = 0;
    private totalTask: number = 0;

    private gameScore: number = 0;

    constructor(){
        super({
            key: Scenes.Game11
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
        Gvar.consolelog("Game11 scene created");
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
        this.correctFound = 0;
        this.totalFound = 0;
        this.speakerAudio = "";
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
        
        this.totalFound = 7;
        this.speakerAudio = taskData["AUDIO"];

        //Game container
        this.gameContainer = this.add.container();
        let lineContainer, optionsContainer, frame, speaker;
        let sentenceContainer;

        // Line 
        lineContainer = new KuralContainer(this,{
            sentence: (`${taskData["LINE1"]} ${taskData["LINE2"]}`),
            onComplete: ()=>{
                Gvar.consolelog("Line Animate end");
                optionsContainer!.animate();
            }
        });
        const lineWidth = lineContainer.getBounds().width
        const lineHeight = lineContainer.getBounds().height
        
        frame = this.add.rectangle(0, 0, lineWidth + Math.floor(Gvar.width * 0.1), Math.floor(lineHeight * 1.5)).setOrigin(0.5);
        frame.setFillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Text-Frame"]);
        frame.x = Gvar.centerX;
        frame.y = Math.floor(Gvar.height * 0.35);

        lineContainer.x = Gvar.centerX - lineWidth * 0.5 + lineContainer.space;
        lineContainer.y = Math.floor(frame.y) - frame.displayHeight * 0.25 + lineContainer.space //Gvar.centerY + lineContainer.space - lineContainer.getBounds().height * 0.5 ;

        speaker = this.add.image(0, 0, Assets.Images["speakerbtn"][0]).setOrigin(0.5)
        speaker.setScale(Math.min((Gvar.width * 0.1)/speaker.width,(Gvar.height * 0.1)/speaker.height) * Gvar.scaleRatio)
        speaker.x = frame.x;
        speaker.y = frame.y - frame.displayHeight * 0.5;

        this.gameContainer.add(frame);
        this.gameContainer.add(speaker);
        this.gameContainer.add(lineContainer);

        //Options
        const optionsData = [...taskData["LINE1"].split(" "), ...taskData["LINE2"].split(" ")];
        optionsContainer = new OptionsContainer(this,{
            shape: "option-box-rectangle",
            text: optionsData,
            onComplete: ()=>{
                Gvar.consolelog("Option Animate end");
                // Start game play
                this.startGame = true;
                this.interactivelistener(true);
            }
        });
        optionsContainer.x = Gvar.centerX - optionsContainer.contentWidth * 0.5
        optionsContainer.y = Math.floor(Gvar.height * 0.7) //Math.floor(Gvar.height * 0.75)
        this.gameContainer?.add(optionsContainer);

        // Start game
        setTimeout(()=>{
            lineContainer.animate();
        },500)
        
    }

    private interactivelistener(flag:boolean){
        const speaker: Phaser.GameObjects.Image = this.gameContainer?.getAt(1) as Phaser.GameObjects.Image;
        const lineContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(2) as Phaser.GameObjects.Container;
        const optionContainer: Phaser.GameObjects.Container = this.gameContainer?.getAt(3) as Phaser.GameObjects.Container;

        //Speaker
        if(flag){
            speaker.setInteractive({useHandCursor: true});
            speaker.on("pointerdown",(pointer:any, dragX:any, dragY:any)=>{
                if(this.speakerAudio){
                    this.sound.stopByKey(Gvar.fileextension(this.speakerAudio));
                    this.sound.play(Gvar.fileextension(this.speakerAudio));
                }
            });
        }else{
            speaker.removeInteractive();
        }

        //Drop Zone
        lineContainer.iterate((element:any) => {
            const isempty = element.getData("box-empty");
            if(!isempty) return;
            if(flag){
                let bounds = element.getData("box-bounds");
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle((0-bounds.width*0.5),(0-bounds.height*0.5),bounds.width,bounds.height), 
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
                    let dpdata:string = dropZone.getData('box-text');
                    let eldata:string = element.getData('box-text');
                    Gvar.consolelog(dpdata+"  -  "+eldata);
                    if(dpdata == eldata){
                        this.correctFound ++;
                        this.explodeParticle?.explode(pointer);
                        window.Sounds.play("general","correct",()=>{
                            
                        });
                        dropZone.reform(()=>{
                            setTimeout(()=>{
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
        if(this.correctFound < this.totalFound)
            return;
        this.startGame = false // Disable game start
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

export default Game11;