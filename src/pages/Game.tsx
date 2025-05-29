import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import PhaserGame from '../components/Phaser';

const Game: React.FC = () => {
    return (
        <IonPage className="background">
            <div className='page-content'>
                <PhaserGame />
            </div>
        </IonPage>
    );
};

export default Game;
