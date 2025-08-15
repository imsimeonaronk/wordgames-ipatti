import Sounds from "../libs/Sounds";
import { GenerateTaskNumber, ResetFirstVisit, ShouldPromptLogin, UpdateScore } from "../utils/UserPlay";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import ExplodeParticle from "../utils/Particles";
import { Scenes } from "../utils/Scenes";
import { MatchBoxContainer, MatchPointContainer } from "../object/MatchContainer";

class Game3 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game3;
    private fpsText: FpsText | undefined;

    private gameContainer: Phaser.GameObjects.Container | undefined;
    private startGame: boolean = false;
    private endGame: boolean = false;

    private explodeParticle: ExplodeParticle | undefined;

    private currentTask: number = 0;
    private totalTask: number = 0;

    private totalFind: number = 0;
    private matchFound: number = 0;

    private dotRadius: number | undefined;
    private firstDot: any;
    private secondDot: any;
    private matchLine: any;
    private lineWidth = Math.floor(40 * Gvar.scaleRatio);

    private gameScore: number = 0;

    constructor(){
        super({
            key: Scenes.Game3
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
        Gvar.consolelog("Game3 scene created");
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
        this.matchFound = 0;
        this.totalFind = 0;
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

        // Data array
        const count = taskData["RIGHT"].length;
        let rightData: any = [];
        let leftData: any = [];
        for(let i=0; i<count; i++){
            rightData.push([i, taskData["RIGHT"][i]]);
            leftData.push([i, taskData["LEFT"][i]]);
        }
        Phaser.Utils.Array.Shuffle(rightData);
        Phaser.Utils.Array.Shuffle(leftData);

        this.totalFind = count;

        //Game container
        this.gameContainer = this.add.container();
        let leftContainer, leftDotContainer, rightContainer, rightDotContainer

        leftContainer = new MatchBoxContainer(this,{
            direction: "left",
            data: leftData,
            scale: taskData["BOX-SCALE"],
            shape: taskData["LEFT-BOX-SHAPE"],
            space: taskData["V-SPACE"],
            onComplete: ()=>{
                rightContainer!.animate();
            }
        });
        leftContainer.x = Gvar.centerX - Gvar.width * 0.15;
        leftContainer.y = Math.floor(Gvar.height * 0.57) - leftContainer.contentHeight! * 0.5 + leftContainer.boxHeight! * 0.5;
        this.gameContainer.add(leftContainer);

        leftDotContainer = new MatchPointContainer(this,{
            direction: "left",
            data: leftData,
            space: taskData["V-SPACE"],
            boxsize: [leftContainer.boxWidth!, leftContainer.boxHeight!],
            onComplete: ()=>{
                rightDotContainer!.animate();
            }
        });
        leftDotContainer.x = leftContainer.x + leftContainer.boxWidth! * 0.5;
        leftDotContainer.y = leftContainer.y;
        this.gameContainer.add(leftDotContainer);

        rightContainer = new MatchBoxContainer(this,{
            direction: "right",
            data: rightData,
            scale: taskData["BOX-SCALE"],
            shape: taskData["RIGHT-BOX-SHAPE"],
            space: taskData["V-SPACE"],
            onComplete: ()=>{
                leftDotContainer.animate();
            }
        });
        rightContainer.x = Gvar.centerX + Gvar.width * 0.15;
        rightContainer.y = Math.floor(Gvar.height * 0.57) - rightContainer.contentHeight! * 0.5 + rightContainer.boxHeight! * 0.5;
        this.gameContainer.add(rightContainer);

        rightDotContainer = new MatchPointContainer(this,{
            direction: "right",
            data: rightData,
            space: taskData["V-SPACE"],
            boxsize: [rightContainer.boxWidth!, rightContainer.boxHeight!],
            onComplete: ()=>{
                Gvar.consolelog("Match Animate end");
                // Start game play
                this.startGame = true;
                this.interactivelistener(true);
            }
        });
        rightDotContainer.x = rightContainer.x;
        rightDotContainer.y = rightContainer.y;
        this.gameContainer.add(rightDotContainer);

        // Update position
        leftDotContainer.x = leftContainer.x + Math.min((leftContainer.boxWidth! * 0.5),(rightContainer.boxWidth! * 0.5));
        rightDotContainer.x = rightContainer.x - Math.min((leftContainer.boxWidth! * 0.5),(rightContainer.boxWidth! * 0.5));

        this.dotRadius = rightDotContainer.radius;

        // Start game
        setTimeout(()=>{
            leftContainer.animate();
        },500)
    }

    private interactivelistener(flag:boolean){
        //Left Box
        let boxtouch = false, islinedraw = false;
        let leftBoxContainer = this.gameContainer!.list[0] as Phaser.GameObjects.Container;
        leftBoxContainer.iterate((element:any) => {
            if(flag){
                let bounds = { width: element.framewd, height: element.frameht }
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle((0-bounds.width*0.5),(0-bounds.height*0.5),bounds.width,bounds.height), 
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true 
                });
                element.on('pointerdown',()=>{
                    if(this.startGame){
                        boxtouch = true;
                    }
                });
                element.on('pointermove',()=>{
                    
                });
                element.on('pointerup',()=>{
                    if(this.startGame){
                        boxtouch = false;
                    }
                });
            }else{
                element.setInteractive(false);
                element.input.cursor = 'default';
            }
        });
        //Right Box
        let rightBoxContainer = this.gameContainer!.list[2] as Phaser.GameObjects.Container;
        rightBoxContainer.iterate((element:any) => {
            if(flag){
                let bounds = { width: element.framewd, height: element.frameht }
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle((0-bounds.width*0.5),(0-bounds.height*0.5),bounds.width,bounds.height), 
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true 
                });
                element.on('pointerdown',()=>{
                    if(this.startGame){
                        boxtouch = true;
                    }
                });
                element.on('pointermove',()=>{
                    
                });
                element.on('pointerup',()=>{
                    if(this.startGame){
                        boxtouch = false;
                    }
                });
            }else{
                element.setInteractive(false);
                element.input.cursor = 'default';
            }
        });
        //Left Dot
        let leftPointContainer = this.gameContainer!.list[1] as Phaser.GameObjects.Container;
        leftPointContainer.iterate((element:any) => {
            if(flag){
                let bounds = this.dotRadius! * 2;
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle(0,0,bounds,bounds), 
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true 
                });
            }else{
                element.setInteractive(false);
                element.input.cursor = 'default';
            }
        });
        //Right Dot
        let rightPointContainer = this.gameContainer!.list[3] as Phaser.GameObjects.Container;
        rightPointContainer.iterate((element:any) => {
            if(flag){
                let bounds = this.dotRadius! * 2;
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle(0,0,bounds,bounds), 
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true 
                });
            }else{
                element.setInteractive(false);
                element.input.cursor = 'default';
            }
        });
        //Stage Draw
        this.input.on('pointerdown',(pointer: any, gameObject: any, event: any)=>{
            if(this.startGame && !boxtouch){
                if(gameObject.length > 0){
                    if(this.firstDot === null || this.firstDot === undefined){
                        this.firstDot = gameObject[0];
                    }
                    islinedraw = false;
                }
            }
        });

        this.input.on('pointermove',(pointer: any, gameObject: any, event: any)=>{
            if(this.startGame && !boxtouch){
                if(this.firstDot){
                    this.drawLine({
                        x: pointer.x, 
                        y: pointer.y
                    });
                    islinedraw = true;
                }
            }
        });

        this.input.on('pointerup',(pointer: any, gameObject: any)=>{
            if(this.startGame && !boxtouch && islinedraw){
                let drawflag = false;
                if(gameObject.length > 0){
                    let edata = gameObject[0].getData('box-index');
                    if(this.firstDot != null){
                        let fdata = this.firstDot.getData('box-index');
                        if(fdata != gameObject[0]){
                            if(fdata === edata){
                                drawflag = true;
                                this.secondDot = gameObject[0];
                            }
                        }
                    }
                }
                //Draw final line
                if(drawflag){
                    this.explodeParticle?.explode(pointer);
                    window.Sounds.play("general","correct",()=>{
                        this.checkresult();
                    });
                    let sdata = this.secondDot!.getData('box-position');
                    this.drawFinalLine({
                        x: sdata.x, 
                        y: sdata.y
                    });
                    this.matchFound = this.matchFound + 1;
                }else{
                    this.clearLine(true);
                    window.Sounds.play("general","wrong",()=>{});
                }
                boxtouch = false;
                islinedraw = false;
            }
        });
    }

    private drawLine(pointer: any){
        if(this.firstDot){
            this.clearLine(false);
            let fbound = this.firstDot!.getBounds();
            this.matchLine = this.add.line(
                0,0,
                fbound.x + this.dotRadius, 
                fbound.y + this.dotRadius, 
                pointer.x, 
                pointer.y
            ).setOrigin(0);
            this.matchLine.setLineWidth(this.lineWidth, this.lineWidth);
            this.matchLine.setStrokeStyle(this.lineWidth, 0x00ff00, 0.75);
        }
    }

    private drawFinalLine(pointer: any){
        if(this.firstDot && this.secondDot){
            this.clearLine(false);
            let fbound = this.firstDot.getBounds();
            let sbound = this.secondDot.getBounds();
            let fline = this.add.line(
                0,0,
                fbound.x + this.dotRadius, 
                fbound.y + this.dotRadius, 
                sbound.x + this.dotRadius, 
                sbound.y + this.dotRadius
            ).setOrigin(0);
            fline.setLineWidth(this.lineWidth, this.lineWidth);
            fline.setStrokeStyle(this.lineWidth, 0x0000ff, 0.75);
            this.gameContainer!.add(fline);
        }
        this.clearLine(true);
    }

    private clearLine(flag: boolean = false){
        if(this.matchLine){
            this.matchLine.destroy();
        }
        //Reset obj
        if(flag){
            this.firstDot = undefined;
            this.secondDot = undefined;
        }
    }

    private checkresult(){
        if(this.matchFound < this.totalFind)
            return;
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

export default Game3;