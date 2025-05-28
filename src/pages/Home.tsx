import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Header from '../components/Header';
import GameSlider from '../components/GameSlider';

const Home: React.FC = () => {
    return (
        <IonPage className="background">
            <div className='page-content'>
                <Header />
                <GameSlider />
            </div>
        </IonPage>
    );
};

export default Home;
