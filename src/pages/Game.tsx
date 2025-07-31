import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import PhaserGame from '../components/Phaser';
import { useEffect, useRef, useState } from 'react';
import NotFound from './NotFound';
import { ssGetItem, ssRemoveItem } from '../utils/SessionStorage';
import { useLocation } from 'react-router';
import { Gvar } from '../game/utils/Gvar';
import { ResizePhaserGame } from '../game/utils/Resize';
import { Capacitor } from '@capacitor/core';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Game: React.FC = () => {
    const [gameId, setGameId] = useState(0);
    const location = useLocation(); // Detect route change
    const query = useQuery();
    const queryGameID = parseInt(query.get("gameID") || "0");
    const hasRun = useRef(false);

    const gameReady = ()=>{
        ResizePhaserGame(Gvar.platformData.isNative);
    }
    
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        // Check device
        Gvar.platformData.type = Capacitor.getPlatform();
        Gvar.isDesktop = ((Capacitor.isNativePlatform() === false) && (isPlatform("desktop") === true));
        Gvar.isMobileWeb = ((Capacitor.isNativePlatform() === false) && (isPlatform("mobileweb") === true));
        Gvar.platformData.isNative = Capacitor.isNativePlatform();

        // Check URL Query
        if (!isNaN(queryGameID) && queryGameID) {
            setGameId(queryGameID);
            Gvar.GameData.Id = queryGameID;
        } else {
            // Check Session Storage
            const storedId = parseInt(ssGetItem("selected-game") || "0");
            if (!isNaN(storedId)) {
                setGameId(storedId);
            }
            Gvar.GameData.Id = storedId;
            ssRemoveItem("selected-game");
        }
    }, [location]);
    

    return (
        <>
            {gameId > 0 ? (
                <IonPage className="background">
                    <div className="page-content">
                        <PhaserGame onGameReady={gameReady} canvas={'phaser-game'}/>
                    </div>
                </IonPage>
            ) : (
                <NotFound />
            )}
        </>
    );
};

export default Game;
