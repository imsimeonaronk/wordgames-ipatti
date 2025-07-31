import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import PhaserGame from '../components/Phaser';
import { useEffect, useRef, useState } from 'react';
import NotFound from './NotFound';
import { ssGetItem, ssRemoveItem } from '../utils/SessionStorage';
import { useLocation } from 'react-router';
import { Gvar } from '../game/utils/Gvar';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Game: React.FC = () => {
    const [gameId, setGameId] = useState(0);
    const location = useLocation(); // Detect route change
    const query = useQuery();
    const queryGameID = parseInt(query.get("gameID") || "0");
    const hasRun = useRef(false);
    
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

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
                        <PhaserGame />
                    </div>
                </IonPage>
            ) : (
                <NotFound />
            )}
        </>
    );
};

export default Game;
