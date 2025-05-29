import { useEffect } from "react"
import { PhaserGameConfig } from "../config/Phaser";

const PhaserGame: React.FC = ()=>{

    useEffect(()=>{
        window.Game = new Phaser.Game(PhaserGameConfig);
        return () => {
            window.Game?.destroy(true);
            window.Game = undefined;
        }
    },[]);

    return(
        <div className="phaser-game" id="phaser-game" />
    )
}

export default PhaserGame