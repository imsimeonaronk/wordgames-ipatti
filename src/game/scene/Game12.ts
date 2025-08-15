import Sounds from "../libs/Sounds";
import { GenerateTaskNumber, ResetFirstVisit, ShouldPromptLogin, UpdateScore } from "../utils/UserPlay";
import Center from "../object/Center";
import FpsText from "../object/FPS";
import { Gvar } from "../utils/Gvar";
import ExplodeParticle from "../utils/Particles";
import { Scenes } from "../utils/Scenes";
import { TextStyle } from "../utils/TextStyle";
import { Colors } from "../utils/Colors";

class Game12 extends Phaser.Scene{

    private sceneClose: boolean = false;
    private sceneName: string = Scenes.Game12;
    private fpsText: FpsText | undefined;

    private gameContainer: Phaser.GameObjects.Container | undefined;
    private startGame: boolean = false;
    private endGame: boolean = false;

    private explodeParticle: ExplodeParticle | undefined;

    private gridWords: string[] | undefined;
    private boxSize: number | undefined;
    private boxSpace: number | undefined;
    private gridRow: number = 0;
    private gridColumn: number = 0;
    private gridSize: number = 0;

    private gridShuffledData: any;
    private gridPositions: {grid: number[], container: Phaser.GameObjects.Container, pos: number[]}[] | undefined;

    private currentTask: number = 0;
    private totalTask: number = 0;

    private gameScore: number = 0;

