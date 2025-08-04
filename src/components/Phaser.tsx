import { useEffect, useRef } from "react"
import { Gvar } from "../game/utils/Gvar";
import { PhaserGameConfig } from "../config/Phaser";

interface GameProps{
    canvas: string;
    onGameReady?: ()=> void;
}

const PhaserGame: React.FC<GameProps> = (GameProps) => {
    const gameDivRef = useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
        if(gameDivRef.current){
            window.Game = new Phaser.Game(PhaserGameConfig);
            Gvar.isSafariBrowser = (window.Game!.device.browser.safari || window.Game!.device.browser.mobileSafari); //Check safari browser
            if(GameProps.onGameReady){
                GameProps.onGameReady();
            }
        }
        return () => {
            if (window.Game && window.Game.destroy) {
                window.Game.destroy(true);
            }
        };
    },[]);

    return(
        <div className="phaser-game" ref={gameDivRef} id={GameProps.canvas} />
    )
}

export default PhaserGame;