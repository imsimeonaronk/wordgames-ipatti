import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import PhaserGame from '../components/Phaser';
import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import { ssGetItem, ssRemoveItem } from '../utils/SessionStorage';
import { useLocation } from 'react-router';

const Game: React.FC = () => {
    const [gameId, setGameId] = useState(0);
    const location = useLocation(); // Detect route change

    useEffect(() => {
        const storedId = parseInt(ssGetItem("selected-game") || "0");
        if (!isNaN(storedId)) {
            setGameId(storedId);
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