    constructor(){
        super({
            key: Scenes.Game12
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
        Gvar.consolelog("Game12 scene created");
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
        //
        this.boxSize = Math.floor(20 * Gvar.scaleRatio);
        this.boxSpace = Math.floor(2 * Gvar.scaleRatio);
        this.gridPositions = [];
        this.gridShuffledData = [];
        this.gridRow = 0;
        this.gridColumn = 0;
        this.gridSize = 0;
        this.gridWords = [];
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

        // Data
        let rowValue = Math.sqrt(taskData["GRID"].length);
        let columnValue = rowValue;
        let gridsize = rowValue * columnValue;

        this.gridRow = rowValue;
        this.gridColumn = columnValue;
        this.gridSize = gridsize;
        this.gridWords = taskData['ANSWER'];

        // Game container
        this.gameContainer = this.add.container();
        
        // Box size
        const baseBoxSize = Math.floor(200 * Gvar.scaleRatio);
        const baseBoxSpace = Math.floor(15 * Gvar.scaleRatio);

        let boxSize = baseBoxSize;

        // Height constraint
        const maxBoxHeight = Math.floor(Gvar.height * 0.75);
        const totalBoxHeight = (rowValue * boxSize) + (baseBoxSpace * (rowValue - 1)); // with extra spacing
        if (totalBoxHeight > maxBoxHeight) {
            const adjustedHeight = Math.floor((Gvar.height * 0.75) / (rowValue + 1));
            boxSize = Math.min(boxSize, adjustedHeight);
        }

        // Width constraint
        const maxBoxWidth = Math.floor(Gvar.width * 0.75);
        const totalBoxWidth = (columnValue * boxSize) + (baseBoxSpace * (columnValue - 1));
        if (totalBoxWidth > maxBoxWidth) {
            const adjustedWidth = Math.floor((Gvar.width * 0.75) / (columnValue + 1));
            boxSize = Math.min(boxSize, adjustedWidth);
        }

        this.boxSize = boxSize;
        this.boxSpace = baseBoxSpace;

        // Grid letter
        let gridletter: string[] = [];
        let griddata: string[][] = [];
        let gridx = 0, gridy = 0;
        for (let i = 0; i < gridsize; i++) {
            gridletter[i] = taskData["GRID"][i];
            griddata[i] = [taskData["GRID"][i], gridx, gridy];
            gridx++;
            if ((i + 1) % columnValue == 0) {
                gridx = 0;
                gridy++;
            }
        }

        const boardwidth = Math.ceil(this.boxSize * (rowValue+0.25)) + Math.ceil(this.boxSpace * (rowValue+0.25));
        const boardheight = Math.ceil(this.boxSize * (columnValue+0.25)) + Math.ceil(this.boxSpace * (columnValue+0.25));

        let gridBoard = this.add.container();
            let board = this.add.rectangle(0,0,boardwidth,boardheight).setOrigin(0.5);
            board.setFillStyle(Colors[`Game-${Gvar.GameData.Id}`]["Board"])
            board.setStrokeStyle(5,0x000000)
            gridBoard.add(board);
        gridBoard.x = Gvar.centerX;
        gridBoard.y = Gvar.centerY;
        this.gameContainer?.add(gridBoard);

        let gridHolderContainer = this.add.container();
        let gridSlideContainer = this.add.container();
        let bx = 0, by = 0, space = this.boxSpace, gx = 0, gy = 0;
        let boxWidth = 0, boxHeight = 0;

        for (let v = 0; v < gridletter.length; v++) {
            // Back box holder
            const hbox = this.createBox(this, {
                x: bx,
                y: by,
                type: "option",
                text: "",
                color: "0x3D2314"
            });
            hbox.setData('child-index',v);
            hbox.setData('grid-index',[gx, gy]);
            gridHolderContainer.add(hbox);

            // Grid positions
            this.gridPositions!.push({ grid: [gx, gy], container: hbox, pos:[bx, by] });

            //Text box
            if(gridletter[v] !== "-"){
                const tbox = this.createBox(this, {
                    x: bx,
                    y: by,
                    type: "option",
                    text: gridletter[v],
                });
                tbox.setData('child-index',v);
                tbox.setData('grid-index',[gx, gy]);
                tbox.setData('org-grid-index',[gx, gy]);
                gridSlideContainer.add(tbox);
            }

            if (boxWidth === 0) {
                boxWidth = hbox.getData('bounds').width;
                boxHeight = hbox.getData('bounds').height;
            }

            bx += boxWidth + space;
            gx ++;
            if ((v + 1) % columnValue === 0) {
                bx = 0;
                by += boxHeight + space;
                // Grid index
                gx = 0;
                gy++;
            }
        }
        
        // ✅ Calculate center position only once
        const containerWidth = (columnValue * boxWidth) + ((columnValue - 1) * space);
        const containerHeight = (rowValue * boxHeight) + ((rowValue - 1) * space);
        gridHolderContainer.x = Gvar.centerX - containerWidth / 2 + boxWidth / 2;
        gridHolderContainer.y = Gvar.centerY - containerHeight / 2 + boxHeight / 2; //- Math.floor(Gvar.height * 0.16);

        gridSlideContainer.x = gridHolderContainer.x;
        gridSlideContainer.y = gridHolderContainer.y;

        this.gameContainer?.add(gridHolderContainer);
        this.gameContainer?.add(gridSlideContainer);

        // Shuffle slide container
        this.shuffleboard(gridHolderContainer,gridSlideContainer);
        //this.resetboard();

        // Start game
        setTimeout(()=>{
            this.startGame = true;
            this.interactivelistener(true);
        },500)
    }

    private createBox(scene: Phaser.Scene, params: any) {
        let box = this.add.container();
        const framewd = this.boxSize; //Math.floor(Math.min(Gvar.width, Gvar.height) * 0.12);
        const frameht = framewd;

        const [radius, corner] = Gvar.getradius(framewd, frameht, 0.1);

        let emptybox = this.createshape(`square-line`, { w: Math.floor(framewd! * 0.6), h: frameht, r: corner, c: params.color });
        box.add(emptybox);

        let optinbox = this.createshape(`square-option`, { w: framewd, h: frameht, r: corner, c: params.color });
        box.add(optinbox);

        let fontsize = Math.floor(frameht! * 0.38);

        optinbox.visible = (params.type == "empty") ? false : true;
        emptybox.visible = (params.type == "option") ? false : true;

        let label = this.add.text(0, 0, params.text.toString(), TextStyle['slide-puzzle']).setOrigin(0.5);
        label.setFontSize(fontsize);
        label.setColor("#000000");
        box.add(label);

        label.text = (params.type == "empty") ? "?" : params.text;

        Gvar.setfontpading("noto-tamil", label, fontsize);

        box.x = params.x;
        box.y = params.y;
        box.setData('fontsize', fontsize);
        box.setData('box-letter', params.text);
        box.setData('coordinate', { x: params.x, y: params.y });
        box.setData('bounds', { width: framewd, height: frameht });
        return box;
    }

    createshape(shapemodel: string, size: any) {
        let shapecontainer = this.add.container();
        switch (shapemodel) {
            case "square-empty":
                let square_empty = this.add.graphics();
                square_empty.lineStyle(8, 0x000000)
                square_empty.strokeRoundedRect((-1 * (size.w / 2)), (-1 * (size.h / 2)), (size.w), (size.h), (size.r));
                square_empty.fillStyle(size.c || 0xfefefe)
                square_empty.fillRoundedRect((-1 * (size.w / 2)), (-1 * (size.h / 2)), (size.w), (size.h), (size.r));
                shapecontainer.add(square_empty);
                break;
            case "square-option":
                let square_option = this.add.graphics();
                square_option.lineStyle(8, 0x000000)
                square_option.strokeRoundedRect((-1 * (size.w / 2)), (-1 * (size.h / 2)), (size.w), (size.h), (size.r));
                square_option.fillStyle(size.c || 0xfefefe)
                square_option.fillRoundedRect((-1 * (size.w / 2)), (-1 * (size.h / 2)), (size.w), (size.h), (size.r));
                shapecontainer.add(square_option);
                break;
            case "square-line":
                let square_line = this.add.graphics();
                square_line.lineStyle(8, 0x000000);
                square_line.lineBetween((-1 * (size.w)), (size.h * 0.65), (size.w), (size.h * 0.65));
                shapecontainer.add(square_line);
                break;
        }
        return shapecontainer;
    }

    private resetboard(){
        const textctr = this.gameContainer!.getAt(2) as Phaser.GameObjects.Container;
        textctr.list.forEach((element)=>{
            const child = element as Phaser.GameObjects.Container;
            child.setData(child.getData('org-grid-index'));
            child.x = child.getData('coordinate').x;
            child.y = child.getData('coordinate').y;
        });
    }

    private shuffleboard(holderContainer:Phaser.GameObjects.Container,
        textContainer:Phaser.GameObjects.Container){
            for(let v=0; v<30; v++){
                const emptyholder = this.findemptygrid(textContainer);
                const adjacents = this.findmovablebox(emptyholder!,textContainer);

                if (adjacents.length === 0) return;

                const tile = Phaser.Utils.Array.GetRandom(adjacents) as Phaser.GameObjects.Container;
                const oldPos = tile.getData('grid-index');

                tile.setData('grid-index', [emptyholder!.grid[0], emptyholder!.grid[1]]);
                tile.x = emptyholder!.pos[0];
                tile.y = emptyholder!.pos[1];

                this.gridShuffledData.push([tile.getData('child-index'), tile.getData('grid-index'), tile.x, tile.y])
            }
    }
    
    private findemptygrid(textContainer:Phaser.GameObjects.Container ) {
        const usedGrid = textContainer.list.map(tile => tile.getData('grid-index').toString());
        const emptyInfo = this.gridPositions!.find(({ grid }) => !usedGrid.includes(grid.toString()));
        return emptyInfo;
    }
    
    private getadjacent(emptyposition:{grid: number[], pos: number[], container:any}) {
        return [
            [emptyposition.grid[0] - 1, emptyposition.grid[1]], // left
            [emptyposition.grid[0] + 1, emptyposition.grid[1]], // right
            [emptyposition.grid[0], emptyposition.grid[1] - 1], // up
            [emptyposition.grid[0], emptyposition.grid[1] + 1]  // down
        ];
    }

    private findmovablebox(emptyposition:{grid: number[], pos: number[], container:any},textContainer:Phaser.GameObjects.Container) {
        const adjacents = this.getadjacent(emptyposition).map(p => p.toString());
        return textContainer.list.filter(tile =>
            adjacents.includes(tile.getData('grid-index').toString())
        );
    }

    private findnearempty(textContainer:Phaser.GameObjects.Container,tile:Phaser.GameObjects.Container){
        const emptyholder = this.findemptygrid(textContainer);
        const tileindex = tile.getData('grid-index')
        const adjacents = this.getadjacent({grid:[ tileindex[0], tileindex[1]], pos: [tileindex.x, tileindex.y], container:tile }).map(p => p.toString());
        const flag = adjacents.includes(emptyholder!.grid.toString())
        if(flag){
            return emptyholder;
        }
    }

    private getRowWord(row:number){
        let word = "";
        const textctr = this.gameContainer!.getAt(2) as Phaser.GameObjects.Container;
        for (let col = 0; col < this.gridColumn; col++) {
            const element = textctr.list.find((el: any) => {
                const index = el.getData('grid-index');
                return index && index[0] === col && index[1] === row;
            });
            if (element) {
                const boxLetter = element.getData('box-letter');
                word += boxLetter ?? "";
            } else {
                word += " ";
            }
        }
        return word;
    }

    private interactivelistener(flag:boolean){
        // Option Container
        const textctr = this.gameContainer!.getAt(2) as Phaser.GameObjects.Container;
        textctr.iterate((element: any,index: any) => {
            if (flag) {
                let bounds = element.data.values.bounds;
                element.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle((0 - bounds.width * 0.5), (0 - bounds.height * 0.5), bounds.width, bounds.height),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true
                });
                element.on('pointerdown', () => {
                    if(!this.startGame)return;
                });
                element.on('pointerup', (pointer: any, gameObject: any) => {
                    if(!this.startGame)return;
                    const nearempty = this.findnearempty(textctr,element);
                    if(nearempty){
                        element.setData('grid-index', [nearempty!.grid[0], nearempty!.grid[1]]);
                        element.x = nearempty!.pos[0];
                        element.y = nearempty!.pos[1];
                        this.checkboard([element.getData('child-index'),element.getData('grid-index'),[element.x, element.y]],pointer);
                    }else{

                    }
                });
            } else {
                element.setInteractive(false);
                element.input.draggable = false;
                element.input.cursor = 'default';
            }
        });
    }

    private checkboard(params: any,pointer:any) {
        let gridword: string[] = [];
        for(let v=0;v<this.gridRow; v++){
            const word = this.getRowWord(v);
            gridword.push(word.trim()); // Trim word
        }
        let completed: boolean = this.gridWords!.length === gridword.length && this.gridWords!.every(val => gridword.includes(val));
        if (completed) {
            this.explodeParticle?.explode(pointer);
            this.startGame = false;
            window.Sounds.play("general","correct",()=>{
                this.checkresult();
            });
        }
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

export default Game12;